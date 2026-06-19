"use client";

import { motion } from "framer-motion";

const METRICS = [
  { value: "8+", label: "AI Agents", description: "Collaborating autonomously" },
  { value: "5", label: "Specialist Domains", description: "On-demand expert knowledge" },
  { value: "100+", label: "Risk Factors", description: "Evaluated per investigation" },
  { value: "24/7", label: "Due Diligence", description: "Automated, instant analysis" }
];

export function PlatformMetricsSection() {
  return (
    <section className="py-24 bg-gray-950 border-t border-b border-white/5">
      <div className="container px-4 md:px-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 divide-x divide-white/5">
          {METRICS.map((metric, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className={`flex flex-col items-center text-center ${i !== 0 ? "pl-8 md:pl-12" : ""}`}
            >
              <div className="text-4xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-white to-gray-500 mb-2">
                {metric.value}
              </div>
              <div className="text-lg font-bold text-white mb-1">{metric.label}</div>
              <div className="text-sm text-gray-500">{metric.description}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
