import { useState } from "react";
import { Plus } from "lucide-react";

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
    <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-lg">
      <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><Plus className="w-5 h-5 text-green-400"/> Create Node</h3>
      <form onSubmit={handleSubmit} className="flex gap-4">
        <input 
          required type="text" placeholder="e.g. Notifications API" 
          className="bg-gray-900 border border-gray-700 rounded p-2 flex-1 outline-none focus:border-blue-500 text-white"
          value={newName} onChange={e => setNewName(e.target.value)}
        />
        <select 
          className="bg-gray-900 border border-gray-700 rounded p-2 outline-none focus:border-blue-500 text-white"
          value={newType} onChange={e => setNewType(e.target.value)}
        >
          <option value="Service">Service</option>
          <option value="Database">Database</option>
        </select>
        <button type="submit" className="bg-green-600 hover:bg-green-500 px-4 py-2 rounded transition font-medium text-white">Create</button>
      </form>
    </div>
  );
}
