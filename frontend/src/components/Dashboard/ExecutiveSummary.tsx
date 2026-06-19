import { useInvestigationStore } from '@/store/useInvestigationStore';
import { FileText, Download, CheckCircle, XCircle } from 'lucide-react';
import { cn } from '../Network/AgentNode';

export default function ExecutiveSummary() {
  const { report, status } = useInvestigationStore();

  if (status !== 'complete' && !report) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 text-center bg-slate-950/40 rounded-xl border border-white/5 backdrop-blur-md">
        <FileText className="w-12 h-12 text-slate-700 mb-4" />
        <h3 className="text-lg font-medium text-slate-300">Executive Report Pending</h3>
        <p className="text-sm text-slate-500 mt-2 max-w-xs">
          The final compiled report will be available here once the Executive Review Agent approves the investigation.
        </p>
      </div>
    );
  }

  const isApproved = report?.executive_decision?.approval_status?.toLowerCase().includes('approve');

  return (
    <div className="h-full flex flex-col bg-slate-950/40 rounded-xl border border-white/5 overflow-hidden backdrop-blur-md animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="p-5 border-b border-white/5 bg-slate-900/50 flex items-center justify-between sticky top-0 z-10">
        <h3 className="text-base font-semibold text-slate-200 flex items-center gap-2">
          <FileText className="w-5 h-5 text-emerald-400" />
          Final Compiled Report
        </h3>
        <button className="flex items-center gap-2 text-xs font-medium text-emerald-400 bg-emerald-400/10 hover:bg-emerald-400/20 px-3 py-1.5 rounded-lg transition-colors border border-emerald-400/20">
          <Download className="w-3.5 h-3.5" />
          Export PDF
        </button>
      </div>
      
      <div className="p-6">
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className={cn(
            "p-4 rounded-xl border flex items-center gap-4",
            isApproved 
              ? "bg-emerald-950/20 border-emerald-500/20" 
              : "bg-red-950/20 border-red-500/20"
          )}>
            <div className={cn(
              "p-3 rounded-lg",
              isApproved ? "bg-emerald-500/20 text-emerald-400" : "bg-red-500/20 text-red-400"
            )}>
              {isApproved ? <CheckCircle className="w-8 h-8" /> : <XCircle className="w-8 h-8" />}
            </div>
            <div>
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1">Final Verdict</p>
              <h2 className={cn("text-2xl font-bold uppercase", isApproved ? "text-emerald-400" : "text-red-400")}>
                {report?.executive_decision?.approval_status?.replace('_', ' ') || 'N/A'}
              </h2>
            </div>
          </div>

          <div className="p-4 rounded-xl border bg-slate-900/40 border-white/5 flex items-center gap-4">
            <div className="p-3 rounded-lg bg-blue-500/20 text-blue-400">
              <span className="text-2xl font-bold">{Math.round((report?.executive_decision?.confidence || 0) * 100)}%</span>
            </div>
            <div>
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1">Confidence Score</p>
              <p className="text-sm text-slate-300">Based on multi-agent consensus</p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <section>
            <h4 className="text-sm font-semibold text-slate-200 mb-3 uppercase tracking-wider border-b border-white/5 pb-2">Executive Summary</h4>
            <p className="text-sm text-slate-400 leading-relaxed whitespace-pre-wrap">
              {report?.executive_summary}
            </p>
          </section>

          <div className="grid grid-cols-2 gap-6">
            <section>
              <h4 className="text-sm font-semibold text-emerald-400 mb-3 uppercase tracking-wider border-b border-white/5 pb-2">Key Opportunities</h4>
              <ul className="space-y-2">
                {report?.opportunities?.map((opp: any, i: number) => (
                  <li key={i} className="text-sm text-slate-400 flex items-start gap-2">
                    <span className="text-emerald-400 mt-0.5">•</span>
                    <span>{typeof opp === 'string' ? opp : opp.title || opp.description}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section>
              <h4 className="text-sm font-semibold text-red-400 mb-3 uppercase tracking-wider border-b border-white/5 pb-2">Critical Risks</h4>
              <ul className="space-y-2">
                {report?.risks?.map((risk: any, i: number) => (
                  <li key={i} className="text-sm text-slate-400 flex items-start gap-2">
                    <span className="text-red-400 mt-0.5">•</span>
                    <span>{typeof risk === 'string' ? risk : risk.title || risk.description}</span>
                  </li>
                ))}
              </ul>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
