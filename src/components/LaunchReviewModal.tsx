import React from 'react';
import { ProductReviewSummary } from '../types/game';
import { Star, Award, TrendingUp, CheckCircle2, AlertTriangle, Sparkles, X, ChevronRight, Newspaper } from 'lucide-react';
import confetti from 'canvas-confetti';

interface Props {
  productName: string;
  productType: 'pc' | 'component' | 'supercomputer';
  reviewSummary: ProductReviewSummary;
  onClose: () => void;
  onOpenMarketing?: () => void;
}

export const LaunchReviewModal: React.FC<Props> = ({
  productName,
  productType,
  reviewSummary,
  onClose,
  onOpenMarketing,
}) => {
  React.useEffect(() => {
    if (reviewSummary.overallScore >= 7.5) {
      confetti({
        particleCount: 90,
        spread: 80,
        origin: { y: 0.55 },
      });
    }
  }, [reviewSummary.overallScore]);

  const scoreColor =
    reviewSummary.overallScore >= 8.5
      ? 'text-emerald-400 border-emerald-500 shadow-emerald-950/60'
      : reviewSummary.overallScore >= 7.0
      ? 'text-teal-400 border-teal-500 shadow-teal-950/60'
      : reviewSummary.overallScore >= 5.5
      ? 'text-amber-400 border-amber-500 shadow-amber-950/60'
      : 'text-rose-400 border-rose-500 shadow-rose-950/60';

  const badgeBg =
    reviewSummary.overallScore >= 8.5
      ? 'bg-emerald-950/70 border-emerald-500 text-emerald-300'
      : reviewSummary.overallScore >= 7.0
      ? 'bg-teal-950/70 border-teal-500 text-teal-300'
      : reviewSummary.overallScore >= 5.5
      ? 'bg-amber-950/70 border-amber-500 text-amber-300'
      : 'bg-rose-950/70 border-rose-500 text-rose-300';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in duration-200 select-none">
      <div className="w-full max-w-2xl bg-[#121620] border-2 border-[#30363d] hover:border-emerald-500/60 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-[#0b0e14] px-6 py-4 border-b border-[#30363d] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/40">
              <Newspaper className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-[#161b22] text-gray-300 border border-[#30363d]">
                  {productType === 'pc' ? 'Turnkey Computer System' : productType === 'supercomputer' ? 'Enterprise Array' : 'Component Line'}
                </span>
                <span className="text-[10px] font-mono text-emerald-400 font-bold">PRESS EMBARGO LIFTED</span>
              </div>
              <h3 className="text-base font-bold text-white uppercase tracking-wider font-mono mt-0.5">
                CRITIC REVIEWS &amp; BENCHMARK VERDICT
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
          {/* Main Scorecard Banner */}
          <div className="bg-[#0b0e14] border border-[#2b3547] rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-5 shadow-inner">
            <div className="space-y-1.5 text-center sm:text-left">
              <span className="text-xs text-gray-400 font-mono uppercase tracking-wider block">
                Official Industry Consensus
              </span>
              <h2 className="text-xl font-black text-white font-mono tracking-wide">
                {productName}
              </h2>
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <span className={`text-xs font-mono font-bold px-3 py-1 rounded-full border ${badgeBg}`}>
                  {reviewSummary.badge}
                </span>
                <span className="text-xs font-mono px-3 py-1 rounded-full bg-[#161b22] text-gray-300 border border-[#30363d] flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                  <span>
                    Sales Velocity:{' '}
                    <strong className={reviewSummary.salesMultiplier >= 1.0 ? 'text-emerald-400' : 'text-rose-400'}>
                      {reviewSummary.salesMultiplier >= 1.0 ? '+' : ''}
                      {Math.round((reviewSummary.salesMultiplier - 1.0) * 100)}%
                    </strong>
                  </span>
                </span>
              </div>
            </div>

            {/* Glowing Score Box */}
            <div className="flex flex-col items-center justify-center shrink-0">
              <div
                className={`w-24 h-24 rounded-2xl bg-[#121620] border-2 flex flex-col items-center justify-center shadow-lg ${scoreColor}`}
              >
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-current text-amber-400" />
                  <span className="text-2xl font-black font-mono tracking-tight text-white">
                    {reviewSummary.overallScore.toFixed(1)}
                  </span>
                </div>
                <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest mt-0.5">
                  OVERALL
                </span>
              </div>
            </div>
          </div>

          {/* Sub-Score Diagnostic Meters */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-[#0b0e14] p-3.5 rounded-xl border border-[#21262d] space-y-2">
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-gray-400">Performance</span>
                <span className="font-bold text-white">{reviewSummary.performanceScore}/10</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-[#1a2130] overflow-hidden">
                <div
                  className="h-full bg-cyan-400 rounded-full"
                  style={{ width: `${reviewSummary.performanceScore * 10}%` }}
                />
              </div>
            </div>

            <div className="bg-[#0b0e14] p-3.5 rounded-xl border border-[#21262d] space-y-2">
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-gray-400">Reliability</span>
                <span className="font-bold text-emerald-400">{reviewSummary.reliabilityScore}/10</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-[#1a2130] overflow-hidden">
                <div
                  className="h-full bg-emerald-400 rounded-full"
                  style={{ width: `${reviewSummary.reliabilityScore * 10}%` }}
                />
              </div>
            </div>

            <div className="bg-[#0b0e14] p-3.5 rounded-xl border border-[#21262d] space-y-2">
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-gray-400">Value for Money</span>
                <span className="font-bold text-amber-300">{reviewSummary.valueScore}/10</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-[#1a2130] overflow-hidden">
                <div
                  className="h-full bg-amber-400 rounded-full"
                  style={{ width: `${reviewSummary.valueScore * 10}%` }}
                />
              </div>
            </div>
          </div>

          {/* Press Review Articles List */}
          <div className="space-y-3">
            <span className="text-xs font-mono font-bold text-gray-400 uppercase tracking-wider block">
              Leading Tech Publications Verdicts:
            </span>

            <div className="space-y-3">
              {reviewSummary.reviews.map((r, i) => (
                <div
                  key={i}
                  className="bg-[#0e121a] border border-[#262f3f] hover:border-gray-500 rounded-xl p-4 space-y-2 transition-all"
                >
                  <div className="flex items-center justify-between pb-2 border-b border-[#21262d]">
                    <div>
                      <h4 className="text-xs font-bold text-white font-mono flex items-center gap-2">
                        <span>{r.publication}</span>
                        <span className="text-[10px] text-gray-400 font-normal">• {r.reviewer}</span>
                      </h4>
                    </div>
                    <div className="flex items-center gap-1.5 bg-[#161b24] px-2.5 py-0.5 rounded-full border border-[#30363d]">
                      <Star className="w-3.5 h-3.5 fill-current text-amber-400" />
                      <span className="text-xs font-mono font-bold text-white">{r.score.toFixed(1)}</span>
                    </div>
                  </div>

                  <p className="text-xs text-gray-300 font-sans italic leading-relaxed">
                    "{r.comment}"
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="bg-[#0b0e14] px-6 py-4 border-t border-[#30363d] flex flex-wrap items-center justify-between gap-3">
          <span className="text-[11px] font-mono text-gray-400">
            {reviewSummary.salesMultiplier >= 1.0 ? (
              <span className="text-emerald-400">Positive buzz will drive incoming order demand</span>
            ) : (
              <span className="text-amber-400">Discounting price or running ads will help overcome skeptic reviews</span>
            )}
          </span>

          <div className="flex items-center gap-3">
            {onOpenMarketing && (
              <button
                onClick={() => {
                  onClose();
                  onOpenMarketing();
                }}
                className="px-4 py-2 rounded-xl text-xs font-mono font-bold bg-[#1e2736] hover:bg-[#28354a] text-gray-200 border border-[#38465e] transition-all flex items-center gap-1.5"
              >
                <span>Setup Item Ad Campaign</span>
                <ChevronRight className="w-4 h-4 text-emerald-400" />
              </button>
            )}

            <button
              onClick={onClose}
              className="px-5 py-2 text-xs font-mono font-bold bg-emerald-400 text-black hover:bg-emerald-300 rounded-xl transition-all shadow-lg shadow-emerald-500/20"
            >
              Confirm &amp; Proceed to Market
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
