import React from 'react';
import { X, ExternalLink, User, Globe, Code, Sparkles, Heart } from 'lucide-react';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const socialLinks = [
    {
      platform: 'GitHub',
      handle: 'HariAcharyaKhatri',
      url: 'https://github.com/HariAcharyaKhatri',
      color: 'from-gray-700 to-gray-900 border-gray-600',
      icon: (
        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
          <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
        </svg>
      ),
      description: 'Repositories, open-source projects, and systems architecture',
    },
    {
      platform: 'LinkedIn',
      handle: 'hariacharyakhatri',
      url: 'https://linkedin.com/in/hariacharyakhatri',
      color: 'from-blue-900/60 to-blue-950 border-blue-600/50',
      icon: (
        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
        </svg>
      ),
      description: 'Professional engineering background & leadership network',
    },
    {
      platform: 'Instagram',
      handle: 'hariacharyakhatri',
      url: 'https://instagram.com/hariacharyakhatri',
      color: 'from-pink-900/60 to-purple-950 border-pink-600/50',
      icon: (
        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
        </svg>
      ),
      description: 'Visual updates, creative design, and behind-the-scenes engineering',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-[#12161f] border border-[#30363d] rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-[#0b0e14] px-6 py-4 border-b border-[#30363d] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
              <User className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-wider uppercase font-mono">
                ABOUT THE CREATOR
              </h2>
              <p className="text-xs text-gray-400">Hari Khatri • Vision & Conceptualization</p>
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
          {/* Creator Profile Spotlight */}
          <div className="bg-gradient-to-r from-emerald-950/40 via-[#161c28] to-[#12161f] border border-emerald-500/30 rounded-xl p-5 flex flex-col sm:flex-row items-center gap-5">
            <div className="relative">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-300 p-0.5 shadow-xl shadow-emerald-950/60">
                <div className="w-full h-full bg-[#0d1117] rounded-2xl flex items-center justify-center text-emerald-400 text-2xl font-bold font-mono">
                  HK
                </div>
              </div>
              <span className="absolute -bottom-1 -right-1 px-1.5 py-0.5 rounded text-[9px] font-mono bg-emerald-500 text-black font-extrabold uppercase">
                CREATOR
              </span>
            </div>

            <div className="space-y-1.5 text-center sm:text-left">
              <h3 className="text-lg font-bold text-white flex items-center justify-center sm:justify-start gap-2">
                <span>Hari Khatri</span>
                <Sparkles className="w-4 h-4 text-emerald-400" />
              </h3>
              <p className="text-xs text-emerald-300 font-mono">
                System Conceptor & Lead Prompt Architect
              </p>
              <p className="text-xs text-gray-300 leading-relaxed pt-1">
                Passionate game designer and software engineer dedicated to building deep, mathematically authentic tycoon simulations that let players relive the historical breakthroughs of modern computing.
              </p>
            </div>
          </div>

          {/* Social Profiles with Clickable Direct Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-emerald-400" />
              Direct Online Profiles & Connect
            </h4>

            <div className="grid grid-cols-1 gap-3">
              {socialLinks.map((item) => (
                <a
                  key={item.platform}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#181f2c] hover:bg-[#20293a] border border-[#30363d] hover:border-emerald-500/50 rounded-xl p-4 flex items-center justify-between transition-all duration-200 group shadow-md"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="p-2.5 rounded-lg bg-[#0d1117] text-white border border-[#30363d] group-hover:border-emerald-500/40 group-hover:text-emerald-400 transition-colors">
                      {item.icon}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors">
                          {item.platform}
                        </span>
                        <span className="text-xs font-mono text-emerald-300/80 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/20">
                          @{item.handle}
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-400 mt-0.5">{item.description}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 text-xs font-mono text-gray-400 group-hover:text-emerald-400 transition-colors">
                    <span>Visit</span>
                    <ExternalLink className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* Vision Note */}
          <div className="bg-[#0b0e14] border border-[#21262d] rounded-xl p-4 text-xs text-gray-400 leading-relaxed font-mono">
            <span className="text-white font-bold block mb-1">DESIGN PHILOSOPHY</span>
            "Silicon Dynasty is built to celebrate the raw technical grit of computing pioneers — where a blown 50W linear transformer or 16-bit address line limit isn't just an arbitrary error, but a genuine historical hurdle on the journey to the quantum era."
          </div>
        </div>

        {/* Footer */}
        <div className="bg-[#0b0e14] px-6 py-4 border-t border-[#30363d] flex items-center justify-between">
          <span className="text-[11px] text-gray-500 font-mono">
            Edition 4 Consolidated Architecture
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
