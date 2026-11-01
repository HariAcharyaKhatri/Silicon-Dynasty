import React from 'react';
import { ComponentItem, Blueprint, TierId } from '../types/game';
import { validatePcBlueprint } from '../utils/compatibilityEngine';
import {
  Layers,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Zap,
  Shield,
  Save,
  Lock,
  ArrowRight,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Cpu,
  Monitor,
  Package,
} from 'lucide-react';
import Images from '../assets/images';

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

  const [cadStep, setCadStep] = React.useState<1 | 2 | 3>(1);
  const [modelName, setModelName] = React.useState('Apex-52 Microcomputer');
  const [sellingPrice, setSellingPrice] = React.useState<number>(950);

  // Component slot selections
  const [cpuId, setCpuId] = React.useState<string>(cpus[0]?.id || '');
  const [mbId, setMbId] = React.useState<string>(mbs[0]?.id || '');
  const [ramId, setRamId] = React.useState<string>(rams[0]?.id || '');
  const [psuId, setPsuId] = React.useState<string>(psus[0]?.id || '');
  const [coolingId, setCoolingId] = React.useState<string>(coolings[0]?.id || '');
  const [caseId, setCaseId] = React.useState<string>(cases[0]?.id || '');

  // Blueprint pagination
  const [bpPage, setBpPage] = React.useState<number>(1);
  const BP_PAGE_SIZE = 3;

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
      <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-6 sm:p-8 text-center space-y-6 max-w-2xl mx-auto my-6 select-none overflow-hidden animate-tab-fade">
        {/* Humble Garage Visual */}
        <div className="rounded-xl overflow-hidden border border-[#30363d] bg-black/60 relative">
          <img
            src={Images.garageOrigin}
            alt="1952 Garage Origin Workshop"
            className="w-full h-36 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#161b22] via-transparent to-transparent" />
          <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between text-[10px] font-mono text-emerald-400">
            <span className="bg-black/80 px-2 py-0.5 rounded border border-emerald-500/40">1952 GARAGE OPERATIONS</span>
            <span>$10,000 STARTING CAPITAL</span>
          </div>
        </div>

        <div className="space-y-2 font-mono">
          <span className="text-[11px] px-3 py-1 rounded bg-amber-950/60 text-amber-300 border border-amber-500/40 uppercase font-bold tracking-widest inline-block">
            TIER FOG OF WAR ACTIVE — LOCKED
          </span>
          <h3 className="text-xl font-bold text-white uppercase tracking-wide">
            Turnkey Computer Assembly Unavailable at Tier 0
          </h3>
          <p className="text-xs text-gray-400 leading-relaxed max-w-lg mx-auto">
            You are operating in a basic garage workshop producing discrete wiring and switches. To design full microcomputers and backplanes, you must conduct R&amp;D and construct a Small Workshop.
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
          className="px-6 py-3 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-black font-bold font-mono text-xs uppercase tracking-wider flex items-center gap-2 mx-auto transition-all shadow-lg shadow-emerald-500/20 active:scale-[0.98]"
        >
          Open Research Lab &amp; Assign Engineers <ArrowRight className="w-4 h-4" />
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

  // Blueprint pagination calculations
  const totalBpPages = Math.max(1, Math.ceil(blueprints.length / BP_PAGE_SIZE));
  const paginatedBlueprints = blueprints.slice(
    (bpPage - 1) * BP_PAGE_SIZE,
    bpPage * BP_PAGE_SIZE
  );

  return (
    <div className="space-y-4 select-none font-mono animate-tab-fade">
      {/* 3-Step Guided CAD Header & Navigation */}
      <div className="bg-[#161b22] border border-[#30363d] p-3 rounded-2xl flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Layers className="w-5 h-5 text-emerald-400" />
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              Computer Design Studio &amp; CAD
            </h3>
            <p className="text-[11px] text-gray-400">Assemble verified compatible parts into a commercial machine</p>
          </div>
        </div>

        {/* Step Indicator Pills */}
        <div className="flex items-center gap-1.5 text-xs">
          {[
            { step: 1, label: '1. Core' },
            { step: 2, label: '2. Chassis & Power' },
            { step: 3, label: '3. Verification' },
          ].map((s) => (
            <button
              key={s.step}
              onClick={() => setCadStep(s.step as any)}
              className={`px-3 py-1.5 rounded-xl border transition-all ${
                cadStep === s.step
                  ? 'bg-emerald-500 text-black font-bold border-emerald-400 shadow-md shadow-emerald-500/20'
                  : 'bg-[#0d1117] text-gray-300 border-[#262c36] hover:text-white'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* ======================================================== */}
        {/* LEFT COLUMN: 3-Step CAD Workspace Form                  */}
        {/* ======================================================== */}
        <div className="lg:col-span-8 bg-[#161b22] border border-[#30363d] rounded-2xl p-4 sm:p-5 space-y-5">
          {/* STEP 1: Core Processing Architecture */}
          {cadStep === 1 && (
            <div className="space-y-4 animate-tab-fade">
              <div className="pb-3 border-b border-[#30363d] flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-emerald-400 uppercase font-bold tracking-wider block">STEP 1 OF 3</span>
                  <h4 className="text-sm font-bold text-white">Core Processing Architecture</h4>
                </div>
                <span className="text-xs px-2.5 py-1 rounded bg-[#0d1117] text-gray-300 border border-[#30363d]">
                  BOM Subtotal: ${(selectedComps[0]?.cost || 0) + (selectedComps[1]?.cost || 0) + (selectedComps[2]?.cost || 0)}
                </span>
              </div>

              {/* Model & Price Input */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">Commercial Model Name</label>
                  <input
                    type="text"
                    value={modelName}
                    onChange={(e) => setModelName(e.target.value)}
                    className="w-full bg-[#0d1117] border border-[#30363d] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">Target Selling Retail Price</label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-xs text-gray-500">$</span>
                    <input
                      type="number"
                      value={sellingPrice}
                      onChange={(e) => setSellingPrice(parseFloat(e.target.value) || 0)}
                      className="w-full bg-[#0d1117] border border-[#30363d] rounded-xl pl-7 pr-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>
              </div>

              {/* CPU Selection */}
              <div className="bg-[#0d1117] p-3.5 rounded-xl border border-[#262c36] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase text-gray-400 font-bold block">CPU / ALU Architecture</span>
                  <span className="text-xs text-emerald-400 font-bold">
                    ${catalogue.find((c) => c.id === cpuId)?.cost || 0}
                  </span>
                </div>
                <select
                  value={cpuId}
                  onChange={(e) => setCpuId(e.target.value)}
                  className="w-full bg-[#161b22] border border-[#30363d] text-xs text-gray-200 rounded-lg p-2.5 focus:outline-none focus:border-emerald-500"
                >
                  {cpus.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} (${c.cost}) [{c.socket || 'N/A'}] — Power: {c.powerDraw || 25}W
                    </option>
                  ))}
                </select>
              </div>

              {/* Motherboard Selection */}
              <div className="bg-[#0d1117] p-3.5 rounded-xl border border-[#262c36] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase text-gray-400 font-bold block">Motherboard / Backplane</span>
                  <span className="text-xs text-emerald-400 font-bold">
                    ${catalogue.find((c) => c.id === mbId)?.cost || 0}
                  </span>
                </div>
                <select
                  value={mbId}
                  onChange={(e) => setMbId(e.target.value)}
                  className="w-full bg-[#161b22] border border-[#30363d] text-xs text-gray-200 rounded-lg p-2.5 focus:outline-none focus:border-emerald-500"
                >
                  {mbs.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} (${c.cost}) [{c.socket || 'N/A'}] — {c.ramType || 'Standard'} RAM
                    </option>
                  ))}
                </select>
              </div>

              {/* RAM Selection */}
              <div className="bg-[#0d1117] p-3.5 rounded-xl border border-[#262c36] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase text-gray-400 font-bold block">System Memory (RAM)</span>
                  <span className="text-xs text-emerald-400 font-bold">
                    ${catalogue.find((c) => c.id === ramId)?.cost || 0}
                  </span>
                </div>
                <select
                  value={ramId}
                  onChange={(e) => setRamId(e.target.value)}
                  className="w-full bg-[#161b22] border border-[#30363d] text-xs text-gray-200 rounded-lg p-2.5 focus:outline-none focus:border-emerald-500"
                >
                  {rams.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} (${c.cost}) — Capacity: {c.ramCapacityMb || 1}MB
                    </option>
                  ))}
                </select>
              </div>

              {/* Step 1 Next Button */}
              <div className="pt-3 border-t border-[#30363d] flex justify-end">
                <button
                  onClick={() => setCadStep(2)}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-black font-bold text-xs uppercase flex items-center justify-center gap-2 transition-all shadow-md active:scale-[0.98]"
                >
                  Next: Chassis &amp; Power <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Thermal, Power & Enclosure */}
          {cadStep === 2 && (
            <div className="space-y-4 animate-tab-fade">
              <div className="pb-3 border-b border-[#30363d] flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-emerald-400 uppercase font-bold tracking-wider block">STEP 2 OF 3</span>
                  <h4 className="text-sm font-bold text-white">Power, Thermal &amp; Enclosure</h4>
                </div>
                <span className="text-xs px-2.5 py-1 rounded bg-[#0d1117] text-gray-300 border border-[#30363d]">
                  BOM Total: ${totalCost.toFixed(2)}
                </span>
              </div>

              {/* PSU Slot */}
              <div className="bg-[#0d1117] p-3.5 rounded-xl border border-[#262c36] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase text-gray-400 font-bold block">Power Supply (PSU)</span>
                  <span className="text-xs text-emerald-400 font-bold">
                    ${catalogue.find((c) => c.id === psuId)?.cost || 0}
                  </span>
                </div>
                <select
                  value={psuId}
                  onChange={(e) => setPsuId(e.target.value)}
                  className="w-full bg-[#161b22] border border-[#30363d] text-xs text-gray-200 rounded-lg p-2.5 focus:outline-none focus:border-emerald-500"
                >
                  {psus.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} (${c.cost}) — Capacity: {c.powerOutput || 150}W
                    </option>
                  ))}
                </select>
              </div>

              {/* Cooling Slot */}
              <div className="bg-[#0d1117] p-3.5 rounded-xl border border-[#262c36] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase text-gray-400 font-bold block">Cooling Architecture</span>
                  <span className="text-xs text-emerald-400 font-bold">
                    ${catalogue.find((c) => c.id === coolingId)?.cost || 0}
                  </span>
                </div>
                <select
                  value={coolingId}
                  onChange={(e) => setCoolingId(e.target.value)}
                  className="w-full bg-[#161b22] border border-[#30363d] text-xs text-gray-200 rounded-lg p-2.5 focus:outline-none focus:border-emerald-500"
                >
                  {coolings.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} (${c.cost}) — TDP Rating: {c.tdpRating || 65}W
                    </option>
                  ))}
                </select>
              </div>

              {/* Chassis Slot */}
              <div className="bg-[#0d1117] p-3.5 rounded-xl border border-[#262c36] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase text-gray-400 font-bold block">Enclosure Case</span>
                  <span className="text-xs text-emerald-400 font-bold">
                    ${catalogue.find((c) => c.id === caseId)?.cost || 0}
                  </span>
                </div>
                <select
                  value={caseId}
                  onChange={(e) => setCaseId(e.target.value)}
                  className="w-full bg-[#161b22] border border-[#30363d] text-xs text-gray-200 rounded-lg p-2.5 focus:outline-none focus:border-emerald-500"
                >
                  {cases.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} (${c.cost}) — Form Factor: {c.formFactor || 'Standard Desktop'}
                    </option>
                  ))}
                </select>
              </div>

              {/* Step 2 Buttons */}
              <div className="pt-3 border-t border-[#30363d] flex items-center justify-between gap-3">
                <button
                  onClick={() => setCadStep(1)}
                  className="px-4 py-2 rounded-xl bg-[#0d1117] border border-[#30363d] text-gray-300 hover:text-white text-xs flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-4 h-4" /> Back to Core
                </button>
                <button
                  onClick={() => setCadStep(3)}
                  className="px-5 py-2.5 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-black font-bold text-xs uppercase flex items-center gap-2 transition-all shadow-md active:scale-[0.98]"
                >
                  Next: Verify &amp; Build <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Verification & Blueprint Registry */}
          {cadStep === 3 && (
            <div className="space-y-4 animate-tab-fade">
              <div className="pb-3 border-b border-[#30363d] flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-emerald-400 uppercase font-bold tracking-wider block">STEP 3 OF 3</span>
                  <h4 className="text-sm font-bold text-white">Compatibility Audit &amp; Build</h4>
                </div>
                <span className="text-xs font-bold font-mono px-3 py-1 rounded bg-[#0d1117] text-emerald-400 border border-emerald-500/40">
                  {validation.isValid ? 'ALL TESTS PASSED' : 'REVISION NEEDED'}
                </span>
              </div>

              {/* Critical Incompatibilities */}
              {validation.errors.length > 0 && (
                <div className="space-y-2">
                  <span className="text-xs font-bold text-rose-400 uppercase tracking-wider block flex items-center gap-1.5">
                    <XCircle className="w-4 h-4" /> Critical Incompatibilities ({validation.errors.length})
                  </span>
                  {validation.errors.map((err, i) => (
                    <div
                      key={i}
                      className="bg-rose-950/30 border border-rose-500/40 p-3 rounded-xl text-xs text-rose-200 leading-snug flex items-start gap-2"
                    >
                      <XCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                      <span>{err}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Engineering Advisories */}
              {validation.warnings.length > 0 && (
                <div className="space-y-2">
                  <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4" /> Engineering Advisories ({validation.warnings.length})
                  </span>
                  {validation.warnings.map((warn, i) => (
                    <div
                      key={i}
                      className="bg-amber-950/30 border border-amber-500/40 p-3 rounded-xl text-xs text-amber-200 leading-snug flex items-start gap-2"
                    >
                      <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      <span>{warn}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Blueprint Summary Card */}
              <div className="bg-[#0d1117] p-4 rounded-xl border border-[#262c36] space-y-2 text-xs">
                <div className="flex justify-between text-gray-300">
                  <span>Bill of Materials (BOM) Cost:</span>
                  <strong className="text-white">${totalCost.toFixed(2)}</strong>
                </div>
                <div className="flex justify-between text-gray-300">
                  <span>Retail Price:</span>
                  <strong className="text-emerald-400">${sellingPrice.toFixed(2)}</strong>
                </div>
                <div className="flex justify-between text-gray-300">
                  <span>Gross Profit Margin:</span>
                  <strong className="text-amber-300">
                    ${(sellingPrice - totalCost).toFixed(2)} ({Math.round(((sellingPrice - totalCost) / Math.max(1, sellingPrice)) * 100)}%)
                  </strong>
                </div>
              </div>

              {/* Step 3 Navigation & Save Action */}
              <div className="pt-3 border-t border-[#30363d] flex flex-col sm:flex-row items-center justify-between gap-3">
                <button
                  onClick={() => setCadStep(2)}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-[#0d1117] border border-[#30363d] text-gray-300 hover:text-white text-xs flex items-center justify-center gap-1.5"
                >
                  <ArrowLeft className="w-4 h-4" /> Back to Chassis
                </button>

                <button
                  onClick={handleSave}
                  disabled={!validation.isValid}
                  className={`w-full sm:w-auto px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
                    validation.isValid
                      ? 'bg-emerald-400 text-black hover:bg-emerald-300 shadow-lg shadow-emerald-500/20 active:scale-[0.98]'
                      : 'bg-gray-800 text-gray-500 cursor-not-allowed border border-[#30363d]'
                  }`}
                >
                  <Save className="w-4 h-4" /> Save Commercial Blueprint
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ======================================================== */}
        {/* RIGHT COLUMN: Live Diagnostic HUD & Saved Blueprints    */}
        {/* ======================================================== */}
        <div className="lg:col-span-4 space-y-4">
          {/* Live Diagnostic HUD Card */}
          <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-4 sm:p-5 space-y-3.5 shadow-xl">
            <div className="flex items-center justify-between pb-2 border-b border-[#30363d]">
              <span className="text-xs font-bold text-white uppercase">Live CAD Diagnostics</span>
              {validation.isValid ? (
                <span className="flex items-center gap-1 text-xs font-bold text-emerald-400">
                  <CheckCircle2 className="w-4 h-4" /> READY
                </span>
              ) : (
                <span className="flex items-center gap-1 text-xs font-bold text-rose-400">
                  <XCircle className="w-4 h-4" /> BLOCKED
                </span>
              )}
            </div>

            <div className="grid grid-cols-2 gap-2.5 text-xs">
              <div className="bg-[#0d1117] p-2.5 rounded-xl border border-[#262c36]">
                <span className="text-[10px] text-gray-500 uppercase block">Power Consumption</span>
                <span className="font-bold text-white flex items-center gap-1 mt-0.5">
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                  {validation.calculatedPowerDraw} W
                </span>
              </div>

              <div className="bg-[#0d1117] p-2.5 rounded-xl border border-[#262c36]">
                <span className="text-[10px] text-gray-500 uppercase block">Reliability</span>
                <span className="font-bold text-emerald-400 flex items-center gap-1 mt-0.5">
                  <Shield className="w-3.5 h-3.5 text-emerald-400" />
                  {Math.round(validation.calculatedReliability * 100)}%
                </span>
              </div>
            </div>

            <div className="bg-[#0d1117] p-2.5 rounded-xl border border-[#262c36] text-xs">
              <span className="text-[10px] text-gray-500 uppercase block">Computed Performance Rating</span>
              <span className="text-sm font-bold text-white">
                {validation.calculatedPerformance} / 100 Appeal Score
              </span>
            </div>
          </div>

          {/* Paginated Blueprint Library Card */}
          <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-4 sm:p-5 space-y-3 shadow-xl">
            <div className="flex items-center justify-between pb-2 border-b border-[#30363d]">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Package className="w-4 h-4 text-emerald-400" />
                Blueprint Library ({blueprints.length})
              </h4>
              <span className="text-[10px] text-gray-400">
                Page {bpPage} of {totalBpPages}
              </span>
            </div>

            {blueprints.length === 0 ? (
              <p className="text-xs text-gray-500 p-3 bg-[#0d1117] rounded-xl border border-[#262c36] text-center">
                No computer blueprints saved yet. Finish the 3-step design flow to assemble your first machine.
              </p>
            ) : (
              <div className="space-y-2">
                {paginatedBlueprints.map((bp) => (
                  <div
                    key={bp.id}
                    className="bg-[#0d1117] p-2.5 rounded-xl border border-[#262c36] flex items-center justify-between text-xs"
                  >
                    <div className="min-w-0 pr-2">
                      <span className="font-bold text-white block truncate">{bp.name}</span>
                      <span className="text-[10px] text-gray-400 font-mono block mt-0.5">
                        Cost: ${bp.totalCost.toFixed(0)} | Retail: ${bp.sellingPrice.toFixed(0)}
                      </span>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-500/40 text-emerald-400 font-bold shrink-0">
                      {bp.unitsSold} Sold
                    </span>
                  </div>
                ))}

                {/* Blueprint Pagination Controls */}
                {totalBpPages > 1 && (
                  <div className="pt-2 flex items-center justify-between border-t border-[#262c36] text-xs">
                    <button
                      disabled={bpPage <= 1}
                      onClick={() => setBpPage((p) => Math.max(1, p - 1))}
                      className="px-2 py-1 rounded bg-[#0d1117] border border-[#30363d] text-gray-300 disabled:opacity-30 text-[11px]"
                    >
                      Prev
                    </button>
                    <span className="text-[10px] text-gray-500">
                      {bpPage} / {totalBpPages}
                    </span>
                    <button
                      disabled={bpPage >= totalBpPages}
                      onClick={() => setBpPage((p) => Math.min(totalBpPages, p + 1))}
                      className="px-2 py-1 rounded bg-[#0d1117] border border-[#30363d] text-gray-300 disabled:opacity-30 text-[11px]"
                    >
                      Next
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
