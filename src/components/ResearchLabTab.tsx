import React from 'react';
import { TechNode, Employee, TierId } from '../types/game';
import { Lightbulb, CheckCircle2, Play, Users, Clock, ArrowRight } from 'lucide-react';
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

export const ResearchLabTab: React.FC<Props> = ({
  techTree,
  employees,
  currentTier,
  onAssignResearcher,
  onUnassignResearcher,
  onAdvanceTierFacility,
  cash,
}) => {
  const hwEngineers = employees.filter((e) => e.role === 'role_hw_eng');

  // Facilities upgrade requirements
  const tierCostMap: Record<TierId, { name: string; cost: number; next: TierId }> = {
    T0: { name: 'Small Workshop', cost: 5000, next: 'T1' },
    T1: { name: 'Assembly Workshop', cost: 15000, next: 'T2' },
    T2: { name: 'Storage Lab', cost: 40000, next: 'T3' },
    T3: { name: 'Electronics Lab', cost: 80000, next: 'T4' },
    T4: { name: 'Fab Start', cost: 200000, next: 'T5' },
    T5: { name: 'Design Center', cost: 800000, next: 'T6' },
    T6: { name: 'Assembly Plant', cost: 2000000, next: 'T7' },
    T7: { name: 'Quantum Frontier Complex', cost: 10000000, next: 'T7' },
  };

  const nextFacility = tierCostMap[currentTier];

  return (
    <div className="space-y-6">
      {/* Tier Advancement Banner */}
      <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-5 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-500/40 text-emerald-400">
              Current Tier: {currentTier}
            </span>
            <span className="text-xs text-gray-400 font-mono">
              Target Facility: {nextFacility.name}
            </span>
          </div>
          <h3 className="text-sm font-bold text-white">Facility Construction & Tier Gate</h3>
          <p className="text-xs text-gray-400 mt-0.5">
            Progressive expansion requires both technology R&D completion and physical facility construction.
          </p>
        </div>

        {nextFacility.next !== currentTier && (
          <button
            onClick={() => onAdvanceTierFacility(nextFacility.next, nextFacility.cost)}
            disabled={cash < nextFacility.cost}
            className={`px-5 py-2.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
              cash >= nextFacility.cost
                ? 'bg-emerald-400 text-black hover:bg-emerald-300 shadow-lg shadow-emerald-500/20'
                : 'bg-gray-800 text-gray-500 cursor-not-allowed border border-[#30363d]'
            }`}
          >
            Construct {nextFacility.name} (${nextFacility.cost.toLocaleString()})
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Research Nodes Catalogue */}
        <div className="lg:col-span-2 space-y-3">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Lightbulb className="w-4 h-4 text-emerald-400" />
            Technology Research Matrix
          </h3>

          <div className="space-y-3">
            {techTree.map((node) => {
              const assignedEngineers = employees.filter((e) => e.assignedNodeId === node.id);
              const isPrereqMet = node.prereqs.every((pId) => {
                const p = techTree.find((n) => n.id === pId);
                return p?.completed;
              });

              const percent = Math.min(100, Math.round((node.progressRP / node.costRP) * 100));

              return (
                <div
                  key={node.id}
                  className={`bg-[#161b22] border rounded-xl p-4 transition-all ${
                    node.completed
                      ? 'border-emerald-500/40 bg-emerald-950/10'
                      : isPrereqMet
                      ? 'border-[#30363d] hover:border-gray-500'
                      : 'border-[#21262d] opacity-50'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-white">{node.name}</h4>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#0d1117] text-gray-400 border border-[#30363d]">
                          {node.rpType}-RP
                        </span>
                        {node.unlocksTier && (
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-900/40 text-emerald-300 border border-emerald-500/40 font-bold">
                            Unlocks {node.unlocksTier}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-400 mt-1">{node.unlocksDescription}</p>
                      {node.prereqs.length > 0 && (
                        <p className="text-[10px] text-gray-500 font-mono mt-0.5">
                          Prerequisites: {node.prereqs.join(', ')}
                        </p>
                      )}
                    </div>

                    <div className="text-right shrink-0">
                      {node.completed ? (
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-400 font-mono">
                          <CheckCircle2 className="w-4 h-4" /> COMPLETED
                        </span>
                      ) : (
                        <span className="font-mono text-xs text-white">
                          {node.progressRP} / {node.costRP} RP ({percent}%)
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Progress bar */}
                  {!node.completed && (
                    <div className="mt-3">
                      <div className="w-full bg-[#0d1117] h-2 rounded-full overflow-hidden border border-[#30363d]">
                        <div
                          className="bg-emerald-400 h-full transition-all duration-300"
                          style={{ width: `${percent}%` }}
                        />
                      </div>

                      <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#30363d]/60 text-xs">
                        <div className="flex items-center gap-2">
                          <Users className="w-3.5 h-3.5 text-gray-400" />
                          <span className="text-gray-400 text-[11px]">
                            {assignedEngineers.length} Researchers Assigned
                          </span>
                        </div>

                        {isPrereqMet && hwEngineers.length > 0 && (
                          <div className="flex gap-2">
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
                                  className={`text-[10px] px-2 py-0.5 rounded border font-mono transition-all ${
                                    isAssignedHere
                                      ? 'bg-emerald-900/60 border-emerald-500 text-emerald-300 font-bold'
                                      : 'bg-[#0d1117] border-[#30363d] text-gray-400 hover:text-white'
                                  }`}
                                >
                                  {isAssignedHere ? `✓ ${eng.name}` : `+ ${eng.name}`}
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Staff & Lab Output */}
        <div className="space-y-4">
          {/* Silicon Cleanroom R&D Visual Banner */}
          <div className="rounded-xl overflow-hidden border border-[#30363d] bg-black/60 relative group shadow-lg">
            <img 
              src={Images.fabSilicon} 
              alt="Silicon Photolithography Cleanroom" 
              className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#161b22] via-transparent to-transparent" />
            <div className="absolute top-2 left-2.5 bg-black/80 px-2 py-0.5 rounded-full border border-teal-500/40 text-[9px] font-mono text-teal-300 font-bold">
              SEMICONDUCTOR R&amp;D CLEANROOM
            </div>
            <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between text-[10px] font-mono text-gray-300">
              <span className="text-teal-400 font-bold">WAFER STEPPER #4</span>
              <span>Class 10 Environment</span>
            </div>
          </div>

          <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-3">
              Research Staff Assignments
            </h3>

            {hwEngineers.length === 0 ? (
              <div className="text-xs text-gray-400 bg-[#0d1117] p-4 rounded-lg border border-[#30363d] text-center space-y-2">
                <p>No Hardware Engineers on payroll.</p>
                <p className="text-[11px] text-gray-500">
                  Visit the <strong>Personnel / Staff tab</strong> to hire your first engineer ($1,500 hiring fee, $2,800/mo salary).
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {hwEngineers.map((eng) => {
                  const assignedNode = techTree.find((n) => n.id === eng.assignedNodeId);
                  const dailyRP = (5 * (eng.skill / 5) * (eng.morale / 100)).toFixed(1);

                  return (
                    <div
                      key={eng.id}
                      className="bg-[#0d1117] border border-[#30363d] rounded-lg p-3 text-xs space-y-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white">{eng.name}</span>
                        <span className="text-[10px] font-mono text-emerald-400">
                          +{dailyRP} RP / Day
                        </span>
                      </div>
                      <div className="text-[11px] text-gray-400 flex items-center justify-between">
                        <span>Skill: {eng.skill}/10</span>
                        <span>Morale: {eng.morale}%</span>
                      </div>
                      <div className="text-[11px] text-gray-300 pt-1 border-t border-[#30363d]">
                        Assignment:{' '}
                        <strong className={assignedNode ? 'text-emerald-400' : 'text-amber-400'}>
                          {assignedNode ? assignedNode.name : 'Idle / Standby'}
                        </strong>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
