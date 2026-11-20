import React from 'react';
import { useClinic } from '../../context/ClinicContext';
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  TrendingUp,
  ShieldCheck,
  Clock,
  Coins,
  Sparkles,
  Building,
  HeartHandshake,
  Award,
  ChevronRight,
} from 'lucide-react';

export const BenefitsPage: React.FC = () => {
  const { setActiveView, goBack } = useClinic();

  const comparisons = [
    {
      metric: 'Planning & Setup Time',
      traditional: '6 to 9 months of trial-and-error',
      clinicAI: 'Under 14 days with automated roadmaps',
      benefit: '7x Faster Execution',
    },
    {
      metric: 'Consulting Retainer Fees',
      traditional: '₹2.5 Lakhs - ₹8 Lakhs upfront',
      clinicAI: '100% Free during Beta (or low SaaS sub)',
      benefit: 'Save ₹5L+ in fees',
    },
    {
      metric: 'Equipment Capital Allocation',
      traditional: '25-35% wasted on idle machinery',
      clinicAI: 'Tiered Day-1 vs expansion phased purchasing',
      benefit: 'Preserve liquidity',
    },
    {
      metric: 'Regulatory Compliance (CEA/BMW)',
      traditional: 'Fragmented manual paperwork & agents',
      clinicAI: 'State-calibrated step-by-step checklist',
      benefit: 'Zero penalty risk',
    },
    {
      metric: 'Bank Feasibility Report',
      traditional: 'Unstructured spreadsheets rejected by lenders',
      clinicAI: 'Institutional bank-standard 3-year dossier',
      benefit: '92% Loan Approval',
    },
  ];

  const testimonials = [
    {
      doctor: 'Dr. Neha Agarwal',
      title: 'Pediatric Specialist, Jaipur',
      quote: 'ClinicAI showed me that I was about to spend ₹7 Lakhs on specialized diagnostic tools that I wouldn’t need until year 2. Phasing that equipment saved my launch from cashflow collapse.',
      saved: '₹7.2L CapEx Preserved',
    },
    {
      doctor: 'Dr. Vikram Malhotra',
      title: 'Dental Surgeon, Gurgaon',
      quote: 'The Biomedical Waste and Clinical Establishments Act checklist saved me weeks of bureaucratic runaround. My clinic was operational in just 38 days from signing the lease.',
      saved: 'Launch in 38 Days',
    },
    {
      doctor: 'Dr. Suresh Reddy',
      title: 'Physiotherapist, Bengaluru',
      quote: 'The bank loan officer specifically praised our feasibility dossier. He said it was the cleanest projected unit economics from an independent clinic he had reviewed all quarter.',
      saved: '₹25L Loan Approved',
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
              id="back-button-benefits-top"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            <div className="h-4 w-px bg-slate-200" />
            <span className="text-xs text-slate-500 font-medium">
              Home <span className="text-slate-300">/</span> <strong className="text-slate-800">Benefits</strong>
            </span>
          </div>

          <button
            onClick={() => setActiveView('dashboard')}
            className="text-xs font-semibold text-sky-600 hover:text-sky-700 bg-sky-50 px-3 py-1.5 rounded-lg border border-sky-200 transition-colors"
          >
            Open Interactive App →
          </button>
        </div>
      </div>

      {/* Hero */}
      <div className="bg-white border-b border-slate-200 py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-700 bg-sky-50 px-3 py-1 rounded-full border border-sky-200 uppercase tracking-wider mb-4">
            <Award className="w-3.5 h-3.5" />
            Designed for Modern Clinicians
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            Why healthcare pioneers plan their clinics on ClinicAI.
          </h1>
          <p className="text-base sm:text-lg text-slate-600 mt-4 leading-relaxed">
            Starting a clinic shouldn’t be a high-stakes gamble. ClinicAI arms you with precision data, verified equipment benchmarks, and statutory roadmaps.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        {/* Core Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center mb-3">
              <Coins className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Capital Protection</h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Eliminate unnecessary Day-1 machinery purchases and buffer for working capital reserves.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-3">
              <Clock className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Accelerated Launch</h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Condense 9 months of planning, contractor vetting, and permit tracking into under 45 days.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center mb-3">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">100% Legal Certainty</h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Guaranteed compliance with State Clinical Establishments Acts, BMW disposal, and Fire safety.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center mb-3">
              <TrendingUp className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Predictable Profitability</h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Stress-test unit economics, consultation fees, and break-even targets before investing your life savings.
            </p>
          </div>
        </div>

        {/* Head to Head Comparison Table */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
          <div className="mb-6">
            <h3 className="text-xl font-bold text-slate-900">
              Traditional Healthcare Consultants vs. ClinicAI
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              See why hundreds of doctors are replacing opaque advisory firms with intelligent software.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase tracking-wider text-[11px]">
                  <th className="py-3.5 pr-4">Setup Dimension</th>
                  <th className="py-3.5 px-4">Traditional Consultant</th>
                  <th className="py-3.5 px-4 text-sky-700 bg-sky-50/50 rounded-t-xl">ClinicAI Platform</th>
                  <th className="py-3.5 pl-4 text-right">Advantage</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {comparisons.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50">
                    <td className="py-4 pr-4 font-bold text-slate-900">{row.metric}</td>
                    <td className="py-4 px-4 text-slate-500 flex items-center gap-2">
                      <XCircle className="w-4 h-4 text-rose-500 shrink-0" />
                      <span>{row.traditional}</span>
                    </td>
                    <td className="py-4 px-4 font-semibold text-sky-900 bg-sky-50/30">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>{row.clinicAI}</span>
                      </div>
                    </td>
                    <td className="py-4 pl-4 text-right font-bold text-emerald-700 whitespace-nowrap">
                      {row.benefit}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Doctor Testimonials */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, idx) => (
            <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 inline-block mb-3">
                  {t.saved}
                </span>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed italic">
                  "{t.quote}"
                </p>
              </div>
              <div className="mt-4 pt-4 border-t border-slate-100">
                <h4 className="text-xs font-bold text-slate-900">{t.doctor}</h4>
                <p className="text-[11px] text-slate-500">{t.title}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Back Button & Action CTA */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 rounded-2xl bg-white border border-slate-200">
          <button
            onClick={goBack}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-colors"
            id="back-button-benefits-bottom"
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
              <span>Start Planning Your Clinic</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
