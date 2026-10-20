import React from 'react';
import { MarketSegment, Competitor, CompanyState } from '../types/game';
import { Users, BarChart3, TrendingUp, DollarSign, Award, Target } from 'lucide-react';
import Images from '../assets/images';

interface Props {
  segments: MarketSegment[];
  competitors: Competitor[];
  company: CompanyState;
  onUpdateAdSpend: (spend: number) => void;
}

export const MarketIntelTab: React.FC<Props> = ({
  segments,
  competitors,
  company,
  onUpdateAdSpend,
}) => {
  const [adSpendInput, setAdSpendInput] = React.useState<number>(company.monthlyAdSpend || 100);

  const totalMarketShare = competitors.reduce((acc, c) => acc + c.marketShare, 0);
  const playerEstimatedShare = Math.max(0, 100 - totalMarketShare);

  return (
    <div className="space-y-6">
      {/* Top Banner: Market Share Overview */}
      <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-5 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-3 border-b border-[#30363d] gap-3">
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-emerald-400" />
              GLOBAL COMPUTING MARKET INTELLIGENCE & SHARE MATRIX
            </h3>
            <p className="text-xs text-gray-400">
              Aggregated monthly telemetry tracking market penetration, brand awareness, and rival pricing pressure
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono">
            <span className="text-gray-400">
              Your Share: <strong className="text-emerald-400 text-sm">{playerEstimatedShare.toFixed(1)}%</strong>
            </span>
            <span className="text-gray-400">
              Brand Awareness: <strong className="text-white text-sm">{company.brandAwareness}/100</strong>
            </span>
          </div>
        </div>

        {/* Competitor Multi-Bar */}
        <div className="space-y-2">
          <div className="w-full h-4 rounded-full overflow-hidden flex bg-[#0d1117] border border-[#30363d]">
            <div
              className="bg-emerald-400 h-full transition-all"
              style={{ width: `${playerEstimatedShare}%` }}
              title={`You: ${playerEstimatedShare.toFixed(1)}%`}
            />
            {competitors.map((c) => (
              <div
                key={c.id}
                style={{ width: `${c.marketShare}%`, backgroundColor: c.color }}
                className="h-full transition-all opacity-85 hover:opacity-100"
                title={`${c.name}: ${c.marketShare}%`}
              />
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-emerald-400" />
              <span className="text-gray-300 font-bold">{company.name} ({playerEstimatedShare.toFixed(1)}%)</span>
            </div>
            {competitors.map((c) => (
              <div key={c.id} className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: c.color }} />
                <span className="text-gray-400">{c.name} ({c.marketShare.toFixed(1)}%)</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Segments Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {segments.map((seg) => (
          <div
            key={seg.id}
            className="bg-[#161b22] border border-[#30363d] rounded-xl p-4 space-y-3 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="text-xs font-bold text-white uppercase">{seg.name}</h4>
                  <p className="text-[10px] text-gray-400 font-mono mt-0.5">
                    Budget: ~${seg.budgetPerUnit.toLocaleString()} / unit
                  </p>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#0d1117] text-gray-300 border border-[#30363d]">
                  {Math.round(seg.populationPct * 100)}% Pop
                </span>
              </div>

              <div className="space-y-1.5 mt-3 text-[11px] text-gray-300">
                <div className="flex justify-between">
                  <span className="text-gray-400">Monthly Segment Demand:</span>
                  <span className="font-mono text-white">{seg.demandPool.toLocaleString()} units</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Price Sensitivity:</span>
                  <span className="font-mono text-amber-300">{seg.priceWeight > 0.25 ? 'High' : 'Low'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Reliability Priority:</span>
                  <span className="font-mono text-emerald-400">{seg.relWeight > 0.25 ? 'Critical' : 'Moderate'}</span>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-[#30363d]/60 flex items-center justify-between text-xs">
              <span className="text-gray-400">Your Share:</span>
              <span className="font-bold font-mono text-emerald-400">{seg.playerSharePct.toFixed(1)}%</span>
            </div>
          </div>
        ))}
      </div>

      {/* Marketing & Promotion Campaign Control */}
      <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-5 space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-[#30363d]">
          <Target className="w-5 h-5 text-emerald-400" />
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              Marketing, Advertising & Local Promotion
            </h4>
            <p className="text-xs text-gray-400">
              Run newspaper advertisements, trade journal circulars, and mail-order brochures to boost customer demand
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-3 md:col-span-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-300 font-medium">Monthly Advertising Budget Allocation:</span>
              <span className="font-mono font-bold text-emerald-400 text-sm">
                ${adSpendInput.toLocaleString()} / Month
              </span>
            </div>

            <input
              type="range"
              min="0"
              max="5000"
              step="50"
              value={adSpendInput}
              onChange={(e) => setAdSpendInput(parseInt(e.target.value))}
              className="w-full accent-emerald-500"
            />

            <div className="flex gap-2">
              {[0, 100, 500, 1500, 3000].map((val) => (
                <button
                  key={val}
                  onClick={() => setAdSpendInput(val)}
                  className={`px-3 py-1 text-xs font-mono rounded border transition-all ${
                    adSpendInput === val
                      ? 'bg-emerald-950/60 border-emerald-500 text-emerald-400 font-bold'
                      : 'bg-[#0d1117] border-[#30363d] text-gray-400 hover:text-white'
                  }`}
                >
                  ${val}
                </button>
              ))}
            </div>

            <button
              onClick={() => onUpdateAdSpend(adSpendInput)}
              className="mt-2 px-5 py-2 text-xs font-bold bg-emerald-400 text-black hover:bg-emerald-300 rounded-lg transition-all"
            >
              Commit Marketing Budget
            </button>
          </div>

          <div className="bg-[#0d1117] border border-[#30363d] rounded-xl overflow-hidden flex flex-col justify-between">
            <div className="relative h-24 overflow-hidden border-b border-[#30363d]">
              <img 
                src={Images.mainframe1952} 
                alt="1952 Mainframe Commercial Market" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0d1117] via-transparent to-transparent" />
              <div className="absolute top-1.5 left-2 bg-black/80 px-2 py-0.5 rounded text-[9px] font-mono text-emerald-400">
                1952 ERA COMMERCIAL MARKET
              </div>
            </div>
            <div className="p-3.5 space-y-2 text-xs">
              <span className="font-bold text-white uppercase tracking-wider block">Demand Multiplier Effect</span>
              <p className="text-gray-400 text-[11px] leading-relaxed">
                Every $100 allocated generates local newspaper circulars and trade store placement, boosting overall sales conversion and brand awareness.
              </p>
              <div className="pt-2 border-t border-[#30363d] text-[11px] text-emerald-400 font-mono">
                Current Ad Multiplier: {(1.0 + (company.monthlyAdSpend / 10000) * 0.15).toFixed(2)}x
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
