import React, { useState } from 'react';
import { useClinic } from '../../context/ClinicContext';
import {
  Calculator,
  Coins,
  TrendingDown,
  Building,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Sliders,
  ArrowRight,
  Info,
} from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { ModulePageShell } from './ModulePageShell';
import { DataBadge } from '../common/DataBadge';
import { CalculationExplanationModal } from '../common/CalculationExplanationModal';
import { AssumptionsModal } from '../common/AssumptionsModal';
import { formatINR, CalculationDetails } from '../../utils/formatters';
import { InitialCostItems, MonthlyOperatingItems } from '../../types';

export const CostEstimatorView: React.FC = () => {
  const { costs, clinic, updateCosts, setActiveView } = useClinic();
  const [activeTab, setActiveTab] = useState<'capital' | 'monthly'>('capital');
  const [activeCalcModal, setActiveCalcModal] = useState<CalculationDetails | null>(null);
  const [assumptionsModalOpen, setAssumptionsModalOpen] = useState(false);

  // Editable local state
  const [capitalInputs, setCapitalInputs] = useState<InitialCostItems>(costs.initialCapital);
  const [monthlyInputs, setMonthlyInputs] = useState<MonthlyOperatingItems>(costs.monthlyExpenses);

  const handleCapitalChange = (key: keyof InitialCostItems, val: number) => {
    const updated = { ...capitalInputs, [key]: Number(val) };
    setCapitalInputs(updated);
    updateCosts(updated, monthlyInputs);
  };

  const handleMonthlyChange = (key: keyof MonthlyOperatingItems, val: number) => {
    const updated = { ...monthlyInputs, [key]: Number(val) };
    setMonthlyInputs(updated);
    updateCosts(capitalInputs, updated);
  };

  const capitalItems: { key: keyof InitialCostItems; label: string; desc: string; source: 'estimate' | 'benchmark' | 'input' }[] = [
    { key: 'medicalEquipment', label: 'Medical Equipment & Diagnostic Tools', desc: 'Sourced from selected inventory in Medical Equipment stage', source: 'estimate' },
    { key: 'interiorSetup', label: 'Interior Fitout & Partitioning', desc: 'Doctor cabins, examination couch partitions, lighting & plumbing', source: 'benchmark' },
    { key: 'securityDeposit', label: 'Commercial Lease Security Deposit', desc: 'Typically 3 months refundable security advance', source: 'benchmark' },
    { key: 'furniture', label: 'Clinical & Waiting Area Furniture', desc: 'Consultation desks, doctor executive chairs, 3-seater visitor benches', source: 'estimate' },
    { key: 'itEquipment', label: 'IT Systems, Computers & Printer', desc: 'Reception desktop, thermal prescription printer, UPS backup', source: 'benchmark' },
    { key: 'registrationLegal', label: 'Licenses, Permits & CEA Registration', desc: 'Municipal license, pollution board consent, statutory filing fees', source: 'estimate' },
    { key: 'brandingSignage', label: 'Exterior LED Signboard & Identity', desc: 'Acrylic LED glow board, clinic branding & reception signage', source: 'estimate' },
    { key: 'initialInventory', label: 'Initial Stock of Consumables & Medicines', desc: 'Syringes, gloves, antiseptics, dressing sets for Month 1', source: 'benchmark' },
    { key: 'miscellaneous', label: 'Contingency & Unforeseen CapEx Buffer', desc: 'Emergency setup reserve covering unexpected installations', source: 'estimate' },
  ];

  const monthlyItems: { key: keyof MonthlyOperatingItems; label: string; desc: string; source: 'estimate' | 'benchmark' | 'input' }[] = [
    { key: 'rent', label: 'Commercial Property Lease Rent', desc: 'Agreed monthly commercial premises rental', source: 'input' },
    { key: 'salaries', label: 'Staff Monthly Gross Payroll', desc: 'Aggregated wages from Clinical Staff Planner module', source: 'estimate' },
    { key: 'consumables', label: 'Medical Consumables & Disposables', desc: 'Monthly replenishment of gloves, needles, cotton, sanitizers', source: 'benchmark' },
    { key: 'electricity', label: 'Electricity & Commercial Power Tariff', desc: 'Air conditioning, lighting, diagnostic device power', source: 'benchmark' },
    { key: 'internet', label: 'High-Speed Broadband & Telephony', desc: 'Dedicated commercial internet connection & clinic phone lines', source: 'benchmark' },
    { key: 'software', label: 'Practice Management & EMR Software', desc: 'Cloud appointment booking, patient records, billing software', source: 'benchmark' },
    { key: 'maintenance', label: 'Biomedical Equipment AMC & Servicing', desc: 'Annual maintenance contracts and preventive calibrations', source: 'benchmark' },
    { key: 'marketing', label: 'Local Community Outreach & Awareness', desc: 'Google Business profile, local health camp flyers, doctor listings', source: 'estimate' },
    { key: 'miscellaneous', label: 'General Overheads & Refreshments', desc: 'Drinking water jars, sanitization, routine office supplies', source: 'estimate' },
  ];

  const pieData = [
    { name: 'Medical Equipment', value: costs.initialCapital.medicalEquipment || 350000, color: '#0f766e' },
    { name: 'Interior Setup', value: costs.initialCapital.interiorSetup || 250000, color: '#0d9488' },
    { name: 'Security Deposit', value: costs.initialCapital.securityDeposit || 114000, color: '#14b8a6' },
    { name: 'Furniture', value: costs.initialCapital.furniture || 95000, color: '#2dd4bf' },
    { name: 'IT Infrastructure', value: costs.initialCapital.itEquipment || 65000, color: '#475569' },
    { name: 'Permits & Legal', value: costs.initialCapital.registrationLegal || 35000, color: '#64748b' },
    { name: 'Signage & Stock', value: (costs.initialCapital.brandingSignage || 30000) + (costs.initialCapital.initialInventory || 45000), color: '#94a3b8' },
  ].filter(d => d.value > 0);

  const capexExplanation: CalculationDetails = {
    title: 'Estimated Startup Investment (CapEx)',
    headline: `${formatINR(costs.totalInitialInvestment)} total estimated setup capital required before opening doors.`,
    formula: 'Startup CapEx = Medical Equipment + Interior Fitout + Security Deposit + Furniture + IT + Permits + Signage + Buffer',
    inputs: [
      { label: 'Equipment Inventory', value: formatINR(costs.initialCapital.medicalEquipment || 350000), source: 'estimate' },
      { label: 'Interior Fitout', value: formatINR(costs.initialCapital.interiorSetup || 250000), source: 'benchmark' },
      { label: 'Security Deposit', value: formatINR(costs.initialCapital.securityDeposit || 114000), source: 'estimate' },
      { label: 'Carpet Area', value: `${clinic.location.approxAreaSqFt || 850} sq.ft`, source: 'input' },
    ],
    explanation: 'Based on current regional market price indices for medical equipment and interior fitouts in your practice location. You can override any line item below.',
    basisOneLiner: `Aggregated from 9 setup categories for a ${clinic.location.approxAreaSqFt || 850} sq.ft clinic.`,
  };

  const monthlyExplanation: CalculationDetails = {
    title: 'Estimated Monthly Operating Expenses (OpEx)',
    headline: `${formatINR(costs.totalMonthlyOperatingCost)} estimated monthly cost to keep clinic running smoothly.`,
    formula: 'Monthly OpEx = Commercial Rent + Staff Salaries + Consumables + Utilities + Software + AMC + Sundry',
    inputs: [
      { label: 'Monthly Rent', value: formatINR(costs.monthlyExpenses.rent || 38000), source: 'input' },
      { label: 'Staff Payroll', value: formatINR(costs.monthlyExpenses.salaries || 52000), source: 'estimate' },
      { label: 'Consumables & Supplies', value: formatINR(costs.monthlyExpenses.consumables || 15000), source: 'benchmark' },
      { label: 'Utilities & Power', value: formatINR(costs.monthlyExpenses.electricity || 9000), source: 'benchmark' },
    ],
    explanation: 'Staff salaries are synced with your staff roster. Commercial rent is derived from your location specifications. Adjust numbers to match your local terms.',
    basisOneLiner: `Reflects monthly lease, payroll for clinic team, power, and medical consumables.`,
  };

  return (
    <ModulePageShell
      stepNumber={5}
      totalSteps={8}
      title="Startup Budget & Operating Costs"
      description="Clear, transparent breakdown separating one-time setup capital from recurring monthly costs."
      statusBadge="In Progress"
      primaryActionLabel="Save & Continue to Permits"
      onPrimaryAction={() => setActiveView('legal')}
      secondaryActionLabel="Back to Staffing"
      onSecondaryAction={() => setActiveView('staff')}
      summaryMetrics={[
        {
          label: 'Estimated Startup CapEx',
          value: formatINR(costs.totalInitialInvestment),
          subtext: `Target budget: ${formatINR(clinic.budget.totalBudget, { compact: true })}`,
        },
        {
          label: 'Estimated Monthly OpEx',
          value: formatINR(costs.totalMonthlyOperatingCost),
          subtext: `${formatINR(costs.totalAnnualOperatingCost, { compact: true })} / year`,
        },
        {
          label: 'Equipment Share',
          value: `${Math.round((costs.initialCapital.medicalEquipment / costs.totalInitialInvestment) * 100)}%`,
          subtext: `${formatINR(costs.initialCapital.medicalEquipment, { compact: true })} allocated`,
        },
      ]}
    >
      {/* Tab Switcher: Initial Capital vs Monthly Expenses */}
      <div className="flex items-center justify-between gap-3 p-1.5 bg-slate-100 rounded-xl mb-6">
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setActiveTab('capital')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'capital'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            One-Time Startup Capital ({formatINR(costs.totalInitialInvestment, { compact: true })})
          </button>
          <button
            onClick={() => setActiveTab('monthly')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'monthly'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Monthly Operating Expenses ({formatINR(costs.totalMonthlyOperatingCost, { compact: true })}/mo)
          </button>
        </div>

        {/* Global Assumptions Trigger */}
        <button
          onClick={() => setAssumptionsModalOpen(true)}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-700 hover:text-teal-800 bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-2xs"
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>Edit Benchmark Rates</span>
        </button>
      </div>

      {/* Tab 1: Capital Items */}
      {activeTab === 'capital' && (
        <div className="space-y-6">
          {/* Explanation Banner */}
          <div className="p-4 rounded-xl bg-teal-50/50 border border-teal-100 flex items-start justify-between gap-3 text-xs text-teal-900">
            <div className="flex items-start gap-2.5">
              <Info className="w-4 h-4 text-teal-700 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block">Estimated Startup Capital (CapEx):</span>
                <span>
                  All upfront investments needed to fit out, equip, and legally register your clinic before welcoming your first patient.
                </span>
              </div>
            </div>
            <button
              onClick={() => setActiveCalcModal(capexExplanation)}
              className="text-xs font-bold text-teal-800 hover:underline shrink-0 flex items-center gap-1"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>How calculated</span>
            </button>
          </div>

          {/* Donut Chart + Table */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Visual Donut */}
            <div className="lg:col-span-5 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col items-center justify-center">
              <div className="h-56 w-full relative flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={88}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(val: number) => [formatINR(val), 'Estimated']} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Total CapEx</span>
                  <span className="text-base font-bold text-slate-900">
                    {formatINR(costs.totalInitialInvestment, { compact: true })}
                  </span>
                </div>
              </div>
              <p className="text-[11px] text-slate-500 text-center mt-2">
                Medical equipment represents the single largest capital allocation.
              </p>
            </div>

            {/* Editable Line Items */}
            <div className="lg:col-span-7 space-y-3">
              {capitalItems.map(item => (
                <div
                  key={item.key}
                  className="p-3.5 rounded-xl bg-white border border-slate-200 hover:border-slate-300 transition-colors shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900">{item.label}</span>
                      <DataBadge type={item.source} size="xs" />
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">{item.desc}</p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                    <span className="text-xs text-slate-400 font-medium">₹</span>
                    <input
                      type="number"
                      value={capitalInputs[item.key] || 0}
                      onChange={e => handleCapitalChange(item.key, Number(e.target.value))}
                      step={5000}
                      className="w-32 px-2.5 py-1 text-right text-xs font-mono font-bold text-slate-900 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-700"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Monthly Expenses */}
      {activeTab === 'monthly' && (
        <div className="space-y-6">
          {/* Explanation Banner */}
          <div className="p-4 rounded-xl bg-teal-50/50 border border-teal-100 flex items-start justify-between gap-3 text-xs text-teal-900">
            <div className="flex items-start gap-2.5">
              <Info className="w-4 h-4 text-teal-700 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block">Estimated Monthly Operating Expenses (OpEx):</span>
                <span>
                  Recurring costs required every 30 days to maintain operations, clinical staff, utilities, and patient amenities.
                </span>
              </div>
            </div>
            <button
              onClick={() => setActiveCalcModal(monthlyExplanation)}
              className="text-xs font-bold text-teal-800 hover:underline shrink-0 flex items-center gap-1"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>How calculated</span>
            </button>
          </div>

          <div className="space-y-3">
            {monthlyItems.map(item => (
              <div
                key={item.key}
                className="p-3.5 rounded-xl bg-white border border-slate-200 hover:border-slate-300 transition-colors shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900">{item.label}</span>
                    <DataBadge type={item.source} size="xs" />
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">{item.desc}</p>
                </div>

                <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                  <span className="text-xs text-slate-400 font-medium">₹</span>
                  <input
                    type="number"
                    value={monthlyInputs[item.key] || 0}
                    onChange={e => handleMonthlyChange(item.key, Number(e.target.value))}
                    step={1000}
                    className="w-32 px-2.5 py-1 text-right text-xs font-mono font-bold text-slate-900 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-700"
                  />
                  <span className="text-[11px] text-slate-400 font-medium">/mo</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Calculation Modal */}
      <CalculationExplanationModal
        isOpen={!!activeCalcModal}
        onClose={() => setActiveCalcModal(null)}
        details={activeCalcModal}
        onOpenAssumptions={() => setAssumptionsModalOpen(true)}
      />

      {/* Assumptions Modal */}
      <AssumptionsModal
        isOpen={assumptionsModalOpen}
        onClose={() => setAssumptionsModalOpen(false)}
      />
    </ModulePageShell>
  );
};
