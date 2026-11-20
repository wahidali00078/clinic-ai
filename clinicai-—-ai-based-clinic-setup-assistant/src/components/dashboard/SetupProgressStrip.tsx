import React from 'react';
import { useClinic, ActiveView } from '../../context/ClinicContext';
import { Check, ArrowRight, Lock, CircleDot } from 'lucide-react';

interface SetupProgressStripProps {
  className?: string;
  compact?: boolean;
}

export const SetupProgressStrip: React.FC<SetupProgressStripProps> = ({ className = '', compact = false }) => {
  const { clinic, activeView, setActiveView } = useClinic();

  const stages: {
    id: string;
    num: number;
    title: string;
    shortTitle: string;
    view: ActiveView;
    isDone: boolean;
  }[] = [
    { id: 'profile', num: 1, title: 'Clinic Profile', shortTitle: 'Profile', view: 'profile', isDone: !!clinic.setupProgress.profile },
    { id: 'location', num: 2, title: 'Location & Market', shortTitle: 'Location', view: 'location', isDone: !!clinic.setupProgress.location },
    { id: 'equipment', num: 3, title: 'Medical Equipment', shortTitle: 'Equipment', view: 'equipment', isDone: !!clinic.setupProgress.equipment },
    { id: 'staff', num: 4, title: 'Staffing & Roles', shortTitle: 'Staff', view: 'staff', isDone: !!clinic.setupProgress.staff },
    { id: 'costs', num: 5, title: 'Startup Budget', shortTitle: 'Budget', view: 'costs', isDone: !!clinic.setupProgress.budget },
    { id: 'legal', num: 6, title: 'Permits & Compliance', shortTitle: 'Legal', view: 'legal', isDone: !!clinic.setupProgress.legal },
    { id: 'revenue', num: 7, title: 'Revenue & Break-Even', shortTitle: 'Revenue', view: 'revenue', isDone: !!clinic.setupProgress.revenue },
    { id: 'reports', num: 8, title: 'Feasibility Report', shortTitle: 'Report', view: 'reports', isDone: !!clinic.setupProgress.report },
  ];

  const completedCount = stages.filter(s => s.isDone).length;
  const totalCount = stages.length;
  const progressPercent = Math.round((completedCount / totalCount) * 100);

  // Find the exact next incomplete step
  const nextIncompleteStep = stages.find(s => !s.isDone) || stages[stages.length - 1];
  const isAllComplete = completedCount === totalCount;

  const handleContinue = () => {
    if (isAllComplete) {
      setActiveView('reports');
    } else {
      setActiveView(nextIncompleteStep.view);
    }
  };

  return (
    <div
      className={`bg-white rounded-2xl border border-slate-200 shadow-xs p-3.5 sm:p-4.5 ${className}`}
      role="region"
      aria-label="Clinic Setup Progress"
    >
      {/* Header row: Progress % + Status summary + Single Primary Continue Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-200 flex flex-col items-center justify-center text-teal-800 shrink-0">
            <span className="text-xs font-bold leading-none">{progressPercent}%</span>
            <span className="text-[9px] uppercase tracking-wider text-teal-600 font-medium">Done</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs sm:text-sm font-bold text-slate-900">
                Setup Roadmap
              </span>
              <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                {completedCount} of {totalCount} Stages Done
              </span>
            </div>
            <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5">
              {isAllComplete
                ? 'All 8 clinical setup stages are complete. Your Feasibility Report is ready!'
                : `Next up: Step ${nextIncompleteStep.num} (${nextIncompleteStep.title})`}
            </p>
          </div>
        </div>

        {/* The ONE Primary Action button */}
        <button
          onClick={handleContinue}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded-xl shadow-xs transition-colors shrink-0"
          id="setup-strip-continue-btn"
        >
          <span>{isAllComplete ? 'View Feasibility Report' : `Continue Setup: Step ${nextIncompleteStep.num}`}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* 8-Stage interactive step track */}
      <div className="pt-3.5">
        <div className="grid grid-cols-4 lg:grid-cols-8 gap-1.5 sm:gap-2">
          {stages.map(step => {
            const isCurrent = activeView === step.view;
            const isCompleted = step.isDone;

            return (
              <button
                key={step.id}
                onClick={() => setActiveView(step.view)}
                className={`flex flex-col items-center text-center p-2 rounded-xl transition-all border relative ${
                  isCurrent
                    ? 'border-teal-600 bg-teal-50/70 text-teal-900 shadow-xs ring-1 ring-teal-600'
                    : isCompleted
                    ? 'border-emerald-200 bg-emerald-50/40 text-slate-800 hover:bg-emerald-50'
                    : 'border-slate-200 bg-slate-50/60 text-slate-500 hover:bg-slate-100/80 hover:text-slate-700'
                }`}
                title={`Step ${step.num}: ${step.title} (${isCompleted ? 'Completed' : 'Pending'})`}
              >
                {/* Step indicator circle */}
                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold mb-1 ${
                    isCurrent
                      ? 'bg-teal-700 text-white'
                      : isCompleted
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {isCompleted ? <Check className="w-3 h-3 stroke-[2.5]" /> : step.num}
                </div>

                <span className="text-[11px] font-bold truncate max-w-full leading-tight">
                  {step.shortTitle}
                </span>

                <span className="text-[9px] mt-0.5 font-medium truncate max-w-full text-slate-400">
                  {isCurrent ? (
                    <span className="text-teal-700 font-semibold">Active</span>
                  ) : isCompleted ? (
                    <span className="text-emerald-700">Done</span>
                  ) : (
                    'Pending'
                  )}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
