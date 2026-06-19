"use client";

import { motion } from "framer-motion";
import { InvestigationForm } from "@/components/investigation/InvestigationForm";

export function StartSection() {
  return (
    <section id="start" className="relative py-32 px-6 overflow-hidden bg-background">
      {/* Premium glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-cyan-500/10 to-transparent rounded-full blur-[100px] pointer-events-none" />
      
      <div className="relative z-10 max-w-3xl mx-auto">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 tracking-tight mb-4">
            Initialize Investigation
          </h2>
          <p className="text-gray-400 text-lg max-w-xl mx-auto">
            Provide the details below to deploy the multi-agent boardroom. Our specialists will begin their due diligence immediately.
          </p>
        </motion.div>

        {/* Form card */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="relative rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-8 shadow-2xl overflow-hidden"
        >
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-50" />
          <InvestigationForm />
        </motion.div>
      </div>
    </section>
  );
}
