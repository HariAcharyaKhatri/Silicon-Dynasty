import React from 'react';
import { ComponentItem, Blueprint, TierId } from '../types/game';
import { validatePcBlueprint } from '../utils/compatibilityEngine';
import { Layers, CheckCircle2, AlertTriangle, XCircle, Zap, Shield, Save, Lock, ArrowRight } from 'lucide-react';

interface Props {
  catalogue: ComponentItem[];
  blueprints: Blueprint[];
  currentTier: TierId;
  onSaveBlueprint: (bp: Blueprint) => void;
  onNavigateToResearch: () => void;
}

const TIER_ORDER: TierId[] = ['T0', 'T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];

export const DesignStudioTab: React.FC<Props> = ({
  catalogue,
  blueprints,
  currentTier,
  onSaveBlueprint,
  onNavigateToResearch,
}) => {
  const currentTierIndex = TIER_ORDER.indexOf(currentTier);

  // Filter catalogue by Tier Fog of War
  const visibleCatalogue = catalogue.filter((comp) => {
    const compTierIndex = TIER_ORDER.indexOf(comp.tier);
    return compTierIndex <= currentTierIndex;
  });

  const cpus = visibleCatalogue.filter((c) => c.category === 'cpu');
  const mbs = visibleCatalogue.filter((c) => c.category === 'motherboard');
  const rams = visibleCatalogue.filter((c) => c.category === 'ram');
  const psus = visibleCatalogue.filter((c) => c.category === 'psu');
  const coolings = visibleCatalogue.filter((c) => c.category === 'cooling');
  const cases = visibleCatalogue.filter((c) => c.category === 'case');

  const [modelName, setModelName] = React.useState('Apex-52 Microcomputer');
  const [sellingPrice, setSellingPrice] = React.useState<number>(950);

  // Component slot selections
  const [cpuId, setCpuId] = React.useState<string>(cpus[0]?.id || '');
  const [mbId, setMbId] = React.useState<string>(mbs[0]?.id || '');
  const [ramId, setRamId] = React.useState<string>(rams[0]?.id || '');
  const [psuId, setPsuId] = React.useState<string>(psus[0]?.id || '');
  const [coolingId, setCoolingId] = React.useState<string>(coolings[0]?.id || '');
  const [caseId, setCaseId] = React.useState<string>(cases[0]?.id || '');

  React.useEffect(() => {
    if (!cpuId && cpus[0]) setCpuId(cpus[0].id);
    if (!mbId && mbs[0]) setMbId(mbs[0].id);
    if (!ramId && rams[0]) setRamId(rams[0].id);
    if (!psuId && psus[0]) setPsuId(psus[0].id);
    if (!coolingId && coolings[0]) setCoolingId(coolings[0].id);
    if (!caseId && cases[0]) setCaseId(cases[0].id);
  }, [visibleCatalogue]);

  // If at Tier 0, full system CAD is sealed under Fog of War
  if (currentTier === 'T0' || (cpus.length === 0 && mbs.length === 0)) {
    return (
      <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-8 text-center space-y-6 max-w-2xl mx-auto my-6 select-none overflow-hidden">
        {/* Humble Garage Visual */}
        <div className="rounded-xl overflow-hidden border border-[#30363d] bg-black/60 relative">
          <img 
            src="/images/garage_origin.svg" 
            alt="1952 Garage Origin Workshop" 
            className="w-full h-36 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#161b22] via-transparent to-transparent" />
          <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between text-[10px] font-mono text-emerald-400">
            <span className="bg-black/80 px-2 py-0.5 rounded border border-emerald-500/40">1952 GARAGE OPERATIONS</span>
            <span>$10,000 STARTING CAPITAL</span>
          </div>
        </div>

        <div className="space-y-2">
          <span className="text-[11px] font-mono px-3 py-1 rounded bg-amber-950/60 text-amber-300 border border-amber-500/40 uppercase font-bold tracking-widest">
            TIER FOG OF WAR ACTIVE — LOCKED
          </span>
          <h3 className="text-xl font-bold text-white font-mono uppercase tracking-wide">
            Turnkey Computer Assembly Unavailable at Tier 0
          </h3>
          <p className="text-xs text-gray-400 font-mono leading-relaxed max-w-lg mx-auto">
            You are operating in a basic garage workshop producing discrete wiring and switches. To design full microcomputers and backplanes, you must conduct R&D and construct a Small Workshop.
          </p>
        </div>

        <div className="bg-[#0d1117] border border-[#262c36] p-4 rounded-xl text-xs font-mono text-left space-y-2 max-w-md mx-auto">
          <span className="text-emerald-400 font-bold block">TIER 1 PREREQUISITES:</span>
          <div className="flex items-center justify-between text-gray-300">
            <span>1. Research 'Passive Component Manufacturing'</span>
            <span className="text-amber-400">80 HW-RP</span>
          </div>
          <div className="flex items-center justify-between text-gray-300">
            <span>2. Construct Small Workshop</span>
            <span className="text-amber-400">$5,000 Cash</span>
          </div>
        </div>

        <button
          onClick={onNavigateToResearch}
          className="px-6 py-3 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-black font-bold font-mono text-xs uppercase tracking-wider flex items-center gap-2 mx-auto transition-all shadow-lg shadow-emerald-500/20"
        >
          Open Research Lab & Assign Engineers <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    );
  }

  // Compute BOM total cost
  const selectedComps = [
    catalogue.find((c) => c.id === cpuId),
    catalogue.find((c) => c.id === mbId),
    catalogue.find((c) => c.id === ramId),
    catalogue.find((c) => c.id === psuId),
    catalogue.find((c) => c.id === coolingId),
    catalogue.find((c) => c.id === caseId),
  ].filter(Boolean) as ComponentItem[];

  const totalCost = selectedComps.reduce((acc, c) => acc + c.cost, 0);

  // Transient blueprint for live validation
  const currentBlueprint: Blueprint = {
    id: `bp_${Date.now()}`,
    name: modelName,
    type: 'pc',
    tier: currentTier,
    components: {
      cpu: cpuId,
      motherboard: mbId,
      ram: ramId,
      psu: psuId,
      cooling: coolingId,
      case: caseId,
    },
    totalCost,
    sellingPrice,
    isValid: false,
    validationErrors: [],
    validationWarnings: [],
    appealScore: 70,
    unitsSold: 0,
    activeProduction: false,
  };

  const validation = validatePcBlueprint(currentBlueprint, catalogue);

  const handleSave = () => {
    onSaveBlueprint({
      ...currentBlueprint,
      isValid: validation.isValid,
      validationErrors: validation.errors,
      validationWarnings: validation.warnings,
      appealScore: validation.calculatedPerformance,
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 select-none font-mono">
      {/* Slot Selector Column */}
      <div className="lg:col-span-2 bg-[#161b22] border border-[#30363d] rounded-2xl p-5 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#30363d]">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-emerald-400" />
            <div>
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                Computer Design Studio & Blueprint CAD
              </h3>
              <p className="text-[11px] text-gray-400">Assemble verified compatible parts into a marketable commercial machine</p>
            </div>
          </div>
          <span className="text-xs font-mono px-3 py-1 rounded-xl bg-[#0d1117] text-gray-300 border border-[#30363d]">
            BOM Cost: <strong className="text-white">${totalCost.toFixed(2)}</strong>
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1">Model Name</label>
            <input
              type="text"
              value={modelName}
              onChange={(e) => setModelName(e.target.value)}
              className="w-full bg-[#0d1117] border border-[#30363d] rounded-xl px-3 py-1.5 text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1">Selling Retail Price (USD)</label>
            <div className="relative">
              <span className="absolute left-3 top-2 text-xs text-gray-500">$</span>
              <input
                type="number"
                value={sellingPrice}
                onChange={(e) => setSellingPrice(parseFloat(e.target.value) || 0)}
                className="w-full bg-[#0d1117] border border-[#30363d] rounded-xl pl-7 pr-3 py-1.5 text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>
        </div>

        {/* Component Slot Selectors */}
        <div className="space-y-3 pt-2">
          {/* CPU Slot */}
          <div className="bg-[#0d1117] p-3 rounded-xl border border-[#262c36] flex flex-col md:flex-row md:items-center justify-between gap-2">
            <div>
              <span className="text-[10px] uppercase text-gray-500 block">CPU / ALU Architecture</span>
              <span className="text-xs font-bold text-white">
                {catalogue.find((c) => c.id === cpuId)?.name || 'None Selected'}
              </span>
            </div>
            <select
              value={cpuId}
              onChange={(e) => setCpuId(e.target.value)}
              className="bg-[#161b22] border border-[#30363d] text-xs text-gray-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-emerald-500"
            >
              {cpus.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} (${c.cost}) [{c.socket || 'N/A'}]
                </option>
              ))}
            </select>
          </div>

          {/* Motherboard Slot */}
          <div className="bg-[#0d1117] p-3 rounded-xl border border-[#262c36] flex flex-col md:flex-row md:items-center justify-between gap-2">
            <div>
              <span className="text-[10px] uppercase text-gray-500 block">Motherboard / Backplane</span>
              <span className="text-xs font-bold text-white">
                {catalogue.find((c) => c.id === mbId)?.name || 'None Selected'}
              </span>
            </div>
            <select
              value={mbId}
              onChange={(e) => setMbId(e.target.value)}
              className="bg-[#161b22] border border-[#30363d] text-xs text-gray-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-emerald-500"
            >
              {mbs.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} (${c.cost}) [{c.socket || 'N/A'}]
                </option>
              ))}
            </select>
          </div>

          {/* RAM Slot */}
          <div className="bg-[#0d1117] p-3 rounded-xl border border-[#262c36] flex flex-col md:flex-row md:items-center justify-between gap-2">
            <div>
              <span className="text-[10px] uppercase text-gray-500 block">Memory (RAM) Module</span>
              <span className="text-xs font-bold text-white">
                {catalogue.find((c) => c.id === ramId)?.name || 'None Selected'}
              </span>
            </div>
            <select
              value={ramId}
              onChange={(e) => setRamId(e.target.value)}
              className="bg-[#161b22] border border-[#30363d] text-xs text-gray-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-emerald-500"
            >
              {rams.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} (${c.cost}) [{c.ramType || 'N/A'}]
                </option>
              ))}
            </select>
          </div>

          {/* PSU Slot */}
          <div className="bg-[#0d1117] p-3 rounded-xl border border-[#262c36] flex flex-col md:flex-row md:items-center justify-between gap-2">
            <div>
              <span className="text-[10px] uppercase text-gray-500 block">Power Supply Unit</span>
              <span className="text-xs font-bold text-white">
                {catalogue.find((c) => c.id === psuId)?.name || 'None Selected'}
              </span>
            </div>
            <select
              value={psuId}
              onChange={(e) => setPsuId(e.target.value)}
              className="bg-[#161b22] border border-[#30363d] text-xs text-gray-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-emerald-500"
            >
              {psus.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} (${c.cost}) [{c.powerOutput}W]
                </option>
              ))}
            </select>
          </div>

          {/* Cooling & Case */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="bg-[#0d1117] p-3 rounded-xl border border-[#262c36]">
              <span className="text-[10px] uppercase text-gray-500 block mb-1">Cooling Heatsink</span>
              <select
                value={coolingId}
                onChange={(e) => setCoolingId(e.target.value)}
                className="w-full bg-[#161b22] border border-[#30363d] text-xs text-gray-200 rounded-lg px-2 py-1 focus:outline-none"
              >
                {coolings.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} (${c.cost})
                  </option>
                ))}
              </select>
            </div>

            <div className="bg-[#0d1117] p-3 rounded-xl border border-[#262c36]">
              <span className="text-[10px] uppercase text-gray-500 block mb-1">Chassis / Enclosure</span>
              <select
                value={caseId}
                onChange={(e) => setCaseId(e.target.value)}
                className="w-full bg-[#161b22] border border-[#30363d] text-xs text-gray-200 rounded-lg px-2 py-1 focus:outline-none"
              >
                {cases.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} (${c.cost})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Realtime Compatibility Engine Status */}
      <div className="space-y-4">
        {/* Architectural Motherboard PCB Graphic */}
        <div className="rounded-2xl overflow-hidden border border-[#30363d] bg-black/60 relative group shadow-lg">
          <img 
            src="/images/motherboard_pcb.svg" 
            alt="Motherboard Circuit Blueprint" 
            className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#161b22] via-transparent to-transparent" />
          <div className="absolute top-2 left-2.5 bg-black/80 px-2.5 py-0.5 rounded-full border border-emerald-500/40 text-[9px] font-mono text-emerald-400 font-bold">
            SYSTEM INTERCONNECT TOPOLOGY
          </div>
          <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between text-[10px] font-mono text-gray-300">
            <span className="text-emerald-400 font-bold">PCB BUS TRACE VERIFIED</span>
            <span>24 Compatibility Rules Active</span>
          </div>
        </div>

        <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#30363d]">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              Compatibility Verification
            </h3>
            {validation.isValid ? (
              <span className="flex items-center gap-1 text-xs font-bold text-emerald-400 font-mono">
                <CheckCircle2 className="w-4 h-4" /> PASS
              </span>
            ) : (
              <span className="flex items-center gap-1 text-xs font-bold text-rose-400 font-mono">
                <XCircle className="w-4 h-4" /> INVALID
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="bg-[#0d1117] p-2.5 rounded-xl border border-[#262c36]">
              <span className="text-[10px] text-gray-500 uppercase block">Power Consumption</span>
              <span className="font-bold text-white flex items-center gap-1">
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                {validation.calculatedPowerDraw} W
              </span>
            </div>

            <div className="bg-[#0d1117] p-2.5 rounded-xl border border-[#262c36]">
              <span className="text-[10px] text-gray-500 uppercase block">Reliability</span>
              <span className="font-bold text-emerald-400 flex items-center gap-1">
                <Shield className="w-3.5 h-3.5 text-emerald-400" />
                {Math.round(validation.calculatedReliability * 100)}%
              </span>
            </div>
          </div>

          {/* Errors list */}
          {validation.errors.length > 0 && (
            <div className="space-y-2">
              <span className="text-[11px] font-bold text-rose-400 uppercase tracking-wider block">
                Critical Incompatibilities ({validation.errors.length})
              </span>
              {validation.errors.map((err, i) => (
                <div
                  key={i}
                  className="bg-rose-950/30 border border-rose-500/40 p-2.5 rounded-xl text-xs text-rose-200 leading-snug flex items-start gap-2"
                >
                  <XCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <span>{err}</span>
                </div>
              ))}
            </div>
          )}

          {/* Warnings list */}
          {validation.warnings.length > 0 && (
            <div className="space-y-2">
              <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider block">
                Engineering Advisories ({validation.warnings.length})
              </span>
              {validation.warnings.map((warn, i) => (
                <div
                  key={i}
                  className="bg-amber-950/30 border border-amber-500/40 p-2.5 rounded-xl text-xs text-amber-200 leading-snug flex items-start gap-2"
                >
                  <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span>{warn}</span>
                </div>
              ))}
            </div>
          )}

          <div className="pt-3 border-t border-[#30363d]">
            <button
              onClick={handleSave}
              disabled={!validation.isValid}
              className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 uppercase tracking-wider ${
                validation.isValid
                  ? 'bg-emerald-400 text-black hover:bg-emerald-300 shadow-lg shadow-emerald-500/20 active:scale-[0.98]'
                  : 'bg-gray-800 text-gray-500 cursor-not-allowed border border-[#30363d]'
              }`}
            >
              <Save className="w-4 h-4" />
              Save Commercial Blueprint
            </button>
          </div>
        </div>

        {/* Existing Blueprints saved */}
        <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-4 space-y-2">
          <h4 className="text-xs font-bold text-gray-300 uppercase tracking-wider">
            Registered Blueprints ({blueprints.length})
          </h4>
          {blueprints.length === 0 ? (
            <p className="text-xs text-gray-500">No computer designs saved yet.</p>
          ) : (
            <div className="space-y-2">
              {blueprints.map((bp) => (
                <div
                  key={bp.id}
                  className="bg-[#0d1117] p-2.5 rounded-xl border border-[#262c36] flex items-center justify-between text-xs"
                >
                  <div>
                    <span className="font-bold text-white block">{bp.name}</span>
                    <span className="text-[10px] text-gray-400 font-mono">
                      Cost: ${bp.totalCost.toFixed(0)} | Retail: ${bp.sellingPrice.toFixed(0)}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-500/40 text-emerald-400 font-bold">
                    {bp.unitsSold} Sold
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
