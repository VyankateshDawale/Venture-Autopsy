import { 
  Activity, TrendingUp, AlertTriangle, Shield, Brain, 
  BarChart3, FileSearch, Gavel, ChevronRight 
} from "lucide-react";

const sidebarItems = [
  { label: "Overview", icon: Activity, active: true },
  { label: "Investment Analysis", icon: TrendingUp, active: false },
  { label: "Market Analysis", icon: BarChart3, active: false },
  { label: "Risk Assessment", icon: AlertTriangle, active: false },
  { label: "Technical Review", icon: FileSearch, active: false },
];

const metrics = [
  { label: "Agents Active", sublabel: "Core + Specialists", value: "8", change: "All deployed", positive: true },
  { label: "Findings", sublabel: "Last 30 min", value: "24", change: "↑ 6 new", positive: true },
  { label: "Conflicts Detected", sublabel: "Resolution pending", value: "3", change: "↑ 1 critical", positive: false },
  { label: "Confidence Score", sublabel: "Overall verdict", value: "87%", change: "Strong consensus", positive: true },
];

const timelineItems = [
  { agent: "Investment Agent", action: "Unit economics look unsustainable at current burn rate", severity: "warning", time: "2m ago" },
  { agent: "Market Agent", action: "TAM estimate validated — $4.2B by 2028", severity: "success", time: "4m ago" },
  { agent: "Risk Agent", action: "⚠️ Regulatory risk detected in EU markets", severity: "critical", time: "5m ago" },
  { agent: "Specialist Recruited", action: "FinTech compliance expert joining investigation", severity: "info", time: "6m ago" },
];

export function DashboardPreview() {
  return (
    <section className="relative pb-20 -mt-10 px-6">
      {/* Subtle gradient fade from hero */}
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-transparent to-[#060608] pointer-events-none" />
      
      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Dashboard container with monitor-like frame */}
        <div className="rounded-2xl border border-white/[0.08] bg-[#0c0c10]/90 backdrop-blur-xl shadow-2xl shadow-black/50 overflow-hidden">
          {/* Top bar */}
          <div className="flex items-center justify-between px-5 py-3 border-b border-white/[0.06] bg-white/[0.02]">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center">
                  <Activity className="w-3.5 h-3.5 text-white" />
                </div>
                <span className="text-sm font-semibold text-white">VentureAutopsy</span>
              </div>
              <div className="h-4 w-px bg-white/10" />
              <span className="text-xs text-gray-500">QuantumEdge Acquisition · Last sync 28s ago</span>
            </div>
            <div className="flex items-center gap-2">
              <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-gray-400 hover:text-white hover:bg-white/5 transition-colors">
                <BarChart3 className="w-3 h-3" />
                Export
              </button>
              <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500 text-black text-xs font-medium">
                + New Report
              </button>
            </div>
          </div>

          <div className="flex">
            {/* Sidebar */}
            <div className="w-52 border-r border-white/[0.06] py-4 px-3 hidden md:block">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-600 px-3 mb-2">Agents</p>
              {sidebarItems.map((item, idx) => (
                <button
                  key={idx}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] font-medium transition-colors mb-0.5 ${
                    item.active
                      ? "bg-emerald-500/10 text-emerald-400"
                      : "text-gray-500 hover:text-gray-300 hover:bg-white/[0.03]"
                  }`}
                >
                  <item.icon className="w-3.5 h-3.5" />
                  {item.label}
                </button>
              ))}
              <div className="h-px bg-white/[0.06] my-3 mx-3" />
              <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-600 px-3 mb-2">Resolution</p>
              <button className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] font-medium text-gray-500 hover:text-gray-300 hover:bg-white/[0.03] transition-colors mb-0.5">
                <Gavel className="w-3.5 h-3.5" />
                Conflict Room
              </button>
              <button className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] font-medium text-gray-500 hover:text-gray-300 hover:bg-white/[0.03] transition-colors">
                <Brain className="w-3.5 h-3.5" />
                Executive Review
              </button>
            </div>

            {/* Main content */}
            <div className="flex-1 p-5 space-y-5">
              {/* Metrics row */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                {metrics.map((metric, idx) => (
                  <div key={idx} className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
                    <div className="text-[11px] text-gray-500 font-medium">{metric.label}</div>
                    <div className="text-[10px] text-gray-600">{metric.sublabel}</div>
                    <div className="flex items-baseline gap-2 mt-2">
                      <span className="text-2xl font-bold text-white tracking-tight">{metric.value}</span>
                      <span className={`text-[11px] font-medium ${metric.positive ? 'text-emerald-400' : 'text-red-400'}`}>
                        {metric.change}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Activity feed */}
              <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold text-white">Live Agent Activity</span>
                  <span className="flex items-center gap-1 text-[10px] text-emerald-400">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Live
                  </span>
                </div>
                <div className="space-y-2">
                  {timelineItems.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-3 py-2 border-b border-white/[0.04] last:border-0">
                      <div className={`mt-0.5 w-2 h-2 rounded-full shrink-0 ${
                        item.severity === 'critical' ? 'bg-red-400' :
                        item.severity === 'warning' ? 'bg-amber-400' :
                        item.severity === 'success' ? 'bg-emerald-400' :
                        'bg-blue-400'
                      }`} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-medium text-white">{item.agent}</span>
                          <span className="text-[10px] text-gray-600">{item.time}</span>
                        </div>
                        <p className="text-xs text-gray-400 mt-0.5 truncate">{item.action}</p>
                      </div>
                      {item.severity === 'critical' && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-500/15 text-red-400 font-medium shrink-0">Critical</span>
                      )}
                      {item.severity === 'warning' && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-400 font-medium shrink-0">Warning</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Reflection glow under the dashboard */}
        <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-emerald-500/5 blur-[80px] rounded-full" />
      </div>
    </section>
  );
}
