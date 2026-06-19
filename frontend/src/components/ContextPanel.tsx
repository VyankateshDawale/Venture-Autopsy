'use client';

import { useInvestigationStore } from '@/lib/store';
import { Database, TrendingUp, AlertTriangle, Lightbulb } from 'lucide-react';

export function ContextPanel() {
  const findings = useInvestigationStore(state => state.findings);

  const getIcon = (category: string) => {
    switch (category) {
      case 'opportunity': return <TrendingUp className="w-4 h-4 text-emerald-400" />;
      case 'risk': return <AlertTriangle className="w-4 h-4 text-rose-400" />;
      case 'expert_finding': return <Lightbulb className="w-4 h-4 text-amber-400" />;
      default: return <Database className="w-4 h-4 text-indigo-400" />;
    }
  };

  const getBorderColor = (category: string) => {
    switch (category) {
      case 'opportunity': return 'border-emerald-500/20 bg-emerald-500/5';
      case 'risk': return 'border-rose-500/20 bg-rose-500/5';
      case 'expert_finding': return 'border-amber-500/20 bg-amber-500/5';
      default: return 'border-indigo-500/20 bg-indigo-500/5';
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 py-3 border-b border-slate-800 bg-slate-900/80 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Database className="w-4 h-4 text-slate-400" />
          <h2 className="text-xs uppercase tracking-widest font-semibold text-slate-300">Shared Context</h2>
        </div>
        <span className="text-xs font-mono text-slate-500">{findings.length} Items</span>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin scrollbar-thumb-slate-700">
        {findings.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-sm text-slate-500 font-mono gap-2">
            <Database className="w-8 h-8 opacity-20 mb-2" />
            <p>Database is empty</p>
            <p className="text-xs opacity-50">Waiting for agent findings...</p>
          </div>
        ) : (
          findings.map((finding) => (
            <div 
              key={finding.id} 
              className={`p-3 rounded-lg border ${getBorderColor(finding.category)} transition-all hover:bg-slate-800/50`}
            >
              <div className="flex items-center gap-2 mb-2">
                {getIcon(finding.category)}
                <span className="text-xs font-semibold text-slate-200">{finding.title}</span>
              </div>
              <p className="text-xs text-slate-400 line-clamp-3">
                {finding.description}
              </p>
              <div className="mt-2 flex justify-between items-center">
                <span className="text-[10px] uppercase tracking-wider text-slate-500">
                  By: {finding.agent_id}
                </span>
                {finding.severity && (
                  <span className={`text-[10px] px-1.5 py-0.5 rounded uppercase tracking-wider ${
                    finding.severity === 'critical' ? 'bg-rose-500/20 text-rose-400' :
                    finding.severity === 'high' ? 'bg-amber-500/20 text-amber-400' :
                    'bg-slate-700 text-slate-300'
                  }`}>
                    {finding.severity}
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
