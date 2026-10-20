import React from 'react';
import { ValuationBreakdown } from '../utils/valuationEngine';
import { CompanyState } from '../types/game';
import { DollarSign, Landmark, TrendingUp, ShieldAlert, Award, FileText } from 'lucide-react';

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
  return (
    <div className="space-y-6">
      {/* Top Banner: Enterprise Valuation Summary */}
      <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-5 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-amber-950/80 border border-amber-500/40 text-amber-300">
              Rank Tier: {valuation.rankTier}
            </span>
            <span className="text-xs text-gray-400 font-mono">
              Facility: {company.facility}
            </span>
          </div>
          <h3 className="text-base font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Landmark className="w-5 h-5 text-emerald-400" />
            ENTERPRISE VALUATION & AUDITED FINANCIAL LEDGER
          </h3>
          <p className="text-xs text-gray-400">
            Composite valuation derived from tangible balance-sheet assets, multi-year earnings power, patent IP, and brand equity
          </p>
        </div>

        <div className="bg-[#0d1117] px-5 py-3 rounded-xl border border-emerald-500/40 text-right">
          <span className="text-[10px] text-gray-400 uppercase font-mono block">Audited Enterprise Valuation</span>
          <span className="text-2xl font-bold font-mono text-emerald-400">
            ${valuation.totalValuation.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Monthly Cash Flow Statement */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-4">
          <span className="text-xs font-mono text-gray-400 uppercase block">Monthly Revenue</span>
          <span className="text-xl font-bold font-mono text-emerald-400 mt-1 block">
            +${monthlyRevenue.toLocaleString()}
          </span>
          <span className="text-[11px] text-gray-400 mt-1 block">From retail component sales & tender contracts</span>
        </div>

        <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-4">
          <span className="text-xs font-mono text-gray-400 uppercase block">Monthly Operating Expenses</span>
          <span className="text-xl font-bold font-mono text-rose-400 mt-1 block">
            -${monthlyExpenses.toLocaleString()}
          </span>
          <span className="text-[11px] text-gray-400 mt-1 block">Facility rent, payroll, and advertising spend</span>
        </div>

        <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-4">
          <span className="text-xs font-mono text-gray-400 uppercase block">Net Operating Margin</span>
          <span
            className={`text-xl font-bold font-mono mt-1 block ${
              monthlyNetProfit >= 0 ? 'text-emerald-400' : 'text-rose-400'
            }`}
          >
            {monthlyNetProfit >= 0 ? '+' : ''}${monthlyNetProfit.toLocaleString()}
          </span>
          <span className="text-[11px] text-gray-400 mt-1 block">
            Status: {monthlyNetProfit >= 0 ? 'Profitable Cash Expansion' : 'Operating Burn Rate'}
          </span>
        </div>
      </div>

      {/* Valuation Pillars Breakdown Table */}
      <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-5 space-y-4">
        <h4 className="text-sm font-bold text-white uppercase tracking-wider pb-3 border-b border-[#30363d]">
          Valuation Component Pillars (Volume 23 Formula)
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="bg-[#0d1117] p-3.5 rounded-lg border border-[#30363d] space-y-1">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-gray-300">1. Tangible Assets:</span>
              <span className="font-mono font-bold text-white">${valuation.tangibleAssets.toLocaleString()}</span>
            </div>
            <p className="text-[11px] text-gray-500">Cash reserves, facility lease book value, and 60% liquidation inventory value.</p>
          </div>

          <div className="bg-[#0d1117] p-3.5 rounded-lg border border-[#30363d] space-y-1">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-gray-300">2. Earnings Power Value:</span>
              <span className="font-mono font-bold text-white">${valuation.earningsPower.toLocaleString()}</span>
            </div>
            <p className="text-[11px] text-gray-500">Trailing annualized net profits multiplied by historical era expansion coefficient.</p>
          </div>

          <div className="bg-[#0d1117] p-3.5 rounded-lg border border-[#30363d] space-y-1">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-gray-300">3. Market Position Value:</span>
              <span className="font-mono font-bold text-white">${valuation.marketPosition.toLocaleString()}</span>
            </div>
            <p className="text-[11px] text-gray-500">Strategic market share percentage relative to the era Total Addressable Market.</p>
          </div>

          <div className="bg-[#0d1117] p-3.5 rounded-lg border border-[#30363d] space-y-1">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-gray-300">4. Technology & IP Assets:</span>
              <span className="font-mono font-bold text-white">${valuation.technologyValue.toLocaleString()}</span>
            </div>
            <p className="text-[11px] text-gray-500">Patents held and cumulative research point capital invested in completed tech tree nodes.</p>
          </div>

          <div className="bg-[#0d1117] p-3.5 rounded-lg border border-[#30363d] space-y-1">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-gray-300">5. Human Capital Value:</span>
              <span className="font-mono font-bold text-white">${valuation.humanCapital.toLocaleString()}</span>
            </div>
            <p className="text-[11px] text-gray-500">Cumulative staff skill index weighted by specialized role multiplier.</p>
          </div>

          <div className="bg-[#0d1117] p-3.5 rounded-lg border border-[#30363d] space-y-1">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-gray-300">6. Brand & Part Reputation:</span>
              <span className="font-mono font-bold text-white">${valuation.brandValue.toLocaleString()}</span>
            </div>
            <p className="text-[11px] text-gray-500">Brand awareness, customer satisfaction index, and branded part reputation score.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
