import React from 'react';
import {
  MarketSegment,
  Competitor,
  CompanyState,
  Blueprint,
  CustomPartNaming,
  ComponentItem,
  InventoryItem,
  ProductReviewSummary,
} from '../types/game';
import {
  Users,
  BarChart3,
  TrendingUp,
  DollarSign,
  Award,
  Target,
  Megaphone,
  Package,
  Star,
  Sliders,
  Radio,
  Flame,
  CheckCircle2,
  AlertTriangle,
  ArrowUpRight,
} from 'lucide-react';
import Images from '../assets/images';
import { ProductMarketingModal, MarketItemData } from './ProductMarketingModal';
import { LaunchReviewModal } from './LaunchReviewModal';

interface Props {
  segments: MarketSegment[];
  competitors: Competitor[];
  company: CompanyState;
  blueprints: Blueprint[];
  customParts: Record<string, CustomPartNaming>;
  catalogue: ComponentItem[];
  inventory: Record<string, InventoryItem>;
  onUpdateProductAdSpend: (itemId: string, itemType: 'pc' | 'component' | 'supercomputer', adSpend: number) => void;
  onUpdateProductPrice: (itemId: string, itemType: 'pc' | 'component' | 'supercomputer', price: number) => void;
  onUpdateCompanyAdSpend: (spend: number) => void;
}

