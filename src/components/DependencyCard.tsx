import { Server, Database, Activity, Trash2 } from "lucide-react";
import { Dependency } from "@/types";

interface Props {
  dep: Dependency;
  onDelete: (name: string) => void;
}

export function DependencyCard({ dep, onDelete }: Props) {
  return (
    <div className="group relative bg-zinc-900 border border-zinc-800 hover:border-zinc-600 transition-colors rounded-md p-5 flex flex-col h-full">
      <button 
        onClick={() => onDelete(dep.affectedService)} 
        className="absolute top-4 right-4 text-zinc-600 hover:text-red-400 opacity-50 hover:opacity-100 transition-all sm:opacity-0 sm:group-hover:opacity-100"
        title={`Delete ${dep.affectedService}`}
      >
        <Trash2 className="w-4 h-4" />
      </button>

      <div className="flex items-center gap-3 mb-6">
        <Database className="w-4 h-4 text-zinc-400" />
        <h2 className="text-sm font-semibold text-zinc-100 truncate pr-6">{dep.databaseName}</h2>
      </div>
      
      <div className="flex-1 space-y-4">
        <div>
          <p className="text-xs text-zinc-500 mb-1">Directly Accessed By</p>
          <div className="flex items-center gap-2 text-sm text-zinc-300">
            <Server className="w-3.5 h-3.5 text-zinc-500" /> 
            <span className="truncate">{dep.directDependency}</span>
          </div>
        </div>
        
        <div>
          <p className="text-xs text-zinc-500 mb-1">Upstream Impact</p>
          <div className="flex items-center gap-2 text-sm text-zinc-300">
            <Activity className="w-3.5 h-3.5 text-zinc-500" /> 
            <span className="truncate">{dep.affectedService}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

