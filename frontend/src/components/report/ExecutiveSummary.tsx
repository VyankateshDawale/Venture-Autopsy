import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { FileText } from "lucide-react";

export function ExecutiveSummary({ content }: { content: string }) {
  return (
    <Card className="bg-[#0a0a0f] border-white/10 shadow-xl relative overflow-hidden">
      <div className="absolute top-0 left-0 w-1 h-full bg-cyan-500" />
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-bold text-white flex items-center gap-2 tracking-wide">
          <FileText className="h-5 w-5 text-cyan-400" />
          Executive Synthesis
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="prose prose-invert max-w-none text-gray-300 leading-loose prose-p:mb-4">
          {content.split('\n').map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
