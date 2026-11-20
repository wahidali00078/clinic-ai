import React, { useState } from 'react';
import { useClinic } from '../../context/ClinicContext';
import {
  ArrowLeft,
  Check,
  ChevronRight,
  Sparkles,
  MapPin,
  Stethoscope,
  Users,
  Coins,
  Scale,
  TrendingUp,
  FileText,
  Lightbulb,
  Building,
  ShieldCheck,
} from 'lucide-react';

export const HowItWorksPage: React.FC = () => {
  const { setActiveView, goBack, clinic } = useClinic();
  const [selectedWorkflowStep, setSelectedWorkflowStep] = useState<number>(1);

  const steps = [
    {
      stepNum: 1,
      title: 'Define Clinic Specialty & Capacity',
      shortDesc: 'Choose your medical domain, consultation rooms, and target daily footfall.',
      icon: Stethoscope,
      details: [
        'Select from 8 specialties: Dental, Pediatrics, Dermatology, Ophthalmology, Ortho, Physio, or Multi-Specialty.',
        'Set expected daily patient capacity (10 to 100+ patients/day).',
        'Configure operating hours and days per week to calibrate nursing shift schedules.',
      ],
      interactivePrompt: 'Try setting your clinic profile in the Onboarding Wizard.',
      ctaView: 'profile' as const,
      ctaLabel: 'View Profile Setup',
    },
    {
      stepNum: 2,
      title: 'Analyze Catchment & Competitor Footfall',
      shortDesc: 'AI models local demographics, healthcare expenditure, and surrounding clinics.',
      icon: MapPin,
      details: [
        'Enter city and local neighborhood (e.g., Malviya Nagar, Jaipur or Bandra, Mumbai).',
        'Receive instant Viability Score (0-100) based on age demographics, income tiers, and commercial lease averages.',
        'View benchmarked commercial rent ranges per square foot to prevent lease overpayment.',
      ],
      interactivePrompt: 'Explore catchment scores for Indian cities.',
      ctaView: 'location' as const,
      ctaLabel: 'Explore Location Engine',
    },
    {
      stepNum: 3,
      title: 'Assemble Equipment & Staffing Roster',
      shortDesc: 'Pre-loaded clinical catalogs automatically separate essential Day-1 tools from expansion items.',
      icon: Users,
      details: [
        'Review curated lists of certified diagnostic tools, sterilization equipment, and examination beds.',
        'Toggle items as Owned, Planned, or Deferred with real-time CapEx price updates.',
        'Auto-generate duty doctor, staff nurse, and front-office headcount with regional salary benchmarks.',
      ],
      interactivePrompt: 'Review equipment & staffing presets.',
      ctaView: 'equipment' as const,
      ctaLabel: 'Open Equipment Catalog',
    },
    {
      stepNum: 4,
      title: 'Calibrate Startup Budget & Compliance',
      shortDesc: 'Calculate total CapEx, monthly OpEx, and regional statutory permits.',
      icon: Scale,
      details: [
        'Calculate fit-outs, security deposit, signage, IT infrastructure, and working capital buffers.',
        'State-specific Clinical Establishments Act (CEA) registration guides.',
        'Biomedical Waste (BMW) disposal, Fire NOC, and pharmacy licensing guidelines.',
      ],
      interactivePrompt: 'Check your statutory licensing checklist.',
      ctaView: 'legal' as const,
      ctaLabel: 'View Compliance Roadmap',
    },
    {
      stepNum: 5,
      title: 'Generate Bank-Ready Feasibility Dossier',
      shortDesc: 'Export a professional, investor-ready executive PDF report with one click.',
      icon: FileText,
      details: [
        'Comprehensive 3-year cashflow projections, EBITDA margins, and break-even timelines.',
        'Bank-compliant format designed specifically for healthcare enterprise loans (MUDRA / CGTMSE / NBFC).',
        'Includes executive summary, equipment inventory schedules, and regulatory milestone roadmap.',
      ],
      interactivePrompt: 'Download or print your sample report.',
      ctaView: 'reports' as const,
      ctaLabel: 'Generate Feasibility Dossier',
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
              id="back-button-howitworks-top"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            <div className="h-4 w-px bg-slate-200" />
            <span className="text-xs text-slate-500 font-medium">
              Home <span className="text-slate-300">/</span> <strong className="text-slate-800">How It Works</strong>
            </span>
          </div>

          <button
            onClick={() => setActiveView('dashboard')}
            className="text-xs font-semibold text-sky-600 hover:text-sky-700 bg-sky-50 px-3 py-1.5 rounded-lg border border-sky-200 transition-colors"
          >
            Launch Clinic Dashboard →
          </button>
        </div>
      </div>

      {/* Hero Header */}
      <div className="bg-white border-b border-slate-200 py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-3xl mx-auto">
          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-700 bg-sky-50 px-3 py-1 rounded-full border border-sky-200 uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            Simple 5-Step Process
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            How ClinicAI transforms your vision into an operational clinic.
          </h1>
          <p className="text-base sm:text-lg text-slate-600 mt-4 leading-relaxed">
            Traditional clinic consulting takes 6 to 9 months and costs lakhs in retainer fees. Here is how our data-driven engine gets you launch-ready in days.
          </p>
        </div>
      </div>

      {/* Interactive 5-Step Workflow Simulator */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Step Progress Stepper */}
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 mb-8">
          {steps.map(s => {
            const Icon = s.icon;
            const isSelected = selectedWorkflowStep === s.stepNum;
            return (
              <button
                key={s.stepNum}
                onClick={() => setSelectedWorkflowStep(s.stepNum)}
                className={`p-4 rounded-xl border text-left transition-all relative ${
                  isSelected
                    ? 'bg-white border-sky-600 shadow-md ring-1 ring-sky-600/20'
                    : 'bg-white/70 border-slate-200 hover:bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      isSelected ? 'bg-sky-600 text-white' : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {s.stepNum}
                  </span>
                  <Icon className={`w-4 h-4 ${isSelected ? 'text-sky-600' : 'text-slate-400'}`} />
                </div>
                <h4 className="text-xs font-bold text-slate-800 line-clamp-1">{s.title}</h4>
              </button>
            );
          })}
        </div>

        {/* Selected Step Deep Dive Card */}
        {(() => {
          const current = steps.find(s => s.stepNum === selectedWorkflowStep) || steps[0];
          const Icon = current.icon;
          return (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-10 shadow-sm">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-8 border-b border-slate-100">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-sky-100 text-sky-700 flex items-center justify-center shrink-0">
                    <Icon className="w-7 h-7" />
                  </div>
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-sky-600 block">
                      Step {current.stepNum} of 5
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
                      {current.title}
                    </h2>
                    <p className="text-sm sm:text-base text-slate-500 mt-1">{current.shortDesc}</p>
                  </div>
                </div>

                <button
                  onClick={() => setActiveView(current.ctaView)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all shrink-0"
                >
                  <span>{current.ctaLabel}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* Step Details */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-8">
                {current.details.map((d, i) => (
                  <div key={i} className="p-5 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
                    <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs font-bold">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                    <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">{d}</p>
                  </div>
                ))}
              </div>

              {/* Interactive Navigation Footer */}
              <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
                <button
                  disabled={selectedWorkflowStep === 1}
                  onClick={() => setSelectedWorkflowStep(prev => Math.max(1, prev - 1))}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  ← Previous Step
                </button>
                <div className="flex items-center gap-1.5">
                  {[1, 2, 3, 4, 5].map(dot => (
                    <button
                      key={dot}
                      onClick={() => setSelectedWorkflowStep(dot)}
                      className={`w-2 h-2 rounded-full transition-all ${
                        selectedWorkflowStep === dot ? 'w-6 bg-sky-600' : 'bg-slate-200'
                      }`}
                    />
                  ))}
                </div>
                <button
                  disabled={selectedWorkflowStep === 5}
                  onClick={() => setSelectedWorkflowStep(prev => Math.min(5, prev + 1))}
                  className="px-4 py-2 text-xs font-bold text-sky-700 hover:text-sky-800 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Next Step →
                </button>
              </div>
            </div>
          );
        })()}

        {/* Bottom Back & Launch Bar */}
        <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-4 p-6 rounded-2xl bg-white border border-slate-200">
          <button
            onClick={goBack}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-colors"
            id="back-button-howitworks-bottom"
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
              <span>Try Onboarding Wizard Now</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
