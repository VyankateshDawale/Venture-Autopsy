import { useInvestigationStore } from '@/store/useInvestigationStore';
import { BrainCircuit, Play, CheckCircle2, AlertTriangle, Lightbulb, Shield, ShieldAlert, GitMerge } from 'lucide-react';
import { cn } from '../Network/AgentNode';

export default function TimelineFeed() {
  const { events } = useInvestigationStore();

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'system': return <Play className="w-4 h-4 text-blue-400" />;
      case 'success': return <CheckCircle2 className="w-4 h-4 text-emerald-400" />;
      case 'finding': return <Lightbulb className="w-4 h-4 text-amber-400" />;
      case 'conflict': return <AlertTriangle className="w-4 h-4 text-red-400" />;
      case 'resolution': return <GitMerge className="w-4 h-4 text-fuchsia-400" />;
      default: return <BrainCircuit className="w-4 h-4 text-slate-400" />;
    }
  };

  const timelineEvents = events.filter(e => e.type === 'timeline_event');

  return (
    <div className="h-full flex flex-col bg-slate-950/40 rounded-xl border border-white/5 overflow-hidden backdrop-blur-md">
      <div className="p-4 border-b border-white/5 bg-slate-900/50 flex items-center justify-between sticky top-0 z-10">
        <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
          <ActivityPulse />
          Live Activity Feed
        </h3>
        <span className="text-[10px] uppercase tracking-wider text-slate-500 font-medium">
          {timelineEvents.length} Events
        </span>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {timelineEvents.length === 0 ? (
          <div className="h-full flex items-center justify-center text-slate-500 text-sm">
            Waiting for events...
          </div>
        ) : (
          timelineEvents.map((event, i) => (
            <div key={event.id || i} className="relative pl-6 pb-4 last:pb-0 group animate-in fade-in slide-in-from-bottom-2">
              {/* Timeline line */}
              {i !== timelineEvents.length - 1 && (
                <div className="absolute left-[11px] top-6 bottom-0 w-px bg-slate-800 group-hover:bg-slate-700 transition-colors" />
              )}
              
              {/* Icon node */}
              <div className="absolute left-0 top-1 w-6 h-6 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center shadow-sm">
                {getEventIcon(event.payload?.event_type)}
              </div>

              {/* Content */}
              <div className="bg-slate-900/40 rounded-lg p-3 border border-white/5 hover:border-white/10 transition-colors">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="text-sm font-medium text-slate-200">
                    {event.payload?.title || 'Event'}
                  </h4>
                  <span className="text-[10px] text-slate-500 font-mono">
                    {new Date(event.timestamp).toLocaleTimeString([], { hour12: false })}
                  </span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {event.payload?.description}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function ActivityPulse() {
  return (
    <span className="relative flex h-2 w-2">
      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
    </span>
  );
}
