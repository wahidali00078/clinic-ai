import React from 'react';
import { X, HelpCircle, ArrowRight, CheckCircle2 } from 'lucide-react';
import { CalculationDetails } from '../../utils/formatters';
import { DataBadge } from './DataBadge';

interface CalculationExplanationModalProps {
  isOpen: boolean;
  onClose: () => void;
  details: CalculationDetails | null;
  onOpenAssumptions?: () => void;
}

export const CalculationExplanationModal: React.FC<CalculationExplanationModalProps> = ({
  isOpen,
  onClose,
  details,
  onOpenAssumptions,
}) => {
  if (!isOpen || !details) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden"
        onClick={e => e.stopPropagation()}
        role="dialog"
        aria-labelledby="calc-modal-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700">
              <HelpCircle className="w-4 h-4" />
            </div>
            <div>
              <h3 id="calc-modal-title" className="text-base font-bold text-slate-900">
                How this was calculated
              </h3>
              <p className="text-xs text-slate-500">{details.title}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4">
          {/* Main Headline */}
          <div className="p-3.5 rounded-xl bg-teal-50/60 border border-teal-100 text-teal-950">
            <span className="text-xs font-semibold block text-teal-800">Result & Basis</span>
            <p className="text-sm font-medium mt-0.5">{details.headline}</p>
          </div>

          {/* Mathematical Formula */}
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1.5">
              Calculation Formula
            </span>
            <div className="p-3 rounded-xl bg-slate-900 text-slate-100 font-mono text-xs overflow-x-auto">
              {details.formula}
            </div>
          </div>

          {/* Inputs Used */}
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-2">
              Inputs & Parameters Used
            </span>
            <div className="space-y-2 border border-slate-200 rounded-xl p-3 bg-slate-50/50">
              {details.inputs.map((inp, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs py-1 border-b border-slate-100 last:border-b-0">
                  <span className="text-slate-600 font-medium">{inp.label}</span>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-900">{inp.value}</span>
                    <DataBadge type={inp.source} size="xs" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Doctor-Friendly Explanation */}
          <div className="text-xs text-slate-600 leading-relaxed bg-white p-3 rounded-xl border border-slate-200">
            <span className="font-bold text-slate-800 block mb-1">Clinical Context & Methodology:</span>
            {details.explanation}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="text-[11px] text-slate-500 text-center sm:text-left">
            All estimates can be adjusted to match your specific practice.
          </span>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            {onOpenAssumptions && (
              <button
                onClick={() => {
                  onClose();
                  onOpenAssumptions();
                }}
                className="w-full sm:w-auto px-3.5 py-2 text-xs font-semibold text-teal-700 bg-teal-50 hover:bg-teal-100 border border-teal-200 rounded-lg transition-colors flex items-center justify-center gap-1.5"
              >
                <span>Edit Assumptions</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
            <button
              onClick={onClose}
              className="w-full sm:w-auto px-4 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
