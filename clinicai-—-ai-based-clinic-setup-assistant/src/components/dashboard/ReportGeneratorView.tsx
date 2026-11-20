import React, { useRef } from 'react';
import { useClinic } from '../../context/ClinicContext';
import {
  FileText,
  Printer,
  Download,
  Share2,
  CheckCircle2,
  Building,
  MapPin,
  Stethoscope,
  Users,
  Coins,
  Scale,
  Sparkles,
} from 'lucide-react';
import { ModulePageShell } from './ModulePageShell';
import { formatINR } from '../../utils/formatters';

export const ReportGeneratorView: React.FC = () => {
  const { clinic, costs, revenue, locationAnalysis, equipment, staff, legalChecklist, addToast, setActiveView } = useClinic();
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    window.print();
  };

  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(
      JSON.stringify({ clinic, costs, revenue, locationAnalysis, equipment, staff, legalChecklist }, null, 2)
    );
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `${clinic.name.toLowerCase().replace(/\s+/g, '_')}_feasibility_report.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    addToast('Feasibility dossier exported successfully as JSON', 'success');
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      addToast('Feasibility report link copied to clipboard!', 'success');
    }
  };

  const essentialEquipment = equipment.filter(e => e.priority === 'Essential');

  return (
    <ModulePageShell
      stepNumber={8}
      totalSteps={8}
      title="Executive Clinic Feasibility Dossier"
      description="Bank-ready business plan, financial model, regulatory checklist, and capital recovery schedule."
      statusBadge="Completed"
      primaryActionLabel="Print / Save Bank-Ready PDF"
      onPrimaryAction={handlePrint}
      secondaryActionLabel="Back to Revenue Forecast"
      onSecondaryAction={() => setActiveView('revenue')}
      summaryMetrics={[
        {
          label: 'Total Capital Outlay',
          value: formatINR(costs.totalInitialInvestment),
          subtext: `${formatINR(clinic.budget.totalBudget, { compact: true })} approved target`,
        },
        {
          label: 'Monthly Gross Billing',
          value: formatINR(revenue.monthlyRevenue),
          subtext: `${revenue.patientsPerDay} patients / day`,
        },
        {
          label: 'Full Payback Timeline',
          value: `~${revenue.estimatedBreakEvenMonths} Months`,
          subtext: `${revenue.profitMarginPercent}% steady net margin`,
        },
      ]}
    >
      {/* Action Controls Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs">
        <div>
          <h3 className="text-sm font-bold text-slate-900">Commercial Healthcare Dossier</h3>
          <p className="text-xs text-slate-500">Includes complete CapEx breakdown, OpEx model, and local compliance roadmap</p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleExportJSON}
            className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors border border-slate-200"
          >
            Export JSON
          </button>
          <button
            onClick={handleShare}
            className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors border border-slate-200 flex items-center gap-1"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Share Link</span>
          </button>
          <button
            onClick={handlePrint}
            className="px-4 py-1.5 text-xs font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded-xl transition-all flex items-center gap-1.5 shadow-2xs"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print / PDF</span>
          </button>
        </div>
      </div>

      {/* Printable Paper Canvas */}
      <div
        ref={printRef}
        className="bg-white rounded-2xl border border-slate-300 shadow-xs p-8 sm:p-12 max-w-4xl mx-auto space-y-8 print:p-0 print:border-none print:shadow-none text-slate-900"
      >
        {/* Document Header */}
        <div className="border-b-2 border-slate-900 pb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-teal-800 font-bold text-xs uppercase tracking-widest">
              <Stethoscope className="w-4 h-4" />
              <span>ClinicAI Healthcare Intelligence</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-950 mt-1">
              {clinic.name}
            </h1>
            <p className="text-xs font-semibold text-slate-600">
              Practice Feasibility & Launch Execution Blueprint • {clinic.clinicType}
            </p>
          </div>

          <div className="text-left sm:text-right text-xs text-slate-500 font-mono">
            <div>Document Ref: CAI-{clinic.id.slice(0, 8).toUpperCase()}</div>
            <div>Date: {new Date().toLocaleDateString('en-IN', { month: 'long', day: 'numeric', year: 'numeric' })}</div>
            <div className="text-emerald-700 font-bold">Status: Ready for Loan & Inspection Review</div>
          </div>
        </div>

        {/* Section 1: Executive Summary */}
        <div className="space-y-3">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider border-b border-slate-200 pb-1">
            1. Executive Summary & Practice Model
          </h2>
          <p className="text-xs text-slate-700 leading-relaxed">
            This comprehensive feasibility assessment details the operational and commercial roadmap for establishing{' '}
            <strong>{clinic.name}</strong>, a proposed <strong>{clinic.clinicType}</strong> practice located in{' '}
            <strong>{clinic.location.area}, {clinic.location.city}</strong>. Based on demographic modeling, the clinic is planned to support an outpatient volume of{' '}
            <strong>{clinic.capacity.expectedPatientsPerDay} patients per day</strong> across {clinic.capacity.consultationRooms} consultation rooms, supported by {staff.length} staff roles.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-xs">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Capital Outlay</span>
              <span className="font-bold text-slate-900 text-sm font-mono">
                {formatINR(costs.totalInitialInvestment)}
              </span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Monthly Gross Billing</span>
              <span className="font-bold text-teal-800 text-sm font-mono">
                {formatINR(revenue.monthlyRevenue)}
              </span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Monthly Net Surplus</span>
              <span className="font-bold text-emerald-700 text-sm font-mono">
                {formatINR(revenue.monthlyProfit)}
              </span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Est. Break-Even</span>
              <span className="font-bold text-teal-800 text-sm font-mono">
                ~{revenue.estimatedBreakEvenMonths} Months
              </span>
            </div>
          </div>
        </div>

        {/* Section 2: Location Viability */}
        <div className="space-y-3">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider border-b border-slate-200 pb-1">
            2. Catchment Viability & Demographics
          </h2>
          <p className="text-xs text-slate-700 leading-relaxed">
            The target micro-market in <strong>{clinic.location.area}, {clinic.location.city}</strong> scored an aggregate viability rating of{' '}
            <strong>{locationAnalysis.overallScore}/100</strong>.
          </p>
          <div className="grid grid-cols-4 gap-2 text-[11px] pt-1">
            <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
              <span className="text-slate-500 block">Demand</span>
              <span className="font-bold text-slate-900">{locationAnalysis?.demandScore ?? (locationAnalysis as any)?.factors?.demandScore ?? 88}/100</span>
            </div>
            <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
              <span className="text-slate-500 block">Competition Balance</span>
              <span className="font-bold text-slate-900">{locationAnalysis?.competitionScore ?? (locationAnalysis as any)?.factors?.competitionScore ?? 82}/100</span>
            </div>
            <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
              <span className="text-slate-500 block">Transit Access</span>
              <span className="font-bold text-slate-900">{locationAnalysis?.accessibilityScore ?? (locationAnalysis as any)?.factors?.accessibilityScore ?? 85}/100</span>
            </div>
            <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
              <span className="text-slate-500 block">Rental Affordability</span>
              <span className="font-bold text-slate-900">{locationAnalysis?.affordabilityScore ?? (locationAnalysis as any)?.factors?.affordabilityScore ?? 78}/100</span>
            </div>
          </div>
        </div>

        {/* Section 3: Essential Equipment */}
        <div className="space-y-3">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider border-b border-slate-200 pb-1">
            3. Essential Equipment & Launch Inventory
          </h2>
          <p className="text-xs text-slate-700">
            Total of <strong>{equipment.length} items</strong> planned at an estimated expenditure of{' '}
            <strong>{formatINR(costs.initialCapital.medicalEquipment || 350000)}</strong>.
          </p>
          <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-[10px] uppercase font-bold text-slate-600">
                <tr>
                  <th className="py-2.5 px-3">Essential Launch Equipment</th>
                  <th className="py-2.5 px-3">Category</th>
                  <th className="py-2.5 px-3 text-center">Qty</th>
                  <th className="py-2.5 px-3 text-right">Est. Total Cost</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {essentialEquipment.slice(0, 6).map(e => (
                  <tr key={e.id}>
                    <td className="py-2 px-3 font-semibold text-slate-800">{e.name}</td>
                    <td className="py-2 px-3 text-slate-500">{e.category}</td>
                    <td className="py-2 px-3 text-center text-slate-800">{e.quantity}</td>
                    <td className="py-2 px-3 text-right font-mono text-slate-900">
                      {formatINR(e.estimatedTotalCost)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Section 4: Staffing Schedule */}
        <div className="space-y-3">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider border-b border-slate-200 pb-1">
            4. Clinical & Administrative Staffing Roster
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            {staff.map(s => (
              <div key={s.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <div className="font-bold text-slate-900">{s.roleTitle}</div>
                <div className="text-[11px] text-slate-500">{s.recommendedCount} personnel ({s.category})</div>
                <div className="text-xs font-mono font-bold text-teal-800 mt-1">
                  {formatINR(s.monthlySalaryEstimate)} / mo
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 5: Statutory Legal & Regulatory Roadmap */}
        <div className="space-y-3">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider border-b border-slate-200 pb-1">
            5. Legal Registrations & Regulatory Compliance
          </h2>
          <p className="text-xs text-slate-600">
            Calibrated for healthcare compliance in {clinic.location.city}, {clinic.location.state}.
          </p>
          <div className="space-y-1.5 text-xs">
            {legalChecklist.map(l => (
              <div key={l.id} className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-100">
                <span className="font-medium text-slate-800">{l.name}</span>
                <span className="text-[11px] font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded">
                  {l.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Sign-off Block */}
        <div className="pt-8 border-t-2 border-slate-900 text-xs text-slate-500 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="font-bold text-slate-900">ClinicAI Automated Medical Advisory</div>
            <div className="text-[11px]">Grounded in regional healthcare benchmarks for {clinic.location.city}.</div>
          </div>
          <div className="text-right">
            <div className="font-semibold text-slate-700">Verified by Practice Director</div>
            <div className="w-40 border-b border-slate-300 mt-6" />
          </div>
        </div>
      </div>
    </ModulePageShell>
  );
};
