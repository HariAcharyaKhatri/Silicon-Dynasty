import React from 'react';
import { AppLogo } from './AppLogo';
import { Shield, Sparkles, User, ArrowRight, CheckCircle2, Lock, Cpu, Globe } from 'lucide-react';
import Images from '../assets/images';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  avatar: string;
  isGuest: boolean;
  provider: 'google' | 'guest';
}

interface AuthScreenProps {
  onLoginSuccess: (user: AuthUser) => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ onLoginSuccess }) => {
  const [isGoogleModalOpen, setIsGoogleModalOpen] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  // Simulated Google Accounts for OAuth Placeholder Modal
  const mockGoogleAccounts = [
    {
      name: 'Hari Khatri',
      email: 'hari.khatri@example.com',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    },
    {
      name: 'Silicon Pioneer',
      email: 'pioneer.investor@gmail.com',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
    },
  ];

  const handleSelectGoogleAccount = (account: typeof mockGoogleAccounts[0]) => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsGoogleModalOpen(false);
      onLoginSuccess({
        id: `google_${Date.now()}`,
        name: account.name,
        email: account.email,
        avatar: account.avatar,
        isGuest: false,
        provider: 'google',
      });
    }, 600);
  };

  const handlePlayAsGuest = () => {
    onLoginSuccess({
      id: `guest_${Math.floor(1000 + Math.random() * 9000)}`,
      name: 'Guest Pioneer',
      email: 'guest@computertycoon.local',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
      isGuest: true,
      provider: 'guest',
    });
  };

  return (
    <div className="relative min-h-screen w-full bg-[#080b0f] flex flex-col justify-between items-center p-6 select-none overflow-hidden font-sans">
      {/* Background Decorative Tech Grid & Scanline Effect */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f293712_1px,transparent_1px),linear-gradient(to_bottom,#1f293712_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />
      <div className="absolute inset-0 bg-radial-at-c from-emerald-950/25 via-transparent to-black pointer-events-none" />
      <div className="crt-overlay absolute inset-0 pointer-events-none" />

      {/* Top Bar / Build Indicator */}
      <header className="relative z-10 w-full max-w-5xl flex items-center justify-between py-3 border-b border-[#21262d]/60 text-xs font-mono text-gray-500">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
          <span className="text-gray-400">TELETYPE MAINFRAME TERMINAL v0.4.2</span>
        </div>
        <div className="flex items-center gap-4 text-[11px]">
          <span>PHASE A/B — 1952 ORIGIN</span>
          <span className="text-emerald-400/80">AUTHENTICATION GATEWAY</span>
        </div>
      </header>

      {/* Center Auth Console */}
      <main className="relative z-10 w-full max-w-lg my-auto py-6">
        <div className="bg-[#12161f]/95 border border-[#30363d] backdrop-blur-xl rounded-2xl shadow-2xl shadow-black/80 p-6 sm:p-8 flex flex-col items-center space-y-5 overflow-hidden relative">
          
          {/* Hero Banner Visual Graphic */}
          <div className="w-full rounded-xl overflow-hidden border border-emerald-500/20 shadow-inner bg-black/40 relative">
            <img 
              src={Images.heroDynasty} 
              alt="Silicon Dynasty Hero" 
              className="w-full h-36 object-cover hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#12161f] via-transparent to-transparent" />
            <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between text-[10px] font-mono text-emerald-400">
              <span>ERA: 1952–2035</span>
              <span className="bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-600/40">CALIFORNIA GARAGE ORIGIN</span>
            </div>
          </div>

          {/* Main App Logo in XL format */}
          <AppLogo size="lg" showText={true} />

          {/* Subtitle / Tagline */}
          <div className="text-center space-y-1">
            <p className="text-xs text-gray-400 font-mono tracking-wide">
              START WITH $10,000 &amp; A GARAGE. SHAPE WORLD HISTORY.
            </p>
            <div className="flex items-center justify-center gap-2 pt-1 text-[11px] text-emerald-400/90 font-mono">
              <Cpu className="w-3.5 h-3.5" />
              <span>Deep Tycoon Simulation (Inspired by Car Company Tycoon)</span>
            </div>
          </div>

          <div className="w-full h-px bg-gradient-to-r from-transparent via-[#30363d] to-transparent" />

          {/* Authentication Action Buttons */}
          <div className="w-full space-y-3 pt-1">
            {/* Login with Google Button */}
            <button
              onClick={() => setIsGoogleModalOpen(true)}
              className="w-full bg-[#1c2333] hover:bg-[#252f44] text-white font-medium py-3 px-4 rounded-xl border border-[#38445a] hover:border-emerald-500/50 shadow-lg transition-all duration-200 flex items-center justify-center gap-3 group active:scale-[0.99]"
            >
              {/* Google G Logo SVG */}
              <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                />
              </svg>
              <span className="text-sm tracking-wide">Continue with Google</span>
              <ArrowRight className="w-4 h-4 ml-auto text-gray-400 group-hover:text-emerald-400 group-hover:translate-x-0.5 transition-all" />
            </button>

            {/* Play as Guest Button */}
            <button
              onClick={handlePlayAsGuest}
              className="w-full bg-[#161b22] hover:bg-[#1f2633] text-gray-200 font-medium py-3 px-4 rounded-xl border border-[#30363d] hover:border-gray-500 shadow transition-all duration-200 flex items-center justify-center gap-3 group active:scale-[0.99]"
            >
              <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <User className="w-3.5 h-3.5" />
              </div>
              <span className="text-sm tracking-wide">Play as Guest (Instant Play)</span>
              <span className="ml-auto text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-[#0d1117] text-emerald-400 border border-[#30363d]">
                Bypass Auth
              </span>
            </button>
          </div>

          {/* Cloud Synchronization Security Notice */}
          <div className="flex items-center gap-2 text-[11px] text-gray-500 font-mono">
            <Lock className="w-3.5 h-3.5 text-emerald-500/70" />
            <span>Telemetry & Cloud Campaign Saves Encrypted</span>
          </div>
        </div>
      </main>

      {/* Footer Info */}
      <footer className="relative z-10 w-full max-w-5xl py-3 border-t border-[#21262d]/60 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 gap-2 font-mono">
        <div>
          Silicon Dynasty: The Evolution of Computing • © 1952–2035 Simulation Engine
        </div>
        <div className="text-[11px] text-gray-400">
          Conceptualized by <span className="text-emerald-400 font-bold">Hari Khatri</span>
        </div>
      </footer>

      {/* Google OAuth UI Mockup Modal */}
      {isGoogleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-white text-gray-900 rounded-2xl shadow-2xl overflow-hidden border border-gray-200">
            {/* Google Header */}
            <div className="p-6 pb-4 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <svg className="w-6 h-6" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                  />
                </svg>
                <div>
                  <h3 className="text-base font-semibold text-gray-800">Sign in with Google</h3>
                  <p className="text-xs text-gray-500">to continue to Silicon Dynasty</p>
                </div>
              </div>
              <button
                onClick={() => setIsGoogleModalOpen(false)}
                className="text-gray-400 hover:text-gray-700 text-sm p-1 rounded-full hover:bg-gray-100"
              >
                ✕
              </button>
            </div>

            {/* Account Picker */}
            <div className="p-6 space-y-4">
              <p className="text-xs text-gray-600">Choose an account to synchronize your venture progress:</p>

              <div className="space-y-2">
                {mockGoogleAccounts.map((acc, index) => (
                  <button
                    key={index}
                    onClick={() => handleSelectGoogleAccount(acc)}
                    disabled={isLoading}
                    className="w-full p-3 rounded-xl border border-gray-200 hover:border-blue-500 hover:bg-blue-50/40 flex items-center gap-3.5 transition-all text-left group"
                  >
                    <img
                      src={acc.avatar}
                      alt={acc.name}
                      className="w-10 h-10 rounded-full object-cover border border-gray-200"
                    />
                    <div className="flex-1">
                      <div className="text-sm font-semibold text-gray-800 group-hover:text-blue-600">
                        {acc.name}
                      </div>
                      <div className="text-xs text-gray-500 font-mono">{acc.email}</div>
                    </div>
                    <CheckCircle2 className="w-5 h-5 text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                ))}
              </div>

              {isLoading && (
                <div className="flex items-center justify-center gap-2 py-2 text-xs font-mono text-blue-600">
                  <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                  <span>Authorizing OAuth session...</span>
                </div>
              )}
            </div>

            {/* Google OAuth Footer */}
            <div className="px-6 py-3 bg-gray-50 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-500">
              <div className="flex gap-3">
                <span className="hover:underline cursor-pointer">Privacy</span>
                <span className="hover:underline cursor-pointer">Terms</span>
              </div>
              <span>Google Identity Service</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
