import React from 'react';
import { X, Code2, Terminal, Cpu, Award, Layers, Zap, Info } from 'lucide-react';

interface DeveloperModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DeveloperModal: React.FC<DeveloperModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-[#12161f] border border-[#30363d] rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-[#0b0e14] px-6 py-4 border-b border-[#30363d] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
              <Code2 className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-wider uppercase font-mono">
                DEVELOPER & CREDITS
              </h2>
              <p className="text-xs text-gray-400">Silicon Dynasty: The Evolution of Computing</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-[#21262d] transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Mandatory Specific Attribution Banner */}
          <div className="bg-emerald-950/40 border-2 border-emerald-500/60 rounded-xl p-5 space-y-2 relative overflow-hidden">
            <div className="absolute top-0 right-0 px-3 py-1 bg-emerald-500/20 border-b border-l border-emerald-500/40 text-[10px] font-mono text-emerald-300 uppercase tracking-widest font-bold">
              OFFICIAL SYSTEM DIRECTIVE
            </div>
            <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 font-bold uppercase tracking-wider">
              <Terminal className="w-4 h-4" />
              <span>Core Conceptualization & Inspiration</span>
            </div>
            <blockquote className="text-sm font-semibold text-white leading-relaxed font-mono bg-[#09110d] p-3.5 rounded-lg border border-emerald-500/30">
            "Original concept and creative direction by Hari Khatri, developed with AI-assisted tools and Antigravity. Inspired by the vision of building a computer technology company from the ground up."
              </blockquote>
          </div>

        {/* Gameplay & UI Details */}
        <div className="bg-[#181f2c] border border-[#30363d] rounded-xl p-5 space-y-3">
          <h4 className="text-xs font-mono font-bold text-gray-300 uppercase tracking-wider flex items-center gap-2">
        <Zap className="w-4 h-4 text-amber-400" />
          Gameplay: Building a Technology Empire
          </h4>
          <p className="text-xs text-gray-300 leading-relaxed">
            <strong>Silicon Dynasty</strong> is a technology business simulation where players build a computer company from scratch, research and manufacture hardware, develop operating systems and software, hire employees, compete with rival companies, and expand their business across generations of computing. The game focuses on computer engineering, technological progress, and strategic business management.
          </p>

            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-gray-300 pt-1">
              <li className="bg-[#0f141d] p-2.5 rounded-lg border border-[#2b3547] flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
                <span>Tactile Batch Production Volume Sliders</span>
              </li>
              <li className="bg-[#0f141d] p-2.5 rounded-lg border border-[#2b3547] flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
                <span>Custom Part Branding & Naming System</span>
              </li>
              <li className="bg-[#0f141d] p-2.5 rounded-lg border border-[#2b3547] flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
                <span>Multi-Segment Price Elasticity & Demand Pools</span>
              </li>
              <li className="bg-[#0f141d] p-2.5 rounded-lg border border-[#2b3547] flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
                <span>Dynamic Tier Fog of War Progression</span>
              </li>
            </ul>
          </div>

          {/* Master Architecture & Volumes Reference */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-bold text-gray-300 uppercase tracking-wider flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-400" />
              Implemented Master Architecture (Volumes 00 – 28)
            </h4>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-[11px] font-mono text-gray-300">
              <div className="bg-[#0d1117] p-2 rounded border border-[#21262d]">
                <strong className="text-white block">V00–V02</strong>
                <span className="text-gray-400">$10,000 Outsider Origin</span>
              </div>
              <div className="bg-[#0d1117] p-2 rounded border border-[#21262d]">
                <strong className="text-white block">V03 & V04</strong>
                <span className="text-gray-400">T0–T7 Hardware Matrix</span>
              </div>
              <div className="bg-[#0d1117] p-2 rounded border border-[#21262d]">
                <strong className="text-white block">V05</strong>
                <span className="text-gray-400">Supercomputer Designer</span>
              </div>
              <div className="bg-[#0d1117] p-2 rounded border border-[#21262d]">
                <strong className="text-white block">V08</strong>
                <span className="text-gray-400">24-Rule Compatibility CAD</span>
              </div>
              <div className="bg-[#0d1117] p-2 rounded border border-[#21262d]">
                <strong className="text-white block">V13</strong>
                <span className="text-gray-400">Dated Historical Teletype</span>
              </div>
              <div className="bg-[#0d1117] p-2 rounded border border-[#21262d]">
                <strong className="text-white block">V22–V27</strong>
                <span className="text-gray-400">Microeconomic Multipliers</span>
              </div>
            </div>
          </div>

          {/* Technical Specifications */}
          <div className="bg-[#0b0e14] border border-[#21262d] rounded-xl p-4 flex items-center justify-between text-xs font-mono text-gray-400">
            <div>
              <span className="text-gray-300 font-bold block">Engine Stack</span>
              React 19 • TypeScript • Vite • Tailwind CSS v4 • Lucide
            </div>
            <div className="text-right">
              <span className="text-gray-300 font-bold block">Build Edition</span>
              Edition 4 Phase A/B
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-[#0b0e14] px-6 py-4 border-t border-[#30363d] flex items-center justify-between">
          <span className="text-[11px] text-gray-500 font-mono">
            All historical milestones researched faithfully.
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-bold bg-[#21262d] hover:bg-[#30363d] text-white rounded-lg transition-all"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
