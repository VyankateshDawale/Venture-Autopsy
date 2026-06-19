"use client";

import { motion } from "framer-motion";
import { ShieldCheck, HeartPulse, Landmark, Scale, Server } from "lucide-react";

const SPECIALISTS = [
  { name: "Cybersecurity Expert", icon: ShieldCheck, domain: "Security & Compliance" },
  { name: "Healthcare Expert", icon: HeartPulse, domain: "MedTech & Regulations" },
  { name: "Fintech Expert", icon: Landmark, domain: "Banking & DeFi" },
  { name: "Legal Expert", icon: Scale, domain: "IP & Liability" },
  { name: "Infrastructure Expert", icon: Server, domain: "Cloud & Scaling" },
];

export function SpecialistNetworkSection() {
  return (
    <section className="py-24 relative bg-gray-950 overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20"></div>
      
      <div className="container relative z-10 px-4 md:px-6">
        <div className="flex flex-col md:flex-row items-center justify-between mb-16 gap-8">
          <div className="max-w-2xl">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-4">
              Dynamic Specialist Network
            </h2>
            <p className="text-lg text-gray-400">
              When the core team encounters domain-specific complexity, they autonomously recruit specialized experts from our global network to join the boardroom.
            </p>
          </div>
          <div className="shrink-0 flex items-center justify-center p-4 rounded-full bg-cyan-500/10 border border-cyan-500/30">
            <span className="flex h-3 w-3 rounded-full bg-cyan-400 animate-ping mr-3"></span>
            <span className="text-cyan-400 font-medium">Recruitment Engine Active</span>
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-4">
          {SPECIALISTS.map((spec, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: i * 0.15, type: "spring", bounce: 0.4 }}
              className="flex items-center space-x-4 bg-white/5 border border-white/10 rounded-full pr-6 pl-2 py-2 hover:bg-white/10 hover:border-cyan-500/50 transition-all cursor-default"
            >
              <div className="bg-gray-800 p-3 rounded-full border border-gray-700 shadow-inner">
                <spec.icon className="h-5 w-5 text-gray-300" />
              </div>
              <div>
                <div className="text-sm font-bold text-white">{spec.name}</div>
                <div className="text-xs text-gray-500">{spec.domain}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
