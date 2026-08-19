import { useState } from "react";
import { Link as LinkIcon } from "lucide-react";
import { GraphNode } from "@/types";

export function LinkNodesForm({ nodes, onLinked }: { nodes: GraphNode[], onLinked: () => void }) {
  const [sourceNode, setSourceNode] = useState("");
  const [targetNode, setTargetNode] = useState("");
  const [relType, setRelType] = useState("DEPENDS_ON");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch("/api/relationships", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ source: sourceNode, target: targetNode, relType })
    });
    onLinked();
  };

  return (
    <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-lg">
      <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><LinkIcon className="w-5 h-5 text-yellow-400"/> Connect Nodes</h3>
      <form onSubmit={handleSubmit} className="flex gap-3">
        <select required className="bg-gray-900 border border-gray-700 rounded p-2 flex-1 outline-none truncate text-white" value={sourceNode} onChange={e => setSourceNode(e.target.value)}>
          <option value="">Select source...</option>
          {nodes.map(n => <option key={`src-${n.name}`} value={n.name}>{n.name} ({n.type})</option>)}
        </select>
        <select className="bg-gray-900 border border-gray-700 rounded p-2 outline-none text-white" value={relType} onChange={e => setRelType(e.target.value)}>
          <option value="DEPENDS_ON">Depends On</option>
          <option value="READS_FROM">Reads From</option>
        </select>
        <select required className="bg-gray-900 border border-gray-700 rounded p-2 flex-1 outline-none truncate text-white" value={targetNode} onChange={e => setTargetNode(e.target.value)}>
          <option value="">Select target...</option>
          {nodes.map(n => <option key={`tgt-${n.name}`} value={n.name}>{n.name} ({n.type})</option>)}
        </select>
        <button type="submit" className="bg-yellow-600 hover:bg-yellow-500 px-4 py-2 rounded transition text-black font-medium">Link</button>
      </form>
    </div>
  );
}
