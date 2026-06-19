import { useInvestigationStore } from '@/store/useInvestigationStore';
import { Database, Zap, AlertCircle } from 'lucide-react';
import { cn } from '../Network/AgentNode';

export default function SharedContextPanel() {
  const { sharedContext } = useInvestigationStore();

  return (
    <div className="h-full flex flex-col bg-slate-950/40 rounded-xl border border-white/5 overflow-hidden backdrop-blur-md">
      <div className="p-4 border-b border-white/5 bg-slate-900/50 flex items-center justify-between sticky top-0 z-10">
        <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
          <Database className="w-4 h-4 text-indigo-400" />
          Shared Context
        </h3>
        <span className="text-[10px] uppercase tracking-wider text-slate-500 font-medium">
          {sharedContext.length} Entries
        </span>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {sharedContext.length === 0 ? (
          <div className="h-full flex items-center justify-center text-slate-500 text-sm text-center px-4">
            Agents are analyzing. Shared insights will appear here.
          </div>
        ) : (
          sharedContext.map((item, i) => (
            <div key={i} className="bg-indigo-950/10 rounded-lg p-3 border border-indigo-500/20 animate-in fade-in slide-in-from-right-4">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 p-1.5 rounded-md bg-indigo-900/30 text-indigo-400 shrink-0">
                  {item.category === 'risk' ? <AlertCircle className="w-3.5 h-3.5" /> : <Zap className="w-3.5 h-3.5" />}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-semibold text-slate-300">
                      {item.agent_name || item.agent_type || 'Agent'}
                    </span>
                    <span className="text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                      {item.category || 'insight'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {item.content || item.finding}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
