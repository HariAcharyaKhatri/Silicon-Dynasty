import React from 'react';
import { Employee, CompanyState } from '../types/game';
import { Users, UserPlus, Award, DollarSign, Heart, Briefcase } from 'lucide-react';

interface Props {
  employees: Employee[];
  company: CompanyState;
  onHireEmployee: (role: Employee['role']) => void;
  onFireEmployee: (id: string) => void;
  onTrainEmployee: (id: string) => void;
}

export const PersonnelTab: React.FC<Props> = ({
  employees,
  company,
  onHireEmployee,
  onFireEmployee,
  onTrainEmployee,
}) => {
  const roleDefinitions = [
    {
      role: 'role_hw_eng' as const,
      name: 'Hardware Engineer',
      salary: 2800,
      hiringFee: 1500,
      desc: 'Conducts laboratory research, validates blueprints, and drives Tier progression.',
    },
    {
      role: 'role_factory' as const,
      name: 'Factory Worker',
      salary: 1800,
      hiringFee: 800,
      desc: 'Operates workbench fabrication lathes and reduces production defect rates.',
    },
    {
      role: 'role_sales' as const,
      name: 'Sales Representative',
      salary: 2200,
      hiringFee: 1000,
      desc: 'Negotiates orders with local radio shops, universities, and businesses.',
    },
    {
      role: 'role_sw_dev' as const,
      name: 'Software Developer',
      salary: 2500,
      hiringFee: 1200,
      desc: 'Authors firmware, monitor interpreters, and operating systems.',
    },
    {
      role: 'role_manager' as const,
      name: 'Department Manager',
      salary: 3500,
      hiringFee: 2000,
      desc: 'Supervises staff, boosting department productivity by +5% stacking.',
    },
  ];

  const monthlyPayroll = employees.reduce((acc, e) => acc + e.salary, 0);

  return (
    <div className="space-y-6">
      {/* Top Banner: Payroll Status */}
      <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-5 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Users className="w-5 h-5 text-emerald-400" />
            ORGANIZATIONAL PERSONNEL & LABOR MANAGEMENT
          </h3>
          <p className="text-xs text-gray-400">
            Workforce headcount, technical training academies, and monthly payroll expenditure
          </p>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="bg-[#0d1117] px-3 py-2 rounded-lg border border-[#30363d]">
            <span className="text-gray-400 block text-[10px]">Headcount</span>
            <span className="font-bold text-white">{employees.length} Staff</span>
          </div>
          <div className="bg-[#0d1117] px-3 py-2 rounded-lg border border-[#30363d]">
            <span className="text-gray-400 block text-[10px]">Monthly Payroll</span>
            <span className="font-bold text-emerald-400">${monthlyPayroll.toLocaleString()} / mo</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Staff List */}
        <div className="lg:col-span-2 space-y-3">
          <h4 className="text-xs font-bold text-gray-300 uppercase tracking-wider">
            Active Company Employees ({employees.length})
          </h4>

          {employees.length === 0 ? (
            <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-6 text-center text-xs text-gray-400">
              No full-time staff hired yet. You are working as a solo founder in your garage.
            </div>
          ) : (
            <div className="space-y-3">
              {employees.map((emp) => {
                const trainingCost = emp.skill * 500;
                const canTrain = emp.skill < 10 && company.cash >= trainingCost;

                return (
                  <div
                    key={emp.id}
                    className="bg-[#161b22] border border-[#30363d] rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-sm">{emp.name}</span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#0d1117] text-emerald-400 border border-[#30363d]">
                          {emp.roleName}
                        </span>
                      </div>

                      <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                        <span className="flex items-center gap-1">
                          <Award className="w-3.5 h-3.5 text-amber-400" /> Skill: {emp.skill}/10
                        </span>
                        <span className="flex items-center gap-1">
                          <Heart className="w-3.5 h-3.5 text-rose-400" /> Morale: {emp.morale}%
                        </span>
                        <span className="font-mono text-gray-300">
                          ${emp.salary.toLocaleString()}/mo
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onTrainEmployee(emp.id)}
                        disabled={!canTrain}
                        className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all ${
                          canTrain
                            ? 'bg-[#21262d] text-emerald-400 border-[#30363d] hover:bg-[#30363d]'
                            : 'bg-[#161b22] text-gray-600 border-transparent cursor-not-allowed'
                        }`}
                        title={emp.skill >= 10 ? 'Max Skill' : `Train for $${trainingCost}`}
                      >
                        {emp.skill >= 10 ? 'Max Skill' : `Train ($${trainingCost})`}
                      </button>

                      <button
                        onClick={() => onFireEmployee(emp.id)}
                        className="px-3 py-1.5 text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-950/30 rounded-lg transition-all"
                      >
                        Dismiss
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Recruitment Desk */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-gray-300 uppercase tracking-wider flex items-center gap-1.5">
            <UserPlus className="w-4 h-4 text-emerald-400" />
            Recruitment & Hiring Hall
          </h4>

          <div className="space-y-3">
            {roleDefinitions.map((def) => {
              const canAfford = company.cash >= def.hiringFee;

              return (
                <div
                  key={def.role}
                  className="bg-[#161b22] border border-[#30363d] rounded-xl p-3.5 space-y-2 text-xs"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="font-bold text-white block">{def.name}</span>
                      <span className="text-[10px] text-gray-400 font-mono">
                        ${def.salary.toLocaleString()} / mo salary
                      </span>
                    </div>
                    <span className="text-xs font-mono font-bold text-emerald-400">
                      Fee: ${def.hiringFee}
                    </span>
                  </div>

                  <p className="text-[11px] text-gray-400 leading-relaxed">{def.desc}</p>

                  <button
                    onClick={() => onHireEmployee(def.role)}
                    disabled={!canAfford}
                    className={`w-full py-1.5 text-xs font-bold rounded-lg transition-all ${
                      canAfford
                        ? 'bg-emerald-400 text-black hover:bg-emerald-300'
                        : 'bg-gray-800 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    Hire Candidate
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
