import React from 'react';
import { Stethoscope, Heart, ShieldCheck, Mail, MapPin } from 'lucide-react';
import { useClinic } from '../../context/ClinicContext';

export const Footer: React.FC = () => {
  const { setActiveView } = useClinic();

  return (
    <footer className="bg-slate-900 text-slate-400 text-sm border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          {/* Col 1: Brand */}
          <div className="col-span-2">
            <div className="flex items-center gap-2.5 text-white mb-4">
              <div className="w-9 h-9 rounded-xl bg-cyan-600 flex items-center justify-center">
                <Stethoscope className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold tracking-tight">
                Clinic<span className="text-cyan-400">AI</span>
              </span>
            </div>
            <p className="text-slate-400 leading-relaxed max-w-sm mb-6">
              The intelligent clinic planning and management assistant for modern doctors, dentists, specialists, and healthcare entrepreneurs.
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>HIPAA-aligned architecture & local regulatory guidance standards.</span>
            </div>
          </div>

          {/* Col 2: Product */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200 mb-4">Product</h4>
            <ul className="space-y-2.5">
              <li>
                <button onClick={() => setActiveView('location')} className="hover:text-cyan-400 transition-colors text-left">
                  Location Analysis
                </button>
              </li>
              <li>
                <button onClick={() => setActiveView('equipment')} className="hover:text-cyan-400 transition-colors text-left">
                  Equipment Planner
                </button>
              </li>
              <li>
                <button onClick={() => setActiveView('staff')} className="hover:text-cyan-400 transition-colors text-left">
                  Staff Planner
                </button>
              </li>
              <li>
                <button onClick={() => setActiveView('costs')} className="hover:text-cyan-400 transition-colors text-left">
                  Cost Estimator
                </button>
              </li>
              <li>
                <button onClick={() => setActiveView('legal')} className="hover:text-cyan-400 transition-colors text-left">
                  Legal Checklist
                </button>
              </li>
              <li>
                <button onClick={() => setActiveView('revenue')} className="hover:text-cyan-400 transition-colors text-left">
                  Revenue Forecast
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Resources */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200 mb-4">Resources</h4>
            <ul className="space-y-2.5">
              <li>
                <button onClick={() => setActiveView('features')} className="hover:text-cyan-400 transition-colors text-left">
                  Platform Features
                </button>
              </li>
              <li>
                <button onClick={() => setActiveView('how-it-works')} className="hover:text-cyan-400 transition-colors text-left">
                  How It Works
                </button>
              </li>
              <li>
                <button onClick={() => setActiveView('pricing')} className="hover:text-cyan-400 transition-colors text-left">
                  Pricing Plans
                </button>
              </li>
              <li>
                <button onClick={() => setActiveView('faq')} className="hover:text-cyan-400 transition-colors text-left">
                  Healthcare FAQs
                </button>
              </li>
              <li>
                <button onClick={() => setActiveView('reports')} className="hover:text-cyan-400 transition-colors text-left">
                  Feasibility Reports
                </button>
              </li>
              <li>
                <button onClick={() => setActiveView('ai-assistant')} className="hover:text-cyan-400 transition-colors text-left">
                  AI Planning Advisor
                </button>
              </li>
              <li>
                <button onClick={() => setActiveView('admin')} className="hover:text-cyan-400 transition-colors text-left">
                  Admin Portal
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Company & Compliance */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200 mb-4">Company & Legal</h4>
            <ul className="space-y-2.5">
              <li>
                <button onClick={() => setActiveView('benefits')} className="hover:text-cyan-400 transition-colors text-left">
                  Benefits & Doctor Stories
                </button>
              </li>
              <li>
                <span className="text-slate-400 cursor-default">Privacy Policy</span>
              </li>
              <li>
                <span className="text-slate-400 cursor-default">Terms of Service</span>
              </li>
              <li>
                <span className="text-slate-400 cursor-default">Medical Disclaimer</span>
              </li>
              <li>
                <span className="text-slate-400 cursor-default">Security & Audit</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <p>© {new Date().getFullYear()} ClinicAI Inc. Built for clinicians and healthcare pioneers.</p>
          <p className="flex items-center gap-1.5 text-slate-500">
            Engineered with high medical precision & intelligence
          </p>
        </div>
      </div>
    </footer>
  );
};
