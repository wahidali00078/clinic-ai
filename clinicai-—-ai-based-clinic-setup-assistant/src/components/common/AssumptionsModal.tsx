import React, { useState, useEffect } from 'react';
import { X, Sliders, CheckCircle2, RotateCcw, Info, ArrowRight } from 'lucide-react';
import { useClinic } from '../../context/ClinicContext';
import { formatINR } from '../../utils/formatters';

interface AssumptionsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AssumptionsModal: React.FC<AssumptionsModalProps> = ({ isOpen, onClose }) => {
  const { clinic, costs, revenue, updateClinic, updateRevenueAssumptions, updateCosts, addToast } = useClinic();

  // Local state for all editable assumptions
  const [rentPerSqFt, setRentPerSqFt] = useState<number>(45);
  const [consultationFee, setConsultationFee] = useState<number>(revenue.consultationFee || 500);
  const [expectedPatientsPerDay, setExpectedPatientsPerDay] = useState<number>(revenue.patientsPerDay || 30);
  const [workingDaysPerMonth, setWorkingDaysPerMonth] = useState<number>(revenue.workingDaysPerMonth || 26);
  const [otherServicesFee, setOtherServicesFee] = useState<number>(revenue.otherServicesRevenuePerPatient || 180);
  const [nurseSalary, setNurseSalary] = useState<number>(22000);
  const [receptionistSalary, setReceptionistSalary] = useState<number>(18000);
  const [supportStaffSalary, setSupportStaffSalary] = useState<number>(12000);
  const [electricityMonthly, setElectricityMonthly] = useState<number>(costs.monthlyExpenses.electricity || 9000);
  const [consumablesMonthly, setConsumablesMonthly] = useState<number>(costs.monthlyExpenses.consumables || 15000);
  const [annualGrowthRate, setAnnualGrowthRate] = useState<number>(15);

  // Initialize from clinic when opening
  useEffect(() => {
    if (isOpen) {
      const approxSqFt = clinic.location.approxAreaSqFt || 850;
      const currentRent = costs.monthlyExpenses.rent || 38000;
      setRentPerSqFt(Math.round(currentRent / approxSqFt) || 45);
      setConsultationFee(revenue.consultationFee || 500);
      setExpectedPatientsPerDay(revenue.patientsPerDay || 30);
      setWorkingDaysPerMonth(revenue.workingDaysPerMonth || 26);
      setOtherServicesFee(revenue.otherServicesRevenuePerPatient || 180);
      setElectricityMonthly(costs.monthlyExpenses.electricity || 9000);
      setConsumablesMonthly(costs.monthlyExpenses.consumables || 15000);
    }
  }, [isOpen, clinic, costs, revenue]);

  if (!isOpen) return null;

  const handleSave = async () => {
    const approxSqFt = clinic.location.approxAreaSqFt || 850;
    const computedRent = rentPerSqFt * approxSqFt;

    // 1. Update revenue assumptions
    await updateRevenueAssumptions({
      patientsPerDay: expectedPatientsPerDay,
      consultationFee: consultationFee,
      workingDaysPerMonth: workingDaysPerMonth,
      otherServicesRevenuePerPatient: otherServicesFee,
    });

    // 2. Update monthly costs
    await updateCosts(undefined, {
      rent: computedRent,
      electricity: electricityMonthly,
      consumables: consumablesMonthly,
    });

    // 3. Update clinic capacity and rent budget
    await updateClinic({
      capacity: {
        ...clinic.capacity,
        expectedPatientsPerDay: expectedPatientsPerDay,
      },
      budget: {
        ...clinic.budget,
        monthlyRentBudget: computedRent,
      },
    });

    addToast('Assumptions updated — all budgets and financial forecasts recalculated', 'success');
    onClose();
  };

