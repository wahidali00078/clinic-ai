import React, { useState, useEffect } from 'react';
import { X, ArrowRight, ArrowLeft, Check, Sparkles, LayoutDashboard, ListOrdered, FileText, Sliders } from 'lucide-react';

interface ProductTourProps {
  userId?: string;
  isOpen: boolean;
  onClose: () => void;
}

export const ProductTour: React.FC<ProductTourProps> = ({ userId = 'default', isOpen, onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const tourSteps = [
    {
      title: 'Welcome to ClinicAI Setup Assistant',
      desc: 'Built specifically for doctors launching a private clinic in India. We turn complex equipment catalogs, staffing plans, and municipal permits into a clear, actionable roadmap.',
      highlight: 'Get started with confidence',
      icon: LayoutDashboard,
      badge: 'Step 1 of 5',
    },
    {
      title: 'Persistent 8-Stage Setup Strip',
      desc: 'Track your progress across all 8 essential clinical phases: Profile, Location, Equipment, Staff, Budget, Legal, Revenue, and Feasibility Report. Click any stage or hit "Continue Setup" to proceed.',
      highlight: 'Always know what to do next',
      icon: ListOrdered,
      badge: 'Step 2 of 5',
    },
    {
      title: 'AI Healthcare Copilot',
      desc: 'Have questions about local rent negotiations in your city, biomedical waste rules, or alternative equipment brands? Click "Ask AI" in the header or bottom bar for instant answers.',
      highlight: 'Specialized healthcare intelligence',
      icon: Sparkles,
      badge: 'Step 3 of 5',
    },
    {
      title: 'Bank-Ready Feasibility Report',
      desc: 'Once your clinic parameters are confirmed, export a professional executive business report in PDF format for landlords, bank loan officers, or medical partners.',
      highlight: 'One-click executive export',
      icon: FileText,
      badge: 'Step 4 of 5',
    },
    {
      title: 'Editable Practice Assumptions',
      desc: 'Every calculation is 100% transparent. Open the "Assumptions" panel anytime to calibrate local rent per sq. ft., staff salary benchmarks, and consultation fees to your exact city.',
      highlight: 'Full financial transparency',
      icon: Sliders,
      badge: 'Step 5 of 5',
    },
  ];

  if (!isOpen) return null;

  const step = tourSteps[currentStep];
  const StepIcon = step.icon;

  const handleNext = () => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleComplete = () => {
    try {
      localStorage.setItem(`clinicai_tour_dismissed_${userId}`, 'true');
    } catch (e) {}
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/65 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={handleComplete}
      role="dialog"
      aria-modal="true"
      aria-labelledby="tour-step-title"
    >
      <div
        className="w-full max-w-md bg-white rounded-2xl border border-slate-200 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150"
        onClick={e => e.stopPropagation()}
      >
        {/* Top Progress & Step Badge */}
        <div className="bg-slate-50 border-b border-slate-100 px-5 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-teal-800 bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-200">
              {step.badge}
            </span>
            <span className="text-xs text-slate-500 font-medium">Quick Product Tour</span>
          </div>
          <button
            onClick={handleComplete}
            className="text-slate-400 hover:text-slate-700 p-1 rounded-md hover:bg-slate-200/60 transition-colors"
            aria-label="Skip tour"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Step Visual Progress Bar */}
        <div className="w-full bg-slate-100 h-1">
          <div
            className="bg-teal-700 h-full transition-all duration-300"
            style={{ width: `${((currentStep + 1) / tourSteps.length) * 100}%` }}
          />
        </div>

        {/* Tour Content */}
        <div className="p-6">
          <div className="w-12 h-12 rounded-2xl bg-teal-50 border border-teal-200 text-teal-700 flex items-center justify-center mb-4">
            <StepIcon className="w-6 h-6" />
          </div>

          <span className="text-xs font-semibold text-teal-700 uppercase tracking-wider block mb-1">
            {step.highlight}
          </span>
          <h3 id="tour-step-title" className="text-lg font-bold text-slate-900 leading-snug">
            {step.title}
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
            {step.desc}
          </p>

          {/* Dots navigation */}
          <div className="flex items-center gap-1.5 mt-6 mb-2">
            {tourSteps.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentStep(idx)}
                className={`h-1.5 rounded-full transition-all ${
                  idx === currentStep ? 'w-6 bg-teal-700' : 'w-2 bg-slate-200 hover:bg-slate-300'
                }`}
                aria-label={`Go to tour step ${idx + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Bottom Actions - Single Primary Button */}
        <div className="px-6 py-4 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={handleComplete}
            className="text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
          >
            Skip Tour
          </button>

          <div className="flex items-center gap-2">
            {currentStep > 0 && (
              <button
                type="button"
                onClick={handlePrev}
                className="px-3 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors flex items-center gap-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>
            )}

            {/* Exactly ONE Primary Action Button */}
            <button
              type="button"
              onClick={handleNext}
              className="px-4 py-2 text-xs font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded-lg shadow-xs transition-colors flex items-center gap-1.5"
            >
              <span>{currentStep === tourSteps.length - 1 ? 'Start Exploring' : 'Next Step'}</span>
              {currentStep === tourSteps.length - 1 ? (
                <Check className="w-3.5 h-3.5" />
              ) : (
                <ArrowRight className="w-3.5 h-3.5" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
