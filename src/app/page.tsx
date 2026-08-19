"use client";
import { useEffect, useState } from "react";
import { RefreshCw, Network, LayoutDashboard, Database as DbIcon } from "lucide-react";
import { Dependency, GraphNode } from "@/types";
import { AddNodeForm } from "@/components/AddNodeForm";
import { LinkNodesForm } from "@/components/LinkNodesForm";
import { DependencyCard } from "@/components/DependencyCard";

export default function Dashboard() {
  const [data, setData] = useState<Dependency[]>([]);
  const [nodes, setNodes] = useState<GraphNode[]>([]);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);
  const [error, setError] = useState("");

  const fetchData = async () => {
    setLoading(true);
    setError("");
    try {
      const [graphRes, nodesRes] = await Promise.all([
        fetch("/api/graph", { cache: "no-store" }),
        fetch("/api/services", { cache: "no-store" })
      ]);
      
      if (!graphRes.ok) throw new Error("Database is currently unreachable.");
      
      const graphJson = await graphRes.json();
      const nodesJson = await nodesRes.json();
      
      setData(graphJson.dependencies);
      setNodes(nodesJson.nodes);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSeed = async () => {
    setSeeding(true);
    try {
      await fetch("/api/seed", { method: "POST" });
      await fetchData();
    } catch (err: any) {
      setError("Failed to seed database.");
    } finally {
      setSeeding(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (name: string) => {
    if (!confirm(`Are you sure you want to delete ${name}?`)) return;
    await fetch("/api/services", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name })
    });
    fetchData();
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50 font-sans selection:bg-zinc-800">
      <div className="max-w-6xl mx-auto p-6 md:p-12 space-y-12">
        
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-zinc-800 pb-8">
          <div className="flex items-center gap-3">
            <LayoutDashboard className="w-6 h-6 text-zinc-400" />
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-white">
                Wexa AI Infrastructure Tracker
              </h1>
              <p className="text-sm text-zinc-400 mt-1">
                Powered by CognoDB
              </p>
            </div>
          </div>
          <div className="mt-6 md:mt-0 flex items-center gap-3">
            <button 
              onClick={handleSeed} 
              disabled={seeding}
              className="flex items-center gap-2 px-4 py-2 bg-zinc-800 text-white hover:bg-zinc-700 rounded-md transition-colors text-sm font-medium border border-zinc-700"
            >
              <DbIcon className={`w-4 h-4 ${seeding ? "animate-bounce" : ""}`} />
              {seeding ? "Seeding..." : "Seed Demo Data"}
            </button>
            <button 
              onClick={fetchData} 
              className="flex items-center gap-2 px-4 py-2 bg-white text-black hover:bg-zinc-200 rounded-md transition-colors text-sm font-medium"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
              Sync Graph
            </button>
          </div>
        </header>

        {error && (
          <div className="bg-red-950/30 border border-red-900 text-red-400 p-4 rounded-md text-sm">
            <span className="font-semibold">Error:</span> {error}
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-6">
          <AddNodeForm onNodeAdded={fetchData} />
          <LinkNodesForm nodes={nodes} onLinked={fetchData} />
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-6 text-zinc-100 flex items-center gap-2">
            Blast Radius Analysis
          </h2>
          
          {loading ? (
            <div className="flex justify-center py-24">
              <RefreshCw className="w-6 h-6 text-zinc-600 animate-spin" />
            </div>
          ) : data.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center border border-zinc-800 rounded-md bg-zinc-900/50">
              <Network className="w-8 h-8 text-zinc-600 mb-3" />
              <h3 className="text-sm font-medium text-zinc-300">Graph is Empty</h3>
              <p className="text-xs text-zinc-500 mt-1 max-w-sm">No dependencies found. To see the Blast Radius, you need a Service that Depends On another Service, which Reads From a Database.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {data.map((dep, idx) => (
                <DependencyCard key={idx} dep={dep} onDelete={handleDelete} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

