"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, CheckCircle2, XCircle, AlertTriangle, X } from "lucide-react";

const SAMPLES = [
  {
    title: "Healthcare AI Startup",
    score: 82,
    decision: "Proceed with Caution",
    keyRisk: "FDA Regulatory Compliance Timeline",
    icon: AlertTriangle,
    color: "text-amber-400",
    bg: "bg-amber-400/10",
    details: "The technical architecture is sound, but the timeline for FDA 510(k) clearance is highly optimistic. The Healthcare Specialist agent flagged potential delays of 12-18 months based on recent precedent. Recommended milestone-based funding tied to regulatory progress."
  },
  {
    title: "Fintech Risk Platform",
    score: 45,
    decision: "Reject",
    keyRisk: "Severe Data Privacy Violations",
    icon: XCircle,
    color: "text-red-400",
    bg: "bg-red-400/10",
    details: "The Cybersecurity Specialist discovered critical vulnerabilities in how PII is stored. Additionally, the Legal Expert highlighted significant GDPR non-compliance that creates immediate liability. The risk profile far exceeds acceptable thresholds."
  },
  {
    title: "AI Developer Tool",
    score: 94,
    decision: "Strong Conviction",
    keyRisk: "Open Source Competitor Threat",
    icon: CheckCircle2,
    color: "text-green-400",
    bg: "bg-green-400/10",
    details: "Exceptional technical execution and a highly scalable architecture. The Technical Agent confirmed the codebase is enterprise-ready. The only significant risk is the rapid evolution of open-source alternatives, requiring a strong community-led GTM strategy."
  }
];

export function SampleInvestigationsSection() {
  const [selectedReport, setSelectedReport] = useState<typeof SAMPLES[0] | null>(null);

  return (
    <>
      <section className="py-24 bg-background">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-4">
              Proven Insights
            </h2>
            <p className="text-lg text-gray-400 max-w-2xl">
              See how the Venture Autopsy AI board analyzes real-world scenarios and delivers actionable executive summaries.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {SAMPLES.map((sample, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                onClick={() => setSelectedReport(sample)}
                className="flex flex-col bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:bg-white/10 transition-colors cursor-pointer group"
              >
                <div className="p-6 border-b border-white/5">
                  <h3 className="text-xl font-bold text-white mb-1 group-hover:text-cyan-400 transition-colors">{sample.title}</h3>
                  <p className="text-sm text-gray-400">Completed Investigation</p>
                </div>
                
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-400 uppercase tracking-wider">Final Score</span>
                      <span className="text-3xl font-bold text-white">{sample.score}/100</span>
                    </div>
                    
                    <div>
                      <span className="text-sm font-medium text-gray-400 uppercase tracking-wider block mb-2">Executive Decision</span>
                      <div className={`inline-flex items-center px-3 py-1 rounded-full ${sample.bg} ${sample.color} text-sm font-medium`}>
                        <sample.icon className="h-4 w-4 mr-2" />
                        {sample.decision}
                      </div>
                    </div>
                    
                    <div>
                      <span className="text-sm font-medium text-gray-400 uppercase tracking-wider block mb-2">Key Risk Identified</span>
                      <p className="text-sm text-gray-300 font-medium">{sample.keyRisk}</p>
                    </div>
                  </div>
                  
                  <div 
                    className="mt-8 flex items-center text-sm font-medium text-cyan-400 group-hover:text-cyan-300 transition-colors"
                  >
                    View Full Report 
                    <ArrowRight className="ml-2 h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <AnimatePresence>
        {selectedReport && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
            onClick={() => setSelectedReport(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-2xl bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden shadow-2xl p-8"
            >
              <button
                onClick={() => setSelectedReport(null)}
                className="absolute top-4 right-4 p-2 bg-gray-800 hover:bg-gray-700 rounded-full text-white transition-colors"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="mb-8">
                <div className="flex items-center space-x-3 mb-2">
                  <div className={`p-2 rounded-lg ${selectedReport.bg}`}>
                    <selectedReport.icon className={`h-6 w-6 ${selectedReport.color}`} />
                  </div>
                  <h3 className="text-2xl font-bold text-white">{selectedReport.title}</h3>
                </div>
                <div className="flex items-center space-x-4 mt-4">
                  <span className="text-sm text-gray-400 uppercase tracking-wider">Score: <span className="text-white font-bold text-lg">{selectedReport.score}</span></span>
                  <div className={`inline-flex items-center px-3 py-1 rounded-full ${selectedReport.bg} ${selectedReport.color} text-sm font-bold`}>
                    {selectedReport.decision}
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2 border-b border-gray-800 pb-2">Executive Summary</h4>
                  <p className="text-gray-300 leading-relaxed">
                    {selectedReport.details}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2 border-b border-gray-800 pb-2">Primary Risk Factor</h4>
                  <p className={`font-medium ${selectedReport.color}`}>
                    {selectedReport.keyRisk}
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
