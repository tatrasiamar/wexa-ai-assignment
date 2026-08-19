import { useState } from "react";
import { Link as LinkIcon, GitMerge } from "lucide-react";
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
    <div className="bg-white/5 backdrop-blur-xl p-8 rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden group">
      <div className="absolute top-0 left-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl -ml-32 -mt-32 transition-all duration-700 group-hover:bg-amber-500/10"></div>
      
      <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
        <div className="p-2 bg-amber-500/10 rounded-lg">
          <LinkIcon className="w-5 h-5 text-amber-400"/>
        </div>
        Establish Edge
      </h3>
      
      <form onSubmit={handleSubmit} className="flex flex-col gap-5 relative z-10">
        <div className="flex gap-3">
          <div className="flex-1 flex flex-col gap-2">
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Source</label>
            <select required className="bg-black/20 border border-white/10 rounded-xl p-3.5 outline-none focus:ring-2 focus:ring-amber-500/50 transition-all truncate text-white appearance-none cursor-pointer" value={sourceNode} onChange={e => setSourceNode(e.target.value)}>
              <option value="" className="text-gray-500">Select...</option>
              {nodes.map(n => <option className="bg-gray-900" key={`src-${n.name}`} value={n.name}>{n.name} ({n.type})</option>)}
            </select>
          </div>
          
          <div className="flex flex-col justify-end pb-[14px]">
            <div className="h-[2px] w-4 bg-white/20 rounded-full"></div>
          </div>

          <div className="flex-1 flex flex-col gap-2">
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Relationship</label>
            <select className="bg-black/20 border border-amber-500/30 rounded-xl p-3.5 outline-none focus:ring-2 focus:ring-amber-500/50 transition-all text-amber-200 appearance-none cursor-pointer text-center font-bold tracking-widest text-sm" value={relType} onChange={e => setRelType(e.target.value)}>
              <option value="DEPENDS_ON" className="bg-gray-900">DEPENDS_ON ➔</option>
              <option value="READS_FROM" className="bg-gray-900">READS_FROM ➔</option>
            </select>
          </div>
        </div>

        <div className="flex gap-4">
          <div className="flex-1 flex flex-col gap-2">
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Target</label>
            <select required className="bg-black/20 border border-white/10 rounded-xl p-3.5 outline-none focus:ring-2 focus:ring-amber-500/50 transition-all truncate text-white appearance-none cursor-pointer" value={targetNode} onChange={e => setTargetNode(e.target.value)}>
              <option value="" className="text-gray-500">Select...</option>
              {nodes.map(n => <option className="bg-gray-900" key={`tgt-${n.name}`} value={n.name}>{n.name} ({n.type})</option>)}
            </select>
          </div>
          
          <button type="submit" className="self-end bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 px-6 py-3.5 rounded-xl transition-all duration-300 font-bold text-white shadow-lg shadow-amber-500/20 hover:shadow-amber-500/40 flex items-center gap-2 transform hover:-translate-y-0.5">
            <GitMerge className="w-4 h-4" /> Link
          </button>
        </div>
      </form>
    </div>
  );
}
