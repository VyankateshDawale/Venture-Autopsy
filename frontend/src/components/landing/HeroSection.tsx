"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ArrowRight, PlayCircle, X } from "lucide-react";

export function HeroSection() {
  const [isDemoOpen, setIsDemoOpen] = useState(false);

  return (
    <>
      <section className="relative min-h-[90vh] flex items-center justify-center pt-24 overflow-hidden aurora-bg">
        {/* Optional overlay gradients */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background pointer-events-none" />

        <div className="container relative z-10 px-4 md:px-6">
          <div className="flex flex-col items-center text-center space-y-8">
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-sm text-cyan-300 backdrop-blur-sm"
            >
              <span className="flex h-2 w-2 rounded-full bg-cyan-400 mr-2 animate-pulse"></span>
              Hackathon 2026 Ready
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-5xl md:text-7xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-gray-500 max-w-4xl"
            >
              Venture Autopsy
            </motion.h1>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-2xl md:text-3xl font-medium text-cyan-400/90"
            >
              An AI Investment & Innovation Review Board
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-lg md:text-xl text-gray-400 max-w-3xl leading-relaxed"
            >
              Upload a startup, repository, pitch deck, or enterprise proposal and watch specialized AI agents investigate, challenge assumptions, recruit experts, and generate an executive recommendation.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 pt-4"
            >
              <Link
                href="#start"
                className="inline-flex h-12 items-center justify-center rounded-md bg-white text-black px-8 text-sm font-medium shadow-lg hover:bg-gray-200 hover:scale-105 transition-all"
              >
                Start Investigation
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
              <button
                onClick={() => setIsDemoOpen(true)}
                className="inline-flex h-12 items-center justify-center rounded-md border border-gray-700 bg-white/5 backdrop-blur-sm px-8 text-sm font-medium text-white hover:bg-white/10 hover:border-gray-600 transition-all cursor-pointer"
              >
                <PlayCircle className="mr-2 h-4 w-4" />
                Watch Demo
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      <AnimatePresence>
        {isDemoOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-4xl bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden shadow-2xl"
            >
              <div className="absolute top-4 right-4 z-10">
                <button
                  onClick={() => setIsDemoOpen(false)}
                  className="p-2 bg-black/50 hover:bg-black/80 rounded-full text-white transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="aspect-video bg-black flex items-center justify-center relative w-full">
                <iframe 
                  className="absolute top-0 left-0 w-full h-full"
                  src="https://www.youtube.com/embed/Bey4XXJAqS8?autoplay=1&mute=1" 
                  title="Venture Autopsy Demo" 
                  frameBorder="0" 
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                  allowFullScreen
                ></iframe>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
