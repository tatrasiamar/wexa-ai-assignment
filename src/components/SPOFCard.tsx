import { AlertTriangle, Users, Server } from "lucide-react";
import { SPOF } from "@/types";

export function SPOFCard({ spof }: { spof: SPOF }) {
  return (
    <div className="group relative bg-red-950/20 border border-red-900/50 hover:border-red-500/50 transition-colors rounded-md p-5 flex flex-col h-full">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-red-500/10 rounded-md">
          <AlertTriangle className="w-5 h-5 text-red-500" />
        </div>
        <div>
          <p className="text-xs font-semibold text-red-400 uppercase tracking-widest">SPOF Detected</p>
          <h2 className="text-lg font-bold text-red-100 truncate">{spof.databaseName}</h2>
        </div>
      </div>
      
      <p className="text-xs text-red-300/80 mb-4 leading-relaxed">
        This database is a single point of failure across multiple teams. An outage here will cause cross-departmental cascading failures.
      </p>

      <div className="flex-1 space-y-3 border-t border-red-900/30 pt-4 mt-auto">
        <div className="flex items-center justify-between">
          <p className="text-xs text-red-400 flex items-center gap-1.5">
            <Server className="w-3.5 h-3.5" /> Downstream Services
          </p>
          <span className="text-sm font-bold text-red-100">{spof.numServices}</span>
        </div>
        
        <div className="flex items-center justify-between">
          <p className="text-xs text-red-400 flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5" /> Impacted Teams
          </p>
          <span className="text-sm font-bold text-red-100">{spof.numTeams}</span>
        </div>
      </div>
    </div>
  );
}
