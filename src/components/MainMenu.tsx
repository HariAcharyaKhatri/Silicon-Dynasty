import React from 'react';
import { AppLogo } from './AppLogo';
import { AuthUser } from './AuthScreen';
import { AboutModal } from './AboutModal';
import { DeveloperModal } from './DeveloperModal';
import {
  Play,
  RotateCcw,
  User,
  Code2,
  Settings,
  LogOut,
  Volume2,
  VolumeX,
  Sparkles,
  ChevronRight,
  Monitor,
  Flame,
  Award,
} from 'lucide-react';

interface MainMenuProps {
  user: AuthUser;
  hasActiveGame: boolean;
  onNewGame: () => void;
  onResumeGame: () => void;
  onLogout: () => void;
  isCrtEnabled: boolean;
  onToggleCrt: () => void;
}

export const MainMenu: React.FC<MainMenuProps> = ({
  user,
  hasActiveGame,
  onNewGame,
  onResumeGame,
  onLogout,
  isCrtEnabled,
  onToggleCrt,
}) => {
  const [isAboutOpen, setIsAboutOpen] = React.useState(false);
  const [isDeveloperOpen, setIsDeveloperOpen] = React.useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = React.useState(false);
  const [isAudioMuted, setIsAudioMuted] = React.useState(false);

  return (
    <div className="relative min-h-screen w-full bg-[#080b0f] flex flex-col justify-between select-none overflow-hidden font-sans">
      {/* Background Decorative Grid, Lights & Scanlines */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f293718_1px,transparent_1px),linear-gradient(to_bottom,#1f293718_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-teal-600/10 rounded-full blur-3xl pointer-events-none" />
      {isCrtEnabled && <div className="crt-overlay absolute inset-0 pointer-events-none z-30" />}

      {/* Top Header Navigation */}
      <header className="relative z-20 w-full px-8 py-5 flex items-center justify-between border-b border-[#21262d]/60 bg-[#0c1017]/80 backdrop-blur-md">
        <AppLogo size="md" showText={true} />

        <div className="flex items-center gap-4 text-xs font-mono">
          {/* User Profile Badge */}
          <div className="flex items-center gap-2.5 bg-[#161c28] border border-[#30363d] px-3.5 py-1.5 rounded-full shadow-inner">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-5 h-5 rounded-full object-cover border border-emerald-500/40"
            />
            <span className="text-gray-200 font-medium">{user.name}</span>
            <span className="text-[10px] uppercase font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/30">
              {user.isGuest ? 'GUEST' : 'GOOGLE AUTH'}
            </span>
          </div>

          {/* CRT Filter Quick Toggle */}
          <button
            onClick={onToggleCrt}
            className={`p-2 rounded-lg border transition-all ${
              isCrtEnabled
                ? 'bg-emerald-950/60 border-emerald-500 text-emerald-400'
                : 'bg-[#161c28] border-[#30363d] text-gray-400 hover:text-white'
            }`}
            title="Toggle Retro CRT Scanlines"
          >
            <Monitor className="w-4 h-4" />
          </button>

          {/* Sound Toggle */}
          <button
            onClick={() => setIsAudioMuted(!isAudioMuted)}
            className="p-2 rounded-lg bg-[#161c28] border border-[#30363d] text-gray-400 hover:text-white transition-all"
            title={isAudioMuted ? 'Unmute Audio' : 'Mute Audio'}
          >
            {isAudioMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
          </button>

          {/* Logout / Switch */}
          <button
            onClick={onLogout}
            className="p-2 rounded-lg bg-[#161c28] border border-[#30363d] text-gray-400 hover:text-rose-400 transition-all"
            title="Exit to Authentication Gate"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Menu Hero Layout — Inspired by Car Company Tycoon title menus */}
      <main className="relative z-20 w-full max-w-6xl mx-auto px-8 my-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center py-6">
        {/* Left Column: Menu Options */}
        <div className="lg:col-span-6 space-y-4">
          <div className="space-y-1">
            <span className="text-xs font-mono font-bold tracking-widest text-emerald-400 uppercase flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5" />
              1952 – 2035 CAMPAIGN SIMULATOR
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight uppercase font-mono">
              MAIN OPERATIONS
            </h1>
            <p className="text-xs text-gray-400 font-mono">
              Select simulation protocol to enter the executive desk.
            </p>
          </div>

          <div className="space-y-3 pt-3">
            {/* Resume / Continue Campaign (if exists) */}
            {hasActiveGame && (
              <button
                onClick={onResumeGame}
                className="w-full bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-500 hover:to-teal-500 text-black font-extrabold p-4 rounded-xl shadow-lg shadow-emerald-950/60 transition-all flex items-center justify-between group active:scale-[0.99]"
              >
                <div className="flex items-center gap-3.5">
                  <div className="p-2 rounded-lg bg-black/25 text-black">
                    <RotateCcw className="w-5 h-5 animate-spin-slow" />
                  </div>
                  <div className="text-left">
                    <div className="text-sm font-black tracking-wide uppercase font-mono">
                      CONTINUE VENTURE
                    </div>
                    <div className="text-[11px] font-mono text-emerald-950 font-medium">
                      Resume active campaign simulation
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-black group-hover:translate-x-1 transition-transform" />
              </button>
            )}

            {/* New Venture (Start Campaign) */}
            <button
              onClick={onNewGame}
              className="w-full bg-[#18202d] hover:bg-[#222c3e] border border-[#38455e] hover:border-emerald-500 text-white font-bold p-4 rounded-xl shadow-md transition-all flex items-center justify-between group active:scale-[0.99]"
            >
              <div className="flex items-center gap-3.5">
                <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 group-hover:bg-emerald-500 group-hover:text-black transition-colors">
                  <Play className="w-5 h-5 fill-current" />
                </div>
                <div className="text-left">
                  <div className="text-sm font-bold tracking-wide uppercase font-mono">
                    NEW VENTURE (1952 ORIGIN)
                  </div>
                  <div className="text-[11px] font-mono text-gray-400">
                    $10,000 Outsider bet in a humble garage workshop
                  </div>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all" />
            </button>

            {/* About Creator Section */}
            <button
              onClick={() => setIsAboutOpen(true)}
              className="w-full bg-[#121620] hover:bg-[#1a202c] border border-[#262f3f] hover:border-gray-500 text-gray-200 font-medium p-3.5 rounded-xl shadow transition-all flex items-center justify-between group active:scale-[0.99]"
            >
              <div className="flex items-center gap-3.5">
                <div className="p-2 rounded-lg bg-[#0d1117] text-gray-300 border border-[#2b3547] group-hover:text-emerald-400 transition-colors">
                  <User className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <div className="text-xs font-bold tracking-wide uppercase font-mono text-white">
                    ABOUT THE CREATOR
                  </div>
                  <div className="text-[11px] font-mono text-gray-400">
                    Hari Khatri • Profiles on GitHub, LinkedIn & Instagram
                  </div>
                </div>
              </div>
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-[#0d1117] text-gray-400 border border-[#30363d] group-hover:border-emerald-500/40 group-hover:text-emerald-400 transition-colors">
                Profiles
              </span>
            </button>

            {/* Developer & Credits Section */}
            <button
              onClick={() => setIsDeveloperOpen(true)}
              className="w-full bg-[#121620] hover:bg-[#1a202c] border border-[#262f3f] hover:border-gray-500 text-gray-200 font-medium p-3.5 rounded-xl shadow transition-all flex items-center justify-between group active:scale-[0.99]"
            >
              <div className="flex items-center gap-3.5">
                <div className="p-2 rounded-lg bg-[#0d1117] text-gray-300 border border-[#2b3547] group-hover:text-emerald-400 transition-colors">
                  <Code2 className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <div className="text-xs font-bold tracking-wide uppercase font-mono text-white">
                    DEVELOPER & CREDITS
                  </div>
                  <div className="text-[11px] font-mono text-gray-400">
                    Prompt Engineering, Conceptualization & Car Company Tycoon Foundations
                  </div>
                </div>
              </div>
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-[#0d1117] text-gray-400 border border-[#30363d] group-hover:border-emerald-500/40 group-hover:text-emerald-400 transition-colors">
                Credits
              </span>
            </button>

            {/* Simulation Settings */}
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="w-full bg-[#121620] hover:bg-[#1a202c] border border-[#262f3f] hover:border-gray-500 text-gray-200 font-medium p-3.5 rounded-xl shadow transition-all flex items-center justify-between group active:scale-[0.99]"
            >
              <div className="flex items-center gap-3.5">
                <div className="p-2 rounded-lg bg-[#0d1117] text-gray-300 border border-[#2b3547] group-hover:text-emerald-400 transition-colors">
                  <Settings className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <div className="text-xs font-bold tracking-wide uppercase font-mono text-white">
                    SIMULATION SETTINGS
                  </div>
                  <div className="text-[11px] font-mono text-gray-400">
                    Audio effects, CRT scanline filter & autosave cadence
                  </div>
                </div>
              </div>
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-[#0d1117] text-gray-400 border border-[#30363d]">
                Options
              </span>
            </button>
          </div>
        </div>

        {/* Right Column: Car Company Tycoon Inspired Live Telemetry Card & Era Visuals */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-[#121620]/90 border border-[#30363d] rounded-2xl p-6 shadow-2xl backdrop-blur-md space-y-4">
            
            {/* Visual Era Showcase Graphic */}
            <div className="rounded-xl overflow-hidden border border-[#30363d] bg-black/50 relative group">
              <img 
                src="/images/garage_origin.svg" 
                alt="1952 Garage Workshop" 
                className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#121620] via-black/20 to-transparent" />
              <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between text-[11px] font-mono text-emerald-400">
                <span className="bg-black/70 px-2 py-0.5 rounded border border-emerald-500/40 font-bold">1952 GARAGE ORIGIN (T0)</span>
                <span className="text-gray-300">Weller Iron • Toggle Switches • AC Cables</span>
              </div>
            </div>

            <div className="flex items-center justify-between pb-2 border-b border-[#30363d]">
              <div className="flex items-center gap-2">
                <Flame className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-mono font-bold uppercase text-gray-300 tracking-wider">
                  TYCOON SIMULATION ENGINE HIGHLIGHTS
                </span>
              </div>
              <span className="text-[10px] font-mono bg-emerald-950/60 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/30">
                ACTIVE
              </span>
            </div>

            {/* Feature Highlights Grid */}
            <div className="grid grid-cols-2 gap-3 text-xs font-mono">
              <div className="bg-[#0b0e14] p-3 rounded-xl border border-[#21262d] space-y-1">
                <span className="text-[10px] text-gray-500 uppercase block">Starting Capital</span>
                <span className="text-base font-bold text-emerald-400">$10,000</span>
                <span className="text-[10px] text-gray-400 block">Outsider Origin</span>
              </div>

              <div className="bg-[#0b0e14] p-3 rounded-xl border border-[#21262d] space-y-1">
                <span className="text-[10px] text-gray-500 uppercase block">Fog of War Tiers</span>
                <span className="text-base font-bold text-amber-300">T0 &rarr; T7</span>
                <span className="text-[10px] text-gray-400 block">T1+ Hidden Until R&amp;D</span>
              </div>

              <div className="bg-[#0b0e14] p-3 rounded-xl border border-[#21262d] space-y-1">
                <span className="text-[10px] text-gray-500 uppercase block">Compatibility CAD</span>
                <span className="text-base font-bold text-cyan-300">24 Rules</span>
                <span className="text-[10px] text-gray-400 block">Sockets, TDP, RAM Gen</span>
              </div>

              <div className="bg-[#0b0e14] p-3 rounded-xl border border-[#21262d] space-y-1">
                <span className="text-[10px] text-gray-500 uppercase block">Custom Part Branding</span>
                <span className="text-base font-bold text-purple-300">Enabled</span>
                <span className="text-[10px] text-gray-400 block">Accumulate Brand Equity</span>
              </div>
            </div>

            {/* Era Progression Thumbnails strip */}
            <div className="pt-1">
              <div className="text-[10px] font-mono text-gray-400 uppercase mb-2 flex items-center justify-between">
                <span>Venture Progression Roadmap</span>
                <span className="text-emerald-400">1952 → 2035</span>
              </div>
              <div className="grid grid-cols-4 gap-2">
                <div className="relative rounded border border-emerald-500/50 overflow-hidden bg-black/60 group">
                  <img src="/images/garage_origin.svg" alt="T0 Garage" className="w-full h-12 object-cover" />
                  <span className="absolute bottom-0 inset-x-0 bg-black/80 text-[8px] font-mono text-center text-emerald-400 font-bold">T0 GARAGE</span>
                </div>
                <div className="relative rounded border border-[#30363d] overflow-hidden bg-black/60 group opacity-85 hover:opacity-100 transition-opacity">
                  <img src="/images/fab_silicon.svg" alt="T3 Fab" className="w-full h-12 object-cover" />
                  <span className="absolute bottom-0 inset-x-0 bg-black/80 text-[8px] font-mono text-center text-teal-400 font-bold">T3 FAB</span>
                </div>
                <div className="relative rounded border border-[#30363d] overflow-hidden bg-black/60 group opacity-85 hover:opacity-100 transition-opacity">
                  <img src="/images/supercomputer_cluster.svg" alt="T5 HPC" className="w-full h-12 object-cover" />
                  <span className="absolute bottom-0 inset-x-0 bg-black/80 text-[8px] font-mono text-center text-blue-400 font-bold">T5 CLUSTER</span>
                </div>
                <div className="relative rounded border border-[#30363d] overflow-hidden bg-black/60 group opacity-85 hover:opacity-100 transition-opacity">
                  <img src="/images/quantum_chamber.svg" alt="T7 Quantum" className="w-full h-12 object-cover" />
                  <span className="absolute bottom-0 inset-x-0 bg-black/80 text-[8px] font-mono text-center text-purple-400 font-bold">T7 QUANTUM</span>
                </div>
              </div>
            </div>

            {/* Lore Quote Box */}
            <div className="bg-[#090c10] border border-emerald-500/20 p-3.5 rounded-xl text-xs text-gray-300 leading-relaxed font-mono">
              <div className="text-[10px] text-emerald-400 font-bold uppercase mb-1">
                HISTORICAL MISSION DIRECTIVE
              </div>
              "It is 1952. The world is witnessing the first commercial computing breakthroughs. You have no corporate backing — only ten thousand dollars, basic hand tools, and a sharp eye for components that don't fail."
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-20 w-full px-8 py-4 border-t border-[#21262d]/60 bg-[#0c1017]/90 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 font-mono gap-2">
        <div className="flex items-center gap-3">
          <span>Silicon Dynasty: The Evolution of Computing</span>
          <span>•</span>
          <span className="text-emerald-400">Master Edition 4 (1952–2035)</span>
        </div>
        <div className="text-[11px] text-gray-400">
          Created by <strong className="text-white">Hari Khatri</strong>
        </div>
      </footer>

      {/* About Modal */}
      <AboutModal isOpen={isAboutOpen} onClose={() => setIsAboutOpen(false)} />

      {/* Developer Modal */}
      <DeveloperModal isOpen={isDeveloperOpen} onClose={() => setIsDeveloperOpen(false)} />

      {/* Settings Modal */}
      {isSettingsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-[#12161f] border border-[#30363d] rounded-2xl shadow-2xl overflow-hidden p-6 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-[#30363d]">
              <div className="flex items-center gap-2">
                <Settings className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-bold text-white uppercase font-mono">SIMULATION PREFERENCES</h3>
              </div>
              <button
                onClick={() => setIsSettingsOpen(false)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs font-mono">
              <div className="flex items-center justify-between p-3 rounded-xl bg-[#0b0e14] border border-[#21262d]">
                <div>
                  <span className="text-white font-bold block">Retro CRT Scanlines</span>
                  <span className="text-[11px] text-gray-400">Simulate 1950s phosphor terminal curvature</span>
                </div>
                <button
                  onClick={onToggleCrt}
                  className={`px-3 py-1 rounded text-xs font-bold border transition-all ${
                    isCrtEnabled
                      ? 'bg-emerald-950/60 border-emerald-500 text-emerald-400'
                      : 'bg-[#18202d] border-[#30363d] text-gray-400'
                  }`}
                >
                  {isCrtEnabled ? 'ENABLED' : 'DISABLED'}
                </button>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-[#0b0e14] border border-[#21262d]">
                <div>
                  <span className="text-white font-bold block">Sound FX & Telemetry</span>
                  <span className="text-[11px] text-gray-400">Teletype clicks, bell ringers and clicks</span>
                </div>
                <button
                  onClick={() => setIsAudioMuted(!isAudioMuted)}
                  className={`px-3 py-1 rounded text-xs font-bold border transition-all ${
                    !isAudioMuted
                      ? 'bg-emerald-950/60 border-emerald-500 text-emerald-400'
                      : 'bg-[#18202d] border-[#30363d] text-gray-400'
                  }`}
                >
                  {!isAudioMuted ? 'ACTIVE' : 'MUTED'}
                </button>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-[#0b0e14] border border-[#21262d]">
                <div>
                  <span className="text-white font-bold block">Autosave Protocol</span>
                  <span className="text-[11px] text-gray-400">Monthly in-game snapshot interval</span>
                </div>
                <span className="text-emerald-400 font-bold">1st of Month</span>
              </div>
            </div>

            <div className="pt-2 border-t border-[#30363d] flex justify-end">
              <button
                onClick={() => setIsSettingsOpen(false)}
                className="px-5 py-2 text-xs font-bold bg-[#21262d] text-white hover:bg-[#30363d] rounded-lg"
              >
                Close Settings
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
