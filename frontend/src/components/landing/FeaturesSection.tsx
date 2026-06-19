import { 
  Brain, Shield, TrendingUp, Code2, Rocket, 
  AlertTriangle, UserPlus, Gavel, Skull
} from "lucide-react";

const agents = [
  {
    name: "Investment Agent",
    description: "Analyzes unit economics, funding history, valuations, and burn rates to assess financial viability.",
    icon: TrendingUp,
    color: "emerald",
  },
  {
    name: "Market Agent",
    description: "Evaluates TAM/SAM/SOM, competitive landscape, timing, and market moats.",
    icon: Brain,
    color: "blue",
  },
  {
    name: "Risk Agent",
    description: "Identifies regulatory, operational, and reputational risks across all dimensions.",
    icon: Shield,
    color: "amber",
  },
  {
    name: "Technical Agent",
    description: "Reviews tech stack, architecture, scalability, code quality, and technical debt.",
    icon: Code2,
    color: "violet",
  },
  {
    name: "Execution Agent",
    description: "Assesses team strength, go-to-market strategy, milestones, and operational readiness.",
    icon: Rocket,
    color: "cyan",
  },
  {
    name: "Conflict Resolution",
    description: "Mediates disagreements between agents and produces consensus-driven decisions.",
    icon: Gavel,
    color: "orange",
  },
  {
    name: "Executive Review",
    description: "Synthesizes all findings into a final investment verdict with confidence scoring.",
    icon: Brain,
    color: "pink",
  },
  {
    name: "Failure Simulator",
    description: "Red-teams the deal by simulating catastrophic failure scenarios and survival probability.",
    icon: Skull,
    color: "red",
  },
];

const colorMap: Record<string, { bg: string; border: string; text: string; glow: string }> = {
  emerald: { bg: "bg-emerald-500/10", border: "border-emerald-500/20", text: "text-emerald-400", glow: "group-hover:shadow-emerald-500/10" },
  blue: { bg: "bg-blue-500/10", border: "border-blue-500/20", text: "text-blue-400", glow: "group-hover:shadow-blue-500/10" },
  amber: { bg: "bg-amber-500/10", border: "border-amber-500/20", text: "text-amber-400", glow: "group-hover:shadow-amber-500/10" },
  violet: { bg: "bg-violet-500/10", border: "border-violet-500/20", text: "text-violet-400", glow: "group-hover:shadow-violet-500/10" },
  cyan: { bg: "bg-cyan-500/10", border: "border-cyan-500/20", text: "text-cyan-400", glow: "group-hover:shadow-cyan-500/10" },
  orange: { bg: "bg-orange-500/10", border: "border-orange-500/20", text: "text-orange-400", glow: "group-hover:shadow-orange-500/10" },
  pink: { bg: "bg-pink-500/10", border: "border-pink-500/20", text: "text-pink-400", glow: "group-hover:shadow-pink-500/10" },
  red: { bg: "bg-red-500/10", border: "border-red-500/20", text: "text-red-400", glow: "group-hover:shadow-red-500/10" },
};

export function FeaturesSection() {
  return (
    <section id="features" className="relative py-32 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08] text-[12px] font-medium text-emerald-400 mb-5 uppercase tracking-wider">
            Agent Architecture
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-4">
            8 Specialized AI Agents
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Each agent brings domain expertise. Together, they form a due diligence war room 
            that no human team could replicate at this speed.
          </p>
        </div>

        {/* Agent grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {agents.map((agent, idx) => {
            const colors = colorMap[agent.color];
            return (
              <div
                key={idx}
                className={`group relative rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 hover:bg-white/[0.04] transition-all duration-300 hover:shadow-xl ${colors.glow} cursor-default`}
              >
                <div className={`w-10 h-10 rounded-xl ${colors.bg} border ${colors.border} flex items-center justify-center mb-4`}>
                  <agent.icon className={`w-5 h-5 ${colors.text}`} />
                </div>
                <h3 className="text-sm font-semibold text-white mb-2">{agent.name}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{agent.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
