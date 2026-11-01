import React from 'react';
import { Employee, CompanyState } from '../types/game';
import {
  Users,
  UserPlus,
  Award,
  DollarSign,
  Heart,
  Briefcase,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  GraduationCap,
  Trash2,
  Check,
} from 'lucide-react';

interface Props {
  employees: Employee[];
  company: CompanyState;
  onHireEmployee: (role: Employee['role']) => void;
  onFireEmployee: (id: string) => void;
  onTrainEmployee: (id: string) => void;
}

const STAFF_PER_PAGE = 4;

export const PersonnelTab: React.FC<Props> = ({
  employees,
  company,
  onHireEmployee,
  onFireEmployee,
  onTrainEmployee,
}) => {
  const [personnelView, setPersonnelView] = React.useState<'roster' | 'recruitment'>('roster');
  const [roleFilter, setRoleFilter] = React.useState<string>('all');
  const [currentPage, setCurrentPage] = React.useState<number>(1);
  const [dismissConfirmId, setDismissConfirmId] = React.useState<string | null>(null);

  const roleDefinitions = [
    {
      role: 'role_hw_eng' as const,
      name: 'Hardware Engineer',
      salary: 2800,
      hiringFee: 1500,
      desc: 'Conducts laboratory research, generates Research Points (RP), and drives Tier progression.',
    },
    {
      role: 'role_factory' as const,
      name: 'Factory Worker',
      salary: 1800,
      hiringFee: 800,
      desc: 'Operates workbench fabrication lathes and reduces production defect rates below 5%.',
    },
    {
      role: 'role_sales' as const,
      name: 'Sales Representative',
      salary: 2200,
      hiringFee: 1000,
      desc: 'Negotiates wholesale orders with radio shops, corporate offices, and universities.',
    },
    {
      role: 'role_sw_dev' as const,
      name: 'Software Developer',
      salary: 2500,
      hiringFee: 1200,
      desc: 'Authors firmware BIOS, compilers, terminal monitors, and operating systems.',
    },
    {
      role: 'role_manager' as const,
      name: 'Department Manager',
      salary: 3500,
      hiringFee: 2000,
      desc: 'Supervises departmental workflow, boosting team productivity by +5% stacking.',
    },
  ];

  const monthlyPayroll = employees.reduce((acc, e) => acc + e.salary, 0);
  const avgSkill =
    employees.length > 0
      ? (employees.reduce((acc, e) => acc + e.skill, 0) / employees.length).toFixed(1)
      : '0.0';
  const avgMorale =
    employees.length > 0
      ? Math.round(employees.reduce((acc, e) => acc + e.morale, 0) / employees.length)
      : 85;

  const filteredEmployees = employees.filter((e) => {
    if (roleFilter === 'all') return true;
    return e.role === roleFilter;
  });

  React.useEffect(() => {
    setCurrentPage(1);
  }, [roleFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredEmployees.length / STAFF_PER_PAGE));
  const paginatedEmployees = filteredEmployees.slice(
    (currentPage - 1) * STAFF_PER_PAGE,
    currentPage * STAFF_PER_PAGE
  );

  return (
    <div className="space-y-4 select-none font-mono animate-tab-fade">
      {/* Top Banner: Payroll Status & KPI Ribbon */}
      <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Users className="w-5 h-5 text-emerald-400" />
            Personnel &amp; Labor Management
          </h3>
          <p className="text-xs text-gray-400 mt-0.5">
            Workforce headcount, technical training academies, and monthly payroll expenditure
          </p>
        </div>

        <div className="grid grid-cols-3 gap-2.5 text-xs w-full md:w-auto">
          <div className="bg-[#0d1117] p-2.5 rounded-xl border border-[#30363d] text-center">
            <span className="text-gray-500 block text-[10px] uppercase">Headcount</span>
            <span className="font-bold text-white text-sm">{employees.length} Staff</span>
          </div>
          <div className="bg-[#0d1117] p-2.5 rounded-xl border border-[#30363d] text-center">
            <span className="text-gray-500 block text-[10px] uppercase">Payroll</span>
            <span className="font-bold text-emerald-400 text-sm">${monthlyPayroll.toLocaleString()}</span>
          </div>
          <div className="bg-[#0d1117] p-2.5 rounded-xl border border-[#30363d] text-center">
            <span className="text-gray-500 block text-[10px] uppercase">Avg Skill</span>
            <span className="font-bold text-amber-300 text-sm">{avgSkill}/10</span>
          </div>
        </div>
      </div>

      {/* Screen / Mode Switcher */}
      <div className="flex items-center bg-[#161b22] border border-[#30363d] p-1.5 rounded-2xl text-xs">
        <button
          onClick={() => setPersonnelView('roster')}
          className={`flex-1 py-2 px-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
            personnelView === 'roster'
              ? 'bg-emerald-500 text-black shadow-md shadow-emerald-500/20'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Active Roster ({employees.length})</span>
        </button>

        <button
          onClick={() => setPersonnelView('recruitment')}
          className={`flex-1 py-2 px-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
            personnelView === 'recruitment'
              ? 'bg-emerald-500 text-black shadow-md shadow-emerald-500/20'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <UserPlus className="w-4 h-4" />
          <span>Recruitment Hall ({roleDefinitions.length} Roles)</span>
        </button>
      </div>

      {/* ======================================================== */}
      {/* VIEW 1: ACTIVE STAFF ROSTER                              */}
      {/* ======================================================== */}
      {personnelView === 'roster' && (
        <div className="space-y-4">
          {/* Role Filter Pills */}
          <div className="bg-[#161b22] border border-[#30363d] p-3 rounded-2xl flex items-center gap-1.5 overflow-x-auto text-xs no-scrollbar">
            {[
              { id: 'all', label: `All (${employees.length})` },
              { id: 'role_hw_eng', label: `Engineers (${employees.filter((e) => e.role === 'role_hw_eng').length})` },
              { id: 'role_factory', label: `Factory (${employees.filter((e) => e.role === 'role_factory').length})` },
              { id: 'role_sales', label: `Sales (${employees.filter((e) => e.role === 'role_sales').length})` },
              { id: 'role_sw_dev', label: `Software (${employees.filter((e) => e.role === 'role_sw_dev').length})` },
              { id: 'role_manager', label: `Managers (${employees.filter((e) => e.role === 'role_manager').length})` },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setRoleFilter(f.id)}
                className={`px-3 py-1.5 rounded-lg border whitespace-nowrap transition-all ${
                  roleFilter === f.id
                    ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300 font-bold'
                    : 'bg-[#0d1117] border-[#262c36] text-gray-400 hover:text-white'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Paginated Staff Cards */}
          {filteredEmployees.length === 0 ? (
            <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-10 text-center text-xs text-gray-400 space-y-3">
              <Users className="w-10 h-10 text-gray-500 mx-auto" />
              <p>No personnel matching the selected department filter.</p>
              <button
                onClick={() => setPersonnelView('recruitment')}
                className="px-4 py-2 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-black font-bold uppercase transition-all shadow-md inline-flex items-center gap-1.5"
              >
                <UserPlus className="w-4 h-4" /> Open Recruitment Hall
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {paginatedEmployees.map((emp) => {
                const trainingCost = emp.skill * 500;
                const canTrain = emp.skill < 10 && company.cash >= trainingCost;

                return (
                  <div
                    key={emp.id}
                    className="bg-[#161b22] border border-[#30363d] rounded-2xl p-4 flex flex-col justify-between space-y-3 transition-all hover:border-gray-500"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <span className="font-bold text-white text-sm block">{emp.name}</span>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#0d1117] text-emerald-400 border border-[#30363d] inline-block mt-1">
                            {emp.roleName}
                          </span>
                        </div>
                        <span className="text-xs font-bold text-gray-300">
                          ${emp.salary.toLocaleString()}/mo
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 mt-3 text-xs">
                        <div className="bg-[#0d1117] p-2 rounded-xl border border-[#262c36] flex items-center justify-between">
                          <span className="text-[10px] text-gray-400">Skill Rating:</span>
                          <span className="font-bold text-amber-300 flex items-center gap-1">
                            <Award className="w-3.5 h-3.5 text-amber-400" /> {emp.skill}/10
                          </span>
                        </div>

                        <div className="bg-[#0d1117] p-2 rounded-xl border border-[#262c36] flex items-center justify-between">
                          <span className="text-[10px] text-gray-400">Morale:</span>
                          <span className="font-bold text-rose-300 flex items-center gap-1">
                            <Heart className="w-3.5 h-3.5 text-rose-400" /> {emp.morale}%
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-[#30363d] flex items-center justify-between gap-2">
                      <button
                        onClick={() => onTrainEmployee(emp.id)}
                        disabled={!canTrain}
                        className={`px-3 py-1.5 text-xs font-semibold rounded-xl border transition-all flex items-center gap-1.5 ${
                          canTrain
                            ? 'bg-[#21262d] text-emerald-400 border-[#30363d] hover:bg-[#30363d] active:scale-[0.98]'
                            : 'bg-[#161b22] text-gray-600 border-transparent cursor-not-allowed'
                        }`}
                      >
                        <GraduationCap className="w-3.5 h-3.5" />
                        {emp.skill >= 10 ? 'Mastery (10/10)' : `Train ($${trainingCost.toLocaleString()})`}
                      </button>

                      {dismissConfirmId === emp.id ? (
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => {
                              onFireEmployee(emp.id);
                              setDismissConfirmId(null);
                            }}
                            className="px-2 py-1 text-[11px] bg-rose-600 text-white rounded-lg font-bold"
                          >
                            Confirm Fire
                          </button>
                          <button
                            onClick={() => setDismissConfirmId(null)}
                            className="px-2 py-1 text-[11px] bg-gray-700 text-gray-300 rounded-lg"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setDismissConfirmId(emp.id)}
                          className="px-2.5 py-1 text-xs text-gray-400 hover:text-rose-400 hover:bg-rose-950/30 rounded-xl transition-all"
                        >
                          Dismiss
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Staff Roster Pagination Controls */}
          {totalPages > 1 && (
            <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-3 flex items-center justify-between text-xs">
              <span className="text-[11px] text-gray-400">
                Page {currentPage} of {totalPages} ({filteredEmployees.length} personnel)
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
      {/* VIEW 2: RECRUITMENT & HIRING HALL                       */}
      {/* ======================================================== */}
      {personnelView === 'recruitment' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {roleDefinitions.map((def) => {
            const canAfford = company.cash >= def.hiringFee;

            return (
              <div
                key={def.role}
                className="bg-[#161b22] border border-[#30363d] rounded-2xl p-4 flex flex-col justify-between space-y-3.5 transition-all hover:border-gray-500 shadow-md"
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="font-bold text-white text-sm">{def.name}</h4>
                      <span className="text-[10px] text-emerald-400 font-bold block mt-0.5">
                        ${def.salary.toLocaleString()} / mo salary
                      </span>
                    </div>
                    <span className="text-xs font-bold text-white px-2 py-0.5 rounded bg-[#0d1117] border border-[#30363d] shrink-0">
                      Fee: ${def.hiringFee}
                    </span>
                  </div>

                  <p className="text-xs text-gray-300 leading-relaxed bg-[#0d1117] p-2.5 rounded-xl border border-[#262c36]">
                    {def.desc}
                  </p>
                </div>

                <button
                  onClick={() => {
                    onHireEmployee(def.role);
                    setPersonnelView('roster');
                  }}
                  disabled={!canAfford}
                  className={`w-full py-2.5 text-xs font-bold uppercase rounded-xl transition-all flex items-center justify-center gap-2 active:scale-[0.98] ${
                    canAfford
                      ? 'bg-emerald-400 text-black hover:bg-emerald-300 shadow-lg shadow-emerald-500/20'
                      : 'bg-gray-800 text-gray-500 cursor-not-allowed border border-[#30363d]'
                  }`}
                >
                  <UserPlus className="w-4 h-4" />
                  Hire Candidate (${def.hiringFee})
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
