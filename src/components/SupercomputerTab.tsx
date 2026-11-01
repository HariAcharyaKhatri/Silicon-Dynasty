import React from 'react';
import { ComponentItem, SuperContract, Blueprint } from '../types/game';
import { validateSupercomputerBlueprint } from '../utils/compatibilityEngine';
import {
  Server,
  Zap,
  Shield,
  FileCheck,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Award,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
  DollarSign,
  Clock,
  ArrowRight,
} from 'lucide-react';
import Images from '../assets/images';

interface Props {
  catalogue: ComponentItem[];
  contracts: SuperContract[];
  cash: number;
  onBidContract: (contractId: string, blueprint: Blueprint) => void;
}

const CONTRACTS_PER_PAGE = 3;

export const SupercomputerTab: React.FC<Props> = ({
  catalogue,
  contracts,
  cash,
  onBidContract,
}) => {
  const [activeScreen, setActiveScreen] = React.useState<'contracts' | 'cad'>('contracts');
  const [contractPage, setContractPage] = React.useState<number>(1);

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

  // Pagination for contracts
  const totalContractPages = Math.max(1, Math.ceil(contracts.length / CONTRACTS_PER_PAGE));
  const paginatedContracts = contracts.slice(
    (contractPage - 1) * CONTRACTS_PER_PAGE,
    contractPage * CONTRACTS_PER_PAGE
  );

  return (
    <div className="space-y-4 select-none font-mono animate-tab-fade">
      {/* Top Navigation Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-[#161b22] border border-[#30363d] p-2.5 rounded-2xl">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveScreen('contracts')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold uppercase transition-all flex items-center gap-2 ${
              activeScreen === 'contracts'
                ? 'bg-emerald-500 text-black shadow-md shadow-emerald-500/20'
                : 'bg-[#0d1117] text-gray-300 hover:text-white border border-[#262c36]'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>Open Tenders ({contracts.filter((c) => c.status === 'available').length} Active)</span>
          </button>

          <button
            onClick={() => setActiveScreen('cad')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold uppercase transition-all flex items-center gap-2 ${
              activeScreen === 'cad'
                ? 'bg-emerald-500 text-black shadow-md shadow-emerald-500/20'
                : 'bg-[#0d1117] text-gray-300 hover:text-white border border-[#262c36]'
            }`}
          >
            <Server className="w-4 h-4" />
            <span>Array &amp; Cluster CAD ({computeCount} Nodes)</span>
          </button>
        </div>

        <div className="flex items-center gap-3 text-xs pr-2 hidden sm:flex">
          <span className="text-gray-400">
            Array Output: <strong className="text-white">{validation.calculatedPerformance} MFLOPS</strong>
          </span>
          <span className="text-gray-400">
            Status:{' '}
            <strong className={validation.isValid ? 'text-emerald-400' : 'text-rose-400'}>
              {validation.isValid ? 'COMPLIANT' : 'UNSUSTAINABLE'}
            </strong>
          </span>
        </div>
      </div>

      {/* ======================================================== */}
      {/* SCREEN 1: INSTITUTIONAL TENDER CONTRACTS                 */}
      {/* ======================================================== */}
      {activeScreen === 'contracts' && (
        <div className="space-y-4">
          <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Award className="w-4 h-4 text-emerald-400" />
                Institutional Supercomputing Tenders
              </h3>
              <p className="text-xs text-gray-400 mt-0.5">
                Government and defense bounties requiring massive multi-blade parallel compute performance.
              </p>
            </div>
            <button
              onClick={() => setActiveScreen('cad')}
              className="px-4 py-2 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-black font-bold text-xs uppercase flex items-center gap-1.5 transition-all shadow-md shrink-0 active:scale-[0.98]"
            >
              Configure Cluster CAD <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Paginated Contracts List */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {paginatedContracts.map((contract) => {
              const meetsPerf = validation.calculatedPerformance >= contract.requiredPerformance;
              const meetsRel = validation.calculatedReliability >= contract.minReliability;
              const canBid = validation.isValid && meetsPerf && meetsRel && contract.status === 'available';

              return (
                <div
                  key={contract.id}
                  className={`bg-[#161b22] border rounded-2xl p-4 flex flex-col justify-between space-y-3 transition-all ${
                    contract.status === 'completed'
                      ? 'border-emerald-500/40 bg-emerald-950/15'
                      : 'border-[#30363d] hover:border-gray-500'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="text-sm font-bold text-white">{contract.title}</h4>
                        <span className="text-xs text-emerald-400 font-medium">{contract.client}</span>
                      </div>
                      <span className="text-xs font-bold text-white px-2 py-0.5 rounded bg-[#0d1117] border border-[#30363d] shrink-0">
                        ${contract.payout.toLocaleString()}
                      </span>
                    </div>

                    <p className="text-xs text-gray-300 leading-relaxed bg-[#0d1117] p-2.5 rounded-xl border border-[#262c36]">
                      {contract.description}
                    </p>

                    <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
                      <div className="bg-[#0d1117] p-2 rounded-lg border border-[#262c36]">
                        <span className="text-gray-500 block">Required Compute:</span>
                        <strong className={meetsPerf ? 'text-emerald-400' : 'text-gray-300'}>
                          {contract.requiredPerformance} MFLOPS
                        </strong>
                      </div>
                      <div className="bg-[#0d1117] p-2 rounded-lg border border-[#262c36]">
                        <span className="text-gray-500 block">Min Reliability:</span>
                        <strong className={meetsRel ? 'text-emerald-400' : 'text-gray-300'}>
                          {Math.round(contract.minReliability * 100)}%
                        </strong>
                      </div>
                      <div className="bg-[#0d1117] p-2 rounded-lg border border-[#262c36]">
                        <span className="text-gray-500 block">Deadline:</span>
                        <span className="text-white">{contract.deadlineMonths} Months</span>
                      </div>
                      <div className="bg-[#0d1117] p-2 rounded-lg border border-[#262c36]">
                        <span className="text-gray-500 block">Penalty:</span>
                        <span className="text-rose-400">${contract.penalty.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-[#30363d] flex items-center justify-between gap-2">
                    <span className="text-[10px] uppercase font-bold text-gray-400">
                      Status:{' '}
                      <strong className={contract.status === 'completed' ? 'text-emerald-400' : 'text-white'}>
                        {contract.status.toUpperCase()}
                      </strong>
                    </span>

                    {contract.status === 'available' && (
                      <button
                        onClick={() => onBidContract(contract.id, superBlueprint)}
                        disabled={!canBid}
                        className={`px-4 py-2 rounded-xl text-xs font-bold uppercase transition-all ${
                          canBid
                            ? 'bg-emerald-400 text-black hover:bg-emerald-300 shadow-lg shadow-emerald-500/20 active:scale-[0.98]'
                            : 'bg-gray-800 text-gray-500 cursor-not-allowed border border-[#30363d]'
                        }`}
                      >
                        Submit Bid
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Contracts Pagination Controls */}
          <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-3 flex items-center justify-between text-xs">
            <span className="text-[11px] text-gray-400">
              Page {contractPage} of {totalContractPages} ({contracts.length} tender contracts)
            </span>
            <div className="flex items-center gap-2">
              <button
                disabled={contractPage <= 1}
                onClick={() => setContractPage((p) => Math.max(1, p - 1))}
                className="px-3 py-1.5 rounded-lg border border-[#30363d] bg-[#0d1117] hover:bg-[#1f2633] text-gray-300 disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-1"
              >
                <ChevronLeft className="w-3.5 h-3.5" /> Prev
              </button>
              <button
                disabled={contractPage >= totalContractPages}
                onClick={() => setContractPage((p) => Math.min(totalContractPages, p + 1))}
                className="px-3 py-1.5 rounded-lg border border-[#30363d] bg-[#0d1117] hover:bg-[#1f2633] text-gray-300 disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-1"
              >
                Next <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* SCREEN 2: ARRAY & SUPERCLUSTER CAD                       */}
      {/* ======================================================== */}
      {activeScreen === 'cad' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          {/* Main CAD Form */}
          <div className="lg:col-span-8 bg-[#161b22] border border-[#30363d] rounded-2xl p-4 sm:p-5 space-y-4">
            <div className="pb-3 border-b border-[#30363d] flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-white uppercase tracking-wider">
                  Compute Array Architecture &amp; Substation
                </h4>
                <p className="text-[11px] text-gray-400">Configure parallel compute blades, bus interconnects, and cooling</p>
              </div>
              <span className="text-xs px-2.5 py-1 rounded bg-[#0d1117] text-gray-300 border border-[#30363d]">
                Cost: <strong className="text-white">${arrayCost.toLocaleString()}</strong>
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">Supercomputer System Codename</label>
                <input
                  type="text"
                  value={arrayName}
                  onChange={(e) => setArrayName(e.target.value)}
                  className="w-full bg-[#0d1117] border border-[#30363d] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">
                  Parallel Compute Blades: <strong className="text-emerald-400">{computeCount} Nodes</strong>
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min="2"
                    max="32"
                    step="2"
                    value={computeCount}
                    onChange={(e) => setComputeCount(parseInt(e.target.value))}
                    className="flex-1 accent-emerald-500 h-2 bg-[#0d1117] rounded-lg cursor-pointer"
                  />
                  <div className="flex gap-1">
                    {[4, 8, 16, 32].map((n) => (
                      <button
                        key={n}
                        onClick={() => setComputeCount(n)}
                        className={`px-2 py-0.5 text-[10px] rounded border ${
                          computeCount === n
                            ? 'bg-emerald-950/80 border-emerald-500 text-emerald-400 font-bold'
                            : 'bg-[#0d1117] border-[#30363d] text-gray-400'
                        }`}
                      >
                        {n}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Component Slots */}
            <div className="space-y-3 pt-2">
              {/* Slot 1: Compute Node */}
              <div className="bg-[#0d1117] p-3 rounded-xl border border-[#262c36] space-y-1.5">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] uppercase text-gray-400 block font-bold">1. Compute Blade / Vector Element</span>
                  <span className="text-xs text-emerald-400 font-bold">${selectedBlade?.cost || 0} / node</span>
                </div>
                <select
                  value={bladeId}
                  onChange={(e) => setBladeId(e.target.value)}
                  className="w-full bg-[#161b22] border border-[#30363d] text-xs text-gray-200 rounded-lg p-2.5 focus:outline-none focus:border-emerald-500"
                >
                  {blades.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name} (${b.cost}) [{b.powerDraw}W]
                    </option>
                  ))}
                </select>
              </div>

              {/* Slot 2: Interconnect */}
              <div className="bg-[#0d1117] p-3 rounded-xl border border-[#262c36] space-y-1.5">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] uppercase text-gray-400 block font-bold">2. High-Speed Interconnect Backplane</span>
                  <span className="text-xs text-emerald-400 font-bold">${selectedInterconnect?.cost || 0}</span>
                </div>
                <select
                  value={interconnectId}
                  onChange={(e) => setInterconnectId(e.target.value)}
                  className="w-full bg-[#161b22] border border-[#30363d] text-xs text-gray-200 rounded-lg p-2.5 focus:outline-none focus:border-emerald-500"
                >
                  {interconnects.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name} (${b.cost})
                    </option>
                  ))}
                </select>
              </div>

              {/* Slot 3: Cooling */}
              <div className="bg-[#0d1117] p-3 rounded-xl border border-[#262c36] space-y-1.5">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] uppercase text-gray-400 block font-bold">3. Industrial Cooling Subsystem</span>
                  <span className="text-xs text-emerald-400 font-bold">${selectedCooling?.cost || 0}</span>
                </div>
                <select
                  value={coolingId}
                  onChange={(e) => setCoolingId(e.target.value)}
                  className="w-full bg-[#161b22] border border-[#30363d] text-xs text-gray-200 rounded-lg p-2.5 focus:outline-none focus:border-emerald-500"
                >
                  {coolings.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} (${c.cost}) [TDP Cap: {c.tdpRating}W]
                    </option>
                  ))}
                </select>
              </div>

              {/* Slot 4: Power System */}
              <div className="bg-[#0d1117] p-3 rounded-xl border border-[#262c36] space-y-1.5">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] uppercase text-gray-400 block font-bold">4. Power Distribution Rack</span>
                  <span className="text-xs text-emerald-400 font-bold">${selectedPsu?.cost || 0}</span>
                </div>
                <select
                  value={psuId}
                  onChange={(e) => setPsuId(e.target.value)}
                  className="w-full bg-[#161b22] border border-[#30363d] text-xs text-gray-200 rounded-lg p-2.5 focus:outline-none focus:border-emerald-500"
                >
                  {psus.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} (${p.cost}) [Max Output: {p.powerOutput}W]
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setActiveScreen('contracts')}
                className="px-5 py-2.5 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-black font-bold text-xs uppercase flex items-center gap-1.5 shadow-md active:scale-[0.98]"
              >
                Review Open Tenders with this Array →
              </button>
            </div>
          </div>

          {/* Diagnostics Column */}
          <div className="lg:col-span-4 space-y-4">
            {/* Visual Image */}
            <div className="rounded-2xl overflow-hidden border border-[#30363d] bg-black/60 relative group shadow-lg">
              <img
                src={Images.supercomputerCluster}
                alt="HPC Supercomputer Cluster"
                className="w-full h-36 object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#161b22] via-transparent to-transparent" />
              <div className="absolute top-2 left-2.5 bg-black/80 px-2 py-0.5 rounded-full border border-blue-500/40 text-[9px] text-blue-300 font-bold">
                MULTI-RACK HPC CLUSTER
              </div>
              <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between text-[10px] text-gray-300">
                <span className="text-blue-400 font-bold">{computeCount} Compute Blades</span>
                <span>Chilled Liquid Interconnect</span>
              </div>
            </div>

            <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-4 sm:p-5 space-y-3.5 shadow-xl">
              <div className="flex items-center justify-between pb-2 border-b border-[#30363d]">
                <h4 className="text-xs font-bold text-white uppercase">Array Diagnostics</h4>
                {validation.isValid ? (
                  <span className="flex items-center gap-1 text-xs font-bold text-emerald-400">
                    <CheckCircle2 className="w-4 h-4" /> COMPLIANT
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-xs font-bold text-rose-400">
                    <XCircle className="w-4 h-4" /> UNSUSTAINABLE
                  </span>
                )}
              </div>

              <div className="grid grid-cols-2 gap-2.5 text-xs">
                <div className="bg-[#0d1117] p-2.5 rounded-xl border border-[#262c36]">
                  <span className="text-[10px] text-gray-400 uppercase block">Compute Power</span>
                  <span className="font-bold text-white text-base">
                    {validation.calculatedPerformance} MFLOPS
                  </span>
                </div>

                <div className="bg-[#0d1117] p-2.5 rounded-xl border border-[#262c36]">
                  <span className="text-[10px] text-gray-400 uppercase block">Electrical Load</span>
                  <span className="font-bold text-amber-400 text-base flex items-center gap-1">
                    <Zap className="w-4 h-4" />
                    {validation.calculatedPowerDraw} W
                  </span>
                </div>
              </div>

              <div className="bg-[#0d1117] p-3 rounded-xl border border-[#262c36] flex items-center justify-between text-xs">
                <span className="text-gray-400">Total Fabrication Cost:</span>
                <span className="font-bold text-white text-base">${arrayCost.toLocaleString()}</span>
              </div>

              {/* Incompatibilities */}
              {validation.errors.map((err, i) => (
                <div
                  key={i}
                  className="bg-rose-950/30 border border-rose-500/40 p-2.5 rounded-xl text-xs text-rose-200 leading-snug flex items-start gap-2"
                >
                  <XCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <span>{err}</span>
                </div>
              ))}

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
          </div>
        </div>
      )}
    </div>
  );
};
