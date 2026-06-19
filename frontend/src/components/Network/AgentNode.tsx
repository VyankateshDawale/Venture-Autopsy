import { Handle, Position } from '@xyflow/react';
import { BrainCircuit, Activity, CheckCircle2, AlertTriangle, AlertCircle, Bot } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

interface AgentNodeProps {
  data: {
    label: string;
    role: string;
    status: 'idle' | 'analyzing' | 'complete' | 'conflict' | 'failed';
    provider?: string;
  };
}

export default function AgentNode({ data }: AgentNodeProps) {
  const { label, role, status, provider } = data;

  const statusConfig = {
    idle: {
      color: 'text-slate-400',
      bg: 'bg-slate-900/50',
      border: 'border-slate-800',
      icon: <BrainCircuit className="w-5 h-5 text-slate-400" />
    },
    analyzing: {
      color: 'text-blue-400',
      bg: 'bg-blue-900/20',
      border: 'border-blue-500/50',
      icon: <Activity className="w-5 h-5 text-blue-400 animate-pulse" />
    },
    complete: {
      color: 'text-emerald-400',
      bg: 'bg-emerald-900/20',
      border: 'border-emerald-500/50',
      icon: <CheckCircle2 className="w-5 h-5 text-emerald-400" />
    },
    conflict: {
      color: 'text-amber-400',
      bg: 'bg-amber-900/20',
      border: 'border-amber-500/50',
      icon: <AlertTriangle className="w-5 h-5 text-amber-400" />
    },
    failed: {
      color: 'text-red-400',
      bg: 'bg-red-900/20',
      border: 'border-red-500/50',
      icon: <AlertCircle className="w-5 h-5 text-red-400" />
    }
  };

  const config = statusConfig[status] || statusConfig.idle;

  return (
    <div className={cn(
      "relative px-4 py-3 rounded-xl border backdrop-blur-md min-w-[200px] shadow-xl transition-all duration-300",
      config.bg,
      config.border
    )}>
      <Handle type="target" position={Position.Top} className="!bg-slate-500 !w-2 !h-2" />
      
      <div className="flex items-start justify-between gap-3">
        <div className={cn("p-2 rounded-lg bg-black/40", config.color)}>
          {config.icon}
        </div>
        
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-slate-200">{label}</h3>
          <p className="text-xs text-slate-400 mt-0.5">{role}</p>
        </div>
      </div>

      {provider && (
        <div className="mt-3 flex items-center gap-1.5 px-2 py-1 rounded-md bg-black/40 border border-white/5 w-fit">
          <Bot className="w-3 h-3 text-slate-400" />
          <span className="text-[10px] font-medium text-slate-300 uppercase tracking-wider">{provider}</span>
        </div>
      )}

      {status === 'analyzing' && (
        <div className="absolute -bottom-px left-0 h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent w-full animate-in fade-in slide-in-from-left-full duration-1000" />
      )}

      <Handle type="source" position={Position.Bottom} className="!bg-slate-500 !w-2 !h-2" />
    </div>
  );
}
