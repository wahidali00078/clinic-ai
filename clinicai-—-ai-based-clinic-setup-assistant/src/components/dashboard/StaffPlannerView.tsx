import React, { useState } from 'react';
import { useClinic } from '../../context/ClinicContext';
import { StaffRoleItem } from '../../types';
import {
  Users,
  Coins,
  ShieldCheck,
  AlertCircle,
  Stethoscope,
  Briefcase,
  Edit2,
  Check,
  RotateCcw,
  Sliders,
  HelpCircle,
} from 'lucide-react';
import { ModulePageShell } from './ModulePageShell';
import { DataBadge } from '../common/DataBadge';
import { formatINR } from '../../utils/formatters';

export const StaffPlannerView: React.FC = () => {
  const { staff, clinic, updateStaffRole, setActiveView } = useClinic();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editCount, setEditCount] = useState<number>(1);
  const [editSalary, setEditSalary] = useState<number>(25000);

  const totalHeadcount = staff.reduce((s, r) => s + r.recommendedCount, 0);
  const totalMonthlyPayroll = staff.reduce((s, r) => s + r.monthlySalaryEstimate * r.recommendedCount, 0);
  const totalAnnualPayroll = totalMonthlyPayroll * 12;

  const handleStartEdit = (role: StaffRoleItem) => {
    setEditingId(role.id);
    setEditCount(role.recommendedCount);
    setEditSalary(role.monthlySalaryEstimate);
  };

  const handleSaveEdit = async (roleId: string) => {
    await updateStaffRole(roleId, editCount, editSalary);
    setEditingId(null);
  };

  return (
    <ModulePageShell
      stepNumber={4}
      totalSteps={8}
      title="Clinical Staffing & Payroll Roster"
      description={`Calibrated for ${clinic.capacity.expectedPatientsPerDay} patients/day across ${clinic.capacity.consultationRooms} consultation rooms.`}
      statusBadge="In Progress"
      primaryActionLabel="Save & Continue to Startup Budget"
      onPrimaryAction={() => setActiveView('costs')}
      secondaryActionLabel="Back to Equipment"
      onSecondaryAction={() => setActiveView('equipment')}
      summaryMetrics={[
        {
          label: 'Total Planned Team',
          value: `${totalHeadcount} Members`,
          subtext: `${staff.length} defined job roles`,
        },
        {
          label: 'Monthly Payroll',
          value: formatINR(totalMonthlyPayroll),
          subtext: `${formatINR(totalAnnualPayroll, { compact: true })} annual commitment`,
        },
        {
          label: 'Staff Category Split',
          value: `${staff.filter(s => s.category === 'Clinical').length} Clinical`,
          subtext: `${staff.filter(s => s.category !== 'Clinical').length} Admin & Support`,
        },
      ]}
    >
      {/* Benchmarking Note */}
      <div className="p-3.5 rounded-xl bg-teal-50/50 border border-teal-100 flex items-center justify-between gap-3 text-xs text-teal-900 mb-6">
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-teal-700 shrink-0" />
          <span>
            Salary estimates reflect current outpatient clinic compensation benchmarks in <strong>{clinic.location.city}</strong>.
          </span>
        </div>
        <DataBadge type="benchmark" size="xs" />
      </div>

      {/* Staff Role Cards */}
      <div className="space-y-3">
        {staff.map(role => {
          const isEditing = editingId === role.id;
          const roleMonthlyTotal = (isEditing ? editSalary * editCount : role.monthlySalaryEstimate * role.recommendedCount);

          return (
            <div
              key={role.id}
              className="p-4 rounded-xl bg-white border border-slate-200 hover:border-slate-300 transition-colors shadow-2xs"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                {/* Role Title & Category */}
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center shrink-0 mt-0.5">
                    {role.category === 'Clinical' ? (
                      <Stethoscope className="w-4 h-4 text-teal-700" />
                    ) : (
                      <Briefcase className="w-4 h-4 text-slate-600" />
                    )}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-xs sm:text-sm font-bold text-slate-900">{role.roleTitle}</h3>
                      <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                        {role.category}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                      {role.responsibility}
                    </p>
                  </div>
                </div>

                {/* Numbers & Edit Controls */}
                <div className="flex items-center gap-4 shrink-0 self-end md:self-center">
                  {isEditing ? (
                    <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-xl border border-slate-200">
                      <div>
                        <span className="text-[10px] text-slate-400 block uppercase font-bold">Qty</span>
                        <input
                          type="number"
                          min={1}
                          max={10}
                          value={editCount}
                          onChange={e => setEditCount(Math.max(1, Number(e.target.value)))}
                          className="w-14 px-2 py-1 text-xs text-center font-bold bg-white border border-slate-200 rounded"
                        />
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block uppercase font-bold">Monthly Fee</span>
                        <input
                          type="number"
                          step={1000}
                          value={editSalary}
                          onChange={e => setEditSalary(Number(e.target.value))}
                          className="w-24 px-2 py-1 text-xs text-right font-mono font-bold bg-white border border-slate-200 rounded"
                        />
                      </div>
                      <button
                        onClick={() => handleSaveEdit(role.id)}
                        className="p-1.5 bg-teal-700 hover:bg-teal-800 text-white rounded-lg self-end mb-0.5"
                        title="Save Changes"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <span className="text-xs font-bold text-slate-900 block font-mono">
                          {role.recommendedCount} × {formatINR(role.monthlySalaryEstimate)}
                        </span>
                        <span className="text-[11px] text-teal-700 font-semibold font-mono">
                          {formatINR(roleMonthlyTotal)} / mo
                        </span>
                      </div>
                      <button
                        onClick={() => handleStartEdit(role)}
                        className="p-1.5 text-slate-400 hover:text-teal-700 hover:bg-teal-50 rounded-lg transition-colors"
                        title="Edit Headcount or Salary"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </ModulePageShell>
  );
};
