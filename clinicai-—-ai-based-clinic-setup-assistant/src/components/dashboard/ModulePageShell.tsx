import React from 'react';
import { useClinic, ActiveView } from '../../context/ClinicContext';
import { ArrowLeft, ChevronRight, Sliders, Sparkles } from 'lucide-react';

interface ModulePageShellProps {
  stepNumber?: number;
  stepTotal?: number;
  title: string;
  subtitle: string;
  primaryAction?: {
    label: string;
    onClick: () => void;
    icon?: React.ReactNode;
    disabled?: boolean;
  };
  secondaryActions?: Array<{
    label: string;
    onClick: () => void;
    icon?: React.ReactNode;
  }>;
  onOpenAssumptions?: () => void;
  children: React.ReactNode;
}

export const ModulePageShell: React.FC<ModulePageShellProps> = ({
  stepNumber,
  stepTotal = 8,
  title,
  subtitle,
  primaryAction,
  secondaryActions,
  onOpenAssumptions,
  children,
}) => {
  const { setActiveView, goBack, setIsFloatingAIAssistantOpen } = useClinic();

  return (
    <div className="space-y-5">
      {/* Top Breadcrumbs and Action Shell */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-xs">
        {/* Breadcrumb row */}
        <div className="flex items-center justify-between text-xs text-slate-500 mb-2.5">
          <div className="flex items-center gap-1.5 flex-wrap">
            <button
              onClick={() => setActiveView('dashboard')}
              className="hover:text-teal-700 transition-colors font-medium"
            >
              Dashboard
            </button>
            <ChevronRight className="w-3 h-3 text-slate-400 shrink-0" />
            {stepNumber ? (
              <span className="text-teal-800 font-semibold bg-teal-50 px-2 py-0.5 rounded-md border border-teal-200">
                Step {stepNumber} of {stepTotal}
              </span>
            ) : null}
            <span className="text-slate-800 font-bold truncate">{title}</span>
          </div>

          <div className="flex items-center gap-2">
            {onOpenAssumptions && (
              <button
                onClick={onOpenAssumptions}
                className="hidden sm:inline-flex items-center gap-1 text-[11px] font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-2.5 py-1 rounded-md transition-colors"
                title="Edit central cost & revenue assumptions"
              >
                <Sliders className="w-3 h-3 text-teal-700" />
                <span>Assumptions</span>
              </button>
            )}
            <button
              onClick={() => setIsFloatingAIAssistantOpen(true)}
              className="hidden sm:inline-flex items-center gap-1 text-[11px] font-semibold text-teal-800 hover:text-teal-900 bg-teal-50 hover:bg-teal-100 px-2.5 py-1 rounded-md border border-teal-200 transition-colors"
              title="Ask AI Copilot for advice on this step"
            >
              <Sparkles className="w-3 h-3 text-teal-600" />
              <span>Ask AI</span>
            </button>
          </div>
        </div>

        {/* Title + Subtitle + Action Buttons */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
          <div className="min-w-0">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              {title}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 leading-normal max-w-3xl">
              {subtitle}
            </p>
          </div>

          {/* Right-aligned action buttons (Never more than ONE primary action!) */}
          <div className="flex items-center gap-2 shrink-0 flex-wrap">
            {secondaryActions?.map((sec, i) => (
              <button
                key={i}
                onClick={sec.onClick}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition-colors"
              >
                {sec.icon}
                <span>{sec.label}</span>
              </button>
            ))}

            {primaryAction && (
              <button
                onClick={primaryAction.onClick}
                disabled={primaryAction.disabled}
                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-teal-700 hover:bg-teal-800 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl shadow-xs transition-colors"
              >
                {primaryAction.icon}
                <span>{primaryAction.label}</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div>{children}</div>
    </div>
  );
};
