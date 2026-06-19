import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users } from "lucide-react";

interface AgentBreakdownProps {
  verdicts: any[];
}

export function AgentBreakdown({ verdicts }: AgentBreakdownProps) {
  return (
    <Card className="bg-[#0a0a0f] border-white/10 shadow-xl">
      <CardHeader className="pb-4 border-b border-white/5">
        <CardTitle className="text-xl font-bold text-white flex items-center gap-2 tracking-wide">
          <Users className="h-5 w-5 text-indigo-400" />
          Agent Breakdown
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {verdicts.map((av, i) => {
            const isApproved = av.verdict === 'approve';
            return (
              <div key={i} className="bg-white/[0.02] border border-white/5 p-4 rounded-lg flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-bold text-gray-200 text-sm">{av.agent_type}</h4>
                    <Badge variant="outline" className={
                      isApproved ? "border-emerald-500/30 text-emerald-400 bg-emerald-500/10" 
                                 : "border-rose-500/30 text-rose-400 bg-rose-500/10"
                    }>
                      {av.verdict.toUpperCase()}
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-400 line-clamp-3 mb-4">
                    {av.reasoning || "Analysis complete. Data processed securely within Band perimeter."}
                  </p>
                </div>
                <div className="text-[10px] text-gray-500 font-mono tracking-wider uppercase">
                  Confidence: <span className="text-cyan-400">{(av.confidence * 100).toFixed(0)}%</span>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
