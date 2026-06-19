'use client';

import { useInvestigationStore } from '@/lib/store';
import { investigationApi } from '@/lib/api';
import { PlayCircle } from 'lucide-react';
import Link from 'next/link';

export function HeaderMetrics({ investigationId }: { investigationId: string }) {
  const status = useInvestigationStore(state => state.status);
  const progress = useInvestigationStore(state => state.progress);
  
  const handleStart = async () => {
    try {
      await investigationApi.start(investigationId);
    } catch (err) {
      console.error(err);
    }
  };

  const isCompleted = status === 'completed';

  return (
    <div className="h-16 border-b border-white/[0.06] bg-[#0c0c10]/80 backdrop-blur-xl flex items-center justify-between px-6 shrink-0">
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-bold tracking-tight text-white">Venture Autopsy</h1>
        <div className="h-4 w-px bg-white/10" />
        <span className="text-sm font-medium text-gray-500">ID: {investigationId.substring(0,8)}</span>
      </div>
      
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-3">
          <span className="text-xs uppercase tracking-widest text-gray-500 font-semibold">Status</span>
          <span className={`px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider ${
            isCompleted ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
            status === 'idle' ? 'bg-white/5 text-gray-300' :
            'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 animate-pulse'
          }`}>
            {status.replace('_', ' ')}
          </span>
        </div>
        
        <div className="flex items-center gap-3 w-48">
          <span className="text-xs uppercase tracking-widest text-gray-500 font-semibold">Progress</span>
          <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
            <div 
              className="h-full bg-emerald-500 transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="text-xs font-mono text-gray-300">{progress}%</span>
        </div>
        
        {isCompleted ? (
          <Link href={`/investigation/${investigationId}`} className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold rounded-lg transition-colors shadow-lg shadow-emerald-500/20">
            View Final Report
          </Link>
        ) : (
          <button 
            onClick={handleStart}
            disabled={status !== 'idle'}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:bg-white/5 disabled:text-gray-600 text-white text-sm font-semibold rounded-lg transition-colors shadow-lg shadow-emerald-500/20"
          >
            <PlayCircle className="w-4 h-4" />
            Launch Agents
          </button>
        )}
      </div>
    </div>
  );
}
