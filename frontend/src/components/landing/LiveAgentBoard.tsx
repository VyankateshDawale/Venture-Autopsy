"use client";

import { motion } from "framer-motion";
import { Activity, BrainCircuit, ShieldAlert, Code2, LineChart, Target, Zap } from "lucide-react";

const AGENTS = [
  {
    id: "investment",
    name: "Investment Agent",
    icon: LineChart,
    status: "Active",
    provider: "Gemini 1.5 Pro",
    confidence: "94%",
    activity: "Analyzing Revenue Model",
    color: "text-green-400",
    bg: "bg-green-400/10",
    border: "border-green-400/20"
  },
  {
    id: "market",
    name: "Market Agent",
    icon: Target,
    status: "Active",
    provider: "Gemini 1.5 Pro",
    confidence: "88%",
    activity: "Evaluating TAM & Competition",
    color: "text-blue-400",
    bg: "bg-blue-400/10",
    border: "border-blue-400/20"
  },
  {
    id: "risk",
    name: "Risk Agent",
    icon: ShieldAlert,
    status: "Recruiting",
    provider: "Gemini 1.5 Pro",
    confidence: "75%",
    activity: "Recruiting Healthcare Specialist",
    color: "text-amber-400",
    bg: "bg-amber-400/10",
    border: "border-amber-400/20"
  },
  {
    id: "technical",
    name: "Technical Agent",
    icon: Code2,
    status: "Active",
    provider: "Gemini 1.5 Pro",
    confidence: "91%",
    activity: "Reviewing Repository Architecture",
    color: "text-purple-400",
    bg: "bg-purple-400/10",
    border: "border-purple-400/20"
  },
  {
    id: "execution",
    name: "Execution Agent",
    icon: Zap,
    status: "Idle",
    provider: "Gemini 1.5 Pro",
    confidence: "82%",
    activity: "Analyzing GTM Strategy and Team",
    color: "text-gray-400",
    bg: "bg-gray-400/10",
    border: "border-gray-400/20"
  }
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

export function LiveAgentBoard() {
  return (
    <section className="py-24 relative overflow-hidden bg-background">
      <div className="container relative z-10 px-4 md:px-6">
        <div className="flex flex-col items-center text-center mb-16">
          <BrainCircuit className="h-12 w-12 text-cyan-400 mb-4 animate-pulse" />
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-4">
            The AI Boardroom
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl">
            Watch as specialized AI agents collaborate in real-time. They debate, analyze data, recruit specialists when out of their depth, and simulate failure scenarios to test resilience.
          </p>
        </div>

        <motion.div 
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6"
        >
          {AGENTS.map((agent) => (
            <motion.div 
              key={agent.id}
              variants={item}
              className={`relative rounded-xl border ${agent.border} bg-white/5 p-6 backdrop-blur-md flex flex-col justify-between hover:bg-white/10 transition-colors group`}
            >
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <agent.icon className={`h-24 w-24 ${agent.color}`} />
              </div>
              
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-2 rounded-lg ${agent.bg}`}>
                    <agent.icon className={`h-5 w-5 ${agent.color}`} />
                  </div>
                  <div className="flex items-center space-x-1">
                    {agent.status === "Active" && (
                      <span className="relative flex h-2 w-2">
                        <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${agent.bg.replace('/10', '')}`}></span>
                        <span className={`relative inline-flex rounded-full h-2 w-2 ${agent.bg.replace('/10', '')}`}></span>
                      </span>
                    )}
                    <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">{agent.status}</span>
                  </div>
                </div>
                
                <h3 className="text-lg font-semibold text-white mb-1">{agent.name}</h3>
                <div className="text-xs text-cyan-400/80 font-mono mb-4">{agent.provider}</div>
                
                <div className="space-y-3">
                  <div>
                    <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Current Activity</div>
                    <div className="text-sm text-gray-300 font-medium h-10 line-clamp-2">
                      {agent.activity}
                    </div>
                  </div>
                  
                  <div className="pt-3 border-t border-white/5 flex justify-between items-end">
                    <div>
                      <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Confidence</div>
                      <div className={`text-lg font-bold ${agent.confidence !== '--' ? agent.color : 'text-gray-500'}`}>
                        {agent.confidence}
                      </div>
                    </div>
                    <Activity className="h-4 w-4 text-gray-600 mb-1" />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
