import React, { useState } from 'react';
import { useClinic } from '../../context/ClinicContext';
import {
  ArrowLeft,
  MapPin,
  Stethoscope,
  Users,
  Coins,
  Scale,
  TrendingUp,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  FileText,
  Calculator,
  Building,
  Zap,
} from 'lucide-react';

export const FeaturesPage: React.FC = () => {
  const { setActiveView, goBack } = useClinic();
  const [activeTab, setActiveTab] = useState<number>(0);

  // Quick ROI calculator state
  const [calcPatients, setCalcPatients] = useState<number>(30);
  const [calcFee, setCalcFee] = useState<number>(600);
  const [calcRooms, setCalcRooms] = useState<number>(2);

  const estimatedMonthlyRevenue = calcPatients * calcFee * 26;
  const estimatedCapEx = calcRooms === 1 ? 1800000 : calcRooms === 2 ? 3200000 : 5400000;
  const estimatedBreakEven = Math.max(3, Math.round(estimatedCapEx / (estimatedMonthlyRevenue * 0.35)));

  const modules = [
    {
      id: 'location',
      stepNum: 1,
      name: 'Smart Catchment & Location Intelligence',
      subtitle: 'Demographic density, footfall scoring & competitor mapping',
      icon: MapPin,
      color: 'sky',
      view: 'location' as const,
      highlights: [
        'Pinpoint local healthcare footfall & age distribution in target tier-1/2 cities',
        'Analyze density of existing polyclinics and diagnostic labs in a 3 km radius',
        'Commercial rental benchmarking (per sq. ft. commercial rates)',
        'Footfall viability score (0-100) calibrated with regional patient transit habits',
      ],
      previewStat: '94% Viability Match',
      previewDetail: 'Validated on 1,200+ local urban healthcare micro-markets',
    },
    {
      id: 'equipment',
      stepNum: 2,
      name: 'Tiered Medical Equipment Procurement',
      subtitle: 'Prioritize essential Day-1 tools vs expansion machinery',
      icon: Stethoscope,
      color: 'blue',
      view: 'equipment' as const,
      highlights: [
        'Pre-loaded catalog across 8 medical specialties (Dental, Pediatric, General, Eye, Ortho)',
        '3-tier priority categorization: Day-1 Essential, Growth, and Advanced Diagnostic',
        'Real-world market price ranges, brand recommendations & warranty expectations',
        'Avoid 25%+ upfront capital overspending on idle machines',
      ],
      previewStat: '₹14.8 Lakhs Avg Savings',
      previewDetail: 'By phasing equipment procurement across operational milestones',
    },
    {
      id: 'staff',
      stepNum: 3,
      name: 'Staffing, Payroll & Shift Architecture',
      subtitle: 'Roster clinical specialists, nurses, receptionists & lab technicians',
      icon: Users,
      color: 'indigo',
      view: 'staff' as const,
      highlights: [
        'Automated headcount recommendations based on patient volume and shift count',
        'Local healthcare payroll benchmarks for doctors, duty RMOs, nurses and front-desk',
        'Statutory staff benefits: PF, ESI, professional indemnity and overtime modeling',
        'Doctor-to-patient ratio optimization to minimize wait times',
      ],
      previewStat: '3.5x Staff Utilization',
      previewDetail: 'Optimal staffing ratios aligned with NABH entry-level norms',
    },
    {
      id: 'costs',
      stepNum: 4,
      name: 'Comprehensive CapEx & OpEx Cost Estimator',
      subtitle: 'Real estate, interior fit-outs, software & working capital buffers',
      icon: Coins,
      color: 'emerald',
      view: 'costs' as const,
      highlights: [
        'Granular initial investment modeling: medical fitout, AC/civil, IT, signage, deposits',
        '3-month working capital cashflow cushion to survive initial patient ramp-up',
        'Monthly recurring expenses: rent, salaries, consumables, utilities, bio-waste disposal',
        'Live budget alerts when CapEx approaches credit or personal savings limits',
      ],
      previewStat: '100% Budget Precision',
      previewDetail: 'Zero hidden surprise line items before signing commercial leases',
    },
    {
      id: 'legal',
      stepNum: 5,
      name: 'Statutory Permits & Regulatory Compliance',
      subtitle: 'State Clinical Establishments Act, Biomedical Waste, Fire Safety & AERB',
      icon: Scale,
      color: 'purple',
      view: 'legal' as const,
      highlights: [
        'State-specific Clinical Establishments Act (CEA) registration checklist',
        'Biomedical Waste Management (BMWM) authorization from State Pollution Control Board',
        'Fire NOC, municipal trade license, building occupancy & pharmacy drug licenses',
        'Direct download links, required documentation, penalty advisories & processing times',
      ],
      previewStat: '12 Essential Permits',
      previewDetail: 'Curated for Indian municipal and state health authority compliance',
    },
    {
      id: 'revenue',
      stepNum: 6,
      name: '3-Year Revenue & Break-Even Forecasting',
      subtitle: 'Unit economics per consultation, lab markups & break-even timeline',
      icon: TrendingUp,
      color: 'amber',
      view: 'revenue' as const,
      highlights: [
        'Customizable patient ramp-up curve (Month 1 conservative to Month 12 maturity)',
        'Blended revenue modeling: consultation fee + minor procedures + pharmacy + diagnostics',
        'Dynamic break-even target calculator (in months)',
        'Net margin projections and EBITDA estimation for commercial bank presentations',
      ],
      previewStat: '8-14 Months',
      previewDetail: 'Average break-even timeline for clinics planned on ClinicAI',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top Breadcrumb & Quick Back Bar */}
      <div className="bg-white border-b border-slate-200 sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={goBack}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold text-slate-700 hover:text-sky-700 bg-slate-100 hover:bg-sky-50 border border-slate-200 transition-colors shadow-xs"
              id="back-button-features-top"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            <div className="h-4 w-px bg-slate-200" />
            <span className="text-xs text-slate-500 font-medium">
              Home <span className="text-slate-300">/</span> <strong className="text-slate-800">Features</strong>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveView('dashboard')}
              className="text-xs font-semibold text-sky-600 hover:text-sky-700 bg-sky-50 px-3 py-1.5 rounded-lg border border-sky-200 transition-colors"
            >
              Open Interactive App →
            </button>
          </div>
        </div>
      </div>

      {/* Main Hero Header */}
      <div className="bg-white border-b border-slate-200 py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 border border-sky-200 text-sky-700 text-xs font-bold uppercase tracking-wider mb-4">
              <Zap className="w-3.5 h-3.5" />
              Enterprise Healthcare Planning Suite
            </div>
            <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
              Every tool a doctor needs to launch a thriving clinic.
            </h1>
            <p className="text-base sm:text-lg text-slate-600 mt-4 leading-relaxed">
              From day-one demographic catchment scoring and medical equipment catalogs to compliance licenses and 3-year revenue forecasts, ClinicAI eliminates guesswork.
            </p>
          </div>
        </div>
      </div>

      {/* Deep-Dive Feature Modules */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Module Selector List */}
          <div className="lg:col-span-4 space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 px-2 mb-2">
              Setup Modules & Capabilities
            </h3>
            {modules.map((mod, idx) => {
              const Icon = mod.icon;
              const isSelected = activeTab === idx;
              return (
                <button
                  key={mod.id}
                  onClick={() => setActiveTab(idx)}
                  className={`w-full text-left p-4 rounded-xl border transition-all flex items-start gap-3.5 ${
                    isSelected
                      ? 'bg-white border-sky-500 shadow-md ring-1 ring-sky-500/20'
                      : 'bg-white/60 border-slate-200 hover:bg-white hover:border-slate-300'
                  }`}
                >
                  <div
                    className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                      isSelected ? 'bg-sky-600 text-white' : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase font-bold text-sky-600 tracking-wider">
                        Step {mod.stepNum}
                      </span>
                      {isSelected && (
                        <span className="text-[10px] font-bold text-sky-700 bg-sky-100 px-1.5 py-0.5 rounded">
                          Active
                        </span>
                      )}
                    </div>
                    <h4 className="text-sm font-bold text-slate-800 mt-0.5 truncate">{mod.name}</h4>
                    <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{mod.subtitle}</p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Detailed Module View */}
          <div className="lg:col-span-8">
            {(() => {
              const current = modules[activeTab];
              const Icon = current.icon;
              return (
                <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center shrink-0">
                        <Icon className="w-6 h-6" />
                      </div>
                      <div>
                        <span className="text-xs font-bold uppercase tracking-wider text-sky-700">
                          Step {current.stepNum} Module
                        </span>
                        <h2 className="text-xl sm:text-2xl font-bold text-slate-900">{current.name}</h2>
                        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">{current.subtitle}</p>
                      </div>
                    </div>

                    <button
                      onClick={() => setActiveView(current.view)}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white font-semibold text-xs rounded-xl shadow-sm transition-all shrink-0"
                    >
                      <span>Test in App</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Highlights Grid */}
                  <div className="py-6">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
                      Core Functional Capabilities
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      {current.highlights.map((h, i) => (
                        <div key={i} className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span className="text-xs text-slate-700 leading-relaxed font-medium">{h}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Stat Card */}
                  <div className="p-4 rounded-xl bg-gradient-to-br from-slate-900 to-slate-800 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-sky-400 tracking-wider">
                        Impact Benchmark
                      </span>
                      <div className="text-2xl font-extrabold text-white mt-0.5">{current.previewStat}</div>
                      <p className="text-xs text-slate-300 mt-0.5">{current.previewDetail}</p>
                    </div>
                    <button
                      onClick={() => setActiveView(current.view)}
                      className="px-4 py-2 bg-white text-slate-900 font-bold text-xs rounded-lg hover:bg-slate-100 transition-colors shrink-0"
                    >
                      Explore {current.name.split(' ')[0]} Tool →
                    </button>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>

        {/* Interactive Quick ROI Calculator */}
        <div className="mt-12 bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-100">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-700 bg-sky-50 px-2.5 py-0.5 rounded-full border border-sky-200 mb-2">
                <Calculator className="w-3.5 h-3.5" />
                Live Planning Estimator
              </div>
              <h3 className="text-xl font-bold text-slate-900">
                Simulate Your Clinic Economics in 10 Seconds
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xl">
                Adjust expected daily footfall, consultation fee, and room capacity to see instant CapEx and break-even timelines.
              </p>
            </div>

            <button
              onClick={() => setActiveView('costs')}
              className="px-4 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-all shadow-sm shrink-0"
            >
              Open Full Financial Engine →
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
            <div className="lg:col-span-6 space-y-4">
              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1.5">
                  <span>Target Patients / Day:</span>
                  <span className="font-bold text-sky-700">{calcPatients} patients</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="80"
                  step="5"
                  value={calcPatients}
                  onChange={e => setCalcPatients(Number(e.target.value))}
                  className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-sky-600"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1.5">
                  <span>Consultation Fee:</span>
                  <span className="font-bold text-sky-700">₹{calcFee}</span>
                </div>
                <input
                  type="range"
                  min="200"
                  max="1500"
                  step="50"
                  value={calcFee}
                  onChange={e => setCalcFee(Number(e.target.value))}
                  className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-sky-600"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1.5">
                  <span>Consultation Rooms:</span>
                  <span className="font-bold text-sky-700">{calcRooms} Rooms</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {[1, 2, 4].map(rooms => (
                    <button
                      key={rooms}
                      onClick={() => setCalcRooms(rooms)}
                      className={`py-2 text-xs font-bold rounded-lg border transition-all ${
                        calcRooms === rooms
                          ? 'bg-sky-600 text-white border-sky-600 shadow-xs'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {rooms} {rooms === 1 ? 'Room' : 'Rooms'}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex flex-col justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Est. Total CapEx</span>
                <div className="text-xl font-black text-slate-900 my-2">
                  ₹{(estimatedCapEx / 100000).toFixed(1)} Lakhs
                </div>
                <span className="text-[10px] text-slate-500">Fitout + Equipment + Deposit</span>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex flex-col justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Est. Monthly Gross</span>
                <div className="text-xl font-black text-slate-900 my-2">
                  ₹{(estimatedMonthlyRevenue / 100000).toFixed(2)} Lakhs
                </div>
                <span className="text-[10px] text-emerald-600 font-semibold">26 Working Days</span>
              </div>

              <div className="p-4 rounded-xl bg-sky-50 border border-sky-100 flex flex-col justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-sky-700">Est. Break-Even</span>
                <div className="text-xl font-black text-sky-900 my-2">
                  ~{estimatedBreakEven} Months
                </div>
                <span className="text-[10px] text-sky-700 font-semibold">Net Cashflow Ramp</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Back Button & Action CTA */}
        <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-4 p-6 rounded-2xl bg-white border border-slate-200">
          <button
            onClick={goBack}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-colors"
            id="back-button-features-bottom"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>← Back to Previous Page</span>
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveView('onboarding')}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-sky-600 hover:bg-sky-700 shadow-sm transition-all"
            >
              <Sparkles className="w-4 h-4 text-sky-200" />
              <span>Start Your Clinic Feasibility Plan Free</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