export const MarketIntelTab: React.FC<Props> = ({
  segments,
  competitors,
  company,
  blueprints,
  customParts,
  catalogue,
  inventory,
  onUpdateProductAdSpend,
  onUpdateProductPrice,
  onUpdateCompanyAdSpend,
}) => {
  const [marketView, setMarketView] = React.useState<'live_sales' | 'macro_intel'>('live_sales');
  const [filterType, setFilterType] = React.useState<'all' | 'pc' | 'component'>('all');
  const [selectedProductForMarketing, setSelectedProductForMarketing] = React.useState<MarketItemData | null>(null);
  const [viewingReview, setViewingReview] = React.useState<{ name: string; review: ProductReviewSummary } | null>(null);
  const [macroAdSpend, setMacroAdSpend] = React.useState<number>(company.monthlyAdSpend || 100);

  const totalMarketShare = competitors.reduce((acc, c) => acc + c.marketShare, 0);
  const playerEstimatedShare = Math.max(0, 100 - totalMarketShare);

  // Compile full live product catalog (Both Assembled Computer Blueprints AND Branded Components)
  const liveItems: MarketItemData[] = [];

  // 1. Assembled Computers from Design Studio
  blueprints.forEach((bp) => {
    liveItems.push({
      id: bp.id,
      name: bp.name,
      type: bp.type,
      tier: bp.tier,
      cost: bp.totalCost,
      sellingPrice: bp.sellingPrice,
      inventoryCount: bp.inventoryCount ?? (bp.activeProduction ? 15 : 0),
      unitsSold: bp.unitsSold || 0,
      dailySalesRate: bp.recentSalesRate || Math.max(1, Math.round(bp.appealScore / 25)),
      adSpend: bp.adSpend || 0,
      reputation: 60,
      review: bp.review,
    });
  });

  // 2. Branded Component Lines from Workshop
  Object.keys(customParts).forEach((compId) => {
    const part = customParts[compId];
    const comp = catalogue.find((c) => c.id === compId);
    if (comp) {
      const inv = inventory[compId]?.quantity || 0;
      liveItems.push({
        id: compId,
        name: part.customName || comp.name,
        type: 'component',
        tier: comp.tier,
        cost: comp.cost,
        sellingPrice: part.sellingPrice || comp.basePrice,
        inventoryCount: inv,
        unitsSold: part.unitsSold || 0,
        dailySalesRate: part.recentSalesRate || Math.max(2, Math.round(20 * (1 + (part.adSpend || 0) / 500))),
        adSpend: part.adSpend || 0,
        reputation: part.reputation,
        review: part.review,
      });
    }
  });

  const filteredItems = liveItems.filter((item) => {
    if (filterType === 'all') return true;
    if (filterType === 'pc') return item.type === 'pc' || item.type === 'supercomputer';
    if (filterType === 'component') return item.type === 'component';
    return true;
  });

  const totalUnitsSoldPortfolio = liveItems.reduce((acc, i) => acc + i.unitsSold, 0);
  const totalDailyRevenueEst = liveItems.reduce((acc, i) => acc + (i.dailySalesRate * i.sellingPrice), 0);
  const reviewedItems = liveItems.filter((i) => i.review);
  const avgReviewScore =
    reviewedItems.length > 0
      ? (reviewedItems.reduce((acc, i) => acc + i.review!.overallScore, 0) / reviewedItems.length).toFixed(1)
      : '8.5';

  return (
    <div className="space-y-6 select-none font-mono">
      {/* Top Switcher: Live Sales vs Macro Demographics */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-[#161b22] border border-[#30363d] p-3 rounded-2xl">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setMarketView('live_sales')}
            className={`px-4 py-2 text-xs font-bold uppercase rounded-xl transition-all flex items-center gap-2 ${
              marketView === 'live_sales'
                ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/20'
                : 'bg-[#0d1117] text-gray-300 hover:text-white border border-[#30363d]'
            }`}
          >
            <Flame className="w-4 h-4" />
            <span>Live Sales &amp; Active Lineup ({liveItems.length})</span>
          </button>

          <button
            onClick={() => setMarketView('macro_intel')}
            className={`px-4 py-2 text-xs font-bold uppercase rounded-xl transition-all flex items-center gap-2 ${
              marketView === 'macro_intel'
                ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/20'
                : 'bg-[#0d1117] text-gray-300 hover:text-white border border-[#30363d]'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Macro Share &amp; Demographics</span>
          </button>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono pr-2">
          <span className="text-gray-400">
            Market Share: <strong className="text-emerald-400 text-sm">{playerEstimatedShare.toFixed(1)}%</strong>
          </span>
          <span className="text-gray-400 hidden sm:inline">
            Brand Awareness: <strong className="text-white text-sm">{company.brandAwareness}/100</strong>
          </span>
        </div>
      </div>

      {/* VIEW 1: LIVE SALES & ACTIVE LINEUP WORKSTATION */}
      {marketView === 'live_sales' && (
        <div className="space-y-6">
          {/* Header KPI Ribbon */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="bg-[#161b22] border border-[#30363d] p-4 rounded-xl space-y-1">
              <span className="text-[10px] text-gray-500 uppercase block">Active Product Lines</span>
              <span className="text-xl font-bold text-white">{liveItems.length} Products</span>
              <span className="text-[10px] text-emerald-400 block">On Commercial Market</span>
            </div>

            <div className="bg-[#161b22] border border-[#30363d] p-4 rounded-xl space-y-1">
              <span className="text-[10px] text-gray-500 uppercase block">Total Units Sold</span>
              <span className="text-xl font-bold text-emerald-400">
                {totalUnitsSoldPortfolio.toLocaleString()}
              </span>
              <span className="text-[10px] text-gray-400 block">Lifetime Portfolio Volume</span>
            </div>

            <div className="bg-[#161b22] border border-[#30363d] p-4 rounded-xl space-y-1">
              <span className="text-[10px] text-gray-500 uppercase block">Daily Gross Run-Rate</span>
              <span className="text-xl font-bold text-cyan-400">
                ${Math.round(totalDailyRevenueEst).toLocaleString()} / day
              </span>
              <span className="text-[10px] text-gray-400 block">All lines combined</span>
            </div>

            <div className="bg-[#161b22] border border-[#30363d] p-4 rounded-xl space-y-1">
              <span className="text-[10px] text-gray-500 uppercase block">Avg Critic Reception</span>
              <div className="flex items-center gap-1.5 pt-0.5">
                <Star className="w-4 h-4 fill-current text-amber-400" />
                <span className="text-xl font-bold text-white">{avgReviewScore} / 10</span>
              </div>
              <span className="text-[10px] text-gray-400 block">Press sentiment rating</span>
            </div>
          </div>

          {/* Filter Bar & Sub-header */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-[#161b22] border border-[#30363d] p-3.5 rounded-xl">
            <div className="flex items-center gap-2 text-xs">
              <span className="text-gray-400 font-bold uppercase text-[11px] pr-2">Filter Lineup:</span>
              <button
                onClick={() => setFilterType('all')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  filterType === 'all'
                    ? 'bg-[#21262d] text-emerald-400 border border-emerald-500/40'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                All Products ({liveItems.length})
              </button>
              <button
                onClick={() => setFilterType('pc')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  filterType === 'pc'
                    ? 'bg-[#21262d] text-emerald-400 border border-emerald-500/40'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Computer Systems ({blueprints.length})
              </button>
              <button
                onClick={() => setFilterType('component')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  filterType === 'component'
                    ? 'bg-[#21262d] text-emerald-400 border border-emerald-500/40'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Components ({Object.keys(customParts).length})
              </button>
            </div>

            <span className="text-[11px] text-gray-400">
              💡 Click any product to configure its <strong>targeted advertising campaign</strong> or adjust pricing.
            </span>
          </div>

          {/* Active Product Lineup Cards */}
          {filteredItems.length === 0 ? (
            <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-12 text-center space-y-3">
              <Package className="w-12 h-12 text-gray-500 mx-auto" />
              <h4 className="text-sm font-bold text-white uppercase">No Active Commercial Lines Found</h4>
              <p className="text-xs text-gray-400 max-w-md mx-auto">
                Visit the <strong>Workshop Catalogue</strong> to manufacture component batches, or design your maiden computer in the <strong>Design Studio</strong>.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredItems.map((item) => {
                const margin = item.sellingPrice - item.cost;
                const marginPct = Math.round((margin / Math.max(1, item.sellingPrice)) * 100);

                return (
                  <div
                    key={item.id}
                    onClick={() => setSelectedProductForMarketing(item)}
                    className="bg-[#121620] border border-[#2b3547] hover:border-emerald-500/70 rounded-2xl p-5 space-y-4 cursor-pointer transition-all duration-200 group shadow-lg hover:shadow-emerald-950/20"
                  >
                    {/* Item Card Header */}
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-[#0b0e14] text-emerald-400 border border-emerald-500/30 font-bold">
                            {item.tier}
                          </span>
                          <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-[#161b22] text-gray-400 border border-[#30363d]">
                            {item.type === 'pc' ? 'Turnkey System' : item.type === 'supercomputer' ? 'Enterprise Array' : 'Component Brand'}
                          </span>
                        </div>
                        <h4 className="text-sm font-bold text-white font-mono mt-1 group-hover:text-emerald-300 transition-colors">
                          {item.name}
                        </h4>
                      </div>

                      {/* Review Badge */}
                      {item.review ? (
                        <div
                          onClick={(e) => {
                            e.stopPropagation();
                            setViewingReview({ name: item.name, review: item.review! });
                          }}
                          className="flex items-center gap-1.5 bg-[#0b0e14] hover:bg-[#161b22] px-2.5 py-1 rounded-xl border border-amber-500/30 transition-all cursor-pointer shrink-0"
                          title="Click to view critic reviews"
                        >
                          <Star className="w-3.5 h-3.5 fill-current text-amber-400" />
                          <span className="text-xs font-bold text-white">{item.review.overallScore.toFixed(1)}</span>
                          <span className="text-[10px] text-gray-400 hidden sm:inline">Reviews</span>
                        </div>
                      ) : (
                        <span className="text-[10px] text-gray-500 font-mono px-2 py-0.5 rounded bg-[#0b0e14]">
                          Unreviewed
                        </span>
                      )}
                    </div>

                    {/* Telemetry Metrics Bar */}
                    <div className="grid grid-cols-3 gap-2.5 bg-[#0b0e14] p-3 rounded-xl border border-[#21262d] text-xs font-mono">
                      <div>
                        <span className="text-[10px] text-gray-500 block uppercase">Stock</span>
                        <span className={`font-bold ${item.inventoryCount > 0 ? 'text-white' : 'text-rose-400 font-extrabold'}`}>
                          {item.inventoryCount > 0 ? `${item.inventoryCount.toLocaleString()} units` : '⚠️ Out of Stock'}
                        </span>
                      </div>

                      <div>
                        <span className="text-[10px] text-gray-500 block uppercase">Retail Price</span>
                        <span className="font-bold text-white">
                          ${item.sellingPrice.toFixed(2)}
                        </span>
                        <span className="text-[10px] text-emerald-400 block font-normal">
                          +{marginPct}% margin
                        </span>
                      </div>

                      <div>
                        <span className="text-[10px] text-gray-500 block uppercase">Daily Sales</span>
                        <span className="font-bold text-cyan-400 flex items-center gap-1">
                          <TrendingUp className="w-3 h-3 text-cyan-400" />
                          ~{item.dailySalesRate}/day
                        </span>
                        <span className="text-[10px] text-gray-400 block font-normal">
                          {item.unitsSold.toLocaleString()} total
                        </span>
                      </div>
                    </div>

                    {/* Active Ad Campaign Status & CTA */}
                    <div className="flex items-center justify-between pt-1 text-xs">
                      <div className="flex items-center gap-1.5 text-[11px] text-gray-300">
                        <Megaphone className="w-3.5 h-3.5 text-purple-400" />
                        <span>
                          Ad Level:{' '}
                          <strong className={item.adSpend > 0 ? 'text-purple-300' : 'text-gray-400'}>
                            {item.adSpend > 0 ? `$${item.adSpend}/mo` : 'Organic (None)'}
                          </strong>
                        </span>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedProductForMarketing(item);
                        }}
                        className="px-3.5 py-1.5 rounded-xl bg-[#1e2736] hover:bg-emerald-500 hover:text-black text-gray-200 border border-[#30363d] transition-all flex items-center gap-1 font-bold text-[11px]"
                      >
                        <span>Manage Ad &amp; Pricing</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* VIEW 2: MACRO DEMOGRAPHICS & MARKET SHARE */}
      {marketView === 'macro_intel' && (
        <div className="space-y-6">
          {/* Top Banner: Market Share Overview */}
          <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-5 space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between pb-3 border-b border-[#30363d] gap-3">
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-emerald-400" />
                  GLOBAL COMPUTING MARKET INTELLIGENCE &amp; SHARE MATRIX
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
                className="bg-[#161b22] border border-[#30363d] rounded-2xl p-4 space-y-3 flex flex-col justify-between"
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

          {/* Company-Wide Umbrella Promotion Control */}
          <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-5 space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-[#30363d]">
              <Target className="w-5 h-5 text-emerald-400" />
              <div>
                <h4 className="text-sm font-bold text-white uppercase tracking-wider">
                  Corporate Umbrella Brand Advertising
                </h4>
                <p className="text-xs text-gray-400">
                  Global corporate image campaigns that elevate overall company brand awareness across all market sectors
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-3 md:col-span-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-300 font-medium">Monthly Company Advertising Allocation:</span>
                  <span className="font-mono font-bold text-emerald-400 text-sm">
                    ${macroAdSpend.toLocaleString()} / Month
                  </span>
                </div>

                <input
                  type="range"
                  min="0"
                  max="5000"
                  step="50"
                  value={macroAdSpend}
                  onChange={(e) => setMacroAdSpend(parseInt(e.target.value))}
                  className="w-full accent-emerald-500"
                />

                <div className="flex gap-2">
                  {[0, 100, 500, 1500, 3000].map((val) => (
                    <button
                      key={val}
                      onClick={() => setMacroAdSpend(val)}
                      className={`px-3 py-1 text-xs font-mono rounded border transition-all ${
                        macroAdSpend === val
                          ? 'bg-emerald-950/60 border-emerald-500 text-emerald-400 font-bold'
                          : 'bg-[#0d1117] border-[#30363d] text-gray-400 hover:text-white'
                      }`}
                    >
                      ${val}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => onUpdateCompanyAdSpend(macroAdSpend)}
                  className="mt-2 px-5 py-2 text-xs font-bold bg-emerald-400 text-black hover:bg-emerald-300 rounded-xl transition-all shadow-lg shadow-emerald-500/20"
                >
                  Commit Corporate Budget
                </button>
              </div>

              <div className="bg-[#0d1117] border border-[#30363d] rounded-xl overflow-hidden flex flex-col justify-between">
                <div className="relative h-24 overflow-hidden border-b border-[#30363d]">
                  <img
                    src={Images.mainframe1952}
                    alt="Commercial Computing Market"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0d1117] via-transparent to-transparent" />
                  <div className="absolute top-1.5 left-2 bg-black/80 px-2 py-0.5 rounded text-[9px] font-mono text-emerald-400">
                    HISTORICAL ERA MARKET MATRIX
                  </div>
                </div>
                <div className="p-3.5 space-y-2 text-xs">
                  <span className="font-bold text-white uppercase tracking-wider block">Global Multiplier</span>
                  <p className="text-gray-400 text-[11px] leading-relaxed">
                    Elevates company-wide brand awareness (+0.8 pts/mo), driving customer trust across all manufactured lines.
                  </p>
                  <div className="pt-2 border-t border-[#30363d] text-[11px] text-emerald-400 font-mono">
                    Umbrella Ad Factor: {(1.0 + (company.monthlyAdSpend / 10000) * 0.15).toFixed(2)}x
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Product Marketing & Ad Modal */}
      {selectedProductForMarketing && (
        <ProductMarketingModal
          item={selectedProductForMarketing}
          companyCash={company.cash}
          onClose={() => setSelectedProductForMarketing(null)}
          onUpdateAdSpend={onUpdateProductAdSpend}
          onUpdatePrice={onUpdateProductPrice}
          onViewReviews={(review, name) => setViewingReview({ review, name })}
        />
      )}

      {/* Review Inspector Modal */}
      {viewingReview && (
        <LaunchReviewModal
          productName={viewingReview.name}
          productType="pc"
          reviewSummary={viewingReview.review}
          onClose={() => setViewingReview(null)}
          onOpenMarketing={() => {
            const match = liveItems.find((i) => i.name === viewingReview.name);
            if (match) setSelectedProductForMarketing(match);
          }}
        />
      )}
    </div>
  );
};
