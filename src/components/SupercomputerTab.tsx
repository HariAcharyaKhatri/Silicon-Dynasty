import React from 'react';
import { ComponentItem, SuperContract, Blueprint } from '../types/game';
import { validateSupercomputerBlueprint } from '../utils/compatibilityEngine';
import { Server, Zap, Shield, FileCheck, CheckCircle2, AlertTriangle, XCircle, Award } from 'lucide-react';

interface Props {
  catalogue: ComponentItem[];
  contracts: SuperContract[];
  cash: number;
  onBidContract: (contractId: string, blueprint: Blueprint) => void;
}

export const SupercomputerTab: React.FC<Props> = ({
  catalogue,
  contracts,
  cash,
  onBidContract,
}) => {
  const [arrayName, setArrayName] = React.useState('Apex Hyperion Cluster I');
  const [computeCount, setComputeCount] = React.useState<number>(8);

  const [bladeId, setBladeId] = React.useState<string>('cpu_vector_unit');
  const [interconnectId, setInterconnectId] = React.useState<string>('t2_s100_backplane');
  const [coolingId, setCoolingId] = React.useState<string>('cool_chilled_liquid');
  const [psuId, setPsuId] = React.useState<string>('psu_industrial_array');

  const blades = catalogue.filter((c) => c.category === 'cpu');
  const interconnects = catalogue.filter((c) => c.category === 'motherboard');
  const coolings = catalogue.filter((c) => c.category === 'cooling');
  const psus = catalogue.filter((c) => c.category === 'psu');

  const selectedBlade = catalogue.find((c) => c.id === bladeId);
  const selectedInterconnect = catalogue.find((c) => c.id === interconnectId);
  const selectedCooling = catalogue.find((c) => c.id === coolingId);
  const selectedPsu = catalogue.find((c) => c.id === psuId);

  const arrayCost =
    (selectedBlade?.cost || 0) * computeCount +
    (selectedInterconnect?.cost || 0) +
    (selectedCooling?.cost || 0) +
    (selectedPsu?.cost || 0);

  const superBlueprint: Blueprint = {
    id: `sbp_${Date.now()}`,
    name: arrayName,
    type: 'supercomputer',
    tier: 'T6',
    components: {
      cpu: bladeId,
      interconnect: interconnectId,
      cooling: coolingId,
      psu: psuId,
      computeCount,
    },
    totalCost: arrayCost,
    sellingPrice: arrayCost * 2.2,
    isValid: false,
    validationErrors: [],
    validationWarnings: [],
    appealScore: 85,
    unitsSold: 0,
    activeProduction: false,
  };

  const validation = validateSupercomputerBlueprint(superBlueprint, catalogue);

  return (
    <div className="space-y-6">
      {/* Intro Header */}
      <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-5 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg bg-emerald-950/60 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
            <Server className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white uppercase tracking-wider">
              SUPERCOMPUTER DESIGN MATRIX & INSTITUTIONAL CONTRACTS
            </h3>
            <p className="text-xs text-gray-400">
              Low-volume, high-margin multi-rack systems tailored for government, defense, and meteorological tenders.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-[#0d1117] px-4 py-2 rounded-lg border border-[#30363d]">
          <span className="text-xs text-gray-400">Design Complexity:</span>
          <span className="text-xs font-mono font-bold text-emerald-400">Streamlined 5-Part Slot Architecture</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Array CAD Builder */}
        <div className="lg:col-span-2 bg-[#161b22] border border-[#30363d] rounded-xl p-5 space-y-4">
          <h4 className="text-sm font-bold text-white uppercase tracking-wider pb-3 border-b border-[#30363d]">
            Compute Array & Substation Configuration
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">Supercomputer System Codename</label>
              <input
                type="text"
                value={arrayName}
                onChange={(e) => setArrayName(e.target.value)}
                className="w-full bg-[#0d1117] border border-[#30363d] rounded-lg px-3 py-1.5 text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">
                Parallel Compute Blades / Vector Units
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="2"
                  max="32"
                  value={computeCount}
                  onChange={(e) => setComputeCount(parseInt(e.target.value))}
                  className="flex-1 accent-emerald-500"
                />
                <span className="font-mono text-xs text-white bg-[#0d1117] px-3 py-1 rounded border border-[#30363d]">
                  {computeCount} Nodes
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            {/* Slot 1: Compute Node */}
            <div className="bg-[#0d1117] p-3 rounded-lg border border-[#30363d] flex flex-col md:flex-row md:items-center justify-between gap-2">
              <div>
                <span className="text-[10px] uppercase font-mono text-gray-400 block">1. Compute Blade / Vector Element</span>
                <span className="text-xs font-bold text-white">{selectedBlade?.name || 'None'}</span>
              </div>
              <select
                value={bladeId}
                onChange={(e) => setBladeId(e.target.value)}
                className="bg-[#161b22] border border-[#30363d] text-xs text-gray-200 rounded px-2.5 py-1.5 font-mono focus:outline-none"
              >
                {blades.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name} (${b.cost}) [{b.powerDraw}W]
                  </option>
                ))}
              </select>
            </div>

            {/* Slot 2: Interconnect */}
            <div className="bg-[#0d1117] p-3 rounded-lg border border-[#30363d] flex flex-col md:flex-row md:items-center justify-between gap-2">
              <div>
                <span className="text-[10px] uppercase font-mono text-gray-400 block">2. High-Speed Interconnect Backplane</span>
                <span className="text-xs font-bold text-white">{selectedInterconnect?.name || 'None'}</span>
              </div>
              <select
                value={interconnectId}
                onChange={(e) => setInterconnectId(e.target.value)}
                className="bg-[#161b22] border border-[#30363d] text-xs text-gray-200 rounded px-2.5 py-1.5 font-mono focus:outline-none"
              >
                {interconnects.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name} (${b.cost})
                  </option>
                ))}
              </select>
            </div>

            {/* Slot 3: Cooling */}
            <div className="bg-[#0d1117] p-3 rounded-lg border border-[#30363d] flex flex-col md:flex-row md:items-center justify-between gap-2">
              <div>
                <span className="text-[10px] uppercase font-mono text-gray-400 block">3. Industrial Cooling Subsystem</span>
                <span className="text-xs font-bold text-white">{selectedCooling?.name || 'None'}</span>
              </div>
              <select
                value={coolingId}
                onChange={(e) => setCoolingId(e.target.value)}
                className="bg-[#161b22] border border-[#30363d] text-xs text-gray-200 rounded px-2.5 py-1.5 font-mono focus:outline-none"
              >
                {coolings.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} (${c.cost}) [TDP Cap: {c.tdpRating}W]
                  </option>
                ))}
              </select>
            </div>

            {/* Slot 4: Power System */}
            <div className="bg-[#0d1117] p-3 rounded-lg border border-[#30363d] flex flex-col md:flex-row md:items-center justify-between gap-2">
              <div>
                <span className="text-[10px] uppercase font-mono text-gray-400 block">4. Power Distribution Rack</span>
                <span className="text-xs font-bold text-white">{selectedPsu?.name || 'None'}</span>
              </div>
              <select
                value={psuId}
                onChange={(e) => setPsuId(e.target.value)}
                className="bg-[#161b22] border border-[#30363d] text-xs text-gray-200 rounded px-2.5 py-1.5 font-mono focus:outline-none"
              >
                {psus.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} (${p.cost}) [Max Output: {p.powerOutput}W]
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Array Specs & Realtime Validation */}
        <div className="space-y-4">
          {/* Supercomputer Cluster Visual Image */}
          <div className="rounded-xl overflow-hidden border border-[#30363d] bg-black/60 relative group shadow-lg">
            <img 
              src="/images/supercomputer_cluster.svg" 
              alt="HPC Supercomputer Cluster" 
              className="w-full h-36 object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#161b22] via-transparent to-transparent" />
            <div className="absolute top-2 left-2.5 bg-black/80 px-2 py-0.5 rounded-full border border-blue-500/40 text-[9px] font-mono text-blue-300 font-bold">
              MULTI-RACK BLADE ENCLOSURE
            </div>
            <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between text-[10px] font-mono text-gray-300">
              <span className="text-blue-400 font-bold">{computeCount} Parallel Compute Blades</span>
              <span>Chilled Liquid Interconnect</span>
            </div>
          </div>

          <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#30363d]">
              <h4 className="text-sm font-bold text-white uppercase tracking-wider">
                Array Diagnostics
              </h4>
              {validation.isValid ? (
                <span className="flex items-center gap-1 text-xs font-bold text-emerald-400 font-mono">
                  <CheckCircle2 className="w-4 h-4" /> COMPLIANT
                </span>
              ) : (
                <span className="flex items-center gap-1 text-xs font-bold text-rose-400 font-mono">
                  <XCircle className="w-4 h-4" /> UNSUSTAINABLE
                </span>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-[#0d1117] p-2.5 rounded border border-[#30363d]">
                <span className="text-[10px] text-gray-400 uppercase font-mono block">Compute Performance</span>
                <span className="font-bold font-mono text-white text-base">
                  {validation.calculatedPerformance} MFLOPS
                </span>
              </div>

              <div className="bg-[#0d1117] p-2.5 rounded border border-[#30363d]">
                <span className="text-[10px] text-gray-400 uppercase font-mono block">Electrical Demand</span>
                <span className="font-bold font-mono text-amber-400 text-base flex items-center gap-1">
                  <Zap className="w-4 h-4" />
                  {validation.calculatedPowerDraw} W
                </span>
              </div>
            </div>

            <div className="bg-[#0d1117] p-3 rounded border border-[#30363d] flex items-center justify-between text-xs">
              <span className="text-gray-400">Total Fabrication Cost:</span>
              <span className="font-bold font-mono text-white text-base">${arrayCost.toLocaleString()}</span>
            </div>

            {/* Incompatibilities */}
            {validation.errors.map((err, i) => (
              <div
                key={i}
                className="bg-rose-950/30 border border-rose-500/40 p-2.5 rounded text-xs text-rose-200 leading-snug flex items-start gap-2"
              >
                <XCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <span>{err}</span>
              </div>
            ))}

            {validation.warnings.map((warn, i) => (
              <div
                key={i}
                className="bg-amber-950/30 border border-amber-500/40 p-2.5 rounded text-xs text-amber-200 leading-snug flex items-start gap-2"
              >
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>{warn}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Available Tenders & Contracts */}
      <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-5 space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-[#30363d]">
          <Award className="w-5 h-5 text-emerald-400" />
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              Open Institutional Supercomputing Tenders
            </h4>
            <p className="text-xs text-gray-400">Submit qualified blueprints to win government research funding and defense bounties</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {contracts.map((contract) => {
            const meetsPerf = validation.calculatedPerformance >= contract.requiredPerformance;
            const meetsRel = validation.calculatedReliability >= contract.minReliability;
            const canBid = validation.isValid && meetsPerf && meetsRel && contract.status === 'available';

            return (
              <div
                key={contract.id}
                className={`bg-[#0d1117] border rounded-xl p-4 flex flex-col justify-between space-y-3 ${
                  contract.status === 'completed'
                    ? 'border-emerald-500/40 opacity-70'
                    : 'border-[#30363d] hover:border-gray-500'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div>
                      <h5 className="text-sm font-bold text-white">{contract.title}</h5>
                      <p className="text-xs text-emerald-400 font-medium">{contract.client}</p>
                    </div>
                    <span className="text-xs font-mono font-bold text-white px-2 py-0.5 rounded bg-[#21262d] border border-[#30363d]">
                      Payout: ${contract.payout.toLocaleString()}
                    </span>
                  </div>

                  <p className="text-xs text-gray-300 mt-2 leading-relaxed">{contract.description}</p>

                  <div className="grid grid-cols-2 gap-2 mt-3 text-[11px] font-mono text-gray-400">
                    <span className={meetsPerf ? 'text-emerald-400' : 'text-gray-400'}>
                      Req Perf: {contract.requiredPerformance} MFLOPS
                    </span>
                    <span className={meetsRel ? 'text-emerald-400' : 'text-gray-400'}>
                      Min Reliability: {Math.round(contract.minReliability * 100)}%
                    </span>
                    <span>Deadline: {contract.deadlineMonths} Months</span>
                    <span className="text-rose-400">Default Penalty: ${contract.penalty.toLocaleString()}</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#30363d] flex items-center justify-between">
                  <span className="text-[11px] font-mono text-gray-400 uppercase">
                    Status: <strong className="text-white">{contract.status.toUpperCase()}</strong>
                  </span>

                  {contract.status === 'available' && (
                    <button
                      onClick={() => onBidContract(contract.id, superBlueprint)}
                      disabled={!canBid}
                      className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        canBid
                          ? 'bg-emerald-400 text-black hover:bg-emerald-300 shadow-lg shadow-emerald-500/20'
                          : 'bg-gray-800 text-gray-500 cursor-not-allowed border border-[#30363d]'
                      }`}
                    >
                      Submit Array Bid
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
