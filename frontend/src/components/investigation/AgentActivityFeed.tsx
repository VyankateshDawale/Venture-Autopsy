"use client";

import { useEffect, useRef } from "react";
import { format } from "date-fns";
import { Bot, AlertTriangle, ShieldCheck, Activity } from "lucide-react";
import type { TimelineEvent } from "@/lib/types";

export function AgentActivityFeed({ events }: { events: TimelineEvent[] }) {
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [events]);

  const getIcon = (type: string) => {
    switch (type) {
      case "alert": return <AlertTriangle className="h-4 w-4 text-rose-400" />;
      case "success": return <ShieldCheck className="h-4 w-4 text-emerald-400" />;
      case "system": return <Activity className="h-4 w-4 text-cyan-400" />;
      default: return <Bot className="h-4 w-4 text-indigo-400" />;
    }
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="flex items-center justify-between pb-4 border-b border-white/5 mb-4 shrink-0">
        <h3 className="text-sm font-semibold text-white tracking-widest uppercase flex items-center gap-2">
          <Activity className="h-4 w-4 text-cyan-400" />
          Live Activity Feed
        </h3>
        <span className="flex h-2 w-2 relative">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
        </span>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 space-y-4 scrollbar-thin scrollbar-thumb-white/10">
        {events.length === 0 ? (
          <div className="text-sm text-gray-500 italic text-center mt-10">Awaiting agent activity...</div>
        ) : (
          events.map((evt, i) => (
            <div key={i} className="flex gap-3 text-sm animate-in slide-in-from-left-2 fade-in duration-300">
              <div className="mt-0.5 shrink-0 bg-white/5 p-1.5 rounded-md border border-white/5">
                {getIcon(evt.event_type)}
              </div>
              <div>
                <div className="flex items-baseline gap-2">
                  <span className="font-medium text-gray-200">{evt.title}</span>
                  <span className="text-[10px] text-gray-500 uppercase">
                    {format(new Date(evt.created_at || new Date()), "HH:mm:ss")}
                  </span>
                </div>
                {evt.description && (
                  <div className="text-gray-400 mt-0.5 leading-relaxed">
                    {evt.description}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
        <div ref={endRef} />
      </div>
    </div>
  );
}
