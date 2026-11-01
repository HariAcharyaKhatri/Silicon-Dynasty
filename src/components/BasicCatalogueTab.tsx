import React from 'react';
import { ComponentItem, CustomPartNaming, InventoryItem, TierId } from '../types/game';
import {
  Package,
  Plus,
  DollarSign,
  Tag,
  TrendingUp,
  AlertTriangle,
  Layers,
  ChevronLeft,
  ChevronRight,
  Search,
  CheckCircle2,
  SlidersHorizontal,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
} from 'lucide-react';
import Images from '../assets/images';

interface Props {
  catalogue: ComponentItem[];
  inventory: Record<string, InventoryItem>;
  customParts: Record<string, CustomPartNaming>;
  cash: number;
  currentTier: TierId;
  onOrderProduction: (componentId: string, quantity: number, unitCost: number) => void;
  onUpdatePartName: (componentId: string, newName: string) => void;
  onUpdatePartPrice: (componentId: string, price: number) => void;
}

const TIER_ORDER: TierId[] = ['T0', 'T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
const ITEMS_PER_PAGE = 5;

export const BasicCatalogueTab: React.FC<Props> = ({
  catalogue,
  inventory,
  customParts,
  cash,
  currentTier,
  onOrderProduction,
  onUpdatePartName,
  onUpdatePartPrice,
}) => {
  // STRICT TIER FOG OF WAR FILTER
  const currentTierIndex = TIER_ORDER.indexOf(currentTier);
  const visibleCatalogue = catalogue.filter((comp) => {
    const compTierIndex = TIER_ORDER.indexOf(comp.tier);
    return compTierIndex <= currentTierIndex;
  });

  const [selectedCompId, setSelectedCompId] = React.useState<string>(
    visibleCatalogue[0]?.id || 't0_power_cable'
  );
  const [mobileView, setMobileView] = React.useState<'list' | 'workbench'>('list');
  const [categoryFilter, setCategoryFilter] = React.useState<string>('all');
  const [searchQuery, setSearchQuery] = React.useState<string>('');
  const [currentPage, setCurrentPage] = React.useState<number>(1);
  const [orderQty, setOrderQty] = React.useState<number>(100);
  const [renameInput, setRenameInput] = React.useState<string>('');
  const [priceInput, setPriceInput] = React.useState<number>(2.5);
  const [saveSuccess, setSaveSuccess] = React.useState<boolean>(false);

  // If selected item becomes invalid or hidden, fallback
  React.useEffect(() => {
    if (!visibleCatalogue.some((c) => c.id === selectedCompId)) {
      if (visibleCatalogue[0]) {
        setSelectedCompId(visibleCatalogue[0].id);
      }
    }
  }, [visibleCatalogue, selectedCompId]);

  const selectedComp = visibleCatalogue.find((c) => c.id === selectedCompId) || visibleCatalogue[0];
  const customPart = customParts[selectedComp?.id || ''];
  const inv = inventory[selectedComp?.id || ''] || { componentId: selectedComp?.id || '', quantity: 0, defective: 0 };

  React.useEffect(() => {
    if (customPart) {
      setRenameInput(customPart.customName);
    } else if (selectedComp) {
      setRenameInput(selectedComp.name);
    }
    if (selectedComp) {
      setPriceInput(selectedComp.basePrice);
    }
  }, [selectedCompId, customPart, selectedComp]);

  // Filter catalogue based on category and search query
  const filteredCatalogue = visibleCatalogue.filter((comp) => {
    const matchesCategory = categoryFilter === 'all' || comp.category === categoryFilter;
    const matchesSearch =
      comp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      comp.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (customParts[comp.id]?.customName || '').toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Reset page when filter changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [categoryFilter, searchQuery]);

  // Pagination calculation
  const totalPages = Math.max(1, Math.ceil(filteredCatalogue.length / ITEMS_PER_PAGE));
  const paginatedCatalogue = filteredCatalogue.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  if (!selectedComp) {
    return (
      <div className="p-8 text-center font-mono text-gray-400 bg-[#161b22] border border-[#30363d] rounded-2xl">
        No components unlocked for this tier yet. Research and construct facilities to unlock.
      </div>
    );
  }

  const totalCost = selectedComp.cost * orderQty;
  const canAfford = cash >= totalCost;
  const maxAffordableQty = Math.max(10, Math.floor(cash / Math.max(0.1, selectedComp.cost)));

  // Telemetry calculations
  const estimatedDefects = Math.round(orderQty * 0.05);
  const estimatedGoodUnits = orderQty - estimatedDefects;
  const unitMargin = priceInput - selectedComp.cost;
  const marginPercent = Math.round((unitMargin / (priceInput || 1)) * 100);

  // Price Elasticity / Market Acceptance Rating
  let marketAcceptance = 'High Elastic Demand';
  let marketColor = 'text-emerald-400';
  if (priceInput > selectedComp.cost * 4.5) {
    marketAcceptance = 'Severe Resistance (Overpriced)';
    marketColor = 'text-rose-400';
  } else if (priceInput > selectedComp.cost * 3.2) {
    marketAcceptance = 'Moderate Premium (High Margin)';
    marketColor = 'text-amber-300';
  }

  const handleSelectComponent = (id: string) => {
    setSelectedCompId(id);
    // On mobile screens, automatically transition to workbench to avoid redundant clicks
    if (window.innerWidth < 1024) {
      setMobileView('workbench');
    }
  };

  const handleSaveTrademark = () => {
    onUpdatePartName(selectedComp.id, renameInput);
    onUpdatePartPrice(selectedComp.id, priceInput);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  return (
    <div className="space-y-4 select-none animate-tab-fade">
      {/* Mobile/Tablet Segmented View Switcher (Hidden on desktop lg:) */}
      <div className="lg:hidden flex items-center bg-[#161b22] border border-[#30363d] p-1.5 rounded-xl text-xs font-mono">
        <button
          onClick={() => setMobileView('list')}
          className={`flex-1 py-2 px-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-all ${
            mobileView === 'list'
              ? 'bg-emerald-500 text-black shadow-md shadow-emerald-500/20'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>1. Select Part ({visibleCatalogue.length})</span>
        </button>
        <button
          onClick={() => setMobileView('workbench')}
          className={`flex-1 py-2 px-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-all ${
            mobileView === 'workbench'
              ? 'bg-emerald-500 text-black shadow-md shadow-emerald-500/20'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <SlidersHorizontal className="w-4 h-4" />
          <span>2. Workbench &amp; Order</span>
        </button>
      </div>

      {/* Main Workspace Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* ======================================================== */}
        {/* COLUMN 1: Component Catalogue with Search & Pagination */}
        {/* ======================================================== */}
        <div
          className={`lg:col-span-5 bg-[#161b22] border border-[#30363d] rounded-2xl p-4 flex flex-col space-y-3.5 ${
            mobileView === 'workbench' ? 'hidden lg:flex' : 'flex'
          }`}
        >
          {/* Header & Fog of War Indicator */}
          <div className="pb-3 border-b border-[#30363d] space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
                <Layers className="w-4 h-4 text-emerald-400" />
                Component Catalogue
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950/70 border border-emerald-500/40 text-emerald-400 font-bold">
                Tier {currentTier} Active
              </span>
            </div>

            {/* Quick Search */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-gray-500" />
              <input
                type="text"
                placeholder="Search components or brands..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#0d1117] border border-[#30363d] rounded-xl pl-8 pr-3 py-1.5 text-xs text-white font-mono placeholder:text-gray-600 focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px] font-mono no-scrollbar">
              {[
                { id: 'all', label: 'All' },
                { id: 'basic', label: 'Basic' },
                { id: 'cpu', label: 'CPU' },
                { id: 'motherboard', label: 'Boards' },
                { id: 'ram', label: 'RAM' },
                { id: 'psu', label: 'PSU' },
                { id: 'cooling', label: 'Cooling' },
                { id: 'case', label: 'Cases' },
              ].map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setCategoryFilter(cat.id)}
                  className={`px-2.5 py-1 rounded-lg border whitespace-nowrap transition-all ${
                    categoryFilter === cat.id
                      ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300 font-bold'
                      : 'bg-[#0d1117] border-[#262c36] text-gray-400 hover:text-white'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Paginated Component Cards */}
          <div className="space-y-2.5 min-h-[300px]">
            {paginatedCatalogue.length === 0 ? (
              <div className="p-8 text-center text-xs font-mono text-gray-500 bg-[#0d1117] rounded-xl border border-[#262c36]">
                No components match your search or filter.
              </div>
            ) : (
              paginatedCatalogue.map((comp) => {
                const partBranding = customParts[comp.id];
                const stock = inventory[comp.id]?.quantity || 0;
                const isSelected = comp.id === selectedComp.id;

                return (
                  <div
                    key={comp.id}
                    onClick={() => handleSelectComponent(comp.id)}
                    className={`p-3 rounded-xl border cursor-pointer transition-all duration-150 ${
                      isSelected
                        ? 'bg-emerald-950/40 border-emerald-500 text-white shadow-md shadow-emerald-950/40 ring-1 ring-emerald-500/50'
                        : 'bg-[#0d1117] border-[#262c36] text-gray-300 hover:border-gray-500 hover:bg-[#12161f]'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <h4 className="text-xs font-bold text-white truncate font-mono">
                            {partBranding?.customName || comp.name}
                          </h4>
                          {partBranding?.customName && (
                            <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-purple-950/80 text-purple-300 border border-purple-500/30 shrink-0">
                              BRANDED
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] text-gray-400 font-mono mt-0.5 truncate">
                          ID: {comp.id} • Tier: <strong className="text-emerald-400">{comp.tier}</strong>
                        </p>
                      </div>
                      <span className="text-xs font-mono text-emerald-400 font-bold shrink-0">
                        ${comp.basePrice.toFixed(2)}
                      </span>
                    </div>

                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#262c36] text-[11px] font-mono">
                      <span className="text-gray-400">
                        Stock: <strong className={stock > 0 ? 'text-emerald-400' : 'text-gray-500'}>{stock} units</strong>
                      </span>
                      <span className="text-gray-400">
                        Reliability: <span className="text-gray-200">{Math.round(comp.reliability * 100)}%</span>
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Page-Based Navigation Controls */}
          <div className="pt-3 border-t border-[#262c36] flex items-center justify-between text-xs font-mono">
            <span className="text-[11px] text-gray-400">
              Page {currentPage} of {totalPages} ({filteredCatalogue.length} items)
            </span>
            <div className="flex items-center gap-1.5">
              <button
                disabled={currentPage <= 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="px-2.5 py-1.5 rounded-lg border border-[#30363d] bg-[#0d1117] hover:bg-[#1f2633] text-gray-300 disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-1"
              >
                <ChevronLeft className="w-3.5 h-3.5" /> Prev
              </button>
              <button
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className="px-2.5 py-1.5 rounded-lg border border-[#30363d] bg-[#0d1117] hover:bg-[#1f2633] text-gray-300 disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-1"
              >
                Next <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* COLUMN 2: Production Workbench & Custom Branding */}
        {/* ======================================================== */}
        <div
          className={`lg:col-span-7 space-y-4 ${
            mobileView === 'list' ? 'hidden lg:block' : 'block'
          }`}
        >
          {/* Mobile Back Button to Catalogue */}
          <div className="lg:hidden flex items-center justify-between bg-[#161b22] border border-[#30363d] p-3 rounded-xl font-mono text-xs">
            <button
              onClick={() => setMobileView('list')}
              className="flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 font-bold"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Catalogue List
            </button>
            <span className="text-gray-400 truncate max-w-[180px]">
              {customPart?.customName || selectedComp.name}
            </span>
          </div>

          {/* Workbench Facility Visual Banner */}
          <div className="rounded-2xl overflow-hidden border border-[#30363d] bg-black/60 relative group shadow-xl">
            <img
              src={
                selectedComp.tier === 'T0'
                  ? Images.garageOrigin
                  : selectedComp.tier === 'T1' || selectedComp.tier === 'T2'
                  ? Images.motherboardPcb
                  : selectedComp.tier === 'T3' || selectedComp.tier === 'T4'
                  ? Images.cpuDie
                  : selectedComp.tier === 'T5'
                  ? Images.fabSilicon
                  : selectedComp.tier === 'T6'
                  ? Images.supercomputerCluster
                  : Images.quantumChamber
              }
              alt="Production Facility Visual"
              className="w-full h-32 sm:h-36 object-cover group-hover:scale-[1.02] transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#161b22] via-transparent to-transparent" />
            <div className="absolute top-2 left-3 bg-black/80 px-2.5 py-0.5 rounded-full border border-emerald-500/40 text-[10px] font-mono text-emerald-400 font-bold">
              {selectedComp.tier === 'T0' ? '1952 GARAGE WORKBENCH' : `${selectedComp.tier} INDUSTRIAL CELL`}
            </div>
            <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between text-[11px] font-mono text-gray-300">
              <span className="font-bold text-white truncate max-w-[200px] sm:max-w-none">
                {customPart?.customName || selectedComp.name}
              </span>
              <span className="text-emerald-400 shrink-0">
                Yield: {Math.round(selectedComp.reliability * 100)}% Quality
              </span>
            </div>
          </div>

          {/* Part Branding & Pricing Card */}
          <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-4 sm:p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#30363d] gap-2">
              <div className="flex items-center gap-2.5">
                <Tag className="w-5 h-5 text-emerald-400 shrink-0" />
                <div>
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                    Part Trademark &amp; Price Setting
                  </h3>
                  <p className="text-[11px] text-gray-400 font-mono">
                    Name this component to build reputation in retail markets
                  </p>
                </div>
              </div>
              {customPart && (
                <div className="flex items-center gap-2 bg-[#0d1117] px-3 py-1 rounded-full border border-[#30363d] self-start sm:self-auto">
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-xs font-mono text-emerald-400">
                    Rep: {customPart.reputation.toFixed(1)}/100
                  </span>
                  <span className="text-[11px] text-gray-400 font-mono">
                    (+{customPart.pricePremiumPct}%)
                  </span>
                </div>
              )}
            </div>

            <p className="text-xs text-gray-300 leading-relaxed bg-[#0d1117] p-3 rounded-xl border border-[#262c36] font-mono">
              {selectedComp.description}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1 font-mono">
                  Your Branded Trademark Name
                </label>
                <input
                  type="text"
                  value={renameInput}
                  onChange={(e) => setRenameInput(e.target.value)}
                  className="w-full bg-[#0d1117] border border-[#30363d] rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1 font-mono">
                  Retail Selling Price (USD)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-xs text-gray-500 font-mono">$</span>
                  <input
                    type="number"
                    step="0.1"
                    value={priceInput}
                    onChange={(e) => setPriceInput(parseFloat(e.target.value) || 0)}
                    className="w-full bg-[#0d1117] border border-[#30363d] rounded-xl pl-7 pr-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-1">
              <button
                onClick={handleSaveTrademark}
                className="w-full sm:w-auto px-4 py-2 text-xs font-bold font-mono bg-[#21262d] text-emerald-400 hover:bg-[#2b3547] rounded-xl border border-emerald-500/40 transition-all flex items-center justify-center gap-1.5 active:scale-[0.98]"
              >
                {saveSuccess ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    Trademark Saved!
                  </>
                ) : (
                  <>Save Brand &amp; Retail Price</>
                )}
              </button>
            </div>
          </div>

          {/* Production Order Workstation */}
          <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-4 sm:p-5 space-y-4">
            <div className="flex items-center gap-2.5 pb-3 border-b border-[#30363d]">
              <Package className="w-5 h-5 text-emerald-400" />
              <div>
                <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                  Workbench Production Line
                </h3>
                <p className="text-[11px] text-gray-400 font-mono">
                  Configure batch runs, monitor defect rates and profit margins
                </p>
              </div>
            </div>

            {/* Metric Telemetry Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs font-mono">
              <div className="bg-[#0d1117] p-3 rounded-xl border border-[#262c36]">
                <span className="text-[10px] text-gray-500 uppercase block">Unit Cost</span>
                <span className="text-sm font-bold text-white">${selectedComp.cost.toFixed(2)}</span>
              </div>
              <div className="bg-[#0d1117] p-3 rounded-xl border border-[#262c36]">
                <span className="text-[10px] text-gray-500 uppercase block">Unit Price</span>
                <span className="text-sm font-bold text-emerald-400">${priceInput.toFixed(2)}</span>
              </div>
              <div className="bg-[#0d1117] p-3 rounded-xl border border-[#262c36]">
                <span className="text-[10px] text-gray-500 uppercase block">Unit Margin</span>
                <span className={`text-sm font-bold ${unitMargin >= 0 ? 'text-amber-300' : 'text-rose-400'}`}>
                  ${unitMargin.toFixed(2)} ({marginPercent}%)
                </span>
              </div>
              <div className="bg-[#0d1117] p-3 rounded-xl border border-[#262c36]">
                <span className="text-[10px] text-gray-500 uppercase block">In-Stock</span>
                <span className="text-sm font-bold text-white">{inv.quantity} units</span>
              </div>
            </div>

            {/* Batch Volume Slider & Tactile Selectors */}
            <div className="space-y-3 pt-1 font-mono">
              <div className="flex flex-wrap items-center justify-between text-xs gap-2">
                <span className="text-gray-300 font-medium">Batch Run Size:</span>
                <div className="flex flex-wrap gap-1.5">
                  {[25, 50, 100, 250, 500].map((qty) => (
                    <button
                      key={qty}
                      onClick={() => setOrderQty(qty)}
                      className={`px-2.5 py-1 text-[11px] font-mono rounded-lg border transition-all ${
                        orderQty === qty
                          ? 'bg-emerald-950/80 border-emerald-500 text-emerald-400 font-bold'
                          : 'bg-[#0d1117] border-[#30363d] text-gray-400 hover:text-white'
                      }`}
                    >
                      {qty}
                    </button>
                  ))}
                  <button
                    onClick={() => setOrderQty(Math.min(1000, Math.max(10, maxAffordableQty)))}
                    className="px-2.5 py-1 text-[11px] font-mono rounded-lg border border-emerald-500/40 bg-emerald-950/30 text-emerald-300 hover:bg-emerald-900/50"
                  >
                    Max ({Math.min(1000, Math.max(10, maxAffordableQty))})
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="10"
                  max="1000"
                  step="10"
                  value={orderQty}
                  onChange={(e) => setOrderQty(parseInt(e.target.value))}
                  className="flex-1 accent-emerald-500 h-2 bg-[#0d1117] rounded-lg cursor-pointer"
                />
                <span className="font-mono text-xs font-bold text-white bg-[#0d1117] px-3.5 py-1.5 rounded-xl border border-[#30363d] min-w-[85px] text-center">
                  {orderQty} units
                </span>
              </div>
            </div>

            {/* Defect & Profit Diagnostics */}
            <div className="bg-[#0b0e14] border border-[#262c36] rounded-xl p-3 grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-[11px] font-mono">
              <div>
                <span className="text-gray-500 block">5% Defect Rate:</span>
                <span className="text-amber-400 font-bold">~{estimatedDefects} Defective Units</span>
              </div>
              <div>
                <span className="text-gray-500 block">Yield Good Units:</span>
                <span className="text-emerald-400 font-bold">~{estimatedGoodUnits} Units</span>
              </div>
              <div>
                <span className="text-gray-500 block">Market Acceptance:</span>
                <span className={`font-bold ${marketColor}`}>{marketAcceptance}</span>
              </div>
            </div>

            {/* Order Action Footer */}
            <div className="pt-3 border-t border-[#30363d] flex flex-col sm:flex-row items-center justify-between gap-3 font-mono">
              <div>
                <span className="text-xs text-gray-400 block">Total Batch Fabrication Cost:</span>
                <span className="text-xl font-bold text-white">${totalCost.toFixed(2)}</span>
              </div>

              <button
                disabled={!canAfford}
                onClick={() => onOrderProduction(selectedComp.id, orderQty, selectedComp.cost)}
                className={`w-full sm:w-auto px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
                  canAfford
                    ? 'bg-emerald-400 text-black hover:bg-emerald-300 shadow-lg shadow-emerald-500/20 active:scale-[0.98]'
                    : 'bg-gray-800 text-gray-500 cursor-not-allowed border border-[#30363d]'
                }`}
              >
                <Plus className="w-4 h-4" />
                Manufacture Batch ({orderQty} Units)
              </button>
            </div>

            {!canAfford && (
              <p className="text-[11px] text-rose-400 font-mono flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                Insufficient capital: Requires ${totalCost.toFixed(2)} (Treasury: ${cash.toFixed(2)}).
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
