import React from 'react';
import { ProductReviewSummary } from '../types/game';
import { AD_OPTIONS } from '../utils/reviewEngine';
import {
  Megaphone,
  DollarSign,
  Tag,
  Star,
  TrendingUp,
  Package,
  ShieldCheck,
  CheckCircle2,
  X,
  Zap,
  BarChart3,
  Sliders,
} from 'lucide-react';

export interface MarketItemData {
  id: string;
  name: string;
  type: 'pc' | 'component' | 'supercomputer';
  tier: string;
  cost: number;
  sellingPrice: number;
  inventoryCount: number;
  unitsSold: number;
  dailySalesRate: number;
  adSpend: number;
  reputation: number;
  review?: ProductReviewSummary;
}

interface Props {
  item: MarketItemData;
  companyCash: number;
  onClose: () => void;
  onUpdateAdSpend: (itemId: string, itemType: 'pc' | 'component' | 'supercomputer', newAdSpend: number) => void;
  onUpdatePrice: (itemId: string, itemType: 'pc' | 'component' | 'supercomputer', newPrice: number) => void;
  onViewReviews?: (review: ProductReviewSummary, name: string) => void;
}

export const ProductMarketingModal: React.FC<Props> = ({
  item,
  companyCash,
  onClose,
  onUpdateAdSpend,
  onUpdatePrice,
  onViewReviews,
}) => {
  const [selectedAdSpend, setSelectedAdSpend] = React.useState<number>(item.adSpend || 0);
  const [currentPrice, setCurrentPrice] = React.useState<number>(item.sellingPrice);

  const unitMargin = currentPrice - item.cost;
  const marginPct = Math.round((unitMargin / Math.max(1, currentPrice)) * 100);

  // Find active ad option
  const activeAd =
    AD_OPTIONS.slice().reverse().find((opt) => selectedAdSpend >= opt.monthlyCost) || AD_OPTIONS[0];

  // Price elasticity estimation
  const priceRatio = currentPrice / Math.max(1, item.cost);
  let demandHealth = 'Optimal';
  let demandColor = 'text-emerald-400';
  let elasticityFactor = 1.0;

  if (priceRatio > 4.5) {
    demandHealth = 'Severe Buyer Resistance (Overpriced)';
    demandColor = 'text-rose-400';
    elasticityFactor = 0.35;
  } else if (priceRatio > 3.2) {
    demandHealth = 'Moderate Resistance (High Margin)';
    demandColor = 'text-amber-300';
    elasticityFactor = 0.65;
  } else if (priceRatio <= 1.4) {
    demandHealth = 'Hyper-Aggressive Budget (Rapid Clearance)';
    demandColor = 'text-cyan-400';
    elasticityFactor = 1.45;
  }

  // Estimated daily units with current price & ad selection
  const reviewMultiplier = item.review?.salesMultiplier || 1.0;
  const adMultiplier = 1.0 + activeAd.appealBoostPct / 100;
  const estimatedDailyRate = Math.max(1, Math.round(item.dailySalesRate * elasticityFactor * adMultiplier * reviewMultiplier));

  const handleSave = () => {
    onUpdateAdSpend(item.id, item.type, selectedAdSpend);
    onUpdatePrice(item.id, item.type, currentPrice);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in duration-200 select-none">
      <div className="w-full max-w-2xl bg-[#121620] border-2 border-[#30363d] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-[#0b0e14] px-6 py-4 border-b border-[#30363d] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center border border-purple-500/40">
              <Megaphone className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-[#161b22] text-gray-300 border border-[#30363d]">
                  {item.tier} • {item.type === 'pc' ? 'Turnkey Model' : 'Component Brand'}
                </span>
                <span className="text-[10px] font-mono text-purple-400 font-bold">MARKETING &amp; PROMOTION SUITE</span>
              </div>
              <h3 className="text-base font-bold text-white uppercase tracking-wider font-mono mt-0.5">
                {item.name}
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-[#21262d] transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Live Telemetry Card */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
            <div className="bg-[#0b0e14] p-3 rounded-xl border border-[#21262d]">
              <span className="text-[10px] text-gray-500 uppercase block">In Stock</span>
              <span className={`text-base font-bold ${item.inventoryCount > 0 ? 'text-white' : 'text-rose-400'}`}>
                {item.inventoryCount.toLocaleString()} units
              </span>
              <span className="text-[10px] text-gray-400 block mt-0.5">
                {item.inventoryCount === 0 ? '⚠️ Stockout Alert' : 'Ready to ship'}
              </span>
            </div>

            <div className="bg-[#0b0e14] p-3 rounded-xl border border-[#21262d]">
              <span className="text-[10px] text-gray-500 uppercase block">Units Sold</span>
              <span className="text-base font-bold text-emerald-400">
                {item.unitsSold.toLocaleString()}
              </span>
              <span className="text-[10px] text-gray-400 block mt-0.5">Lifetime volume</span>
            </div>

            <div className="bg-[#0b0e14] p-3 rounded-xl border border-[#21262d]">
              <span className="text-[10px] text-gray-500 uppercase block">Sell Velocity</span>
              <span className="text-base font-bold text-cyan-400 flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5 text-cyan-400" />
                ~{estimatedDailyRate} / day
              </span>
              <span className="text-[10px] text-gray-400 block mt-0.5">Market conversion</span>
            </div>

            <div className="bg-[#0b0e14] p-3 rounded-xl border border-[#21262d]">
              <span className="text-[10px] text-gray-500 uppercase block">Press Rating</span>
              <div className="flex items-center gap-1.5 mt-0.5">
                {item.review ? (
                  <>
                    <Star className="w-3.5 h-3.5 fill-current text-amber-400" />
                    <span className="text-sm font-bold text-white">{item.review.overallScore.toFixed(1)}/10</span>
                  </>
                ) : (
                  <span className="text-xs text-gray-400 font-normal">Pending Review</span>
                )}
              </div>
              {item.review && onViewReviews && (
                <button
                  onClick={() => onViewReviews(item.review!, item.name)}
                  className="text-[10px] text-emerald-400 hover:underline block mt-0.5"
                >
                  View Critic Quotes →
                </button>
              )}
            </div>
          </div>

          {/* Pricing & Profit Margin Workstation */}
          <div className="bg-[#0e121a] border border-[#262f3f] rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-[#21262d]">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-emerald-400" />
                <h4 className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                  Retail Pricing Strategy &amp; Elasticity
                </h4>
              </div>
              <span className={`text-[11px] font-mono font-bold ${demandColor}`}>
                {demandHealth}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
              <div>
                <label className="text-[10px] font-mono text-gray-400 block mb-1">
                  Selling Price (USD)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-xs text-gray-500 font-mono">$</span>
                  <input
                    type="number"
                    step="0.5"
                    min="1"
                    value={currentPrice}
                    onChange={(e) => setCurrentPrice(Math.max(1, parseFloat(e.target.value) || 1))}
                    className="w-full bg-[#090d14] border border-[#30363d] rounded-xl pl-7 pr-3 py-1.5 text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="bg-[#090d14] p-2.5 rounded-xl border border-[#21262d] text-xs font-mono">
                <span className="text-[10px] text-gray-500 block">Unit Cost: ${item.cost.toFixed(2)}</span>
                <span className="font-bold text-emerald-400 block">
                  Margin: +${unitMargin.toFixed(2)} ({marginPct}%)
                </span>
              </div>

              <div className="bg-[#090d14] p-2.5 rounded-xl border border-[#21262d] text-xs font-mono">
                <span className="text-[10px] text-gray-500 block">Estimated Profit / Day</span>
                <span className="font-bold text-white block">
                  ${Math.round(unitMargin * estimatedDailyRate).toLocaleString()} / day
                </span>
              </div>
            </div>
          </div>

          {/* Targeted Product Advertising Campaign Selector */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-gray-300 uppercase tracking-wider flex items-center gap-2">
                <Megaphone className="w-4 h-4 text-purple-400" />
                Item Dedicated Ad Campaign Level
              </span>
              <span className="text-xs font-mono text-purple-300 bg-purple-950/60 px-2.5 py-0.5 rounded border border-purple-500/30">
                Active Budget: ${selectedAdSpend}/mo
              </span>
            </div>

            <div className="space-y-2">
              {AD_OPTIONS.map((opt) => {
                const isSelected = selectedAdSpend === opt.monthlyCost;
                return (
                  <div
                    key={opt.id}
                    onClick={() => setSelectedAdSpend(opt.monthlyCost)}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all duration-150 flex items-start justify-between gap-3 ${
                      isSelected
                        ? 'bg-purple-950/40 border-purple-500 text-white shadow-md shadow-purple-950/40'
                        : 'bg-[#0d1117] border-[#262c36] text-gray-300 hover:border-gray-500 hover:bg-[#12161f]'
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white font-mono">{opt.name}</span>
                        {opt.appealBoostPct > 0 && (
                          <span className="text-[10px] font-mono px-2 py-0.2 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-500/30 font-bold">
                            +{opt.appealBoostPct}% Conversion
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-gray-400 font-sans leading-relaxed">
                        {opt.description}
                      </p>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-xs font-bold font-mono text-purple-300 block">
                        {opt.badge}
                      </span>
                      {isSelected && (
                        <span className="text-[10px] text-emerald-400 font-mono font-bold flex items-center justify-end gap-1 mt-1">
                          <CheckCircle2 className="w-3 h-3" /> Selected
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-[#0b0e14] px-6 py-4 border-t border-[#30363d] flex items-center justify-between">
          <div className="text-xs font-mono text-gray-400">
            Treasury: <strong className="text-emerald-400">${companyCash.toLocaleString()}</strong>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-mono text-gray-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-5 py-2 text-xs font-mono font-bold bg-emerald-400 text-black hover:bg-emerald-300 rounded-xl transition-all shadow-lg shadow-emerald-500/20"
            >
              Save Campaign &amp; Pricing
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
