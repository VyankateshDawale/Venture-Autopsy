import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ShieldAlert, Flame } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface RiskMatrixProps {
  risks: any[];
}

export function RiskMatrix({ risks }: RiskMatrixProps) {
  // Simple bucketing for demonstration
  const critical = risks.filter(r => r.severity === 'critical');
  const high = risks.filter(r => r.severity === 'high');
  const medium = risks.filter(r => r.severity === 'medium');

  return (
    <Card className="bg-[#0a0a0f] border-white/10 shadow-xl h-full">
      <CardHeader className="pb-4 border-b border-white/5">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl font-bold text-rose-400 flex items-center gap-2 tracking-wide">
            <ShieldAlert className="h-5 w-5" />
            Risk Matrix
          </CardTitle>
          <Badge variant="outline" className="border-rose-500/20 text-rose-400 bg-rose-500/10">
            {risks.length} Identified
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-6 space-y-6">
        
        {/* Critical Row */}
        <div>
          <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3 flex items-center gap-2">
            <Flame className="h-3 w-3 text-rose-500" /> Critical Severity
          </h4>
          <div className="grid grid-cols-1 gap-3">
            {critical.length === 0 ? <p className="text-sm text-gray-600">None detected.</p> : critical.map((r, i) => (
              <div key={i} className="bg-rose-950/30 border border-rose-900/50 p-4 rounded-md">
                <div className="font-semibold text-rose-300 text-sm mb-1">{r.title}</div>
                <p className="text-xs text-rose-200/70">{r.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* High Row */}
        <div>
          <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">High Severity</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {high.length === 0 ? <p className="text-sm text-gray-600">None detected.</p> : high.map((r, i) => (
              <div key={i} className="bg-orange-950/20 border border-orange-900/40 p-3 rounded-md">
                <div className="font-semibold text-orange-300 text-sm mb-1">{r.title}</div>
                <p className="text-xs text-orange-200/70 line-clamp-2">{r.description}</p>
              </div>
            ))}
          </div>
        </div>

      </CardContent>
    </Card>
  );
}
