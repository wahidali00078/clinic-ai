import React, { useState } from 'react';
import { useClinic } from '../../context/ClinicContext';
import {
  TrendingUp,
  Coins,
  Calendar,
  Sparkles,
  AlertCircle,
  HelpCircle,
  BarChart2,
  Sliders,
  Info,
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
} from 'recharts';
import { ModulePageShell } from './ModulePageShell';
import { DataBadge } from '../common/DataBadge';
import { CalculationExplanationModal } from '../common/CalculationExplanationModal';
import { AssumptionsModal } from '../common/AssumptionsModal';
import { formatINR, CalculationDetails } from '../../utils/formatters';

export const RevenueForecastView: React.FC = () => {
  const { revenue, clinic, costs, updateRevenueAssumptions, setActiveView } = useClinic();

  const [patientsPerDay, setPatientsPerDay] = useState(revenue.patientsPerDay);
  const [consultationFee, setConsultationFee] = useState(revenue.consultationFee);
  const [workingDaysPerMonth, setWorkingDaysPerMonth] = useState(revenue.workingDaysPerMonth);
  const [otherServices, setOtherServices] = useState(revenue.otherServicesRevenuePerPatient);

  const [scenario, setScenario] = useState<'conservative' | 'realistic' | 'optimistic'>('realistic');
  const [activeCalcModal, setActiveCalcModal] = useState<CalculationDetails | null>(null);
  const [assumptionsModalOpen, setAssumptionsModalOpen] = useState(false);

  const handlePatientsChange = (val: number) => {
    setPatientsPerDay(val);
    updateRevenueAssumptions({ patientsPerDay: val });
  };

  const handleFeeChange = (val: number) => {
    setConsultationFee(val);
    updateRevenueAssumptions({ consultationFee: val });
  };

  const handleDaysChange = (val: number) => {
    setWorkingDaysPerMonth(val);
    updateRevenueAssumptions({ workingDaysPerMonth: val });
  };

  const handleOtherChange = (val: number) => {
    setOtherServices(val);
    updateRevenueAssumptions({ otherServicesRevenuePerPatient: val });
  };

  // Scenario multipliers
  const scenarioMultipliers = {
    conservative: 0.7,
    realistic: 1.0,
    optimistic: 1.3,
  };

  const activeMultiplier = scenarioMultipliers[scenario];
  const effectiveMonthlyRevenue = Math.round(revenue.monthlyRevenue * activeMultiplier);
  const effectiveMonthlyProfit = Math.round(effectiveMonthlyRevenue - costs.totalMonthlyOperatingCost);
  const effectiveMargin = effectiveMonthlyRevenue > 0
    ? Math.round((effectiveMonthlyProfit / effectiveMonthlyRevenue) * 100)
    : 0;

  const effectiveBreakEvenMonths = effectiveMonthlyProfit > 0
    ? Number((costs.totalInitialInvestment / effectiveMonthlyProfit).toFixed(1))
    : 99;

  // Build 12-Month Cumulative Cash Flow Curve
  const initialCap = costs.totalInitialInvestment;
  let cumulative = -initialCap;

  const cashflowData = Array.from({ length: 12 }, (_, i) => {
    const month = i + 1;
    // Patient ramp-up curve
    const rampFactor = month === 1 ? 0.6 : month === 2 ? 0.75 : month === 3 ? 0.9 : 1.0 + (month - 4) * 0.02;
    const mRev = Math.round(revenue.monthlyRevenue * activeMultiplier * rampFactor);
    const mExp = costs.totalMonthlyOperatingCost;
    const mNet = mRev - mExp;
    cumulative += mNet;

    return {
      month: `M${month}`,
      MonthlyRevenue: mRev,
      MonthlyProfit: mNet,
      CumulativeCashflow: cumulative,
    };
  });

  const revenueCalcDetails: CalculationDetails = {
    title: 'Projected Monthly Patient Gross Revenue',
    headline: `${formatINR(effectiveMonthlyRevenue)} projected monthly patient gross billing in steady-state practice.`,
    formula: 'Monthly Revenue = (Patients/Day × Working Days) × (Doctor Fee + Ancillary Fee)',
    inputs: [
      { label: 'Patient Footfall', value: `${patientsPerDay} patients/day`, source: 'input' },
      { label: 'Consultation Fee', value: formatINR(consultationFee), source: 'input' },
      { label: 'Ancillary/Lab Fee per Patient', value: formatINR(otherServices), source: 'benchmark' },
      { label: 'Monthly Working Days', value: `${workingDaysPerMonth} days`, source: 'benchmark' },
    ],
    explanation: 'Calculated using your direct input on consultation fee and expected throughput, plus average outpatient diagnostics and minor procedure utilization.',
    basisOneLiner: `Modeled at ${patientsPerDay} patients/day × ${formatINR(consultationFee + otherServices)} avg realization × ${workingDaysPerMonth} working days.`,
  };

  const breakEvenCalcDetails: CalculationDetails = {
    title: 'Projected Capital Break-Even Timeline',
    headline: `Estimated capital recovery in ~${effectiveBreakEvenMonths} months based on net operational surplus.`,
    formula: 'Break-Even Months = Total Startup Capital ÷ (Projected Monthly Revenue - Monthly Operating Costs)',
    inputs: [
      { label: 'Startup Capital (CapEx)', value: formatINR(costs.totalInitialInvestment), source: 'estimate' },
      { label: 'Monthly Gross Revenue', value: formatINR(effectiveMonthlyRevenue), source: 'estimate' },
      { label: 'Monthly Operating Costs', value: formatINR(costs.totalMonthlyOperatingCost), source: 'estimate' },
      { label: 'Monthly Net Surplus', value: formatINR(effectiveMonthlyProfit), source: 'estimate' },
    ],
    explanation: 'Models monthly net operating cash flows after deducting staff salaries, rent, consumables, and utility bills from patient receipts.',
    basisOneLiner: `Derived from ${formatINR(costs.totalInitialInvestment)} initial capital divided by ${formatINR(effectiveMonthlyProfit)} monthly net surplus.`,
  };

  return (
    <ModulePageShell
      stepNumber={7}
      totalSteps={8}
      title="Patient Revenue & Break-Even Projections"
      description="Interactive financial modeling to estimate patient footfall, gross receipts, and capital recovery timelines."
      statusBadge="In Progress"
      primaryActionLabel="Finalize & View Feasibility Report"
      onPrimaryAction={() => setActiveView('reports')}
      secondaryActionLabel="Back to Permits"
      onSecondaryAction={() => setActiveView('legal')}
      summaryMetrics={[
        {
          label: 'Projected Monthly Revenue',
          value: formatINR(effectiveMonthlyRevenue),
          subtext: `${formatINR(effectiveMonthlyProfit)} net surplus / mo`,
        },
        {
          label: 'Projected Break-Even',
          value: `~${effectiveBreakEvenMonths} Mo`,
          subtext: 'Operating breakeven in M2',
        },
        {
          label: 'Operating Margin',
          value: `${effectiveMargin}%`,
          subtext: `At ${scenario} projection level`,
        },
      ]}
    >
      {/* Scenario Mode Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-2 bg-slate-100 rounded-xl mb-6">
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-semibold text-slate-500 pl-2">Ramp-Up Scenario:</span>
          {(['conservative', 'realistic', 'optimistic'] as const).map(scen => (
            <button
              key={scen}
              onClick={() => setScenario(scen)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                scenario === scen
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {scen} {scen === 'conservative' ? '(-30%)' : scen === 'optimistic' ? '(+30%)' : ''}
            </button>
          ))}
        </div>

        <button
          onClick={() => setAssumptionsModalOpen(true)}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-700 hover:text-teal-800 bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-2xs self-end sm:self-auto"
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>Edit Benchmarks</span>
        </button>
      </div>

      {/* Interactive Sliders & Inputs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Left: Interactive Variables */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h3 className="text-xs sm:text-sm font-bold text-slate-900">Practice Footfall & Fee Inputs</h3>
            <DataBadge type="input" size="xs" />
          </div>

          {/* Daily Patients */}
          <div>
            <div className="flex justify-between text-xs mb-1.5">
              <span className="font-semibold text-slate-700">Planned Patient Footfall</span>
              <span className="font-bold font-mono text-teal-800">{patientsPerDay} patients / day</span>
            </div>
            <input
              type="range"
              min={10}
              max={80}
              step={2}
              value={patientsPerDay}
              onChange={e => handlePatientsChange(Number(e.target.value))}
              className="w-full accent-teal-700 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1">
              <span>10 (Gentle start)</span>
              <span>45 (Standard OP)</span>
              <span>80 (Busy polyclinic)</span>
            </div>
          </div>

          {/* Consultation Fee */}
          <div>
            <div className="flex justify-between text-xs mb-1.5">
              <span className="font-semibold text-slate-700">Doctor Consultation Fee</span>
              <span className="font-bold font-mono text-teal-800">{formatINR(consultationFee)}</span>
            </div>
            <input
              type="range"
              min={200}
              max={1500}
              step={50}
              value={consultationFee}
              onChange={e => handleFeeChange(Number(e.target.value))}
              className="w-full accent-teal-700 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1">
              <span>₹200 (Accessible)</span>
              <span>₹500 (Regional avg)</span>
              <span>₹1,500 (Super-specialist)</span>
            </div>
          </div>

          {/* Working Days */}
          <div>
            <div className="flex justify-between text-xs mb-1.5">
              <span className="font-semibold text-slate-700">Operating Days per Month</span>
              <span className="font-bold font-mono text-teal-800">{workingDaysPerMonth} days</span>
            </div>
            <input
              type="range"
              min={20}
              max={30}
              step={1}
              value={workingDaysPerMonth}
              onChange={e => handleDaysChange(Number(e.target.value))}
              className="w-full accent-teal-700 cursor-pointer"
            />
          </div>

          {/* Ancillary Services per patient */}
          <div>
            <div className="flex justify-between text-xs mb-1.5">
              <span className="font-semibold text-slate-700">Add-on Diagnostics / Dressing Fee</span>
              <span className="font-bold font-mono text-teal-800">{formatINR(otherServices)} / patient</span>
            </div>
            <input
              type="range"
              min={0}
              max={600}
              step={20}
              value={otherServices}
              onChange={e => handleOtherChange(Number(e.target.value))}
              className="w-full accent-teal-700 cursor-pointer"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              Average realization from in-clinic blood sugar tests, ECGs, injections, and wound dressings.
            </p>
          </div>
        </div>

        {/* Right: Real-time Monthly Net Profit & Break-Even Snapshot */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-xs sm:text-sm font-bold text-slate-900">Projected Operational Bottom-Line</h3>
              <DataBadge type="estimate" size="xs" />
            </div>

            <div className="mt-4 space-y-3">
              <div className="flex justify-between items-center text-xs p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-600">Projected Gross Revenue:</span>
                <span className="font-bold font-mono text-slate-900">{formatINR(effectiveMonthlyRevenue)}</span>
              </div>
              <div className="flex justify-between items-center text-xs p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-600">Monthly Operating Expenses:</span>
                <span className="font-bold font-mono text-rose-700">- {formatINR(costs.totalMonthlyOperatingCost)}</span>
              </div>
              <div className="flex justify-between items-center text-sm p-3 rounded-xl bg-teal-50 border border-teal-200">
                <span className="font-bold text-teal-950">Net Monthly Operating Surplus:</span>
                <span className="font-bold font-mono text-teal-900 text-base">{formatINR(effectiveMonthlyProfit)}</span>
              </div>
            </div>

            <div className="mt-4 p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-1">
              <div className="flex justify-between">
                <span>Estimated Startup CapEx:</span>
                <span className="font-mono font-bold text-slate-900">{formatINR(costs.totalInitialInvestment)}</span>
              </div>
              <div className="flex justify-between">
                <span>Calculated Break-Even Timeline:</span>
                <span className="font-mono font-bold text-teal-800">~{effectiveBreakEvenMonths} Months</span>
              </div>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between text-xs">
            <button
              onClick={() => setActiveCalcModal(revenueCalcDetails)}
              className="text-teal-700 hover:text-teal-800 font-semibold flex items-center gap-1"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>How revenue is calculated</span>
            </button>
            <button
              onClick={() => setActiveCalcModal(breakEvenCalcDetails)}
              className="text-teal-700 hover:text-teal-800 font-semibold flex items-center gap-1"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Break-even logic</span>
            </button>
          </div>
        </div>
      </div>

      {/* 12-Month Cumulative Cash Flow Chart */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">12-Month Projected Cash Flow & Break-Even Curve</h3>
            <p className="text-xs text-slate-500">
              Visualizes the transition from initial negative cash outlay to net positive cumulative practice returns
            </p>
          </div>
          <span className="text-xs font-bold text-teal-800 bg-teal-50 px-2.5 py-1 rounded-lg border border-teal-200">
            Break-Even: ~M{Math.ceil(effectiveBreakEvenMonths)}
          </span>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={cashflowData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748b' }} />
              <YAxis
                tickFormatter={v => `₹${(v / 100000).toFixed(1)}L`}
                tick={{ fontSize: 11, fill: '#64748b' }}
              />
              <Tooltip formatter={(val: number) => [formatINR(val), '']} />
              <Legend wrapperStyle={{ fontSize: '11px' }} />
              <ReferenceLine y={0} stroke="#dc2626" strokeDasharray="3 3" label={{ value: 'Capital Break-Even Line', fill: '#dc2626', fontSize: 10, position: 'insideTopLeft' }} />
              <Line
                type="monotone"
                dataKey="CumulativeCashflow"
                name="Cumulative Net Cash Flow"
                stroke="#0f766e"
                strokeWidth={3}
                dot={{ r: 3 }}
              />
              <Line
                type="monotone"
                dataKey="MonthlyRevenue"
                name="Monthly Patient Billing"
                stroke="#64748b"
                strokeWidth={1.5}
                strokeDasharray="4 4"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Transparent Disclaimer */}
      <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-500 flex items-start gap-2 mt-4">
        <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
        <span>
          These projections are models based on doctor-entered fee schedules and regional healthcare footfall patterns. Patient acquisition speed depends heavily on clinic visibility, doctor reputation, and local community outreach.
        </span>
      </div>

      {/* Modals */}
      <CalculationExplanationModal
        isOpen={!!activeCalcModal}
        onClose={() => setActiveCalcModal(null)}
        details={activeCalcModal}
        onOpenAssumptions={() => setAssumptionsModalOpen(true)}
      />
      <AssumptionsModal
        isOpen={assumptionsModalOpen}
        onClose={() => setAssumptionsModalOpen(false)}
      />
    </ModulePageShell>
  );
};
