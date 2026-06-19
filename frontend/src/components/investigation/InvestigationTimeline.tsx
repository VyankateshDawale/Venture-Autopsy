"use client";

import { CheckCircle2, Circle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface TimelineProps {
  status: string;
}

const steps = [
  { id: "pending", label: "Pending Initialization" },
  { id: "initializing", label: "Parsing Input Data" },
  { id: "agents_joining", label: "Assembling Core Team" },
  { id: "analyzing", label: "Core Analysis Phase" },
  { id: "recruiting_specialists", label: "Specialist Recruitment" },
  { id: "conflict_resolution", label: "Conflict Resolution" },
  { id: "executive_review", label: "Executive Synthesis" },
  { id: "completed", label: "Report Generated" },
];

export function InvestigationTimeline({ status }: TimelineProps) {
  const currentIndex = steps.findIndex(s => s.id === status);
  const activeIndex = currentIndex === -1 ? 0 : currentIndex;

  return (
    <div className="flex flex-col space-y-4">
      <h3 className="text-sm font-semibold text-white tracking-widest uppercase">Investigation Phase</h3>
      <div className="relative pl-3 space-y-6">
        <div className="absolute top-2 bottom-2 left-[19px] w-[2px] bg-white/5" />
        
        {steps.map((step, index) => {
          const isCompleted = index < activeIndex;
          const isActive = index === activeIndex;
          const isPending = index > activeIndex;

          return (
            <div key={step.id} className="relative flex items-center gap-4">
              <div className={cn(
                "relative z-10 flex h-4 w-4 items-center justify-center rounded-full bg-[#0a0a0f] border-2",
                isCompleted ? "border-cyan-500" : isActive ? "border-cyan-400" : "border-white/10"
              )}>
                {isCompleted && <CheckCircle2 className="h-3 w-3 text-cyan-500" />}
                {isActive && <div className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse" />}
              </div>
              
              <div className={cn(
                "text-sm font-medium transition-colors duration-300",
                isCompleted ? "text-gray-400" : isActive ? "text-cyan-400" : "text-gray-600"
              )}>
                {step.label}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
