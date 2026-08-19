import { useState } from "react";

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
    <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-md">
      <h3 className="text-sm font-medium text-zinc-200 mb-5">Create Node</h3>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="text-xs text-zinc-500 mb-1.5 block">Name</label>
          <input 
            required type="text" placeholder="e.g. Auth Microservice" 
            className="w-full bg-zinc-950 border border-zinc-800 rounded-md p-2.5 text-sm text-zinc-100 placeholder:text-zinc-600 outline-none focus:border-zinc-500 transition-colors"
            value={newName} onChange={e => setNewName(e.target.value)}
          />
        </div>
        <div className="flex gap-3">
          <div className="flex-1">
            <label className="text-xs text-zinc-500 mb-1.5 block">Type</label>
            <select 
              className="w-full bg-zinc-950 border border-zinc-800 rounded-md p-2.5 text-sm text-zinc-100 outline-none focus:border-zinc-500 transition-colors appearance-none"
              value={newType} onChange={e => setNewType(e.target.value)}
            >
              <option value="Service">Service</option>
              <option value="Database">Database</option>
            </select>
          </div>
          <button type="submit" className="self-end bg-white hover:bg-zinc-200 text-black px-5 py-2.5 rounded-md text-sm font-medium transition-colors">
            Create
          </button>
        </div>
      </form>
    </div>
  );
}
