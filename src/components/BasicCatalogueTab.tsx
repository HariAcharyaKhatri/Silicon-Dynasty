import React from 'react';
import { ComponentItem, CustomPartNaming, InventoryItem, TierId } from '../types/game';
import { Package, Plus, DollarSign, Tag, TrendingUp, AlertTriangle, ShieldCheck, Eye, Layers } from 'lucide-react';
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
  // Only reveal components up to the current unlocked tier
  const currentTierIndex = TIER_ORDER.indexOf(currentTier);
  const visibleCatalogue = catalogue.filter((comp) => {
    const compTierIndex = TIER_ORDER.indexOf(comp.tier);
    return compTierIndex <= currentTierIndex;
  });

  const [selectedCompId, setSelectedCompId] = React.useState<string>(
    visibleCatalogue[0]?.id || 't0_power_cable'
  );
  const [orderQty, setOrderQty] = React.useState<number>(100);
  const [renameInput, setRenameInput] = React.useState<string>('');
  const [priceInput, setPriceInput] = React.useState<number>(2.5);

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

  if (!selectedComp) {
    return (
      <div className="p-8 text-center font-mono text-gray-400">
        No components unlocked for this tier.
      </div>
    );
  }

  const totalCost = selectedComp.cost * orderQty;
  const canAfford = cash >= totalCost;

  // Car Company Tycoon inspired telemetry calculations
  const estimatedDefects = Math.round(orderQty * 0.05);
  const estimatedGoodUnits = orderQty - estimatedDefects;
  const estimatedBatchRevenue = estimatedGoodUnits * priceInput;
  const estimatedBatchProfit = estimatedBatchRevenue - totalCost;
  const unitMargin = priceInput - selectedComp.cost;
  const marginPercent = Math.round((unitMargin / (priceInput || 1)) * 100);

  // Price Elasticity / Market Acceptance Rating
  let marketAcceptance = 'High';
  let marketColor = 'text-emerald-400';
  if (priceInput > selectedComp.cost * 4.5) {
    marketAcceptance = 'Severe Resistance (Overpriced)';
    marketColor = 'text-rose-400';
  } else if (priceInput > selectedComp.cost * 3.2) {
    marketAcceptance = 'Moderate (Slower Conversion)';
    marketColor = 'text-amber-300';
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full select-none">
      {/* Component Listing (Filtered by Tier Fog of War) */}
      <div className="lg:col-span-5 bg-[#161b22] border border-[#30363d] rounded-2xl p-4 flex flex-col h-[700px]">
        <div className="pb-3 border-b border-[#30363d] mb-3 space-y-1">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-400" />
              Catalogue Telemetry
            </h3>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950/70 border border-emerald-500/40 text-emerald-400 font-bold">
              Fog of War: {currentTier}
            </span>
          </div>
          <p className="text-[11px] text-gray-400 font-mono">
            {visibleCatalogue.length} Components Unlocked ({currentTier === 'T0' ? 'T0 Basic Parts Only' : `T0 to ${currentTier} Active`})
          </p>
        </div>

        {/* Scrollable Component Cards */}
        <div className="flex-1 overflow-y-auto space-y-2 pr-1">
          {visibleCatalogue.map((comp) => {
            const partBranding = customParts[comp.id];
            const stock = inventory[comp.id]?.quantity || 0;
            const isSelected = comp.id === selectedComp.id;

            return (
              <div
                key={comp.id}
                onClick={() => setSelectedCompId(comp.id)}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all duration-150 ${
                  isSelected
                    ? 'bg-emerald-950/40 border-emerald-500 text-white shadow-md shadow-emerald-950/40'
                    : 'bg-[#0d1117] border-[#262c36] text-gray-300 hover:border-gray-500 hover:bg-[#12161f]'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-white leading-tight font-mono">
                      {partBranding?.customName || comp.name}
                    </h4>
                    <p className="text-[10px] text-gray-400 font-mono mt-0.5">
                      Model: {comp.id} • Tier: <strong className="text-emerald-400">{comp.tier}</strong>
                    </p>
                  </div>
                  <span className="text-xs font-mono text-emerald-400 font-bold">
                    ${comp.basePrice.toFixed(2)}
                  </span>
                </div>

                <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-[#262c36] text-[11px] font-mono">
                  <span className="text-gray-400">
                    Stock: <strong className={stock > 0 ? 'text-emerald-400' : 'text-gray-500'}>{stock} units</strong>
                  </span>
                  <span className="text-gray-400">
                    Quality: <span className="text-gray-200">{Math.round(comp.reliability * 100)}%</span>
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Fog of War Footer Indicator */}
        <div className="mt-3 pt-3 border-t border-[#262c36] flex items-center justify-between text-[11px] font-mono text-gray-500">
          <span className="flex items-center gap-1.5">
            <Eye className="w-3.5 h-3.5 text-emerald-400/70" />
            <span>Tier Fog of War Active</span>
          </span>
          <span>{currentTier === 'T0' ? 'Research T1 to reveal' : `Advancing to next tier`}</span>
        </div>
      </div>

      {/* Production Workbench & Custom Branding (Car Company Tycoon inspired) */}
      <div className="lg:col-span-7 space-y-5">
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
            className="w-full h-36 object-cover group-hover:scale-[1.02] transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#161b22] via-transparent to-transparent" />
          <div className="absolute top-2 left-3 bg-black/80 px-2.5 py-0.5 rounded-full border border-emerald-500/40 text-[10px] font-mono text-emerald-400 font-bold">
            {selectedComp.tier === 'T0' ? '1952 GARAGE WORKBENCH' : `${selectedComp.tier} INDUSTRIAL FABRICATION CELL`}
          </div>
          <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between text-[11px] font-mono text-gray-300">
            <span className="font-bold text-white">{customPart?.customName || selectedComp.name}</span>
            <span className="text-emerald-400">Yield: {Math.round(selectedComp.reliability * 100)}% Quality</span>
          </div>
        </div>

        {/* Part Branding & Pricing Card */}
        <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#30363d]">
            <div className="flex items-center gap-2.5">
              <Tag className="w-5 h-5 text-emerald-400" />
              <div>
                <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                  Custom Part Trademark & Price Setting
                </h3>
                <p className="text-[11px] text-gray-400">Name this component to accumulate brand reputation with customers</p>
              </div>
            </div>
            {customPart && (
              <div className="flex items-center gap-2 bg-[#0d1117] px-3 py-1 rounded-full border border-[#30363d]">
                <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-xs font-mono text-emerald-400">
                  Reputation: {customPart.reputation.toFixed(1)}/100
                </span>
                <span className="text-[11px] text-gray-400 font-mono">
                  (+{customPart.pricePremiumPct}% premium)
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
              <div className="flex gap-2">
                <input
                  type="text"
                  value={renameInput}
                  onChange={(e) => setRenameInput(e.target.value)}
                  className="flex-1 bg-[#0d1117] border border-[#30363d] rounded-xl px-3 py-1.5 text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
                />
                <button
                  onClick={() => onUpdatePartName(selectedComp.id, renameInput)}
                  className="px-3.5 py-1.5 text-xs font-bold font-mono bg-[#21262d] text-emerald-400 hover:bg-[#30363d] rounded-xl border border-[#30363d] transition-all"
                >
                  Save Brand
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1 font-mono">
                Retail Selling Price (USD)
              </label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <span className="absolute left-3 top-2 text-xs text-gray-500 font-mono">$</span>
                  <input
                    type="number"
                    step="0.1"
                    value={priceInput}
                    onChange={(e) => setPriceInput(parseFloat(e.target.value) || 0)}
                    className="w-full bg-[#0d1117] border border-[#30363d] rounded-xl pl-7 pr-3 py-1.5 text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <button
                  onClick={() => onUpdatePartPrice(selectedComp.id, priceInput)}
                  className="px-3.5 py-1.5 text-xs font-bold font-mono bg-[#21262d] text-emerald-400 hover:bg-[#30363d] rounded-xl border border-[#30363d] transition-all"
                >
                  Apply Price
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Production Order Workstation — Car Company Tycoon Inspired */}
        <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-5 space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-[#30363d]">
            <Package className="w-5 h-5 text-emerald-400" />
            <div>
              <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                Workbench Production Line
              </h3>
              <p className="text-[11px] text-gray-400">Configure batch run sliders, monitor defect rates and profit margins</p>
            </div>
          </div>

          {/* Metric Telemetry Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs font-mono">
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
              <span className="text-[10px] text-gray-500 uppercase block">Inventory In-Stock</span>
              <span className="text-sm font-bold text-white">{inv.quantity} units</span>
            </div>
          </div>

          {/* Batch Volume Slider & Tactile Selectors */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-gray-300 font-medium">Batch Run Size:</span>
              <div className="flex gap-2">
                {[50, 100, 200, 500, 1000].map((qty) => (
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
              <span className="font-mono text-xs font-bold text-white bg-[#0d1117] px-3.5 py-1.5 rounded-xl border border-[#30363d] min-w-[90px] text-center">
                {orderQty} units
              </span>
            </div>
          </div>

          {/* Telemetry Calculation Preview: Defect & Forecasted Profits */}
          <div className="bg-[#0b0e14] border border-[#262c36] rounded-xl p-3.5 grid grid-cols-2 sm:grid-cols-3 gap-3 text-[11px] font-mono">
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
          <div className="pt-3 border-t border-[#30363d] flex flex-col sm:flex-row items-center justify-between gap-3">
            <div>
              <span className="text-xs text-gray-400 block font-mono">Total Batch Fabrication Cost:</span>
              <span className="text-xl font-bold font-mono text-white">${totalCost.toFixed(2)}</span>
            </div>

            <button
              disabled={!canAfford}
              onClick={() => onOrderProduction(selectedComp.id, orderQty, selectedComp.cost)}
              className={`w-full sm:w-auto px-6 py-2.5 rounded-xl text-xs font-bold font-mono uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
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
              Insufficient capital: You require ${totalCost.toFixed(2)} but your treasury holds ${cash.toFixed(2)}.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
