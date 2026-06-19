"use client";

import Link from "next/link";
import { Globe, FileText, Layers, Info } from "lucide-react";

export function FooterSection() {
  return (
    <footer className="bg-gray-950 border-t border-white/10 py-12">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <span className="text-xl font-bold tracking-tight text-white">Venture Autopsy</span>
            <span className="text-sm text-cyan-400">by Band of Agents</span>
          </div>
          
          <div className="flex space-x-6">
            <Link href="#" className="text-gray-400 hover:text-white flex items-center text-sm transition-colors">
              <Globe className="h-4 w-4 mr-2" />
              GitHub
            </Link>
            <Link href="#" className="text-gray-400 hover:text-white flex items-center text-sm transition-colors">
              <FileText className="h-4 w-4 mr-2" />
              Documentation
            </Link>
            <Link href="#" className="text-gray-400 hover:text-white flex items-center text-sm transition-colors">
              <Layers className="h-4 w-4 mr-2" />
              Architecture
            </Link>
            <Link href="#" className="text-gray-400 hover:text-white flex items-center text-sm transition-colors">
              <Info className="h-4 w-4 mr-2" />
              About
            </Link>
          </div>
        </div>
        <div className="mt-8 text-center text-xs text-gray-600">
          © {new Date().getFullYear()} Venture Autopsy. Built for Hackathon 2026.
        </div>
      </div>
    </footer>
  );
}
