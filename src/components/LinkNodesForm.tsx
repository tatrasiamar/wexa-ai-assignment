import { useState } from "react";
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
    setSourceNode("");
    setTargetNode("");
    onLinked();
  };

  return (
    <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-md">
      <h3 className="text-sm font-medium text-zinc-200 mb-5">Connect Nodes</h3>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex gap-3">
          <div className="flex-1">
            <label className="text-xs text-zinc-500 mb-1.5 block">Source</label>
            <select required className="w-full bg-zinc-950 border border-zinc-800 rounded-md p-2.5 text-sm text-zinc-100 outline-none focus:border-zinc-500 transition-colors appearance-none truncate" value={sourceNode} onChange={e => setSourceNode(e.target.value)}>
              <option value="">Select...</option>
              {nodes.map((n, i) => <option key={`src-${n.name}-${i}`} value={n.name}>{n.name} ({n.type})</option>)}
            </select>
          </div>
          <div className="flex-1">
            <label className="text-xs text-zinc-500 mb-1.5 block">Relationship</label>
            <select className="w-full bg-zinc-950 border border-zinc-800 rounded-md p-2.5 text-sm text-zinc-400 outline-none focus:border-zinc-500 transition-colors appearance-none" value={relType} onChange={e => setRelType(e.target.value)}>
              <option value="DEPENDS_ON">Depends On &rarr;</option>
              <option value="READS_FROM">Reads From &rarr;</option>
            </select>
          </div>
        </div>
        <div className="flex gap-3">
          <div className="flex-1">
            <label className="text-xs text-zinc-500 mb-1.5 block">Target</label>
            <select required className="w-full bg-zinc-950 border border-zinc-800 rounded-md p-2.5 text-sm text-zinc-100 outline-none focus:border-zinc-500 transition-colors appearance-none truncate" value={targetNode} onChange={e => setTargetNode(e.target.value)}>
              <option value="">Select...</option>
              {nodes.map((n, i) => <option key={`tgt-${n.name}-${i}`} value={n.name}>{n.name} ({n.type})</option>)}
            </select>
          </div>
          <button type="submit" className="self-end bg-white hover:bg-zinc-200 text-black px-5 py-2.5 rounded-md text-sm font-medium transition-colors">
            Link
          </button>
        </div>
      </form>
    </div>
  );
}

