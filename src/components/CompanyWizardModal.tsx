import React from 'react';
import { CompanyState, TierId } from '../types/game';
import { Cpu, DollarSign, Award, Wrench, Shield, CheckCircle2 } from 'lucide-react';

interface Props {
  onComplete: (setup: {
    companyName: string;
    founderName: string;
    background: CompanyState['background'];
    difficulty: CompanyState['difficulty'];
    startingCash: number;
    initialPartName: string;
  }) => void;
}

export const CompanyWizardModal: React.FC<Props> = ({ onComplete }) => {
  const [step, setStep] = React.useState(1);
  const [founderName, setFounderName] = React.useState('Alex Walker');
  const [companyName, setCompanyName] = React.useState('Apex Components');
  const [background, setBackground] = React.useState<CompanyState['background']>('bg_outsider');
  const [difficulty, setDifficulty] = React.useState<CompanyState['difficulty']>('diff_underdog');
  const [initialPartName, setInitialPartName] = React.useState('Apex PowerLink C-100');

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      const startingCash = difficulty === 'diff_underdog' ? 10000 : difficulty === 'diff_standard' ? 25000 : 50000;
      onComplete({
        companyName,
        founderName,
        background,
        difficulty,
        startingCash,
        initialPartName,
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4">
      <div className="w-full max-w-2xl bg-[#161b22] border border-[#30363d] rounded-xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-[#0d1117] px-6 py-4 border-b border-[#30363d] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Cpu className="text-emerald-400 w-6 h-6 animate-pulse" />
            <div>
              <h2 className="text-lg font-bold text-white tracking-wide">FOUNDING PROTOCOL — 1952</h2>
              <p className="text-xs text-gray-400">Silicon Dynasty: The Evolution of Computing</p>
            </div>
          </div>
          <span className="text-xs font-mono px-2.5 py-1 rounded bg-[#21262d] text-emerald-400 border border-[#30363d]">
            Step {step} of 3
          </span>
        </div>

        {/* Step Content */}
        <div className="p-6 flex-1 space-y-6">
          {step === 1 && (
            <div className="space-y-4">
              {/* Garage Workshop Visual Image */}
              <div className="rounded-xl overflow-hidden border border-emerald-500/30 bg-black/50 relative">
                <img 
                  src="/images/garage_origin.svg" 
                  alt="1952 Garage Origin Workshop" 
                  className="w-full h-32 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#161b22] via-transparent to-transparent" />
                <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between text-[11px] font-mono text-emerald-400">
                  <span className="bg-black/80 px-2 py-0.5 rounded border border-emerald-500/40">CALIFORNIA GARAGE HQ</span>
                  <span>STARTING CASH: $10,000</span>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-300">
                  Step 1: The Founder & Identity
                </h3>
                <p className="text-xs text-gray-400 mt-1">
                  You are not a privileged Silicon Valley heir or computer scientist. You are an observant outsider starting in a modest garage workshop.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">Founder Full Name</label>
                  <input
                    type="text"
                    value={founderName}
                    onChange={(e) => setFounderName(e.target.value)}
                    className="w-full bg-[#0d1117] border border-[#30363d] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">Company Venture Name</label>
                  <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="w-full bg-[#0d1117] border border-[#30363d] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-300 mb-2">Founder Origin Background</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {[
                    {
                      id: 'bg_outsider',
                      name: 'The Outsider (Canonical)',
                      bonus: '+15% Sales Conversion & Local Business Trust',
                      desc: 'You were the customer who suffered fragile early cables. Low overhead.',
                    },
                    {
                      id: 'bg_tinkerer',
                      name: 'Hobbyist Tinkerer',
                      bonus: '+10% Component Quality at T0 & T1',
                      desc: 'Skilled with the soldering iron, bench lathe, and hand tools.',
                    },
                    {
                      id: 'bg_engineer',
                      name: 'Former Draftsman',
                      bonus: '+10% Hardware Research Speed',
                      desc: 'Familiar with mechanical drafting and basic electrical schematics.',
                    },
                    {
                      id: 'bg_salesman',
                      name: 'Hardware Salesman',
                      bonus: '+15% Initial Brand Awareness',
                      desc: 'Knows local radio store owners, repairmen, and university procurement.',
                    },
                  ].map((item) => (
                    <div
                      key={item.id}
                      onClick={() => setBackground(item.id as any)}
                      className={`p-3 rounded-lg border cursor-pointer transition-all ${
                        background === item.id
                          ? 'bg-emerald-950/40 border-emerald-500 text-white'
                          : 'bg-[#0d1117] border-[#30363d] text-gray-400 hover:border-gray-500'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold text-xs text-white">{item.name}</span>
                        {background === item.id && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                      </div>
                      <p className="text-[11px] text-emerald-400 font-medium">{item.bonus}</p>
                      <p className="text-[11px] text-gray-400 mt-1">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-300">
                  Step 2: Starting Difficulty & Capital
                </h3>
                <p className="text-xs text-gray-400 mt-1">
                  How much capital have you scraped together to rent your initial garage and buy bench equipment?
                </p>
              </div>

              <div className="space-y-3">
                {[
                  {
                    id: 'diff_underdog',
                    name: 'The Outsider Bet (Canonical — $10,000)',
                    cash: '$10,000 Starting Cash',
                    desc: 'Tight margins. Must produce basic cables and switches to survive before affording an engineer.',
                    tag: 'Recommended Authentic Experience',
                  },
                  {
                    id: 'diff_standard',
                    name: 'Established Workshop ($25,000)',
                    cash: '$25,000 Starting Cash',
                    desc: 'Moderate breathing room. Enough savings to immediately hire a hardware engineer and pay workshop rent.',
                    tag: 'Standard Simulation',
                  },
                  {
                    id: 'diff_tycoon',
                    name: 'Angel Backed Venture ($50,000)',
                    cash: '$50,000 Starting Cash',
                    desc: 'High initial capital buffer. Allows rapid facility upgrading to an assembly lab.',
                    tag: 'Relaxed Expansion',
                  },
                ].map((item) => (
                  <div
                    key={item.id}
                    onClick={() => setDifficulty(item.id as any)}
                    className={`p-4 rounded-lg border cursor-pointer flex items-center justify-between transition-all ${
                      difficulty === item.id
                        ? 'bg-emerald-950/40 border-emerald-500 text-white'
                        : 'bg-[#0d1117] border-[#30363d] text-gray-400 hover:border-gray-500'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-white">{item.name}</span>
                        <span className="text-[10px] bg-[#21262d] text-amber-300 px-2 py-0.5 rounded border border-[#30363d]">
                          {item.tag}
                        </span>
                      </div>
                      <p className="text-xs text-emerald-400 font-mono mt-0.5">{item.cash}</p>
                      <p className="text-xs text-gray-400 mt-1">{item.desc}</p>
                    </div>
                    {difficulty === item.id && <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />}
                  </div>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-300">
                  Step 3: Custom Part Naming & Maiden Product
                </h3>
                <p className="text-xs text-gray-400 mt-1">
                  In Silicon Dynasty, you can brand every part you manufacture. Your initial product is the humble AC Power Cable.
                </p>
              </div>

              <div className="bg-[#0d1117] p-4 rounded-lg border border-[#30363d] space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded bg-emerald-900/40 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                    <Wrench className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Tier 0 Maiden Component: Standard Power Cable</h4>
                    <p className="text-xs text-gray-400">Base Cost: $0.80 | Suggested Retail: $2.50 | Quality: 95%</p>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">
                    Your Custom Brand Name for this Part
                  </label>
                  <input
                    type="text"
                    value={initialPartName}
                    onChange={(e) => setInitialPartName(e.target.value)}
                    placeholder="e.g. Apex PowerLink C-100"
                    className="w-full bg-[#161b22] border border-[#30363d] rounded-lg px-3 py-2 text-sm text-white font-mono focus:outline-none focus:border-emerald-500"
                  />
                  <p className="text-[11px] text-gray-500 mt-1">
                    Branded parts accumulate sales reputation, boosting future blueprint appeal and customer price premiums.
                  </p>
                </div>
              </div>

              <div className="p-3 bg-amber-950/20 border border-amber-600/40 rounded-lg text-xs text-amber-200/90 leading-relaxed">
                <strong>Narrative Objective:</strong> Produce and deliver your first batch of 100 power cables to local businesses, achieve profitability, and accumulate $25,000 cash to construct a Small Workshop and unlock Tier 1.
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-[#0d1117] px-6 py-4 border-t border-[#30363d] flex items-center justify-between">
          {step > 1 ? (
            <button
              onClick={() => setStep(step - 1)}
              className="px-4 py-2 text-xs font-semibold text-gray-300 hover:text-white rounded-lg bg-[#21262d] border border-[#30363d] hover:bg-[#30363d] transition-all"
            >
              Back
            </button>
          ) : (
            <div />
          )}

          <button
            onClick={handleNext}
            className="px-5 py-2 text-xs font-bold text-black rounded-lg bg-emerald-400 hover:bg-emerald-300 transition-all flex items-center gap-1.5 shadow-lg shadow-emerald-500/20"
          >
            {step === 3 ? 'Incorporate Venture & Enter 1952' : 'Continue'}
          </button>
        </div>
      </div>
    </div>
  );
};
