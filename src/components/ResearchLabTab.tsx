import React from 'react';
import { TechNode, Employee, TierId } from '../types/game';
import {
  Lightbulb,
  CheckCircle2,
  Users,
  Clock,
  ArrowRight,
  Building2,
  Cpu,
  ChevronLeft,
  ChevronRight,
  Search,
  Sparkles,
  Zap,
  Check,
  ShieldAlert,
} from 'lucide-react';
import Images from '../assets/images';

interface Props {
  techTree: TechNode[];
  employees: Employee[];
  currentTier: TierId;
  onAssignResearcher: (employeeId: string, nodeId: string) => void;
  onUnassignResearcher: (employeeId: string) => void;
  onAdvanceTierFacility: (nextTier: TierId, cost: number) => void;
  cash: number;
}

const ITEMS_PER_PAGE = 4;
const TIER_ORDER: TierId[] = ['T0', 'T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];

export const ResearchLabTab: React.FC<Props> = ({
  techTree,
  employees,
  currentTier,
  onAssignResearcher,
  onUnassignResearcher,
  onAdvanceTierFacility,
  cash,
}) => {
  const [subTab, setSubTab] = React.useState<'matrix' | 'facilities' | 'staff'>('matrix');
  const [filterMode, setFilterMode] = React.useState<'all' | 'available' | 'in_progress' | 'completed' | 'tier'>('all');
  const [searchQuery, setSearchQuery] = React.useState<string>('');
  const [currentPage, setCurrentPage] = React.useState<number>(1);

  const hwEngineers = employees.filter((e) => e.role === 'role_hw_eng');

  // Facilities upgrade definitions
  const tierCostMap: Record<TierId, { name: string; cost: number; next: TierId; rent: number; description: string }> = {
    T0: { name: 'Small Workshop', cost: 5000, next: 'T1', rent: 800, description: 'Expanded bench space for discrete transistors and passive logic circuits.' },
    T1: { name: 'Assembly Workshop', cost: 15000, next: 'T2', rent: 2200, description: 'Manual flow-soldering lines capable of backplane motherboards.' },
    T2: { name: 'Storage Lab', cost: 40000, next: 'T3', rent: 6000, description: 'Precision magnetic testing chamber for hard drive platters & core memory.' },
    T3: { name: 'Electronics Lab', cost: 80000, next: 'T4', rent: 15000, description: 'Microprocessor simulation workstations and clean air benches.' },
    T4: { name: 'Fab Start', cost: 200000, next: 'T5', rent: 45000, description: 'Initial cleanroom lithography facility for proprietary silicon fabrication.' },
    T5: { name: 'Design Center', cost: 800000, next: 'T6', rent: 120000, description: 'Automated VLSI silicon layout cluster and ASIC verification lab.' },
    T6: { name: 'Assembly Plant', cost: 2000000, next: 'T7', rent: 350000, description: 'Automated high-throughput robotic assembly lines for supercomputers.' },
    T7: { name: 'Quantum Frontier Complex', cost: 10000000, next: 'T7', rent: 1000000, description: 'Cryogenic dilution dilution refrigerators and quantum annealing bays.' },
  };

  const nextFacility = tierCostMap[currentTier];

  // Filtering tech nodes
  const filteredNodes = techTree.filter((node) => {
    const isPrereqMet = node.prereqs.every((pId) => {
      const p = techTree.find((n) => n.id === pId);
      return p?.completed;
    });

    const isAssigned = employees.some((e) => e.assignedNodeId === node.id);

    if (filterMode === 'completed' && !node.completed) return false;
    if (filterMode === 'in_progress' && (node.completed || (!isAssigned && node.progressRP === 0))) return false;
    if (filterMode === 'available' && (node.completed || !isPrereqMet)) return false;
    if (filterMode === 'tier' && !node.unlocksTier) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        node.name.toLowerCase().includes(q) ||
        node.unlocksDescription.toLowerCase().includes(q) ||
        node.id.toLowerCase().includes(q)
      );
    }
    return true;
  });

  React.useEffect(() => {
    setCurrentPage(1);
  }, [filterMode, searchQuery]);

  const totalPages = Math.max(1, Math.ceil(filteredNodes.length / ITEMS_PER_PAGE));
  const paginatedNodes = filteredNodes.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const completedCount = techTree.filter((n) => n.completed).length;
  const inProgressCount = techTree.filter((n) => !n.completed && (n.progressRP > 0 || employees.some((e) => e.assignedNodeId === n.id))).length;
  const totalDailyRP = hwEngineers.reduce((acc, eng) => acc + 5 * (eng.skill / 5) * (eng.morale / 100), 0);

  return (
    <div className="space-y-4 select-none font-mono animate-tab-fade">
      {/* Sub-Screen / Mode Navigation Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-[#161b22] border border-[#30363d] p-2 rounded-2xl">
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto no-scrollbar">
          <button
            onClick={() => setSubTab('matrix')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold uppercase transition-all flex items-center gap-2 whitespace-nowrap ${
              subTab === 'matrix'
                ? 'bg-emerald-500 text-black shadow-md shadow-emerald-500/20'
                : 'bg-[#0d1117] text-gray-300 hover:text-white border border-[#262c36]'
            }`}
          >
            <Lightbulb className="w-4 h-4" />
            <span>Tech Matrix ({completedCount}/{techTree.length})</span>
          </button>

          <button
            onClick={() => setSubTab('facilities')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold uppercase transition-all flex items-center gap-2 whitespace-nowrap ${
              subTab === 'facilities'
                ? 'bg-emerald-500 text-black shadow-md shadow-emerald-500/20'
                : 'bg-[#0d1117] text-gray-300 hover:text-white border border-[#262c36]'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>Facility &amp; Tier Gates ({currentTier})</span>
          </button>

          <button
            onClick={() => setSubTab('staff')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold uppercase transition-all flex items-center gap-2 whitespace-nowrap ${
              subTab === 'staff'
                ? 'bg-emerald-500 text-black shadow-md shadow-emerald-500/20'
                : 'bg-[#0d1117] text-gray-300 hover:text-white border border-[#262c36]'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>R&amp;D Team ({hwEngineers.length})</span>
          </button>
        </div>

        {/* Global R&D Speed Telemetry */}
        <div className="flex items-center gap-3 text-xs pr-2 hidden md:flex">
          <span className="text-gray-400">
            Lab Velocity: <strong className="text-emerald-400">+{totalDailyRP.toFixed(1)} RP/day</strong>
          </span>
          <span className="text-gray-400">
            Active Projects: <strong className="text-white">{inProgressCount}</strong>
          </span>
        </div>
      </div>

      {/* ======================================================== */}
      {/* SUB-VIEW 1: TECHNOLOGY MATRIX (PAGINATED & SEARCHABLE)   */}
      {/* ======================================================== */}
      {subTab === 'matrix' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          {/* Main Nodes Column */}
          <div className="lg:col-span-8 space-y-3.5">
            {/* Filter and Search Bar */}
            <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-3.5 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="relative flex-1">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-gray-500" />
                  <input
                    type="text"
                    placeholder="Search technologies or unlocks..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-[#0d1117] border border-[#30363d] rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder:text-gray-600 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="flex items-center gap-1.5 overflow-x-auto text-[11px] no-scrollbar">
                  {[
                    { id: 'all', label: 'All' },
                    { id: 'available', label: 'Ready' },
                    { id: 'in_progress', label: 'Active' },
                    { id: 'tier', label: 'Tiers' },
                    { id: 'completed', label: 'Done' },
                  ].map((f) => (
                    <button
                      key={f.id}
                      onClick={() => setFilterMode(f.id as any)}
                      className={`px-2.5 py-1 rounded-lg border whitespace-nowrap transition-all ${
                        filterMode === f.id
                          ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300 font-bold'
                          : 'bg-[#0d1117] border-[#262c36] text-gray-400 hover:text-white'
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Paginated Tech Cards */}
            <div className="space-y-3 min-h-[360px]">
              {paginatedNodes.length === 0 ? (
                <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-8 text-center text-xs text-gray-500">
                  No technology nodes match the current filter or search criteria.
                </div>
              ) : (
                paginatedNodes.map((node) => {
                  const assignedEngineers = employees.filter((e) => e.assignedNodeId === node.id);
                  const isPrereqMet = node.prereqs.every((pId) => {
                    const p = techTree.find((n) => n.id === pId);
                    return p?.completed;
                  });

                  const percent = Math.min(100, Math.round((node.progressRP / node.costRP) * 100));

                  return (
                    <div
                      key={node.id}
                      className={`bg-[#161b22] border rounded-2xl p-4 transition-all ${
                        node.completed
                          ? 'border-emerald-500/40 bg-emerald-950/15'
                          : isPrereqMet
                          ? 'border-[#30363d] hover:border-gray-500'
                          : 'border-[#21262d] opacity-55'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                        <div className="space-y-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <h4 className="text-sm font-bold text-white">{node.name}</h4>
                            <span className="text-[10px] px-2 py-0.5 rounded bg-[#0d1117] text-gray-300 border border-[#30363d]">
                              {node.rpType}-RP
                            </span>
                            {node.unlocksTier && (
                              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-900/60 text-emerald-300 border border-emerald-500/40 font-bold">
                                UNLOCKS {node.unlocksTier}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-gray-400 leading-relaxed">{node.unlocksDescription}</p>
                          {node.prereqs.length > 0 && (
                            <p className="text-[10px] text-gray-500">
                              Prerequisites: {node.prereqs.join(', ')}
                            </p>
                          )}
                        </div>

                        <div className="text-left sm:text-right shrink-0 pt-1 sm:pt-0">
                          {node.completed ? (
                            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400">
                              <CheckCircle2 className="w-4 h-4" /> COMPLETED
                            </span>
                          ) : (
                            <span className="text-xs font-bold text-white">
                              {node.progressRP} / {node.costRP} RP ({percent}%)
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Progress bar & Assign Controls */}
                      {!node.completed && (
                        <div className="mt-3.5 space-y-2.5">
                          <div className="w-full bg-[#0d1117] h-2 rounded-full overflow-hidden border border-[#30363d]">
                            <div
                              className="bg-emerald-400 h-full transition-all duration-300"
                              style={{ width: `${percent}%` }}
                            />
                          </div>

                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pt-2 border-t border-[#30363d]/60 text-xs">
                            <div className="flex items-center gap-2">
                              <Users className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                              <span className="text-gray-400 text-[11px]">
                                {assignedEngineers.length} Engineers Working
                              </span>
                            </div>

                            {/* Assign / Unassign Buttons */}
                            {isPrereqMet && hwEngineers.length > 0 ? (
                              <div className="flex flex-wrap gap-1.5">
                                {hwEngineers.map((eng) => {
                                  const isAssignedHere = eng.assignedNodeId === node.id;
                                  return (
                                    <button
                                      key={eng.id}
                                      onClick={() =>
                                        isAssignedHere
                                          ? onUnassignResearcher(eng.id)
                                          : onAssignResearcher(eng.id, node.id)
                                      }
                                      className={`text-[10px] px-2.5 py-1 rounded-lg border font-mono transition-all flex items-center gap-1 ${
                                        isAssignedHere
                                          ? 'bg-emerald-900/60 border-emerald-500 text-emerald-300 font-bold'
                                          : 'bg-[#0d1117] border-[#30363d] text-gray-400 hover:text-white'
                                      }`}
                                    >
                                      {isAssignedHere ? <Check className="w-3 h-3 text-emerald-400" /> : '+'}
                                      <span>{eng.name.split(' ')[0]}</span>
                                    </button>
                                  );
                                })}
                              </div>
                            ) : !isPrereqMet ? (
                              <span className="text-[10px] text-amber-400/80">
                                Locked — Complete prerequisites first
                              </span>
                            ) : (
                              <span className="text-[10px] text-gray-500">
                                Hire HW Engineers in Personnel tab
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>

            {/* Pagination Controls */}
            <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-3 flex items-center justify-between text-xs">
              <span className="text-[11px] text-gray-400">
                Page {currentPage} of {totalPages} ({filteredNodes.length} technologies)
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
          </div>

          {/* Right Column: Lab Telemetry & Staff Summary */}
          <div className="lg:col-span-4 space-y-4">
            {/* Visual Cleanroom Banner */}
            <div className="rounded-2xl overflow-hidden border border-[#30363d] bg-black/60 relative group shadow-lg">
              <img
                src={Images.fabSilicon}
                alt="Silicon Cleanroom"
                className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#161b22] via-transparent to-transparent" />
              <div className="absolute top-2 left-3 bg-black/80 px-2 py-0.5 rounded-full border border-teal-500/40 text-[9px] text-teal-300 font-bold">
                SEMICONDUCTOR R&amp;D
              </div>
              <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between text-[10px] text-gray-300">
                <span className="text-teal-400 font-bold">RESEARCH SPEED</span>
                <span>+{totalDailyRP.toFixed(1)} RP / Day</span>
              </div>
            </div>

            {/* Quick Facility Upgrade Card */}
            <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-4 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-[#30363d]">
                <span className="text-xs font-bold text-white uppercase">Next Facility</span>
                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/30">
                  Tier {nextFacility.next}
                </span>
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">{nextFacility.name}</h4>
                <p className="text-[11px] text-gray-400 mt-1 leading-relaxed">{nextFacility.description}</p>
              </div>
              <div className="pt-2 border-t border-[#30363d] flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-gray-500 block">Required Capital</span>
                  <span className="text-sm font-bold text-white">${nextFacility.cost.toLocaleString()}</span>
                </div>
                <button
                  onClick={() => onAdvanceTierFacility(nextFacility.next, nextFacility.cost)}
                  disabled={cash < nextFacility.cost || nextFacility.next === currentTier}
                  className={`px-4 py-2 rounded-xl text-xs font-bold uppercase transition-all ${
                    cash >= nextFacility.cost && nextFacility.next !== currentTier
                      ? 'bg-emerald-400 text-black hover:bg-emerald-300 shadow-lg shadow-emerald-500/20'
                      : 'bg-gray-800 text-gray-500 cursor-not-allowed border border-[#30363d]'
                  }`}
                >
                  Upgrade
                </button>
              </div>
            </div>

            {/* Staff Quick Assignment HUD */}
            <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-white uppercase">Lab Engineers ({hwEngineers.length})</h4>
                <span className="text-[10px] text-emerald-400">+{totalDailyRP.toFixed(1)} RP/day</span>
              </div>
              {hwEngineers.length === 0 ? (
                <div className="p-3 bg-[#0d1117] rounded-xl border border-[#262c36] text-[11px] text-gray-400 text-center">
                  No engineers hired yet. Recruit engineers from the Personnel tab.
                </div>
              ) : (
                <div className="space-y-2">
                  {hwEngineers.map((eng) => {
                    const assignedNode = techTree.find((n) => n.id === eng.assignedNodeId);
                    return (
                      <div
                        key={eng.id}
                        className="bg-[#0d1117] border border-[#262c36] p-2.5 rounded-xl text-xs flex items-center justify-between"
                      >
                        <div>
                          <span className="font-bold text-white block">{eng.name}</span>
                          <span className="text-[10px] text-gray-400">
                            {assignedNode ? (
                              <span className="text-emerald-400 truncate max-w-[130px] inline-block">
                                {assignedNode.name}
                              </span>
                            ) : (
                              <span className="text-amber-400">Idle / Standby</span>
                            )}
                          </span>
                        </div>
                        {assignedNode && (
                          <button
                            onClick={() => onUnassignResearcher(eng.id)}
                            className="text-[10px] text-gray-400 hover:text-rose-400 px-2 py-1 rounded border border-[#30363d] bg-[#161b22]"
                          >
                            Unassign
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* SUB-VIEW 2: FACILITIES & PROGRESSIVE TIER EXPANSION     */}
      {/* ======================================================== */}
      {subTab === 'facilities' && (
        <div className="space-y-4">
          <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-5">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-1 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-emerald-400" />
              Corporate Facility Roadmap (1952–2035)
            </h3>
            <p className="text-xs text-gray-400">
              Expanding physical engineering space unlocks advanced component tiers and turnkey system assembly capabilities.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {Object.entries(tierCostMap).map(([tierKey, data]) => {
              const isCurrent = currentTier === tierKey;
              const isUnlocked = TIER_ORDER.indexOf(currentTier) >= TIER_ORDER.indexOf(tierKey as TierId);

              return (
                <div
                  key={tierKey}
                  className={`p-4 rounded-2xl border transition-all space-y-3 ${
                    isCurrent
                      ? 'bg-emerald-950/40 border-emerald-500 shadow-lg shadow-emerald-950/40'
                      : isUnlocked
                      ? 'bg-[#161b22] border-emerald-500/30'
                      : 'bg-[#0d1117] border-[#262c36] opacity-60'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-[#0d1117] text-emerald-400 border border-[#30363d]">
                      Tier {tierKey}
                    </span>
                    {isCurrent && (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500 text-black font-extrabold uppercase">
                        ACTIVE HQ
                      </span>
                    )}
                    {isUnlocked && !isCurrent && (
                      <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" /> Built
                      </span>
                    )}
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-white">{data.name}</h4>
                    <p className="text-[11px] text-gray-400 mt-1 leading-relaxed">{data.description}</p>
                  </div>

                  <div className="pt-2 border-t border-[#30363d] text-[11px] space-y-1">
                    <div className="flex justify-between text-gray-400">
                      <span>Upgrade Cost:</span>
                      <strong className="text-white">${data.cost.toLocaleString()}</strong>
                    </div>
                    <div className="flex justify-between text-gray-400">
                      <span>Monthly Rent:</span>
                      <strong className="text-rose-400">${data.rent.toLocaleString()}/mo</strong>
                    </div>
                  </div>

                  {!isUnlocked && (
                    <button
                      onClick={() => onAdvanceTierFacility(data.next, data.cost)}
                      disabled={cash < data.cost || TIER_ORDER.indexOf(tierKey as TierId) !== TIER_ORDER.indexOf(currentTier) + 1}
                      className={`w-full py-2 rounded-xl text-xs font-bold uppercase transition-all ${
                        cash >= data.cost && TIER_ORDER.indexOf(tierKey as TierId) === TIER_ORDER.indexOf(currentTier) + 1
                          ? 'bg-emerald-400 text-black hover:bg-emerald-300 shadow-md'
                          : 'bg-gray-800 text-gray-500 cursor-not-allowed border border-[#30363d]'
                      }`}
                    >
                      Construct Facility
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* SUB-VIEW 3: R&D TEAM ALLOCATION & ACCELERATION          */}
      {/* ======================================================== */}
      {subTab === 'staff' && (
        <div className="space-y-4">
          <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-1 flex items-center gap-2">
                <Users className="w-4 h-4 text-emerald-400" />
                Laboratory R&amp;D Engineering Department
              </h3>
              <p className="text-xs text-gray-400">
                Staff skill level directly increases daily research point output. Higher morale prevents errors.
              </p>
            </div>
            <div className="bg-[#0d1117] px-4 py-2 rounded-xl border border-[#30363d] text-right">
              <span className="text-[10px] text-gray-500 uppercase block">Total Output</span>
              <span className="text-base font-bold text-emerald-400">+{totalDailyRP.toFixed(1)} RP/Day</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {hwEngineers.length === 0 ? (
              <div className="col-span-full bg-[#161b22] border border-[#30363d] rounded-2xl p-8 text-center text-xs text-gray-400 space-y-2">
                <p>No Hardware Engineers currently on the team.</p>
                <p className="text-emerald-400">
                  Switch to the Personnel tab to recruit hardware engineers and assign them to technology nodes.
                </p>
              </div>
            ) : (
              hwEngineers.map((eng) => {
                const assignedNode = techTree.find((n) => n.id === eng.assignedNodeId);
                const dailyRP = (5 * (eng.skill / 5) * (eng.morale / 100)).toFixed(1);

                return (
                  <div
                    key={eng.id}
                    className="bg-[#161b22] border border-[#30363d] rounded-2xl p-4 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white text-sm">{eng.name}</span>
                      <span className="text-xs font-mono font-bold text-emerald-400">
                        +{dailyRP} RP / Day
                      </span>
                    </div>

                    <div className="space-y-1.5 text-xs text-gray-400">
                      <div className="flex justify-between">
                        <span>Technical Skill:</span>
                        <strong className="text-white">{eng.skill} / 10</strong>
                      </div>
                      <div className="flex justify-between">
                        <span>Morale Level:</span>
                        <strong className="text-white">{eng.morale}%</strong>
                      </div>
                      <div className="flex justify-between">
                        <span>Monthly Salary:</span>
                        <strong className="text-white">${eng.salary.toLocaleString()}/mo</strong>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-[#30363d] text-xs">
                      <span className="text-[10px] text-gray-500 uppercase block">Active Node:</span>
                      <span className={`font-bold block truncate ${assignedNode ? 'text-emerald-400' : 'text-amber-400'}`}>
                        {assignedNode ? assignedNode.name : 'Idle / Standby'}
                      </span>
                    </div>

                    {assignedNode && (
                      <button
                        onClick={() => onUnassignResearcher(eng.id)}
                        className="w-full py-1.5 rounded-xl border border-[#30363d] bg-[#0d1117] hover:bg-rose-950/40 hover:border-rose-500/40 text-gray-300 hover:text-rose-300 text-xs transition-all"
                      >
                        Remove from Project
                      </button>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};
