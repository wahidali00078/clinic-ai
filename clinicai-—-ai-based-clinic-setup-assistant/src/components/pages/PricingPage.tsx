import React, { useState } from 'react';
import { useClinic } from '../../context/ClinicContext';
import {
  ArrowLeft,
  Check,
  Sparkles,
  ShieldCheck,
  Zap,
  Building,
  HelpCircle,
} from 'lucide-react';

export const PricingPage: React.FC = () => {
  const { setActiveView, goBack } = useClinic();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual');

  const plans = [
    {
      id: 'starter',
      name: 'Starter Doctor',
      badge: 'Free Early Beta',
      priceMonthly: '₹0',
      priceAnnual: '₹0',
      period: 'Forever free during public beta',
      desc: 'Everything an individual practitioner needs to calculate CapEx, review equipment and start planning.',
      features: [
        'Single clinic feasibility model',
        '8 clinical specialties supported',
        'Tiered Day-1 equipment checklist',
        'Staffing & payroll calculator',
        'Standard statutory permit checklist',
        'Web-view feasibility report',
      ],
      ctaText: 'Get Started Free',
      popular: false,
      buttonAction: () => setActiveView('onboarding'),
    },
    {
      id: 'pro',
      name: 'Professional Clinic',
      badge: 'Most Popular',
      priceMonthly: '₹3,499',
      priceAnnual: '₹2,499',
      period: 'per month, billed annually',
      desc: 'For clinics actively signing commercial leases, sourcing equipment vendors, and filing for state permits.',
      features: [
        'Everything in Starter Doctor, plus:',
        'Unlimited AI Planning Assistant queries',
        'Local demographic catchment heatmap & footfall score',
        'Downloadable bank-ready executive PDF dossier',
        'Vendor quotation benchmarking & AMC calculators',
        'State-specific BMWM & CEA statutory document templates',
        'Multi-scenario 3-year cashflow stress testing',
      ],
      ctaText: 'Start 14-Day Free Trial',
      popular: true,
      buttonAction: () => setActiveView('dashboard'),
    },
    {
      id: 'enterprise',
      name: 'Poly-Clinic / Hospital',
      badge: 'Enterprise',
      priceMonthly: 'Custom',
      priceAnnual: 'Custom',
      period: 'Tailored for healthcare groups',
      desc: 'For hospital networks, diagnostic chains, and medical investors planning multi-branch healthcare centers.',
      features: [
        'Everything in Professional Clinic, plus:',
        'Multi-location & branch expansion modeling',
        'Custom equipment vendor RFP bidding system',
        'On-ground licensing & regulatory liaison support',
        'Dedicated healthcare finance advisor',
        'Custom EMR / HIS system architecture planning',
        'SLA-backed 99.9% uptime & private data tenancy',
      ],
      ctaText: 'Contact Enterprise Team',
      popular: false,
      buttonAction: () => setActiveView('ai-assistant'),
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
              id="back-button-pricing-top"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            <div className="h-4 w-px bg-slate-200" />
            <span className="text-xs text-slate-500 font-medium">
              Home <span className="text-slate-300">/</span> <strong className="text-slate-800">Pricing</strong>
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
      <div className="bg-white border-b border-slate-200 py-12 sm:py-16 text-center">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-700 bg-sky-50 px-3 py-1 rounded-full border border-sky-200 uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            Transparent Healthcare Pricing
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            Predictable plans. Zero hidden consultant commissions.
          </h1>
          <p className="text-base sm:text-lg text-slate-600 mt-4 leading-relaxed">
            Choose the plan that fits your clinic setup stage. All core planning tools are free to test during our public beta.
          </p>

          {/* Billing Cycle Switcher */}
          <div className="mt-8 inline-flex items-center p-1 bg-slate-100 rounded-xl border border-slate-200">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                billingCycle === 'monthly'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Monthly Billing
            </button>
            <button
              onClick={() => setBillingCycle('annual')}
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                billingCycle === 'annual'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>Annual Billing</span>
              <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-100 px-1.5 py-0.2 rounded">
                Save 30%
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {plans.map(p => {
            const price = billingCycle === 'annual' ? p.priceAnnual : p.priceMonthly;
            return (
              <div
                key={p.id}
                className={`rounded-2xl p-6 sm:p-8 flex flex-col justify-between transition-all relative ${
                  p.popular
                    ? 'bg-white border-2 border-sky-600 shadow-xl ring-1 ring-sky-600/20 lg:-translate-y-2'
                    : 'bg-white border border-slate-200 shadow-sm'
                }`}
              >
                {p.popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-sky-600 text-white font-bold text-[10px] uppercase tracking-wider px-3 py-0.5 rounded-full shadow-xs">
                    Recommended for Clinic Owners
                  </span>
                )}

                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-bold text-slate-900">{p.name}</h3>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                      {p.badge}
                    </span>
                  </div>

                  <p className="text-xs text-slate-500 mb-6 leading-relaxed">{p.desc}</p>

                  <div className="mb-6 pb-6 border-b border-slate-100">
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl sm:text-4xl font-black text-slate-900">{price}</span>
                      {price !== 'Custom' && <span className="text-xs text-slate-400">/ mo</span>}
                    </div>
                    <span className="text-[11px] text-slate-500 mt-1 block">{p.period}</span>
                  </div>

                  <div className="space-y-3 mb-8">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                      Included Capabilities:
                    </span>
                    {p.features.map((feat, i) => (
                      <div key={i} className="flex items-start gap-2.5 text-xs text-slate-700">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span className="leading-snug">{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={p.buttonAction}
                  className={`w-full py-3 rounded-xl font-bold text-xs transition-all shadow-sm ${
                    p.popular
                      ? 'bg-sky-600 hover:bg-sky-700 text-white'
                      : 'bg-slate-900 hover:bg-slate-800 text-white'
                  }`}
                >
                  {p.ctaText}
                </button>
              </div>
            );
          })}
        </div>

        {/* Bottom Back Button */}
        <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-4 p-6 rounded-2xl bg-white border border-slate-200">
          <button
            onClick={goBack}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-colors"
            id="back-button-pricing-bottom"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>← Back to Previous Page</span>
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveView('dashboard')}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-sky-600 hover:bg-sky-700 shadow-sm transition-all"
            >
              <Sparkles className="w-4 h-4 text-sky-200" />
              <span>Explore Active Clinic Workspace</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