  const handleResetDefaults = () => {
    setRentPerSqFt(45);
    setConsultationFee(500);
    setExpectedPatientsPerDay(30);
    setWorkingDaysPerMonth(26);
    setOtherServicesFee(180);
    setNurseSalary(22000);
    setReceptionistSalary(18000);
    setSupportStaffSalary(12000);
    setElectricityMonthly(9000);
    setConsumablesMonthly(15000);
    setAnnualGrowthRate(15);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl bg-white rounded-2xl border border-slate-200 shadow-xl my-8 overflow-hidden flex flex-col max-h-[90vh]"
        onClick={e => e.stopPropagation()}
        role="dialog"
        aria-labelledby="assumptions-modal-title"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50/70 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h3 id="assumptions-modal-title" className="text-base font-bold text-slate-900">
                Global Practice Assumptions
              </h3>
              <p className="text-xs text-slate-500">
                Centralized financial and operational baselines used across all calculations
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Informational Guidance Notice */}
        <div className="bg-teal-50/70 border-b border-teal-100 px-5 py-3 flex items-start gap-2.5 text-xs text-teal-900 shrink-0">
          <Info className="w-4 h-4 text-teal-700 shrink-0 mt-0.5" />
          <p>
            Adjust these values to reflect your local market realities. Changing any number here automatically updates your <strong>Startup Budget</strong>, <strong>Monthly Running Costs</strong>, and <strong>Break-Even Forecast</strong> in real time.
          </p>
        </div>

        {/* Scrollable Form Body */}
        <div className="p-5 overflow-y-auto space-y-6 text-slate-800 text-xs">
          {/* Section 1: Patient Footfall & Fees */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
              <span>1. Patient Flow & Fee Assumptions</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Consultation Fee */}
              <div className="space-y-1.5">
                <label className="font-semibold text-slate-800 block">
                  Consultation Fee per Patient (₹)
                </label>
                <p className="text-[11px] text-slate-500">
                  Your baseline doctor consultation charges for general visits
                </p>
                <input
                  type="number"
                  min="100"
                  max="10000"
                  step="50"
                  value={consultationFee}
                  onChange={e => setConsultationFee(Math.max(0, Number(e.target.value)))}
                  placeholder="e.g. ₹500"
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-teal-600 focus:border-teal-600 bg-white"
                />
              </div>

              {/* Patients per day */}
              <div className="space-y-1.5">
                <label className="font-semibold text-slate-800 block">
                  Expected Daily Patient Volume
                </label>
                <p className="text-[11px] text-slate-500">
                  Estimated average patients seen each working day
                </p>
                <input
                  type="number"
                  min="1"
                  max="200"
                  value={expectedPatientsPerDay}
                  onChange={e => setExpectedPatientsPerDay(Math.max(1, Number(e.target.value)))}
                  placeholder="e.g. 30"
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-teal-600 focus:border-teal-600 bg-white"
                />
              </div>

              {/* Working days per month */}
              <div className="space-y-1.5">
                <label className="font-semibold text-slate-800 block">
                  Clinic Working Days per Month
                </label>
                <p className="text-[11px] text-slate-500">
                  Number of operational clinic days each month (usually 24–26)
                </p>
                <input
                  type="number"
                  min="10"
                  max="31"
                  value={workingDaysPerMonth}
                  onChange={e => setWorkingDaysPerMonth(Math.min(31, Math.max(1, Number(e.target.value))))}
                  placeholder="e.g. 26"
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-teal-600 focus:border-teal-600 bg-white"
                />
              </div>

