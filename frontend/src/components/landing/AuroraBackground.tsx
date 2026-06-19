"use client";

export function AuroraBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden" aria-hidden="true">
      {/* Base dark */}
      <div className="absolute inset-0 bg-[#050507]" />

      {/* Grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255,255,255,0.5) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255,255,255,0.5) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Main aurora blob - top center */}
      <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[1000px] h-[700px] animate-aurora-drift">
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-emerald-500/20 via-teal-500/10 to-transparent blur-[120px]" />
      </div>

      {/* Secondary aurora - left */}
      <div className="absolute top-[10%] left-[-5%] w-[600px] h-[500px] animate-aurora-drift-slow">
        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-emerald-600/12 via-green-400/6 to-transparent blur-[100px]" />
      </div>

      {/* Tertiary aurora - right */}
      <div className="absolute top-[5%] right-[-5%] w-[500px] h-[450px] animate-aurora-drift-reverse">
        <div className="absolute inset-0 rounded-full bg-gradient-to-tl from-teal-500/10 via-emerald-400/5 to-transparent blur-[100px]" />
      </div>

      {/* Mid-page glow */}
      <div className="absolute top-[50%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] animate-aurora-pulse">
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-emerald-500/6 via-transparent to-teal-500/6 blur-[120px]" />
      </div>

      {/* Bottom accent */}
      <div className="absolute bottom-[-10%] left-1/3 w-[600px] h-[300px] animate-aurora-drift-slow">
        <div className="absolute inset-0 rounded-full bg-gradient-to-t from-emerald-500/8 to-transparent blur-[100px]" />
      </div>

      {/* Floating orbs / particles */}
      <div className="absolute top-[15%] left-[20%] w-2 h-2 rounded-full bg-emerald-400/30 animate-float-1" />
      <div className="absolute top-[25%] right-[25%] w-1.5 h-1.5 rounded-full bg-teal-400/25 animate-float-2" />
      <div className="absolute top-[40%] left-[15%] w-1 h-1 rounded-full bg-emerald-300/20 animate-float-3" />
      <div className="absolute top-[60%] right-[20%] w-2 h-2 rounded-full bg-green-400/20 animate-float-1" />
      <div className="absolute top-[35%] left-[60%] w-1.5 h-1.5 rounded-full bg-emerald-400/25 animate-float-2" />
      <div className="absolute top-[70%] left-[40%] w-1 h-1 rounded-full bg-teal-300/20 animate-float-3" />
      <div className="absolute top-[20%] left-[75%] w-1 h-1 rounded-full bg-emerald-300/30 animate-float-1" />
      <div className="absolute top-[80%] right-[35%] w-1.5 h-1.5 rounded-full bg-green-300/15 animate-float-2" />

      {/* Radial light rays from top center */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[500px] opacity-[0.025]">
        <svg viewBox="0 0 800 500" className="w-full h-full" preserveAspectRatio="none">
          {Array.from({ length: 12 }).map((_, i) => {
            const angle = (i / 12) * Math.PI;
            const x2 = 400 + Math.cos(angle) * 800;
            const y2 = Math.sin(angle) * 500;
            return (
              <line
                key={i}
                x1="400"
                y1="0"
                x2={x2}
                y2={y2}
                stroke="white"
                strokeWidth="0.5"
              />
            );
          })}
        </svg>
      </div>

      {/* Noise texture overlay */}
      <div
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
          backgroundSize: "128px 128px",
        }}
      />

      {/* Vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,#050507_80%)]" />
    </div>
  );
}
