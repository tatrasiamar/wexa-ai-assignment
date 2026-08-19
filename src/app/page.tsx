"use client";
import { useEffect, useState } from "react";
import { AlertCircle, RefreshCw } from "lucide-react";
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
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <header className="mb-12 flex justify-between items-center border-b border-gray-800 pb-6">
        <div>
          <h1 className="text-3xl font-bold text-blue-400">IT Infrastructure Tracker</h1>
          <p className="text-gray-400 mt-2">Dynamic Graph Database powered by CognoDB</p>
        </div>
        <button onClick={fetchData} className="p-3 bg-gray-800 rounded-lg hover:bg-gray-700 transition" title="Refresh Graph">
          <RefreshCw className={loading ? "animate-spin text-blue-400" : "text-blue-400"} />
        </button>
      </header>

      {error && (
        <div className="bg-red-900/50 border border-red-500 p-6 rounded-lg flex items-center gap-4 mb-8">
          <AlertCircle className="text-red-400 w-8 h-8" />
          <div>
            <h2 className="text-xl font-semibold text-red-200">Connection Error</h2>
            <p className="text-red-300">{error}</p>
          </div>
        </div>
      )}

      {/* Admin Controls Panel */}
      <div className="grid md:grid-cols-2 gap-8 mb-12">
        <AddNodeForm onNodeAdded={fetchData} />
        <LinkNodesForm nodes={nodes} onLinked={fetchData} />
      </div>

      <h2 className="text-2xl font-bold mb-6 border-b border-gray-800 pb-2">Blast Radius Analysis</h2>
      
      {loading ? (
        <div className="flex justify-center py-20 text-blue-400">Loading infrastructure graph...</div>
      ) : data.length === 0 ? (
        <div className="text-center py-20 text-gray-500 border border-dashed border-gray-700 rounded-xl">No dependencies found in the graph. Create nodes and connect them above!</div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.map((dep, idx) => (
            <DependencyCard key={idx} dep={dep} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  );
}
