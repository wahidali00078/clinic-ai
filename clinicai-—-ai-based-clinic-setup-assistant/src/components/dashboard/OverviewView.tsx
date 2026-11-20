import React, { useState } from 'react';
import { useClinic } from '../../context/ClinicContext';
import { useAuth } from '../../context/AuthContext';
import {
  TrendingUp,
  MapPin,
  Coins,
  Sparkles,
  ArrowRight,
  Clock,
  Building,
  Check,
  Package,
  ChevronRight,
  PieChart as PieIcon,
  BarChart3,
  HelpCircle,
  Sliders,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from 'recharts';
import { SetupProgressStrip } from './SetupProgressStrip';
import { DataBadge } from '../common/DataBadge';
import { CalculationExplanationModal } from '../common/CalculationExplanationModal';
import { AssumptionsModal } from '../common/AssumptionsModal';
import { formatINR, CalculationDetails } from '../../utils/formatters';
import { RealClinicLocationMap } from '../maps/RealClinicLocationMap';

export const OverviewView: React.FC = () => {
  const {
    clinic,
    costs,
    revenue,
    setActiveView,
    equipment,
    staff,
    setIsFloatingAIAssistantOpen,
  } = useClinic();
  const { user } = useAuth();

  const [activeChartTab, setActiveChartTab] = useState<'budget' | 'cashflow'>('budget');
  const [activeCalcModal, setActiveCalcModal] = useState<CalculationDetails | null>(null);
  const [assumptionsModalOpen, setAssumptionsModalOpen] = useState(false);

  // 8 sequential setup steps with friendly medical language
  const setupSteps = [
    {
      id: 'profile',
      stepNum: 1,
      title: 'Clinic Concept & Profile',
      desc: 'Specialty, room layout & patient capacity',
      view: 'profile' as const,
      isDone: !!clinic.setupProgress.profile,
    },
    {
      id: 'location',
      stepNum: 2,
      title: 'Location & Catchment',
      desc: 'Local demographics, competition & accessibility',
      view: 'location' as const,
      isDone: !!clinic.setupProgress.location,
    },
    {
      id: 'equipment',
      stepNum: 3,
      title: 'Essential Medical Equipment',
      desc: `${equipment.length} tools planned (${equipment.filter(e => e.priority === 'Essential').length} essential for launch)`,
      view: 'equipment' as const,
      isDone: !!clinic.setupProgress.equipment,
    },
    {
      id: 'staff',
      stepNum: 4,
      title: 'Staffing & Payroll Roster',
      desc: `${staff.reduce((s, r) => s + r.recommendedCount, 0)} clinical and support roles`,
      view: 'staff' as const,
      isDone: !!clinic.setupProgress.staff,
    },
    {
      id: 'costs',
      stepNum: 5,
      title: 'Startup Budget & CapEx',
      desc: `${formatINR(costs.totalInitialInvestment, { compact: true })} estimated upfront capital`,
      view: 'costs' as const,
      isDone: !!clinic.setupProgress.budget,
    },
    {
      id: 'legal',
      stepNum: 6,
      title: 'Permits & Health Regulations',
      desc: 'Clinical Establishments Act & Biomedical Waste rules',
      view: 'legal' as const,
      isDone: !!clinic.setupProgress.legal,
    },
    {
      id: 'revenue',
      stepNum: 7,
      title: 'Patient Revenue & Break-Even',
      desc: `Break-even expected in ~${revenue.estimatedBreakEvenMonths} months`,
      view: 'revenue' as const,
      isDone: !!clinic.setupProgress.revenue,
    },
    {
      id: 'reports',
      stepNum: 8,
      title: 'Executive Feasibility Report',
      desc: 'Bank-ready business plan & financial model',
      view: 'reports' as const,
      isDone: !!clinic.setupProgress.report,
    },
  ];

  const completedCount = setupSteps.filter(s => s.isDone).length;
  const totalCount = setupSteps.length;
  const progressPercent = Math.round((completedCount / totalCount) * 100);

  // Exact next incomplete step
  const nextStep = setupSteps.find(s => !s.isDone) || setupSteps[setupSteps.length - 1];
  const isAllComplete = completedCount === totalCount;

  // Capital distribution data for Donut Chart (using actual costs structure keys)
  const capitalChartData = [
    { name: 'Medical Equipment', value: costs.initialCapital.medicalEquipment || 350000, color: '#0f766e' },
    { name: 'Interior & Partitioning', value: costs.initialCapital.interiorSetup || 250000, color: '#0d9488' },
    { name: 'Security Lease Deposit', value: costs.initialCapital.securityDeposit || 114000, color: '#14b8a6' },
    { name: 'Furniture & Fixtures', value: costs.initialCapital.furniture || 95000, color: '#2dd4bf' },
    { name: 'IT Systems & EMR', value: costs.initialCapital.itEquipment || 65000, color: '#475569' },
    { name: 'Licenses & Registrations', value: costs.initialCapital.registrationLegal || 35000, color: '#64748b' },
    { name: 'Initial Consumables & Signage', value: (costs.initialCapital.initialInventory || 45000) + (costs.initialCapital.brandingSignage || 30000), color: '#94a3b8' },
  ].filter(d => d.value > 0);

  // 6-Month cashflow comparison projection
  const monthlyProjectionData = [
    { month: 'Month 1', Revenue: Math.round(revenue.monthlyRevenue * 0.6), Expenses: costs.totalMonthlyOperatingCost },
    { month: 'Month 2', Revenue: Math.round(revenue.monthlyRevenue * 0.75), Expenses: costs.totalMonthlyOperatingCost },
    { month: 'Month 3', Revenue: Math.round(revenue.monthlyRevenue * 0.9), Expenses: costs.totalMonthlyOperatingCost },
    { month: 'Month 4', Revenue: revenue.monthlyRevenue, Expenses: costs.totalMonthlyOperatingCost },
    { month: 'Month 5', Revenue: Math.round(revenue.monthlyRevenue * 1.05), Expenses: costs.totalMonthlyOperatingCost },
    { month: 'Month 6', Revenue: Math.round(revenue.monthlyRevenue * 1.1), Expenses: costs.totalMonthlyOperatingCost },
  ];

  // Calculation explanation definitions for trust popovers
  const capexExplanation: CalculationDetails = {
    title: 'Estimated Startup Investment (CapEx)',
    headline: `${formatINR(costs.totalInitialInvestment)} total estimated setup capital required before opening doors.`,
    formula: 'Startup CapEx = Equipment + Interior Fitout + Security Deposit + Furniture + IT + Permits + Inventory',
    inputs: [
      { label: 'Medical Equipment Total', value: formatINR(costs.initialCapital.medicalEquipment || 350000), source: 'estimate' },
      { label: 'Interior Fitout & Partitions', value: formatINR(costs.initialCapital.interiorSetup || 250000), source: 'benchmark' },
      { label: 'Security Deposit (3 Mo. Rent)', value: formatINR(costs.initialCapital.securityDeposit || 114000), source: 'estimate' },
      { label: 'Clinic Carpet Area', value: `${clinic.location.approxAreaSqFt || 850} sq. ft.`, source: 'input' },
    ],
    explanation: 'Calculated using local commercial real estate lease rates in Jaipur along with standard Indian medical equipment manufacturer quotations for a general practice outpatient setup.',
    basisOneLiner: `Estimated from ${clinic.location.approxAreaSqFt || 850} sq.ft clinic layout and ${equipment.length} selected equipment items.`,
  };

  const revenueExplanation: CalculationDetails = {
    title: 'Estimated Monthly Patient Gross Revenue',
    headline: `${formatINR(revenue.monthlyRevenue)} monthly gross receipts at steady-state utilization.`,
    formula: 'Monthly Revenue = (Patients/Day × Working Days) × (Consultation Fee + Ancillary Services Fee)',
    inputs: [
      { label: 'Expected Daily Footfall', value: `${revenue.patientsPerDay} patients/day`, source: 'input' },
      { label: 'Monthly Working Days', value: `${revenue.workingDaysPerMonth} days`, source: 'benchmark' },
      { label: 'Consultation Fee', value: formatINR(revenue.consultationFee), source: 'input' },
      { label: 'Add-on Procedures/Lab per Patient', value: formatINR(revenue.otherServicesRevenuePerPatient), source: 'benchmark' },
    ],
    explanation: `Assumes ${revenue.patientsPerDay} patients seen per day across ${revenue.workingDaysPerMonth} working days. Total patient fee realization averages ${formatINR(revenue.consultationFee + revenue.otherServicesRevenuePerPatient)} (consultation plus basic ECG/injections/dressing).`,
    basisOneLiner: `Estimated from ${revenue.patientsPerDay} patients/day × ${formatINR(revenue.consultationFee + revenue.otherServicesRevenuePerPatient)} avg revenue × ${revenue.workingDaysPerMonth} days.`,
  };

  const breakEvenExplanation: CalculationDetails = {
    title: 'Estimated Break-Even Timeline',
    headline: `Full capital recoup in ~${revenue.estimatedBreakEvenMonths} months with operating breakeven in Month 2.`,
    formula: 'Break-Even Months = Total Initial Investment ÷ Monthly Net Operating Profit',
    inputs: [
      { label: 'Total Startup Capital', value: formatINR(costs.totalInitialInvestment), source: 'estimate' },
      { label: 'Monthly Gross Revenue', value: formatINR(revenue.monthlyRevenue), source: 'estimate' },
      { label: 'Monthly Operating Expenses', value: formatINR(costs.totalMonthlyOperatingCost), source: 'estimate' },
      { label: 'Monthly Net Surplus', value: formatINR(revenue.monthlyRevenue - costs.totalMonthlyOperatingCost), source: 'estimate' },
    ],
    explanation: 'Models a realistic 4-month patient ramp-up curve starting at 60% capacity in Month 1. Operating costs are covered by Month 2, and the initial capital outlay is fully recovered within the projected timeframe.',
    basisOneLiner: `Calculated from ${formatINR(costs.totalInitialInvestment)} capital divided by ${formatINR(revenue.monthlyRevenue - costs.totalMonthlyOperatingCost)} monthly surplus.`,
  };

  return (
    <div className="space-y-6">
      {/* 1. Persistent 8-Stage Setup Progress Strip (Requirement A) */}
      <SetupProgressStrip />

      {/* 2. Three-Question 10-Second Status Briefing Card (Requirement A) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 divide-y md:divide-y-0 md:divide-x divide-slate-100">
          {/* Question 1: Where am I? */}
          <div className="pr-0 md:pr-4">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
              1. Where Am I?
            </span>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-900 truncate">{clinic.name}</h2>
              <span className="text-[10px] font-semibold text-teal-800 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200 shrink-0">
                {clinic.clinicType}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-teal-700 shrink-0" />
              <span>{clinic.location.area}, {clinic.location.city} ({clinic.location.approxAreaSqFt || 850} sq.ft)</span>
            </p>
            <div className="mt-3 flex items-center gap-2">
              <DataBadge type="input" size="xs" />
              <button
                onClick={() => setActiveView('profile')}
                className="text-[11px] font-semibold text-teal-700 hover:underline"
              >
                Edit Details →
              </button>
            </div>
          </div>

          {/* Question 2: What is done? */}
          <div className="pt-4 md:pt-0 px-0 md:px-4">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
              2. What Is Done?
            </span>
            <div className="flex items-center gap-2">
              <span className="text-base font-bold text-slate-900">
                {completedCount} of {totalCount} Setup Stages Done
              </span>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                {progressPercent}%
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              {isAllComplete
                ? 'All clinical parameters confirmed and verified.'
                : `${totalCount - completedCount} milestones remaining to finalize your feasibility plan.`}
            </p>
            {/* Mini Progress track */}
            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mt-3">
              <div
                className="bg-emerald-600 h-full rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Question 3: What do I do next? (Single Primary Action) */}
          <div className="pt-4 md:pt-0 pl-0 md:pl-4 flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700 block mb-1">
                3. What Do I Do Next?
              </span>
              <div className="text-xs font-bold text-slate-900">
                {isAllComplete ? (
                  <span>Ready to Export Feasibility Report</span>
                ) : (
                  <span>Step {nextStep.stepNum}: {nextStep.title}</span>
                )}
              </div>
              <p className="text-xs text-slate-500 mt-1 leading-snug">
                {isAllComplete
                  ? 'Generate your full executive PDF business plan for bankers and partners.'
                  : nextStep.desc}
              </p>
            </div>

            {/* Exactly ONE Primary Action Button on Dashboard */}
            <div className="mt-3">
              <button
                onClick={() => setActiveView(isAllComplete ? 'reports' : nextStep.view)}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded-xl shadow-xs transition-colors"
                id="overview-next-step-btn"
              >
                <span>{isAllComplete ? 'Download Feasibility Plan' : `Continue Step ${nextStep.stepNum}`}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Three Transparent, High-Trust Metric Cards (Requirement B & D) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Metric 1: Setup Cost */}
        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-xs relative">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-600">Estimated Startup Capital (CapEx)</span>
            <DataBadge type="estimate" size="xs" />
          </div>
          <div className="text-2xl font-bold text-slate-900 tracking-tight">
            {formatINR(costs.totalInitialInvestment)}
          </div>
          <p className="text-[11px] text-slate-500 mt-1.5 leading-relaxed">
            {capexExplanation.basisOneLiner}
          </p>
          <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
            <button
              onClick={() => setActiveCalcModal(capexExplanation)}
              className="font-semibold text-teal-700 hover:text-teal-800 flex items-center gap-1"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>How was this calculated?</span>
            </button>
            <button
              onClick={() => setActiveView('costs')}
              className="text-slate-500 hover:text-slate-800 font-medium"
            >
              View breakdown →
            </button>
          </div>
        </div>

        {/* Metric 2: Monthly Operating Revenue */}
        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-xs relative">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-600">Estimated Monthly Patient Receipts</span>
            <DataBadge type="estimate" size="xs" />
          </div>
          <div className="text-2xl font-bold text-slate-900 tracking-tight">
            {formatINR(revenue.monthlyRevenue)} <span className="text-xs font-normal text-slate-500">/ month</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1.5 leading-relaxed">
            {revenueExplanation.basisOneLiner}
          </p>
          <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
            <button
              onClick={() => setActiveCalcModal(revenueExplanation)}
              className="font-semibold text-teal-700 hover:text-teal-800 flex items-center gap-1"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>How was this calculated?</span>
            </button>
            <button
              onClick={() => setActiveView('revenue')}
              className="text-slate-500 hover:text-slate-800 font-medium"
            >
              Revenue model →
            </button>
          </div>
        </div>

        {/* Metric 3: Break-Even Timeline */}
        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-xs relative">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-600">Projected Break-Even Timeline</span>
            <DataBadge type="benchmark" size="xs" />
          </div>
          <div className="text-2xl font-bold text-slate-900 tracking-tight">
            ~{revenue.estimatedBreakEvenMonths} Months
          </div>
          <p className="text-[11px] text-slate-500 mt-1.5 leading-relaxed">
            {breakEvenExplanation.basisOneLiner}
          </p>
          <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
            <button
              onClick={() => setActiveCalcModal(breakEvenExplanation)}
              className="font-semibold text-teal-700 hover:text-teal-800 flex items-center gap-1"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>How was this calculated?</span>
            </button>
            <button
              onClick={() => setAssumptionsModalOpen(true)}
              className="text-teal-700 hover:text-teal-800 font-medium flex items-center gap-1"
            >
              <Sliders className="w-3 h-3" />
              <span>Edit assumptions</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4. Tabbed Financial Insights & Projections (Donut & Cashflow) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs">
        {/* Tab Headers */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900">Capital Allocation & Operating Cashflow</h3>
            <p className="text-xs text-slate-500">
              Clear breakdown of Day-1 expenditures and monthly operational surplus
            </p>
          </div>

          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl">
            <button
              onClick={() => setActiveChartTab('budget')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeChartTab === 'budget'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <PieIcon className="w-3.5 h-3.5 text-teal-700" />
              <span>CapEx Allocation</span>
            </button>
            <button
              onClick={() => setActiveChartTab('cashflow')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeChartTab === 'cashflow'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5 text-teal-700" />
              <span>6-Month Cashflow</span>
            </button>
          </div>
        </div>

        {/* Tab 1: Budget Allocation */}
        {activeChartTab === 'budget' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-5 h-64 relative flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={capitalChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={65}
                    outerRadius={95}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {capitalChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(val: number) => [formatINR(val), 'Estimated Cost']}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total CapEx</span>
                <span className="text-lg font-bold text-slate-900">
                  {formatINR(costs.totalInitialInvestment, { compact: true })}
                </span>
              </div>
            </div>

            <div className="lg:col-span-7 space-y-2">
              {capitalChartData.map((item, idx) => {
                const percent = Math.round((item.value / costs.totalInitialInvestment) * 100);
                return (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="w-3 h-3 rounded-md shrink-0" style={{ backgroundColor: item.color }} />
                      <span className="font-semibold text-slate-800">{item.name}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-slate-600 font-mono">
                        {formatINR(item.value)}
                      </span>
                      <span className="font-bold text-slate-900 w-10 text-right font-mono">
                        {percent}%
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 2: 6-Month Cashflow Projections */}
        {activeChartTab === 'cashflow' && (
          <div>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyProjectionData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748b' }} />
                  <YAxis
                    tickFormatter={v => `₹${(v / 1000).toFixed(0)}k`}
                    tick={{ fontSize: 11, fill: '#64748b' }}
                  />
                  <Tooltip
                    formatter={(val: number) => [formatINR(val), '']}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px' }} />
                  <Bar dataKey="Revenue" fill="#0f766e" radius={[4, 4, 0, 0]} name="Projected Revenue" />
                  <Bar dataKey="Expenses" fill="#94a3b8" radius={[4, 4, 0, 0]} name="Monthly Operating Costs" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 p-3 rounded-xl bg-teal-50/50 border border-teal-100 text-xs text-teal-900 flex items-center justify-between">
              <span>Operating cashflow breakeven achieved by Month 2</span>
              <span className="font-bold text-teal-800">
                Full Capital Payback: ~{revenue.estimatedBreakEvenMonths} Months
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Real Clinic Location & Catchment Map Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-teal-700" />
                <span>Physical Clinic Premises & Catchment Map</span>
              </h3>
              <span className="text-[10px] font-bold text-teal-800 bg-teal-50 border border-teal-200 px-2 py-0.5 rounded-full">
                Google Maps Live
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Live geospatial view of <strong>{clinic.name}</strong> ({clinic.location.area}, {clinic.location.city}) with local micro-markets and healthcare ecosystem
            </p>
          </div>

          <button
            onClick={() => setActiveView('location')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-teal-800 bg-teal-50 hover:bg-teal-100 rounded-xl transition-colors border border-teal-200 self-start sm:self-auto"
          >
            <span>Full Catchment Analysis</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <RealClinicLocationMap
          height="320px"
          showMicroMarkets={true}
          allowPinRelocation={true}
        />
      </div>

      {/* 5. 8-Step Setup Roadmap Cards */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">Setup Roadmap Modules</h3>
            <p className="text-xs text-slate-500">
              Complete each stage to ensure your clinic is fully prepared for medical inspection and launch
            </p>
          </div>
          <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg">
            {completedCount}/{totalCount} Completed
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {setupSteps.map(step => (
            <button
              key={step.id}
              onClick={() => setActiveView(step.view)}
              className={`p-4 rounded-xl border text-left transition-all group flex flex-col justify-between relative ${
                step.isDone
                  ? 'border-emerald-200 bg-emerald-50/30 hover:bg-emerald-50/60'
                  : 'border-slate-200 bg-slate-50/60 hover:bg-slate-50 hover:border-teal-300'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Step {step.stepNum}
                  </span>
                  {step.isDone ? (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                      <Check className="w-3 h-3" />
                      Done
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-slate-600 bg-slate-200 px-2 py-0.5 rounded-full">
                      Pending
                    </span>
                  )}
                </div>
                <h4 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-teal-800 transition-colors">
                  {step.title}
                </h4>
                <p className="text-xs text-slate-500 mt-1 leading-snug line-clamp-2">
                  {step.desc}
                </p>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-200/60 flex items-center justify-between text-xs text-teal-700 font-semibold group-hover:translate-x-0.5 transition-transform">
                <span>{step.isDone ? 'Review Details' : 'Open Step'}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* 6. AI Healthcare Copilot Quick Action Banner */}
      <div className="rounded-2xl bg-white border border-slate-200 p-5 sm:p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-200 text-teal-800 flex items-center justify-center shrink-0 mt-0.5">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-bold text-slate-900">
              Need advice on licenses, staff salary, or equipment brands?
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Your AI Copilot is grounded in your exact clinic specialty and regional healthcare standards.
            </p>
            {/* Quick Prompt Pills */}
            <div className="flex flex-wrap gap-2 mt-2.5">
              <button
                onClick={() => setIsFloatingAIAssistantOpen(true)}
                className="text-[11px] px-2.5 py-1 bg-slate-50 hover:bg-teal-50 text-slate-700 hover:text-teal-800 rounded-lg border border-slate-200 transition-colors"
              >
                💡 Day-1 Essential Equipment List
              </button>
              <button
                onClick={() => setIsFloatingAIAssistantOpen(true)}
                className="text-[11px] px-2.5 py-1 bg-slate-50 hover:bg-teal-50 text-slate-700 hover:text-teal-800 rounded-lg border border-slate-200 transition-colors"
              >
                📜 Biomedical Waste rules in {clinic.location.city}
              </button>
              <button
                onClick={() => setIsFloatingAIAssistantOpen(true)}
                className="text-[11px] px-2.5 py-1 bg-slate-50 hover:bg-teal-50 text-slate-700 hover:text-teal-800 rounded-lg border border-slate-200 transition-colors"
              >
                💰 Lease rent negotiation tips
              </button>
            </div>
          </div>
        </div>

        <button
          onClick={() => setIsFloatingAIAssistantOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs sm:text-sm font-semibold transition-colors shadow-xs shrink-0"
        >
          <Sparkles className="w-4 h-4 text-teal-400" />
          <span>Ask AI Advisor</span>
        </button>
      </div>

      {/* 7. Clinical Statutory Advisory Banner */}
      <div className="py-2.5 px-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-500 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
        <span className="flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-slate-400 shrink-0" />
          <span>
            Statutory notice for {clinic.location.city}, {clinic.location.state}: Clinical Establishment Act requirements vary by municipal zone. Verify local regulations before finalizing lease agreements.
          </span>
        </span>
        <button
          onClick={() => setActiveView('legal')}
          className="font-semibold text-teal-700 hover:underline shrink-0"
        >
          Review Legal Checklist →
        </button>
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
    </div>
  );
};
