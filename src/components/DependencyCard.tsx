import { Server, Database, AlertCircle, Trash2 } from "lucide-react";
import { Dependency } from "@/types";

interface Props {
  dep: Dependency;
  onDelete: (name: string) => void;
}

export function DependencyCard({ dep, onDelete }: Props) {
  return (
    <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 relative group hover:border-blue-500 transition shadow-md">
      <button 
        onClick={() => onDelete(dep.affectedService)} 
        className="absolute top-4 right-4 text-gray-500 hover:text-red-500 opacity-0 group-hover:opacity-100 transition"
        title={`Delete ${dep.affectedService} node from graph`}
      >
        <Trash2 className="w-5 h-5" />
      </button>

      <div className="flex items-center gap-3 mb-4">
        <Database className="text-purple-400" />
        <h2 className="text-lg font-bold text-white">{dep.databaseName}</h2>
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
  );
}
