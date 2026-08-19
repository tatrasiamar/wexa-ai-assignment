import { Server, Database, Activity, Trash2, ArrowRight } from "lucide-react";
import { Dependency } from "@/types";

interface Props {
  dep: Dependency;
  onDelete: (name: string) => void;
}

export function DependencyCard({ dep, onDelete }: Props) {
  return (
    <div className="group relative bg-white/5 backdrop-blur-sm p-7 rounded-3xl border border-white/10 hover:border-indigo-500/50 transition-all duration-500 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-indigo-500/20 hover:bg-white/10 overflow-hidden flex flex-col h-full">
      <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

      <button 
        onClick={() => onDelete(dep.affectedService)} 
        className="absolute top-5 right-5 p-2 bg-red-500/10 text-red-400/50 hover:text-red-400 hover:bg-red-500/20 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110"
        title={`Terminate ${dep.affectedService} node`}
      >
        <Trash2 className="w-4 h-4" />
      </button>

      <div className="flex items-center gap-4 mb-8">
        <div className="p-3 bg-gradient-to-br from-purple-500/20 to-indigo-500/20 rounded-xl border border-purple-500/20 group-hover:scale-110 transition-transform duration-500">
          <Database className="w-6 h-6 text-purple-400" />
        </div>
        <div>
          <p className="text-xs font-semibold text-purple-400/80 uppercase tracking-widest mb-1">Target Database</p>
          <h2 className="text-xl font-bold text-white tracking-tight">{dep.databaseName}</h2>
        </div>
      </div>
      
      <div className="flex-1 relative pl-6 border-l-2 border-indigo-500/20 space-y-6">
        <div className="absolute -left-[9px] top-1 w-4 h-4 bg-gray-900 border-2 border-indigo-500/50 rounded-full group-hover:border-indigo-400 group-hover:bg-indigo-500/20 transition-colors"></div>
        <div className="absolute -left-[9px] bottom-1 w-4 h-4 bg-gray-900 border-2 border-red-500/50 rounded-full group-hover:border-red-400 group-hover:bg-red-500/20 transition-colors"></div>

        <div>
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1 flex items-center gap-1">
            <ArrowRight className="w-3 h-3"/> Directly Accessed By
          </p>
          <p className="text-base font-semibold text-indigo-300 flex items-center gap-2 bg-indigo-500/5 py-2 px-3 rounded-lg border border-indigo-500/10 w-fit">
            <Server className="w-4 h-4 text-indigo-400" /> {dep.directDependency}
          </p>
        </div>
        
        <div>
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1 flex items-center gap-1">
            <ArrowRight className="w-3 h-3"/> Upstream Impact
          </p>
          <p className="text-base font-semibold text-red-300 flex items-center gap-2 bg-red-500/5 py-2 px-3 rounded-lg border border-red-500/10 w-fit">
            <Activity className="w-4 h-4 text-red-400" /> {dep.affectedService}
          </p>
        </div>
      </div>
    </div>
  );
}
