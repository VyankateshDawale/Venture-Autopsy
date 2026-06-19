'use client';

import { useInvestigationStore } from '@/lib/store';
import { Terminal, AlertCircle, CheckCircle, Info } from 'lucide-react';
import { format } from 'date-fns';

export function ActivityFeed() {
  const events = useInvestigationStore(state => state.timelineEvents);

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 py-3 border-b border-slate-800 bg-slate-900/80 flex items-center gap-2">
        <Terminal className="w-4 h-4 text-slate-400" />
        <h2 className="text-xs uppercase tracking-widest font-semibold text-slate-300">Live Activity Feed</h2>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-slate-700">
        {events.length === 0 ? (
          <div className="h-full flex items-center justify-center text-sm text-slate-500 font-mono">
            Waiting for agents...
          </div>
        ) : (
          events.map((event) => (
            <div key={event.id} className="flex gap-3 text-sm animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="mt-0.5 shrink-0">
                {event.payload.event_type === 'alert' ? (
                  <AlertCircle className="w-4 h-4 text-amber-500" />
                ) : event.payload.event_type === 'success' ? (
                  <CheckCircle className="w-4 h-4 text-emerald-500" />
                ) : event.payload.event_type === 'error' ? (
                  <AlertCircle className="w-4 h-4 text-rose-500" />
                ) : (
                  <Info className="w-4 h-4 text-indigo-400" />
                )}
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <span className={`font-semibold ${
                    event.payload.event_type === 'alert' ? 'text-amber-400' :
                    event.payload.event_type === 'success' ? 'text-emerald-400' :
                    event.payload.event_type === 'error' ? 'text-rose-400' :
                    'text-indigo-300'
                  }`}>
                    {event.payload.title}
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">
                    {format(new Date(event.timestamp), 'HH:mm:ss')}
                  </span>
                </div>
                <p className="text-slate-400 text-xs leading-relaxed">
                  {event.payload.description}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
