import { useState } from "react";
import { Plus, Box } from "lucide-react";

export function AddNodeForm({ onNodeAdded }: { onNodeAdded: () => void }) {
  const [newName, setNewName] = useState("");
  const [newType, setNewType] = useState("Service");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch("/api/services", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newName, type: newType })
    });
    setNewName("");
    onNodeAdded();
  };

  return (
    <div className="bg-white/5 backdrop-blur-xl p-8 rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl -mr-32 -mt-32 transition-all duration-700 group-hover:bg-indigo-500/10"></div>
      
      <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
        <div className="p-2 bg-emerald-500/10 rounded-lg">
          <Plus className="w-5 h-5 text-emerald-400"/>
        </div>
        Provision Node
      </h3>
      
      <form onSubmit={handleSubmit} className="flex flex-col gap-5 relative z-10">
        <div className="flex flex-col gap-2">
          <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Node Name</label>
          <input 
            required type="text" placeholder="e.g. Auth Microservice" 
            className="bg-black/20 border border-white/10 rounded-xl p-3.5 outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all text-white placeholder:text-gray-600"
            value={newName} onChange={e => setNewName(e.target.value)}
          />
        </div>
        
        <div className="flex gap-4">
          <div className="flex-1 flex flex-col gap-2">
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Type</label>
            <select 
              className="bg-black/20 border border-white/10 rounded-xl p-3.5 outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all text-white appearance-none cursor-pointer"
              value={newType} onChange={e => setNewType(e.target.value)}
            >
              <option value="Service" className="bg-gray-900">⚙️ Service</option>
              <option value="Database" className="bg-gray-900">🗄️ Database</option>
            </select>
          </div>
          
          <button type="submit" className="self-end bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 px-6 py-3.5 rounded-xl transition-all duration-300 font-bold text-white shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40 flex items-center gap-2 transform hover:-translate-y-0.5">
            <Box className="w-4 h-4" /> Deploy
          </button>
        </div>
      </form>
    </div>
  );
}
