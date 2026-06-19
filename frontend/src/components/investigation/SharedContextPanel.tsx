"use client";

import { ShieldAlert, Lightbulb, CheckCircle2, Flame } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

interface ContextPanelProps {
  findings: any[];
}

export function SharedContextPanel({ findings }: ContextPanelProps) {
  const risks = findings.filter(f => f.category === 'risk' || f.category === 'red_flag');
  const opportunities = findings.filter(f => f.category === 'opportunity' || f.category === 'strength');

  return (
    <div className="flex flex-col h-full bg-[#0a0a0f] border-l border-white/5">
      <div className="p-4 border-b border-white/5 shrink-0 bg-white/[0.02]">
        <h3 className="text-sm font-semibold text-white tracking-widest uppercase">Shared Context</h3>
        <p className="text-xs text-gray-500 mt-1">Cross-agent consolidated findings</p>
      </div>

      <ScrollArea className="flex-1 p-4">
        <div className="space-y-6">
          {/* Critical Risks */}
          <section>
            <div className="flex items-center gap-2 mb-3">
              <ShieldAlert className="h-4 w-4 text-rose-500" />
              <h4 className="text-sm font-medium text-gray-200">Active Risks</h4>
              <Badge variant="secondary" className="ml-auto bg-rose-500/10 text-rose-400 border-rose-500/20">
                {risks.length}
              </Badge>
            </div>
            {risks.length === 0 ? (
              <p className="text-xs text-gray-500 italic">No risks identified yet.</p>
            ) : (
              <div className="space-y-2">
                {risks.map((r, i) => (
                  <div key={i} className="p-3 rounded-md bg-rose-950/20 border border-rose-900/30 animate-in fade-in zoom-in-95">
                    <div className="flex justify-between items-start mb-1">
                      <span className="text-xs font-semibold text-rose-300">{r.title}</span>
                      {r.severity === 'critical' && <Flame className="h-3 w-3 text-rose-500 shrink-0" />}
                    </div>
                    <p className="text-xs text-gray-400 line-clamp-2">{r.description}</p>
                    <div className="text-[10px] text-gray-500 mt-2 font-mono">{r.agent_id}</div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Opportunities / Strengths */}
          <section>
            <div className="flex items-center gap-2 mb-3">
              <Lightbulb className="h-4 w-4 text-emerald-500" />
              <h4 className="text-sm font-medium text-gray-200">Opportunities</h4>
              <Badge variant="secondary" className="ml-auto bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
                {opportunities.length}
              </Badge>
            </div>
            {opportunities.length === 0 ? (
              <p className="text-xs text-gray-500 italic">No opportunities identified yet.</p>
            ) : (
              <div className="space-y-2">
                {opportunities.map((o, i) => (
                  <div key={i} className="p-3 rounded-md bg-emerald-950/20 border border-emerald-900/30 animate-in fade-in zoom-in-95">
                    <div className="text-xs font-semibold text-emerald-300 mb-1">{o.title}</div>
                    <p className="text-xs text-gray-400 line-clamp-2">{o.description}</p>
                    <div className="text-[10px] text-gray-500 mt-2 font-mono">{o.agent_id}</div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </ScrollArea>
    </div>
  );
}
