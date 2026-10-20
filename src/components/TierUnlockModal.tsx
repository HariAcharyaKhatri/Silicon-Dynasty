import React from 'react';
import { TierId } from '../types/game';
import { Sparkles, CheckCircle2, ArrowRight, Eye, Layers, Wrench } from 'lucide-react';
import confetti from 'canvas-confetti';

interface TierUnlockModalProps {
  unlockedTier: TierId;
  facilityName: string;
  onAcknowledge: () => void;
}

export const TierUnlockModal: React.FC<TierUnlockModalProps> = ({
  unlockedTier,
  facilityName,
  onAcknowledge,
}) => {
  React.useEffect(() => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
    });
  }, []);

  const tierDescriptions: Record<TierId, { title: string; desc: string; revealed: string[] }> = {
    T0: {
      title: 'Tier 0: Basic Components',
      desc: 'Humble power cables, connectors, toggle switches, and sheet metal cases.',
      revealed: ['10 Baseline Workshop Products'],
    },
    T1: {
      title: 'Tier 1: Passive Components & Workshop Enclosures',
      desc: 'The Tier Fog of War clears! You can now manufacture stamped desktop cabinets, finned heatsinks, linear power supplies, and vacuum tube backplanes.',
      revealed: [
        'Early Desktop Stamped Cabinet',
        '50W Regulated Linear Power Supply',
        'Cast Aluminum Passive Radiator Heatsink',
        'Vacuum Tube Point-to-Point Backplane',
        'Vacuum Tube 8-Bit Logic Block ALU',
      ],
    },
    T2: {
      title: 'Tier 2: Circuit Boards & S-100 Bus',
      desc: 'Standardized printed circuit boards and open modular buses now manufacturable.',
      revealed: ['S-100 Bus Backplane', 'Baby AT Motherboard', '250W Switching Power Supply'],
    },
    T3: {
      title: 'Tier 3: Magnetic Storage Subsystems',
      desc: 'High-capacity magnetic tape drives and flexible 8-inch floppy disks unlocked.',
      revealed: ['Reel-to-Reel Tape Drives', '8-Inch Shugart Floppy Disk Drives'],
    },
    T4: {
      title: 'Tier 4: Solid-State Memory & Core Logic',
      desc: 'Non-volatile magnetic core memory stacks and dynamic silicon MOS RAM revealed.',
      revealed: ['Magnetic Core Memory (4 KB)', 'Silicon DRAM Chip Arrays (16 KB)'],
    },
    T5: {
      title: 'Tier 5: Integrated Circuits & Video Graphics',
      desc: 'Discrete logic integration and Color Graphics Adapters (CGA) available.',
      revealed: ['Color Graphics Adapter (CGA)', 'Complex IC Logic Blocks'],
    },
    T6: {
      title: 'Tier 6: Microprocessors & Vector Blades',
      desc: 'Silicon microprocessors (8080, 6502) and industrial supercomputing units unlocked.',
      revealed: ['Intel 8080 Class CPU', 'MOS 6502 Class CPU', 'Vector Compute Blades', 'Chilled Immersion Fluorinert Cooling'],
    },
    T7: {
      title: 'Tier 7: Full System Turnkey Assemblies & Quantum Frontier',
      desc: 'Assemble complete commercial microcomputers, enterprise servers, and supercomputers.',
      revealed: ['Turnkey Personal Computers', 'Enterprise Rack Clusters', 'Quantum Processing Units'],
    },
  };

  const details = tierDescriptions[unlockedTier] || tierDescriptions['T1'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-in zoom-in-95 duration-200 select-none">
      <div className="w-full max-w-lg bg-[#12161f] border-2 border-emerald-500 rounded-2xl shadow-2xl shadow-emerald-950/60 overflow-hidden">
        {/* Banner */}
        <div className="bg-gradient-to-r from-emerald-900/80 via-emerald-800/40 to-[#12161f] p-6 border-b border-emerald-500/40 flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-emerald-400 text-black flex items-center justify-center shadow-lg shadow-emerald-400/30 shrink-0">
            <Sparkles className="w-8 h-8 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-black/40 text-emerald-300 font-extrabold tracking-widest border border-emerald-400/40">
                TIER FOG OF WAR CLEARED
              </span>
            </div>
            <h3 className="text-xl font-black text-white font-mono tracking-tight uppercase mt-1">
              {details.title}
            </h3>
            <p className="text-xs text-emerald-300 font-mono">
              Operational Facility: {facilityName}
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Tier Architecture Preview Image */}
          <div className="rounded-xl overflow-hidden border border-[#30363d] bg-black/60 relative">
            <img 
              src={
                unlockedTier === 'T7' 
                  ? '/images/quantum_chamber.svg'
                  : unlockedTier === 'T6'
                  ? '/images/supercomputer_cluster.svg'
                  : unlockedTier === 'T5'
                  ? '/images/fab_silicon.svg'
                  : unlockedTier === 'T4'
                  ? '/images/cpu_die.svg'
                  : unlockedTier === 'T2'
                  ? '/images/motherboard_pcb.svg'
                  : '/images/mainframe_1952.svg'
              } 
              alt="Tier Architectural Blueprint"
              className="w-full h-36 object-cover" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#12161f] via-transparent to-transparent" />
            <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between text-[10px] font-mono text-emerald-400">
              <span className="bg-black/80 px-2 py-0.5 rounded border border-emerald-500/40">TECH ERA HARDWARE ADVANCE</span>
              <span className="text-gray-300">SILICON DYNASTY ENGINE</span>
            </div>
          </div>

          <p className="text-xs text-gray-300 leading-relaxed font-mono">
            {details.desc}
          </p>

          <div className="bg-[#0b0e14] border border-[#21262d] rounded-xl p-4 space-y-2">
            <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5" />
              Newly Revealed Catalogue Components:
            </span>
            <ul className="space-y-1.5 pt-1">
              {details.revealed.map((item, idx) => (
                <li key={idx} className="flex items-center gap-2 text-xs text-gray-200 font-mono">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-amber-950/20 border border-amber-500/30 p-3 rounded-lg text-[11px] text-amber-200/90 font-mono leading-relaxed">
            <strong>Next Operational Phase:</strong> Design studio blueprints can now incorporate these new parts. Check your workbench to begin production or assemble turnkey systems.
          </div>
        </div>

        {/* Footer */}
        <div className="bg-[#0b0e14] px-6 py-4 border-t border-[#30363d] flex justify-end">
          <button
            onClick={onAcknowledge}
            className="px-6 py-2.5 text-xs font-bold bg-emerald-400 text-black hover:bg-emerald-300 rounded-xl transition-all shadow-lg shadow-emerald-500/20 flex items-center gap-2 font-mono uppercase"
          >
            Enter {unlockedTier} Operations <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
