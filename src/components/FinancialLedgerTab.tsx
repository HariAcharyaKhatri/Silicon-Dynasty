import React from 'react';
import { ValuationBreakdown } from '../utils/valuationEngine';
import { CompanyState } from '../types/game';
import {
  DollarSign,
  Landmark,
  TrendingUp,
  ShieldAlert,
  Award,
  FileText,
  BarChart3,
  Layers,
  ArrowUpRight,
  Sparkles,
} from 'lucide-react';

interface Props {
  valuation: ValuationBreakdown;
  company: CompanyState;
  monthlyRevenue: number;
  monthlyExpenses: number;
  monthlyNetProfit: number;
}

export const FinancialLedgerTab: React.FC<Props> = ({
  valuation,
  company,
  monthlyRevenue,
  monthlyExpenses,
  monthlyNetProfit,
}) => {
  const [activeLedgerView, setActiveLedgerView] = React.useState<'cashflow' | 'valuation' | 'milestones'>('cashflow');

  const rankThresholds = [
    { rank: 'Garage Tinkerer', minVal: 0, maxVal: 50000 },
    { rank: 'Seed Venture', minVal: 50000, maxVal: 250000 },
    { rank: 'Emerging Manufacturer', minVal: 250000, maxVal: 1000000 },
    { rank: 'Silicon Valley Contender', minVal: 1000000, maxVal: 10000000 },
    { rank: 'National Industrial Power', minVal: 10000000, maxVal: 100000000 },
    { rank: 'Global Tech Conglomerate', minVal: 100000000, maxVal: 1000000000 },
    { rank: 'Silicon Dynasty Titan', minVal: 1000000000, maxVal: 1000000000000 },
  ];

  const currentRankIndex = rankThresholds.findIndex(
    (r) => valuation.totalValuation >= r.minVal && valuation.totalValuation < r.maxVal
  );
  const activeRank = rankThresholds[Math.max(0, currentRankIndex)] || rankThresholds[0];
  const nextRank = rankThresholds[currentRankIndex + 1] || activeRank;
  const progressToNext = Math.min(
    100,
    Math.max(0, Math.round(((valuation.totalValuation - activeRank.minVal) / Math.max(1, nextRank.minVal - activeRank.minVal)) * 100))
  );

  return (
    <div className="space-y-4 select-none font-mono animate-tab-fade">
      {/* Top Banner: Enterprise Valuation Summary */}
      <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <span className="text-xs font-bold px-2 py-0.5 rounded bg-amber-950/80 border border-amber-500/40 text-amber-300">
              Rank: {valuation.rankTier}
            </span>
            <span className="text-xs text-gray-400">Facility: {company.facility}</span>
          </div>
          <h3 className="text-base font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Landmark className="w-5 h-5 text-emerald-400" />
            Audited Corporate Ledger &amp; Valuation
          </h3>
          <p className="text-xs text-gray-400 mt-0.5">
            Real-time balance sheet, operating margins, and audited composite valuation
          </p>
        </div>

        <div className="bg-[#0d1117] px-5 py-3 rounded-2xl border border-emerald-500/40 text-left sm:text-right w-full sm:w-auto">
          <span className="text-[10px] text-gray-400 uppercase block">Audited Enterprise Valuation</span>
          <span className="text-2xl font-bold text-emerald-400">
            ${valuation.totalValuation.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Screen / Sub-Tab Switcher */}
      <div className="flex items-center bg-[#161b22] border border-[#30363d] p-1.5 rounded-2xl text-xs">
        <button
          onClick={() => setActiveLedgerView('cashflow')}
          className={`flex-1 py-2 px-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
            activeLedgerView === 'cashflow'
              ? 'bg-emerald-500 text-black shadow-md shadow-emerald-500/20'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>Operating Cash Flow</span>
        </button>

        <button
          onClick={() => setActiveLedgerView('valuation')}
          className={`flex-1 py-2 px-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
            activeLedgerView === 'valuation'
              ? 'bg-emerald-500 text-black shadow-md shadow-emerald-500/20'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <Landmark className="w-4 h-4" />
          <span>6 Valuation Pillars</span>
        </button>

        <button
          onClick={() => setActiveLedgerView('milestones')}
          className={`flex-1 py-2 px-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
            activeLedgerView === 'milestones'
              ? 'bg-emerald-500 text-black shadow-md shadow-emerald-500/20'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>Rank &amp; Milestones</span>
        </button>
      </div>

      {/* ======================================================== */}
      {/* VIEW 1: MONTHLY CASH FLOW STATEMENT                     */}
      {/* ======================================================== */}
      {activeLedgerView === 'cashflow' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-4 sm:p-5 space-y-1">
              <span className="text-xs text-gray-400 uppercase block">Monthly Gross Revenue</span>
              <span className="text-2xl font-bold text-emerald-400 block">
                +${monthlyRevenue.toLocaleString()}
              </span>
              <span className="text-[11px] text-gray-400 block pt-1">
                From component batches &amp; turnkey PC sales
              </span>
            </div>

            <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-4 sm:p-5 space-y-1">
              <span className="text-xs text-gray-400 uppercase block">Monthly Operating Expenses</span>
              <span className="text-2xl font-bold text-rose-400 block">
                -${monthlyExpenses.toLocaleString()}
              </span>
              <span className="text-[11px] text-gray-400 block pt-1">
                Facility rent, payroll, and marketing ad spend
              </span>
            </div>

            <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-4 sm:p-5 space-y-1">
              <span className="text-xs text-gray-400 uppercase block">Net Operating Profit</span>
              <span
                className={`text-2xl font-bold block ${
                  monthlyNetProfit >= 0 ? 'text-emerald-400' : 'text-rose-400'
                }`}
              >
                {monthlyNetProfit >= 0 ? '+' : ''}${monthlyNetProfit.toLocaleString()}
              </span>
              <span className="text-[11px] text-gray-400 block pt-1">
                Status: {monthlyNetProfit >= 0 ? 'Profitable Expansion' : 'Operating Burn Rate'}
              </span>
            </div>
          </div>

          <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-5 space-y-4">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider pb-2 border-b border-[#30363d]">
              Treasury Liquidity &amp; Runway Diagnostics
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
              <div className="bg-[#0d1117] p-3 rounded-xl border border-[#262c36]">
                <span className="text-[10px] text-gray-500 uppercase block">Cash in Bank</span>
                <span className="text-base font-bold text-emerald-400">
                  ${company.cash.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>

              <div className="bg-[#0d1117] p-3 rounded-xl border border-[#262c36]">
                <span className="text-[10px] text-gray-500 uppercase block">Outstanding Debt</span>
                <span className="text-base font-bold text-white">${company.debt.toLocaleString()}</span>
              </div>

              <div className="bg-[#0d1117] p-3 rounded-xl border border-[#262c36]">
                <span className="text-[10px] text-gray-500 uppercase block">Customer Satisfaction</span>
                <span className="text-base font-bold text-cyan-400">
                  {Math.round(company.customerSatisfaction * 100)}%
                </span>
              </div>

              <div className="bg-[#0d1117] p-3 rounded-xl border border-[#262c36]">
                <span className="text-[10px] text-gray-500 uppercase block">Facility Lease</span>
                <span className="text-base font-bold text-amber-300">{company.facility}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* VIEW 2: 6 VALUATION PILLARS BREAKDOWN                   */}
      {/* ======================================================== */}
      {activeLedgerView === 'valuation' && (
        <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-4 sm:p-5 space-y-4">
          <div className="pb-2 border-b border-[#30363d]">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              6 Composite Valuation Pillars
            </h4>
            <p className="text-xs text-gray-400 mt-0.5">
              Derived from tangible liquid assets, multi-year earnings power, patent portfolio, and brand reputation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="bg-[#0d1117] p-4 rounded-xl border border-[#262c36] space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-bold text-white text-sm">1. Tangible Assets</span>
                <span className="text-emerald-400 font-bold text-sm">${valuation.tangibleAssets.toLocaleString()}</span>
              </div>
              <p className="text-[11px] text-gray-400">
                Cash reserves, facility lease book equity, and 60% liquidation inventory valuation.
              </p>
            </div>

            <div className="bg-[#0d1117] p-4 rounded-xl border border-[#262c36] space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-bold text-white text-sm">2. Earnings Power Value</span>
                <span className="text-emerald-400 font-bold text-sm">${valuation.earningsPower.toLocaleString()}</span>
              </div>
              <p className="text-[11px] text-gray-400">
                Trailing annualized net profits multiplied by historical era expansion coefficient.
              </p>
            </div>

            <div className="bg-[#0d1117] p-4 rounded-xl border border-[#262c36] space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-bold text-white text-sm">3. Market Position Value</span>
                <span className="text-emerald-400 font-bold text-sm">${valuation.marketPosition.toLocaleString()}</span>
              </div>
              <p className="text-[11px] text-gray-400">
                Strategic market share percentage relative to the era Total Addressable Market (TAM).
              </p>
            </div>

            <div className="bg-[#0d1117] p-4 rounded-xl border border-[#262c36] space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-bold text-white text-sm">4. Technology &amp; IP Assets</span>
                <span className="text-emerald-400 font-bold text-sm">${valuation.technologyValue.toLocaleString()}</span>
              </div>
              <p className="text-[11px] text-gray-400">
                Patents held and cumulative research point capital invested in completed tech tree nodes.
              </p>
            </div>

            <div className="bg-[#0d1117] p-4 rounded-xl border border-[#262c36] space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-bold text-white text-sm">5. Human Capital Value</span>
                <span className="text-emerald-400 font-bold text-sm">${valuation.humanCapital.toLocaleString()}</span>
              </div>
              <p className="text-[11px] text-gray-400">
                Cumulative engineering and factory staff skill index weighted by specialized role multiplier.
              </p>
            </div>

            <div className="bg-[#0d1117] p-4 rounded-xl border border-[#262c36] space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-bold text-white text-sm">6. Brand &amp; Part Reputation</span>
                <span className="text-emerald-400 font-bold text-sm">${valuation.brandValue.toLocaleString()}</span>
              </div>
              <p className="text-[11px] text-gray-400">
                Brand awareness, customer satisfaction index, and custom branded part reputation score.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* VIEW 3: CORPORATE RANK & PRESTIGE MILESTONES             */}
      {/* ======================================================== */}
      {activeLedgerView === 'milestones' && (
        <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-5 space-y-4">
          <div className="pb-3 border-b border-[#30363d] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Award className="w-4 h-4 text-emerald-400" />
                Silicon Valley Prestige Rank: {activeRank.rank}
              </h4>
              <p className="text-xs text-gray-400">
                Advance through 7 industry tiers from garage startup to global tech titan.
              </p>
            </div>
            <span className="text-xs text-emerald-400 font-bold">
              {progressToNext}% to Next Rank
            </span>
          </div>

          {/* Progress bar to next rank */}
          <div className="space-y-1.5">
            <div className="w-full bg-[#0d1117] h-3 rounded-full overflow-hidden border border-[#30363d]">
              <div
                className="bg-emerald-400 h-full transition-all duration-500"
                style={{ width: `${progressToNext}%` }}
              />
            </div>
            <div className="flex justify-between text-[11px] text-gray-400">
              <span>Current: ${valuation.totalValuation.toLocaleString()}</span>
              <span>Target: ${nextRank.minVal.toLocaleString()}</span>
            </div>
          </div>

          {/* All Ranks Breakdown */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
            {rankThresholds.map((r, i) => {
              const isAchieved = valuation.totalValuation >= r.minVal;
              const isCurrent = activeRank.rank === r.rank;

              return (
                <div
                  key={r.rank}
                  className={`p-3 rounded-xl border text-xs transition-all ${
                    isCurrent
                      ? 'bg-emerald-950/60 border-emerald-500 shadow-md ring-1 ring-emerald-500/40'
                      : isAchieved
                      ? 'bg-[#0d1117] border-emerald-500/30 text-gray-300'
                      : 'bg-[#0d1117] border-[#262c36] opacity-50'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-white">{r.rank}</span>
                    {isCurrent && (
                      <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-500 text-black font-bold">
                        CURRENT
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-gray-400 block mt-1">
                    Threshold: ${r.minVal.toLocaleString()}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