              {/* Ancillary services per patient */}
              <div className="space-y-1.5">
                <label className="font-semibold text-slate-800 block">
                  Add-on Diagnostics / Procedure Fee (₹)
                </label>
                <p className="text-[11px] text-slate-500">
                  Average revenue per patient from ECG, dressing, or lab collection
                </p>
                <input
                  type="number"
                  min="0"
                  max="5000"
                  step="10"
                  value={otherServicesFee}
                  onChange={e => setOtherServicesFee(Math.max(0, Number(e.target.value)))}
                  placeholder="e.g. ₹180"
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-teal-600 focus:border-teal-600 bg-white"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Real Estate & Utility Benchmarks */}
          <div className="pt-4 border-t border-slate-100">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
              <span>2. Real Estate & Operational Expenses</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Rent per Sq Ft */}
              <div className="space-y-1.5">
                <label className="font-semibold text-slate-800 block">
                  Commercial Rent per sq. ft. (₹/month)
                </label>
                <p className="text-[11px] text-slate-500">
                  Current rate: {formatINR(rentPerSqFt * (clinic.location.approxAreaSqFt || 850))}/mo for {clinic.location.approxAreaSqFt || 850} sq.ft
                </p>
                <input
                  type="number"
                  min="10"
                  max="500"
                  value={rentPerSqFt}
                  onChange={e => setRentPerSqFt(Math.max(5, Number(e.target.value)))}
                  placeholder="e.g. 45"
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-teal-600 focus:border-teal-600 bg-white"
                />
              </div>

              {/* Monthly Electricity & Power */}
              <div className="space-y-1.5">
                <label className="font-semibold text-slate-800 block">
                  Monthly Electricity & Air Conditioning (₹)
                </label>
                <p className="text-[11px] text-slate-500">
                  Commercial meter tariff and regular lighting/AC usage
                </p>
                <input
                  type="number"
                  min="1000"
                  max="100000"
                  step="500"
                  value={electricityMonthly}
                  onChange={e => setElectricityMonthly(Math.max(0, Number(e.target.value)))}
                  placeholder="e.g. ₹9000"
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-teal-600 focus:border-teal-600 bg-white"
                />
              </div>

              {/* Monthly Consumables */}
              <div className="space-y-1.5">
                <label className="font-semibold text-slate-800 block">
                  Medical Consumables & Disposables (₹/mo)
                </label>
                <p className="text-[11px] text-slate-500">
                  Syringes, gloves, sanitizer, dressing rolls, prescription stationery
                </p>
                <input
                  type="number"
                  min="1000"
                  max="100000"
                  step="500"
                  value={consumablesMonthly}
                  onChange={e => setConsumablesMonthly(Math.max(0, Number(e.target.value)))}
                  placeholder="e.g. ₹15000"
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-teal-600 focus:border-teal-600 bg-white"
                />
              </div>

              {/* Growth rate */}
              <div className="space-y-1.5">
                <label className="font-semibold text-slate-800 block">
                  Annual Patient Growth Rate (%)
                </label>
                <p className="text-[11px] text-slate-500">
                  Anticipated year-on-year expansion in patient appointments
                </p>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={annualGrowthRate}
                  onChange={e => setAnnualGrowthRate(Math.max(0, Number(e.target.value)))}
                  placeholder="e.g. 15%"
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-teal-600 focus:border-teal-600 bg-white"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Staff Salary Benchmarks */}
          <div className="pt-4 border-t border-slate-100">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
              <span>3. Staff Monthly Salary Benchmarks (Tier-2/Metro Standard)</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="font-semibold text-slate-800 block text-xs">Staff Nurse</span>
                <span className="text-[11px] text-slate-500 block mb-1.5">GNM / B.Sc Nursing</span>
                <input
                  type="number"
                  step="500"
                  value={nurseSalary}
                  onChange={e => setNurseSalary(Number(e.target.value))}
                  placeholder="₹22,000"
                  className="w-full px-2.5 py-1.5 text-xs border border-slate-200 rounded-md bg-white font-medium"
                />
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="font-semibold text-slate-800 block text-xs">Receptionist</span>
                <span className="text-[11px] text-slate-500 block mb-1.5">Billing & Scheduling</span>
                <input
                  type="number"
                  step="500"
                  value={receptionistSalary}
                  onChange={e => setReceptionistSalary(Number(e.target.value))}
                  placeholder="₹18,000"
                  className="w-full px-2.5 py-1.5 text-xs border border-slate-200 rounded-md bg-white font-medium"
                />
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="font-semibold text-slate-800 block text-xs">Support / Helper</span>
                <span className="text-[11px] text-slate-500 block mb-1.5">Sanitization & errands</span>
                <input
                  type="number"
                  step="500"
                  value={supportStaffSalary}
                  onChange={e => setSupportStaffSalary(Number(e.target.value))}
                  placeholder="₹12,000"
                  className="w-full px-2.5 py-1.5 text-xs border border-slate-200 rounded-md bg-white font-medium"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer with Actions */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/70 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <button
            type="button"
            onClick={handleResetDefaults}
            className="text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1.5 hover:bg-slate-100 px-3 py-2 rounded-lg transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset to Standard Benchmarks</span>
          </button>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-4 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg transition-colors"
            >
              Cancel
            </button>
            {/* Exactly ONE Primary Action */}
            <button
              type="button"
              onClick={handleSave}
              className="w-full sm:w-auto px-5 py-2 text-xs font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded-lg shadow-xs transition-colors flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Save & Recalculate Plan</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
