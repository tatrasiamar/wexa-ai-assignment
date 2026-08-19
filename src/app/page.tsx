"use client";
import { useEffect, useState } from 'react';
import { Server, Database, AlertCircle, RefreshCw } from 'lucide-react';

interface Dependency {
  affectedService: string;
  databaseName: string;
  directDependency: string;
}

export default function Dashboard() {
  const [data, setData] = useState<Dependency[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/graph');
      if (!res.ok) throw new Error('Database is currently unreachable.');
      const json = await res.json();
      setData(json.dependencies);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <header className="mb-12 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-blue-400">IT Infrastructure Tracker</h1>
          <p className="text-gray-400 mt-2">Powered by CognoDB & Next.js</p>
        </div>
        <button onClick={fetchData} className="p-3 bg-blue-600 rounded-lg hover:bg-blue-500 transition">
          <RefreshCw className={loading ? "animate-spin" : ""} />
        </button>
      </header>

      {error ? (
        <div className="bg-red-900/50 border border-red-500 p-6 rounded-lg flex items-center gap-4">
          <AlertCircle className="text-red-400 w-8 h-8" />
          <div>
            <h2 className="text-xl font-semibold text-red-200">Connection Error</h2>
            <p className="text-red-300">{error}</p>
          </div>
        </div>
      ) : loading ? (
        <div className="flex justify-center py-20 text-blue-400">Loading infrastructure graph...</div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.map((dep, idx) => (
            <div key={idx} className="bg-gray-800 p-6 rounded-xl border border-gray-700 hover:border-blue-500 transition">
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
