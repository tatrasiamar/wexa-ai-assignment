"use client";
import { useEffect, useState } from "react";
import { AlertCircle, RefreshCw, Network } from "lucide-react";
import { Dependency, GraphNode } from "@/types";
import { AddNodeForm } from "@/components/AddNodeForm";
import { LinkNodesForm } from "@/components/LinkNodesForm";
import { DependencyCard } from "@/components/DependencyCard";

export default function Dashboard() {
  const [data, setData] = useState<Dependency[]>([]);
  const [nodes, setNodes] = useState<GraphNode[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchData = async () => {
    setLoading(true);
    setError("");
    try {
      const [graphRes, nodesRes] = await Promise.all([
        fetch("/api/graph"),
        fetch("/api/services")
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
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-gray-900 to-slate-950 text-white p-6 md:p-12 font-sans selection:bg-indigo-500/30">
      <div className="max-w-7xl mx-auto space-y-12">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-white/10 pb-8">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-indigo-500/10 rounded-xl border border-indigo-500/20">
              <Network className="w-8 h-8 text-indigo-400" />
            </div>
            <div>
              <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                IT Infrastructure Tracker
              </h1>
              <p className="text-gray-400 mt-1 font-medium tracking-wide">
                Dynamic Graph Database powered by CognoDB
              </p>
            </div>
          </div>
          <button 
            onClick={fetchData} 
            className="mt-6 md:mt-0 group flex items-center gap-2 px-5 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all duration-300 shadow-lg backdrop-blur-md" 
            title="Refresh Graph"
          >
            <RefreshCw className={`w-5 h-5 text-indigo-400 group-hover:text-indigo-300 transition-colors ${loading ? "animate-spin" : ""}`} />
            <span className="font-semibold text-gray-200 group-hover:text-white transition-colors">Sync</span>
          </button>
        </header>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 p-6 rounded-2xl flex items-center gap-4 shadow-2xl backdrop-blur-md animate-in fade-in slide-in-from-top-4">
            <AlertCircle className="text-red-400 w-8 h-8 flex-shrink-0" />
            <div>
              <h2 className="text-lg font-bold text-red-200">Connection Interrupted</h2>
              <p className="text-red-300/80 mt-1">{error}</p>
            </div>
          </div>
        )}

        {/* Admin Controls Panel */}
        <div className="grid md:grid-cols-2 gap-8">
          <AddNodeForm onNodeAdded={fetchData} />
          <LinkNodesForm nodes={nodes} onLinked={fetchData} />
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
            <span className="w-2 h-8 bg-indigo-500 rounded-full"></span>
            Blast Radius Analysis
          </h2>
          
          {loading ? (
            <div className="flex flex-col items-center justify-center py-32 space-y-4">
              <RefreshCw className="w-10 h-10 text-indigo-500 animate-spin opacity-50" />
              <p className="text-indigo-300/60 font-medium animate-pulse">Mapping infrastructure graph...</p>
            </div>
          ) : data.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-32 text-center border border-dashed border-white/10 rounded-3xl bg-white/5 backdrop-blur-sm">
              <Network className="w-16 h-16 text-gray-600 mb-4" />
              <h3 className="text-xl font-bold text-gray-300 mb-2">Graph is Empty</h3>
              <p className="text-gray-500 max-w-md">No database dependencies found in the graph. Create new nodes and connect them using the control panel above.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
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
