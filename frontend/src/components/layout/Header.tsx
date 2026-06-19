import { Activity, Zap, History } from "lucide-react";
import Link from "next/link";

export function Header() {
  return (
    <header className="fixed top-0 z-50 w-full bg-[#060608]/60 backdrop-blur-xl border-b border-white/[0.06]">
      <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-6">
        {/* Logo */}
        <Link href="/" className="flex gap-2.5 items-center group">
          <div className="relative">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center">
              <Activity className="h-4 w-4 text-white" />
            </div>
            <div className="absolute inset-0 rounded-lg bg-emerald-500/30 blur-md group-hover:blur-lg transition-all duration-300" />
          </div>
          <span className="font-bold text-[15px] tracking-tight text-white">Venture<span className="text-emerald-400">Autopsy</span></span>
        </Link>

        {/* Nav */}
        <nav className="hidden md:flex items-center gap-8 text-[13px] font-medium text-gray-400">
          <Link href="/#how-it-works" className="hover:text-white transition-colors duration-200">How it works</Link>
          <Link href="/#features" className="hover:text-white transition-colors duration-200">Features</Link>
          <Link href="/history" className="hover:text-white transition-colors duration-200">History</Link>
        </nav>

        {/* CTA */}
        <Link 
          href="/#start" 
          className="hidden md:flex items-center gap-2 px-5 py-2 rounded-full bg-emerald-500 text-black text-[13px] font-semibold hover:bg-emerald-400 transition-all duration-200 shadow-lg shadow-emerald-500/20"
        >
          <Zap className="w-3.5 h-3.5" />
          Start Investigation
        </Link>
      </div>
    </header>
  );
}
