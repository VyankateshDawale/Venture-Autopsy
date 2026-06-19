"use client";

import { motion } from "framer-motion";
import { Rocket, Code2, Building2, Briefcase, Bot } from "lucide-react";

const TYPES = [
  {
    title: "Startup Due Diligence",
    description: "Deep dive into business models, unit economics, and competitive moats for early-stage investments.",
    icon: Rocket,
    color: "text-orange-400",
    bg: "bg-orange-400/10",
  },
  {
    title: "GitHub Repository Audit",
    description: "Automated code quality, architecture scaling, and technical debt analysis for software acquisitions.",
    icon: Code2,
    color: "text-gray-200",
    bg: "bg-gray-200/10",
  },
  {
    title: "Enterprise Innovation Review",
    description: "Assess internal R&D proposals, alignment with corporate strategy, and implementation risks.",
    icon: Building2,
    color: "text-blue-400",
    bg: "bg-blue-400/10",
  },
  {
    title: "Acquisition Evaluation",
    description: "Comprehensive multi-agent risk assessment for M&A targets, identifying hidden liabilities.",
    icon: Briefcase,
    color: "text-emerald-400",
    bg: "bg-emerald-400/10",
  },
  {
    title: "AI Product Assessment",
    description: "Evaluate AI safety, model robustness, data moats, and regulatory compliance of AI products.",
    icon: Bot,
    color: "text-indigo-400",
    bg: "bg-indigo-400/10",
  }
];

export function InvestigationTypesSection() {
  return (
    <section className="py-24 bg-background">
      <div className="container px-4 md:px-6">
        <div className="mb-16">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-4">
            Investigation Capabilities
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl">
            A versatile framework adaptable to any due diligence scenario.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {TYPES.map((type, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="group p-8 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all hover:border-white/20"
            >
              <div className={`inline-flex p-3 rounded-lg ${type.bg} mb-6 group-hover:scale-110 transition-transform`}>
                <type.icon className={`h-8 w-8 ${type.color}`} />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{type.title}</h3>
              <p className="text-gray-400 leading-relaxed">
                {type.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
