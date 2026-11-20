import React, { useState } from 'react';
import { useClinic } from '../../context/ClinicContext';
import { useAuth } from '../../context/AuthContext';
import {
  MapPin,
  Stethoscope,
  Users,
  Calculator,
  Scale,
  TrendingUp,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  Shield,
  Clock,
  Coins,
  FileText,
  BadgeCheck,
  Building2,
  Check,
} from 'lucide-react';

interface LandingPageProps {
  onOpenAuth: (mode: 'login' | 'register') => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onOpenAuth }) => {
  const { setActiveView, resetToDemoClinic } = useClinic();
  const { user } = useAuth();
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: 'How does ClinicAI estimate equipment and setup costs?',
      a: 'ClinicAI uses vetted healthcare equipment benchmarks categorized by medical specialty, patient volume, and room count. You can modify every item, unit price, and priority level to fit your exact budget.',
    },
    {
      q: 'Are the legal and regulatory checklists legally binding?',
      a: 'No. ClinicAI provides standardized regulatory guidance based on Clinical Establishments Acts, municipal laws, and health department rules. We explicitly label all compliance items with a reminder to verify locally with your CMHO or legal counsel.',
    },
    {
      q: 'Can I use ClinicAI for specialized clinics like Dental, Eye, or Pediatrics?',
      a: 'Yes! ClinicAI supports 8 specialized clinical workflows including General Medicine, Dental, Pediatrics, Dermatology, Ophthalmology, Physiotherapy, Diagnostic Centers, and Custom Specialties.',
    },
    {
      q: 'Can I export my clinic plan for bank loans or investors?',
      a: 'Yes. You can generate a 13-section Comprehensive Clinic Feasibility Report in one click, and print or download it as an executive PDF document with breakdown charts.',
    },
    {
      q: 'Is my clinic data private and secure?',
      a: 'Absolutely. We enforce strict role-based data boundaries where each clinician only accesses their own clinics. We never expose your sensitive financials or plans to unauthorized parties.',
    },
  ];

  return (
    <div className="w-full min-h-screen bg-slate-50 flex flex-col selection:bg-cyan-500 selection:text-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28 border-b border-slate-200/80 bg-white">
        {/* Subtle decorative mesh background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#f1f5f9_1px,transparent_1px),linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-70 pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-50 border border-cyan-200/80 text-cyan-800 text-xs font-semibold uppercase tracking-wider mb-6 shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-cyan-600" />
              <span>Next-Generation Healthcare Practice Planning</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.12] mb-6">
              Plan Your Clinic. <br />
              <span className="text-cyan-600">Smarter. Faster.</span> With AI.
            </h1>

            <p className="text-lg sm:text-xl text-slate-600 leading-relaxed max-w-2xl mx-auto mb-8 font-normal">
              From location and equipment to staffing, licensing, costs and revenue — ClinicAI helps you plan your clinic from one intelligent dashboard.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5">
              <button
                onClick={() => {
                  if (user) {
                    setActiveView('onboarding');
                  } else {
                    onOpenAuth('register');
                  }
                }}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 text-base font-semibold text-white bg-cyan-600 hover:bg-cyan-700 rounded-xl transition-all shadow-md shadow-cyan-600/25 hover:shadow-cyan-600/35"
                id="hero-start-free-btn"
              >
                <span>Start Planning Free</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => {
                  resetToDemoClinic();
                  setActiveView('dashboard');
                }}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3.5 text-base font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200/80 rounded-xl transition-all"
                id="hero-see-how-btn"
              >
                <Stethoscope className="w-4 h-4 text-cyan-700" />
                <span>Explore Live Jaipur Demo</span>
              </button>
            </div>

            <div className="mt-8 flex items-center justify-center gap-6 text-xs text-slate-500 font-medium">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>No Credit Card Required</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Instant Feasibility Report</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Doctor & Specialist Calibrated</span>
              </div>
            </div>
          </div>

          {/* Hero Visual Mockup: Dashboard Snapshot */}
          <div className="relative mx-auto max-w-5xl rounded-2xl border border-slate-200/90 bg-white p-3 sm:p-5 shadow-2xl shadow-slate-300/40">
            {/* Window header */}
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100 text-xs text-slate-500">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-rose-400/80" />
                <div className="w-3 h-3 rounded-full bg-amber-400/80" />
                <div className="w-3 h-3 rounded-full bg-emerald-400/80" />
                <span className="ml-2 font-mono text-[11px] text-slate-400">clinicai.app/dashboard/overview</span>
              </div>
              <span className="font-semibold text-cyan-700 bg-cyan-50 px-2 py-0.5 rounded border border-cyan-100">
                Live Interactive Simulation
              </span>
            </div>

            {/* Mockup Grid */}
            <div className="space-y-4">
              {/* Setup Progress Bar */}
              <div className="p-4 rounded-xl bg-slate-900 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400">Setup Progress</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800">
                      8 of 8 Completed (100%)
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-white mt-0.5">Aarogya Family Health Clinic • Jaipur</h3>
                </div>
                <button
                  onClick={() => setActiveView('dashboard')}
                  className="px-3.5 py-1.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 rounded-lg text-xs font-bold transition-colors"
                >
                  Open Dashboard →
                </button>
              </div>

              {/* 4 Quick Stat Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                <div className="p-3.5 rounded-xl border border-slate-200/80 bg-slate-50/60">
                  <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">Estimated Investment</span>
                  <div className="text-xl font-bold text-slate-900 mt-1">₹10,03,000</div>
                  <span className="text-[11px] text-emerald-600 font-medium">Within ₹12L target budget</span>
                </div>

                <div className="p-3.5 rounded-xl border border-slate-200/80 bg-slate-50/60">
                  <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">Expected Monthly Rev</span>
                  <div className="text-xl font-bold text-slate-900 mt-1">₹5,30,400</div>
                  <span className="text-[11px] text-cyan-600 font-medium">30 pts/day @ ₹500 fee</span>
                </div>

                <div className="p-3.5 rounded-xl border border-slate-200/80 bg-slate-50/60">
                  <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">Recommended Location</span>
                  <div className="text-xl font-bold text-slate-900 mt-1">Score: 84/100</div>
                  <span className="text-[11px] text-slate-600 font-medium">Malviya Nagar, Jaipur</span>
                </div>

                <div className="p-3.5 rounded-xl border border-slate-200/80 bg-slate-50/60">
                  <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">Est. Break-Even</span>
                  <div className="text-xl font-bold text-emerald-700 mt-1">3.4 Months</div>
                  <span className="text-[11px] text-emerald-600 font-medium">Operating margin: 57%</span>
                </div>
              </div>

              {/* AI Recommendations banner */}
              <div className="p-3.5 rounded-xl border border-cyan-200 bg-cyan-50/70 flex items-start gap-3">
                <div className="p-2 rounded-lg bg-cyan-600 text-white shrink-0 mt-0.5">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <h4 className="text-xs font-bold text-cyan-900">AI Clinical Advisor Insight:</h4>
                  <p className="text-xs text-cyan-800 mt-0.5 leading-relaxed">
                    Based on your general practice room capacity in Jaipur, prioritizing the digital ECG and Class-B autoclave over high-end elective equipment will preserve ₹1.8L cash buffer before opening.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Section (6 Major Features) */}
      <section id="features" className="py-20 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-semibold text-cyan-700 uppercase tracking-wider bg-cyan-100/70 px-3 py-1 rounded-full">
              Full Spectrum Capabilities
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-3 mb-4">
              Everything You Need to Plan and Launch
            </h2>
            <p className="text-slate-600 text-base mb-4">
              Replace fragmented spreadsheets and expensive consultants with six specialized modules designed for healthcare practices.
            </p>
            <button
              onClick={() => setActiveView('features')}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-cyan-600 hover:text-cyan-700 bg-cyan-50 px-3 py-1.5 rounded-lg border border-cyan-200 transition-colors"
            >
              Explore Full Features Page →
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Feature 1: Location Analysis */}
            <div
              onClick={() => setActiveView('location')}
              className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm hover:shadow-md hover:border-cyan-400 transition-all cursor-pointer group"
            >
              <div className="w-12 h-12 rounded-xl bg-cyan-50 text-cyan-700 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <MapPin className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">1. Smart Location Analysis</h3>
              <p className="text-sm text-slate-600 leading-relaxed mb-4">
                Evaluate prospective commercial neighborhoods with multi-factor scoring: local demographic demand, density, competition, transit accessibility, and rental affordability.
              </p>
              <span className="text-xs font-semibold text-cyan-600 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                Explore Location Engine →
              </span>
            </div>

            {/* Feature 2: Equipment Planner */}
            <div
              onClick={() => setActiveView('equipment')}
              className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm hover:shadow-md hover:border-cyan-400 transition-all cursor-pointer group"
            >
              <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <Stethoscope className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">2. Equipment Planner</h3>
              <p className="text-sm text-slate-600 leading-relaxed mb-4">
                Specialty-specific equipment lists organized into Essential, Recommended, and Optional tiers with unit cost estimates, reasons required, and purchase tracking.
              </p>
              <span className="text-xs font-semibold text-teal-600 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                View Medical Inventory →
              </span>
            </div>

            {/* Feature 3: Staff Planner */}
            <div
              onClick={() => setActiveView('staff')}
              className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm hover:shadow-md hover:border-cyan-400 transition-all cursor-pointer group"
            >
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">3. Staff Planner</h3>
              <p className="text-sm text-slate-600 leading-relaxed mb-4">
                Model clinical headcount for doctors, nurses, front-desk administrators, and hygiene attendants based on daily patient throughput with instant payroll projections.
              </p>
              <span className="text-xs font-semibold text-blue-600 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                Configure Clinical Staff →
              </span>
            </div>

            {/* Feature 4: Cost Estimator */}
            <div
              onClick={() => setActiveView('costs')}
              className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm hover:shadow-md hover:border-cyan-400 transition-all cursor-pointer group"
            >
              <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <Calculator className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">4. Cost Estimator</h3>
              <p className="text-sm text-slate-600 leading-relaxed mb-4">
                Accurate financial calculator distinguishing initial capital outlay (interior, deposits, IT, branding) from recurring monthly overheads (rent, power, consumables).
              </p>
              <span className="text-xs font-semibold text-amber-600 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                Calculate Capital Outlay →
              </span>
            </div>

            {/* Feature 5: Legal & License Checklist */}
            <div
              onClick={() => setActiveView('legal')}
              className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm hover:shadow-md hover:border-cyan-400 transition-all cursor-pointer group"
            >
              <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <Scale className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">5. Legal & License Checklist</h3>
              <p className="text-sm text-slate-600 leading-relaxed mb-4">
                Structured legal roadmap spanning Clinical Establishments Act, Bio-Medical Waste agreements, municipal trade NOCs, and fire safety protocols with official portal links.
              </p>
              <span className="text-xs font-semibold text-purple-600 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                Review Legal Compliance →
              </span>
            </div>

            {/* Feature 6: Revenue Forecast */}
            <div
              onClick={() => setActiveView('revenue')}
              className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm hover:shadow-md hover:border-cyan-400 transition-all cursor-pointer group"
            >
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">6. Revenue Forecast</h3>
              <p className="text-sm text-slate-600 leading-relaxed mb-4">
                Interactive financial modeling with consultation fees, ancillary tests, monthly net profits, profit margins, and cumulative 12-month break-even trajectories.
              </p>
              <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                Model Financial ROI →
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-semibold text-cyan-700 uppercase tracking-wider bg-cyan-100/70 px-3 py-1 rounded-full">
              Streamlined Process
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-3 mb-4">
              How ClinicAI Works in 4 Steps
            </h2>
            <p className="text-slate-600 text-base">
              A clear, structured workflow designed to guide you from initial idea to ready-to-execute clinic blueprint.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
            {/* Step 1 */}
            <div className="p-6 rounded-2xl border border-slate-200 bg-slate-50/70 relative">
              <div className="w-8 h-8 rounded-full bg-cyan-600 text-white text-sm font-bold flex items-center justify-center mb-4">
                1
              </div>
              <h4 className="text-base font-bold text-slate-900 mb-1.5">Enter Clinic Details</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Provide your clinic specialty, target city, room capacity, and available budget in our rapid 5-step onboarding wizard.
              </p>
            </div>

            {/* Step 2 */}
            <div className="p-6 rounded-2xl border border-slate-200 bg-slate-50/70 relative">
              <div className="w-8 h-8 rounded-full bg-cyan-600 text-white text-sm font-bold flex items-center justify-center mb-4">
                2
              </div>
              <h4 className="text-base font-bold text-slate-900 mb-1.5">AI Analyzes Requirements</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                The AI engine maps your patient throughput against medical standards to curate your equipment, staff, and permits.
              </p>
            </div>

            {/* Step 3 */}
            <div className="p-6 rounded-2xl border border-slate-200 bg-slate-50/70 relative">
              <div className="w-8 h-8 rounded-full bg-cyan-600 text-white text-sm font-bold flex items-center justify-center mb-4">
                3
              </div>
              <h4 className="text-base font-bold text-slate-900 mb-1.5">Review Recommendations</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Fine-tune every assumption: adjust doctor fees, swap equipment models, simulate rent negotiations, and see real-time break-even shifts.
              </p>
            </div>

            {/* Step 4 */}
            <div className="p-6 rounded-2xl border border-slate-200 bg-slate-50/70 relative">
              <div className="w-8 h-8 rounded-full bg-cyan-600 text-white text-sm font-bold flex items-center justify-center mb-4">
                4
              </div>
              <h4 className="text-base font-bold text-slate-900 mb-1.5">Generate Clinic Plan</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Download a professional 13-section clinic feasibility proposal ready for bank financing, property landlords, and partners.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="py-20 bg-slate-900 text-white border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-semibold text-cyan-400 uppercase tracking-wider bg-cyan-950 px-3 py-1 rounded-full border border-cyan-800">
              Why Doctors Trust ClinicAI
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mt-3 mb-4">
              Designed for Healthcare Entrepreneurs
            </h2>
            <p className="text-slate-400 text-base">
              Eliminate costly mistakes before signing commercial leases or placing large equipment orders.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex gap-4 items-start">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-white mb-2">Save Hundreds of Planning Hours</h4>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Instead of spending months assembling equipment catalogs and wondering what staff to hire, get instant calibrated benchmarks in minutes.
                </p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                <Coins className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-white mb-2">Reduce Dependency on Consultants</h4>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Traditional hospital and clinic consultants charge thousands in upfront advisory fees. ClinicAI equips you with professional-grade analysis yourself.
                </p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-white mb-2">Make Confident Financial Decisions</h4>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Test optimistic and conservative patient scenarios with interactive revenue forecasting so you know your exact break-even timeline before opening doors.
                </p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-white mb-2">Structured, Step-by-Step Clarity</h4>
                <p className="text-sm text-slate-400 leading-relaxed">
                  A 10-second intuitive UX progress bar guides you through profile, location, equipment, staff, budget, legal, and final report without feeling overwhelmed.
                </p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                <BadgeCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-white mb-2">Beginner & Resident Friendly</h4>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Whether you are a senior consultant launching your flagship practice or a young specialist opening your first outpatient clinic, the guidance is clear and accessible.
                </p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center shrink-0">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-white mb-2">Transparent Assumptions</h4>
                <p className="text-sm text-slate-400 leading-relaxed">
                  We never pretend AI predictions are guaranteed. Every calculation clearly reveals its assumptions so you can verify local rates with certainty.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing / Plan Section */}
      <section id="pricing" className="py-20 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-semibold text-cyan-700 uppercase tracking-wider bg-cyan-100/70 px-3 py-1 rounded-full">
              Transparent Pricing
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-3 mb-4">
              Start Free, Scale as You Build
            </h2>
            <p className="text-slate-600 text-base mb-4">
              Full access to complete planning modules with zero upfront barrier for healthcare entrepreneurs.
            </p>
            <button
              onClick={() => setActiveView('pricing')}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-cyan-600 hover:text-cyan-700 bg-cyan-50 px-3 py-1.5 rounded-lg border border-cyan-200 transition-colors"
            >
              Open Dedicated Pricing Page & Calculator →
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Starter Plan */}
            <div className="p-8 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Starter Plan</span>
                <div className="text-3xl font-extrabold text-slate-900 mt-2 mb-1">Free</div>
                <p className="text-xs text-slate-500 mb-6">Ideal for exploring initial feasibility and equipment needs.</p>
                <ul className="space-y-3 text-xs text-slate-600 mb-8">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span>1 Complete Clinic Plan</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span>Location Demand Scoring</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span>Essential Equipment Planner</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span>Legal Checklist & Portal Links</span>
                  </li>
                </ul>
              </div>
              <button
                onClick={() => {
                  if (user) setActiveView('dashboard');
                  else onOpenAuth('register');
                }}
                className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold rounded-xl text-sm transition-colors"
              >
                Get Started Free
              </button>
            </div>

            {/* Pro Clinic Plan (Featured) */}
            <div className="p-8 rounded-2xl bg-white border-2 border-cyan-500 shadow-xl shadow-cyan-500/10 flex flex-col justify-between relative">
              <div className="absolute -top-3.5 right-6 px-3 py-1 bg-cyan-600 text-white text-[11px] font-bold rounded-full uppercase tracking-wider">
                Most Popular
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-cyan-600">Professional Plan</span>
                <div className="text-3xl font-extrabold text-slate-900 mt-2 mb-1">
                  ₹2,499 <span className="text-xs text-slate-500 font-normal">/ clinic</span>
                </div>
                <p className="text-xs text-slate-500 mb-6">For clinicians actively preparing to sign leases and purchase equipment.</p>
                <ul className="space-y-3 text-xs text-slate-600 mb-8">
                  <li className="flex items-center gap-2 font-medium text-slate-900">
                    <Check className="w-4 h-4 text-cyan-600" />
                    <span>Unlimited AI Planning Queries</span>
                  </li>
                  <li className="flex items-center gap-2 font-medium text-slate-900">
                    <Check className="w-4 h-4 text-cyan-600" />
                    <span>13-Section PDF Report Export</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-cyan-600" />
                    <span>Full Staff & Payroll Model</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-cyan-600" />
                    <span>Sensitivity ROI & Break-even Curves</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-cyan-600" />
                    <span>Multi-zone Location Comparison</span>
                  </li>
                </ul>
              </div>
              <button
                onClick={() => {
                  if (user) setActiveView('dashboard');
                  else onOpenAuth('register');
                }}
                className="w-full py-2.5 bg-cyan-600 hover:bg-cyan-700 text-white font-semibold rounded-xl text-sm transition-colors shadow-md shadow-cyan-600/25"
              >
                Launch Pro Practice
              </button>
            </div>

            {/* Enterprise / Multi-center */}
            <div className="p-8 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Healthcare Network</span>
                <div className="text-3xl font-extrabold text-slate-900 mt-2 mb-1">Custom</div>
                <p className="text-xs text-slate-500 mb-6">For multi-specialty chains, diagnostic franchises, and investors.</p>
                <ul className="space-y-3 text-xs text-slate-600 mb-8">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span>Multi-Center Portfolio Planning</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span>Custom City Demographics Grounding</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span>Vendor Equipment Procurement Quotes</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span>Dedicated Healthcare Architect Support</span>
                  </li>
                </ul>
              </div>
              <button
                onClick={() => setActiveView('ai-assistant')}
                className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl text-sm transition-colors"
              >
                Contact Healthcare Team
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Accordion Section */}
      <section id="faq" className="py-20 bg-white border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-xs font-semibold text-cyan-700 uppercase tracking-wider bg-cyan-100/70 px-3 py-1 rounded-full">
              Got Questions?
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-3 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-slate-600 text-base mb-4">
              Everything you need to know about setting up your clinic with ClinicAI.
            </p>
            <button
              onClick={() => setActiveView('faq')}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-cyan-600 hover:text-cyan-700 bg-cyan-50 px-3 py-1.5 rounded-lg border border-cyan-200 transition-colors"
            >
              Open Full FAQ Knowledge Base & Search →
            </button>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="border border-slate-200 rounded-xl overflow-hidden transition-colors"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full p-5 text-left font-semibold text-slate-900 flex items-center justify-between gap-4 hover:bg-slate-50 transition-colors"
                >
                  <span className="text-base">{faq.q}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-slate-400 transition-transform ${openFaq === idx ? 'rotate-180 text-cyan-600' : ''}`}
                  />
                </button>
                {openFaq === idx && (
                  <div className="p-5 pt-0 text-sm text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50/50">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="py-20 bg-gradient-to-tr from-slate-950 via-slate-900 to-cyan-950 text-white relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight mb-6">
            Ready to plan your clinic?
          </h2>
          <p className="text-lg text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed font-normal">
            Join forward-thinking doctors and healthcare entrepreneurs who plan smarter, launch faster, and achieve profitability sooner.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => {
                if (user) setActiveView('onboarding');
                else onOpenAuth('register');
              }}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-xl text-base transition-all shadow-lg shadow-cyan-500/20"
              id="final-cta-btn"
            >
              <Sparkles className="w-5 h-5" />
              <span>Start Planning Your Clinic</span>
            </button>

            <button
              onClick={() => {
                resetToDemoClinic();
                setActiveView('dashboard');
              }}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 bg-slate-800 hover:bg-slate-700 text-white font-medium rounded-xl text-base transition-colors border border-slate-700"
            >
              <span>Explore Jaipur Demo Clinic</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
