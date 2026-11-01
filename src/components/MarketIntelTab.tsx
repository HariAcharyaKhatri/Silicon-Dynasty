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
  Search,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
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

const PRODUCTS_PER_PAGE = 6;
const SEGMENTS_PER_PAGE = 4;

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
  const [searchQuery, setSearchQuery] = React.useState<string>('');
  const [sortBy, setSortBy] = React.useState<'velocity' | 'stock' | 'sold'>('velocity');
  const [currentPage, setCurrentPage] = React.useState<number>(1);
  const [segmentPage, setSegmentPage] = React.useState<number>(1);

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

  // Filter products by type and search query
  const filteredItems = liveItems
    .filter((item) => {
      if (filterType === 'pc' && item.type !== 'pc' && item.type !== 'supercomputer') return false;
      if (filterType === 'component' && item.type !== 'component') return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return item.name.toLowerCase().includes(q) || item.id.toLowerCase().includes(q);
      }
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'velocity') return b.dailySalesRate - a.dailySalesRate;
      if (sortBy === 'stock') return b.inventoryCount - a.inventoryCount;
      if (sortBy === 'sold') return b.unitsSold - a.unitsSold;
      return 0;
    });

  React.useEffect(() => {
    setCurrentPage(1);
  }, [filterType, searchQuery, sortBy]);

  // Product Pagination
  const totalPages = Math.max(1, Math.ceil(filteredItems.length / PRODUCTS_PER_PAGE));
  const paginatedItems = filteredItems.slice(
    (currentPage - 1) * PRODUCTS_PER_PAGE,
    currentPage * PRODUCTS_PER_PAGE
  );

  // Segment Pagination
  const totalSegmentPages = Math.max(1, Math.ceil(segments.length / SEGMENTS_PER_PAGE));
  const paginatedSegments = segments.slice(
    (segmentPage - 1) * SEGMENTS_PER_PAGE,
    segmentPage * SEGMENTS_PER_PAGE
  );

  const totalUnitsSoldPortfolio = liveItems.reduce((acc, i) => acc + i.unitsSold, 0);
  const totalDailyRevenueEst = liveItems.reduce((acc, i) => acc + i.dailySalesRate * i.sellingPrice, 0);
  const reviewedItems = liveItems.filter((i) => i.review);
  const avgReviewScore =
    reviewedItems.length > 0
      ? (reviewedItems.reduce((acc, i) => acc + i.review!.overallScore, 0) / reviewedItems.length).toFixed(1)
      : '8.5';

  return (
    <div className="space-y-4 select-none font-mono animate-tab-fade">
      {/* Top Switcher: Live Sales vs Macro Demographics */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-[#161b22] border border-[#30363d] p-2.5 rounded-2xl">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setMarketView('live_sales')}
            className={`px-3.5 py-2 text-xs font-bold uppercase rounded-xl transition-all flex items-center gap-2 ${
              marketView === 'live_sales'
                ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/20'
                : 'bg-[#0d1117] text-gray-300 hover:text-white border border-[#262c36]'
            }`}
          >
            <Flame className="w-4 h-4" />
            <span>Active Lineup ({liveItems.length})</span>
          </button>

          <button
            onClick={() => setMarketView('macro_intel')}
            className={`px-3.5 py-2 text-xs font-bold uppercase rounded-xl transition-all flex items-center gap-2 ${
              marketView === 'macro_intel'
                ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/20'
                : 'bg-[#0d1117] text-gray-300 hover:text-white border border-[#262c36]'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Macro Share &amp; Demographics</span>
          </button>
        </div>

        <div className="flex items-center gap-4 text-xs pr-2 hidden sm:flex">
          <span className="text-gray-400">
            Market Share: <strong className="text-emerald-400 text-sm">{playerEstimatedShare.toFixed(1)}%</strong>
          </span>
          <span className="text-gray-400">
            Brand Awareness: <strong className="text-white text-sm">{company.brandAwareness}/100</strong>
          </span>
        </div>
      </div>

      {/* ======================================================== */}
      {/* VIEW 1: LIVE SALES & ACTIVE LINEUP WORKSTATION           */}
      {/* ======================================================== */}
      {marketView === 'live_sales' && (
        <div className="space-y-4">
          {/* Header KPI Ribbon */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
            <div className="bg-[#161b22] border border-[#30363d] p-3 sm:p-4 rounded-xl space-y-1">
              <span className="text-[10px] text-gray-500 uppercase block">Active Product Lines</span>
              <span className="text-lg sm:text-xl font-bold text-white">{liveItems.length} Products</span>
              <span className="text-[10px] text-emerald-400 block">On Commercial Market</span>
            </div>

            <div className="bg-[#161b22] border border-[#30363d] p-3 sm:p-4 rounded-xl space-y-1">
              <span className="text-[10px] text-gray-500 uppercase block">Total Units Sold</span>
              <span className="text-lg sm:text-xl font-bold text-emerald-400">
                {totalUnitsSoldPortfolio.toLocaleString()}
              </span>
              <span className="text-[10px] text-gray-400 block">Lifetime Volume</span>
            </div>

            <div className="bg-[#161b22] border border-[#30363d] p-3 sm:p-4 rounded-xl space-y-1">
              <span className="text-[10px] text-gray-500 uppercase block">Daily Gross Run-Rate</span>
              <span className="text-lg sm:text-xl font-bold text-cyan-400">
                ${Math.round(totalDailyRevenueEst).toLocaleString()} / day
              </span>
              <span className="text-[10px] text-gray-400 block">Portfolio pace</span>
            </div>

            <div className="bg-[#161b22] border border-[#30363d] p-3 sm:p-4 rounded-xl space-y-1">
              <span className="text-[10px] text-gray-500 uppercase block">Avg Critic Reception</span>
              <div className="flex items-center gap-1.5 pt-0.5">
                <Star className="w-3.5 h-3.5 fill-current text-amber-400" />
                <span className="text-lg sm:text-xl font-bold text-white">{avgReviewScore} / 10</span>
              </div>
              <span className="text-[10px] text-gray-400 block">Press sentiment rating</span>
            </div>
          </div>

          {/* Filter Bar & Search */}
          <div className="bg-[#161b22] border border-[#30363d] p-3 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
            {/* Filter Buttons */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
              {[
                { id: 'all', label: `All (${liveItems.length})` },
                { id: 'pc', label: `Computers (${blueprints.length})` },
                { id: 'component', label: `Components (${Object.keys(customParts).length})` },
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => setFilterType(f.id as any)}
                  className={`px-3 py-1.5 rounded-lg font-bold whitespace-nowrap transition-all ${
                    filterType === f.id
                      ? 'bg-emerald-950/80 border border-emerald-500 text-emerald-300'
                      : 'bg-[#0d1117] border border-[#262c36] text-gray-400 hover:text-white'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {/* Search & Sort Controls */}
            <div className="flex items-center gap-2">
              <div className="relative flex-1 sm:w-48">
                <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-gray-500" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#0d1117] border border-[#30363d] rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder:text-gray-600 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-[#0d1117] border border-[#30363d] text-xs text-gray-300 rounded-xl px-2.5 py-1.5 focus:outline-none"
              >
                <option value="velocity">Sort: Daily Velocity</option>
                <option value="stock">Sort: In-Stock Qty</option>
                <option value="sold">Sort: Total Units Sold</option>
              </select>
            </div>
          </div>

          {/* Active Product Lineup Cards */}
          {filteredItems.length === 0 ? (
            <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-12 text-center space-y-3">
              <Package className="w-12 h-12 text-gray-500 mx-auto" />
              <h4 className="text-sm font-bold text-white uppercase">No Active Commercial Lines Found</h4>
              <p className="text-xs text-gray-400 max-w-md mx-auto">
                Visit the <strong>Workshop Catalogue</strong> to manufacture component batches, or assemble your maiden computer in the <strong>Design Studio</strong>.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {paginatedItems.map((item) => {
                const margin = item.sellingPrice - item.cost;
                const marginPct = Math.round((margin / Math.max(1, item.sellingPrice)) * 100);

                return (
                  <div
                    key={item.id}
                    className="bg-[#161b22] border border-[#30363d] hover:border-emerald-500/50 rounded-2xl p-4 flex flex-col justify-between space-y-3.5 transition-all shadow-md group"
                  >
                    <div>
                      {/* Top Header Row */}
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <span className="text-[9px] uppercase px-2 py-0.5 rounded bg-[#0d1117] border border-[#30363d] text-gray-400">
                            {item.type === 'pc' ? 'Turnkey Computer' : item.type === 'supercomputer' ? 'Enterprise Array' : 'Component Line'}
                          </span>
                          <h4 className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors mt-1 truncate">
                            {item.name}
                          </h4>
                          <span className="text-[10px] text-gray-400">Tier: {item.tier}</span>
                        </div>

                        <div className="text-right shrink-0">
                          <span className="text-base font-bold text-white block">
                            ${item.sellingPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </span>
                          <span className="text-[10px] text-amber-300 font-mono">
                            ${margin.toFixed(2)} ({marginPct}%)
                          </span>
                        </div>
                      </div>

                      {/* Review Badge & Critic Score */}
                      {item.review ? (
                        <div
                          onClick={() => setViewingReview({ name: item.name, review: item.review! })}
                          className="mt-2.5 p-2 rounded-xl bg-[#0d1117] border border-[#262c36] hover:border-emerald-500/50 cursor-pointer flex items-center justify-between text-xs transition-colors"
                        >
                          <div className="flex items-center gap-1.5">
                            <Star className="w-3.5 h-3.5 fill-current text-amber-400" />
                            <span className="font-bold text-white">{item.review.overallScore.toFixed(1)}/10</span>
                            <span className="text-[10px] text-emerald-400 ml-1">({item.review.badge})</span>
                          </div>
                          <span className="text-[10px] text-gray-400 hover:text-white flex items-center gap-0.5">
                            Read Reviews <ArrowUpRight className="w-3 h-3" />
                          </span>
                        </div>
                      ) : (
                        <div className="mt-2.5 p-2 rounded-xl bg-[#0d1117] border border-[#262c36] text-[10px] text-gray-500">
                          No press review registered yet
                        </div>
                      )}

                      {/* Stock & Velocity Metrics */}
                      <div className="grid grid-cols-2 gap-2 mt-2.5 text-[11px]">
                        <div className="bg-[#0d1117] p-2 rounded-xl border border-[#262c36]">
                          <span className="text-gray-500 block text-[10px]">Stock Level:</span>
                          <strong className={item.inventoryCount > 0 ? 'text-emerald-400' : 'text-rose-400'}>
                            {item.inventoryCount} units
                          </strong>
                        </div>

                        <div className="bg-[#0d1117] p-2 rounded-xl border border-[#262c36]">
                          <span className="text-gray-500 block text-[10px]">Sales Rate:</span>
                          <strong className="text-cyan-400">
                            ~{item.dailySalesRate} units / day
                          </strong>
                        </div>
                      </div>

                      {/* Targeted Ad Campaign Tag */}
                      <div className="mt-2 text-[10px] flex items-center justify-between text-gray-400">
                        <span className="flex items-center gap-1">
                          <Megaphone className="w-3 h-3 text-purple-400" />
                          Ad Budget:
                        </span>
                        <strong className="text-purple-300">
                          {item.adSpend > 0 ? `$${item.adSpend}/mo campaign` : 'Organic (Word of mouth)'}
                        </strong>
                      </div>
                    </div>

                    {/* Manage Ad & Price CTA */}
                    <div className="pt-2 border-t border-[#30363d]">
                      <button
                        onClick={() => setSelectedProductForMarketing(item)}
                        className="w-full py-2 px-3 rounded-xl bg-[#21262d] hover:bg-emerald-500 hover:text-black text-gray-200 text-xs font-bold transition-all flex items-center justify-center gap-1.5 active:scale-[0.98]"
                      >
                        <SlidersHorizontal className="w-3.5 h-3.5" />
                        Manage Ad &amp; Pricing
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Product Lineup Pagination Controls */}
          {totalPages > 1 && (
            <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-3 flex items-center justify-between text-xs">
              <span className="text-[11px] text-gray-400">
                Page {currentPage} of {totalPages} ({filteredItems.length} products total)
              </span>
              <div className="flex items-center gap-2">
                <button
                  disabled={currentPage <= 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  className="px-3 py-1.5 rounded-lg border border-[#30363d] bg-[#0d1117] hover:bg-[#1f2633] text-gray-300 disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-1"
                >
                  <ChevronLeft className="w-3.5 h-3.5" /> Prev
                </button>
                <button
                  disabled={currentPage >= totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  className="px-3 py-1.5 rounded-lg border border-[#30363d] bg-[#0d1117] hover:bg-[#1f2633] text-gray-300 disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-1"
                >
                  Next <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ======================================================== */}
      {/* VIEW 2: MACRO DEMOGRAPHICS & COMPETITOR SHARE           */}
      {/* ======================================================== */}
      {marketView === 'macro_intel' && (
        <div className="space-y-4">
          {/* Corporate Umbrella Advertising Card */}
          <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-white uppercase flex items-center gap-2">
                <Megaphone className="w-4 h-4 text-emerald-400" />
                Corporate Umbrella Brand Campaign
              </h3>
              <p className="text-xs text-gray-400 max-w-xl">
                Global brand advertising lifts company-wide awareness ({company.brandAwareness}/100) and improves baseline demand across all product lines.
              </p>
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto">
              <div className="relative flex-1 md:w-36">
                <span className="absolute left-3 top-2 text-xs text-gray-500 font-mono">$</span>
                <input
                  type="number"
                  step="50"
                  value={macroAdSpend}
                  onChange={(e) => setMacroAdSpend(Math.max(0, parseFloat(e.target.value) || 0))}
                  className="w-full bg-[#0d1117] border border-[#30363d] rounded-xl pl-7 pr-3 py-1.5 text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
                />
              </div>
              <button
                onClick={() => onUpdateCompanyAdSpend(macroAdSpend)}
                className="px-4 py-2 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-black font-bold text-xs uppercase transition-all shadow-md shrink-0 active:scale-[0.98]"
              >
                Apply Budget
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
            {/* Demographics Segments */}
            <div className="lg:col-span-7 bg-[#161b22] border border-[#30363d] rounded-2xl p-4 sm:p-5 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-[#30363d]">
                <h4 className="text-xs font-bold text-white uppercase flex items-center gap-2">
                  <Users className="w-4 h-4 text-emerald-400" />
                  Target Customer Demographics
                </h4>
                <span className="text-[10px] text-gray-400">
                  Page {segmentPage} of {totalSegmentPages}
                </span>
              </div>

              <div className="space-y-3">
                {paginatedSegments.map((seg) => (
                  <div key={seg.id} className="bg-[#0d1117] border border-[#262c36] p-3 rounded-xl space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <div>
                        <span className="font-bold text-white">{seg.name}</span>
                        <span className="text-[10px] text-gray-500 ml-2">({seg.populationPct}% of population)</span>
                      </div>
                      <span className="text-emerald-400 font-bold">${seg.budgetPerUnit.toLocaleString()} Budget</span>
                    </div>

                    <div className="w-full bg-[#161b22] h-2 rounded-full overflow-hidden border border-[#30363d]">
                      <div
                        className="bg-emerald-400 h-full transition-all duration-300"
                        style={{ width: `${Math.min(100, seg.playerSharePct * 3 || 8)}%` }}
                      />
                    </div>

                    <div className="flex justify-between text-[10px] text-gray-400">
                      <span>Demand Pool: {seg.demandPool.toLocaleString()} units</span>
                      <span>Your Share: {(seg.playerSharePct || 0).toFixed(1)}%</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Segment Pagination */}
              {totalSegmentPages > 1 && (
                <div className="pt-2 flex items-center justify-between border-t border-[#262c36] text-xs">
                  <button
                    disabled={segmentPage <= 1}
                    onClick={() => setSegmentPage((p) => Math.max(1, p - 1))}
                    className="px-2.5 py-1 rounded bg-[#0d1117] border border-[#30363d] text-gray-300 disabled:opacity-30 text-[11px]"
                  >
                    Prev
                  </button>
                  <span className="text-[10px] text-gray-500">
                    {segmentPage} / {totalSegmentPages}
                  </span>
                  <button
                    disabled={segmentPage >= totalSegmentPages}
                    onClick={() => setSegmentPage((p) => Math.min(totalSegmentPages, p + 1))}
                    className="px-2.5 py-1 rounded bg-[#0d1117] border border-[#30363d] text-gray-300 disabled:opacity-30 text-[11px]"
                  >
                    Next
                  </button>
                </div>
              )}
            </div>

            {/* Competitor Shares */}
            <div className="lg:col-span-5 bg-[#161b22] border border-[#30363d] rounded-2xl p-4 sm:p-5 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-[#30363d]">
                <h4 className="text-xs font-bold text-white uppercase flex items-center gap-2">
                  <Target className="w-4 h-4 text-emerald-400" />
                  Industry Competitor Intelligence
                </h4>
                <span className="text-[10px] text-emerald-400 font-bold">
                  Your Share: {playerEstimatedShare.toFixed(1)}%
                </span>
              </div>

              <div className="space-y-3">
                {competitors.map((comp) => (
                  <div key={comp.id} className="bg-[#0d1117] p-3 rounded-xl border border-[#262c36] space-y-1.5">
                    <div className="flex justify-between items-center text-xs">
                      <div>
                        <span className="font-bold text-white">{comp.name}</span>
                        <span className="text-[10px] text-gray-500 block">{comp.tagline}</span>
                      </div>
                      <span className="font-bold text-gray-200">{comp.marketShare.toFixed(1)}%</span>
                    </div>

                    <div className="w-full bg-[#161b22] h-1.5 rounded-full overflow-hidden border border-[#30363d]">
                      <div
                        className="h-full bg-blue-400"
                        style={{ width: `${comp.marketShare}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Product Marketing & Ad Drawer Modal */}
      {selectedProductForMarketing && (
        <ProductMarketingModal
          item={selectedProductForMarketing}
          companyCash={company.cash}
          onClose={() => setSelectedProductForMarketing(null)}
          onUpdateAdSpend={onUpdateProductAdSpend}
          onUpdatePrice={onUpdateProductPrice}
          onViewReviews={(review, name) => setViewingReview({ name, review })}
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
            const target = liveItems.find((i) => i.name === viewingReview.name);
            setViewingReview(null);
            if (target) setSelectedProductForMarketing(target);
          }}
        />
      )}
    </div>
  );
};
