"use client";
import { useEffect, useState } from 'react';
import { Server, Database, AlertCircle, RefreshCw, Plus, Link as LinkIcon, Trash2 } from 'lucide-react';

interface Dependency {
  affectedService: string;
  databaseName: string;
  directDependency: string;
}

interface GraphNode {
  name: string;
  type: string;
}

export default function Dashboard() {
  const [data, setData] = useState<Dependency[]>([]);
  const [nodes, setNodes] = useState<GraphNode[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Form states
  const [newName, setNewName] = useState('');
  const [newType, setNewType] = useState('Service');
  const [sourceNode, setSourceNode] = useState('');
  const [targetNode, setTargetNode] = useState('');
  const [relType, setRelType] = useState('DEPENDS_ON');

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const [graphRes, nodesRes] = await Promise.all([
        fetch('/api/graph'),
        fetch('/api/services')
      ]);
      
      if (!graphRes.ok) throw new Error('Database is currently unreachable.');
      
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

  const handleAddNode = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch('/api/services', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newName, type: newType })
    });
    setNewName('');
    fetchData();
  };

  const handleLinkNodes = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch('/api/relationships', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ source: sourceNode, target: targetNode, relType })
    });
    fetchData();
  };

  const handleDelete = async (name: string) => {
    if (!confirm(`Are you sure you want to delete ${name}?`)) return;
    await fetch('/api/services', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
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
        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-lg">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><Plus className="w-5 h-5 text-green-400"/> Create Node</h3>
          <form onSubmit={handleAddNode} className="flex gap-4">
            <input 
              required
              type="text" 
              placeholder="e.g. Notifications API" 
              className="bg-gray-900 border border-gray-700 rounded p-2 flex-1 outline-none focus:border-blue-500"
              value={newName} onChange={e => setNewName(e.target.value)}
            />
            <select 
              className="bg-gray-900 border border-gray-700 rounded p-2 outline-none focus:border-blue-500"
              value={newType} onChange={e => setNewType(e.target.value)}
            >
              <option value="Service">Service</option>
              <option value="Database">Database</option>
            </select>
            <button type="submit" className="bg-green-600 hover:bg-green-500 px-4 py-2 rounded transition font-medium">Create</button>
          </form>
        </div>

        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-lg">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><LinkIcon className="w-5 h-5 text-yellow-400"/> Connect Nodes</h3>
          <form onSubmit={handleLinkNodes} className="flex gap-3">
            <select required className="bg-gray-900 border border-gray-700 rounded p-2 flex-1 outline-none truncate" value={sourceNode} onChange={e => setSourceNode(e.target.value)}>
              <option value="">Select source...</option>
              {nodes.map(n => <option key={`src-${n.name}`} value={n.name}>{n.name} ({n.type})</option>)}
            </select>
            <select className="bg-gray-900 border border-gray-700 rounded p-2 outline-none" value={relType} onChange={e => setRelType(e.target.value)}>
              <option value="DEPENDS_ON">Depends On</option>
              <option value="READS_FROM">Reads From</option>
            </select>
            <select required className="bg-gray-900 border border-gray-700 rounded p-2 flex-1 outline-none truncate" value={targetNode} onChange={e => setTargetNode(e.target.value)}>
              <option value="">Select target...</option>
              {nodes.map(n => <option key={`tgt-${n.name}`} value={n.name}>{n.name} ({n.type})</option>)}
            </select>
            <button type="submit" className="bg-yellow-600 hover:bg-yellow-500 px-4 py-2 rounded transition text-black font-medium">Link</button>
          </form>
        </div>
      </div>

      <h2 className="text-2xl font-bold mb-6 border-b border-gray-800 pb-2">Blast Radius Analysis</h2>
      
      {loading ? (
        <div className="flex justify-center py-20 text-blue-400">Loading infrastructure graph...</div>
      ) : data.length === 0 ? (
        <div className="text-center py-20 text-gray-500 border border-dashed border-gray-700 rounded-xl">No dependencies found in the graph. Create nodes and connect them above!</div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.map((dep, idx) => (
            <div key={idx} className="bg-gray-800 p-6 rounded-xl border border-gray-700 relative group hover:border-blue-500 transition shadow-md">
              <button 
                onClick={() => handleDelete(dep.affectedService)} 
                className="absolute top-4 right-4 text-gray-500 hover:text-red-500 opacity-0 group-hover:opacity-100 transition"
                title={`Delete ${dep.affectedService} node from graph`}
              >
                <Trash2 className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3 mb-4">
                <Database className="text-purple-400" />
                <h2 className="text-lg font-bold">{dep.databaseName}</h2>
              </div>
              <div className="pl-4 border-l-2 border-gray-700 space-y-3">
                <div>
                  <p className="text-sm text-gray-400">Directly accessed by</p>
                  <p className="font-semibold text-blue-300 flex items-center gap-2">
                    <Server className="w-4 h-4" /> {dep.directDependency}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Impacts upstream service</p>
                  <p className="font-semibold text-red-400 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" /> {dep.affectedService}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
