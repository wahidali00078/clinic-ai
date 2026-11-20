import React, { useState } from 'react';
import { useClinic } from '../../context/ClinicContext';
import { LegalChecklistItem, LegalItemStatus } from '../../types';
import {
  Scale,
  CheckCircle2,
  Clock,
  AlertCircle,
  ExternalLink,
  ShieldCheck,
  FileText,
  Building,
  Check,
  Edit2,
  Filter,
  Info,
} from 'lucide-react';
import { ModulePageShell } from './ModulePageShell';
import { formatINR } from '../../utils/formatters';

export const LegalChecklistView: React.FC = () => {
  const { legalChecklist, clinic, updateLegalItem, setActiveView } = useClinic();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [editingNotesId, setEditingNotesId] = useState<string | null>(null);
  const [tempNotes, setTempNotes] = useState<string>('');

  const completedCount = legalChecklist.filter(item => item.status === 'Completed').length;
  const inProgressCount = legalChecklist.filter(item => item.status === 'In Progress').length;
  const totalItems = legalChecklist.length;
  const compliancePercent = Math.round((completedCount / totalItems) * 100);

  const categories = [
    'All',
    'Clinic registration',
    'Local permissions',
    'Medical council',
    'Tax and business',
  ];

  const filteredItems = legalChecklist.filter(item => {
    return selectedCategory === 'All' || item.category === selectedCategory;
  });

  const handleStatusChange = async (id: string, status: LegalItemStatus) => {
    await updateLegalItem(id, { status });
  };

  const handleStartEditNotes = (item: LegalChecklistItem) => {
    setEditingNotesId(item.id);
    setTempNotes(item.notes || '');
  };

  const handleSaveNotes = async (id: string) => {
    await updateLegalItem(id, { notes: tempNotes });
    setEditingNotesId(null);
  };

  return (
    <ModulePageShell
      stepNumber={6}
      totalSteps={8}
      title="Permits & Healthcare Regulatory Approvals"
      description={`Statutory registrations calibrated for ${clinic.clinicType} in ${clinic.location.city}, ${clinic.location.state}.`}
      statusBadge={compliancePercent === 100 ? 'Completed' : 'In Progress'}
      primaryActionLabel="Save & Continue to Revenue Forecast"
      onPrimaryAction={() => setActiveView('revenue')}
      secondaryActionLabel="Back to Startup Budget"
      onSecondaryAction={() => setActiveView('costs')}
      summaryMetrics={[
        {
          label: 'Compliance Progress',
          value: `${compliancePercent}%`,
          subtext: `${completedCount} of ${totalItems} approvals secured`,
        },
        {
          label: 'Applications In-Flight',
          value: `${inProgressCount}`,
          subtext: 'Currently submitted for review',
        },
        {
          label: 'Pending Actions',
          value: `${totalItems - completedCount - inProgressCount}`,
          subtext: 'Requires document filing',
        },
      ]}
    >
      {/* Statutory Advisory Banner strictly matching Section D */}
      <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200 text-xs text-amber-950 flex items-start gap-3 mb-6">
        <AlertCircle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <span className="font-bold block text-sm mb-0.5 text-amber-900">
            Statutory Healthcare Notice for {clinic.location.city}, {clinic.location.state}:
          </span>
          Requirements vary by state, city, and clinic type. Verify with the relevant local health department or municipal authority before executing lease or interior contracts.
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-4">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
              selectedCategory === cat
                ? 'bg-teal-700 text-white'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Checklist Cards */}
      <div className="space-y-3">
        {filteredItems.map(item => {
          const isDone = item.status === 'Completed';
          const isInProgress = item.status === 'In Progress';

          return (
            <div
              key={item.id}
              className={`p-4 rounded-xl border transition-all ${
                isDone
                  ? 'bg-emerald-50/30 border-emerald-200'
                  : isInProgress
                  ? 'bg-amber-50/30 border-amber-200'
                  : 'bg-white border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                {/* Left: Item Info */}
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 shrink-0">
                    <button
                      onClick={() =>
                        handleStatusChange(
                          item.id,
                          isDone ? 'Not Started' : 'Completed'
                        )
                      }
                      className={`w-5 h-5 rounded-md flex items-center justify-center border transition-all ${
                        isDone
                          ? 'bg-emerald-600 border-emerald-600 text-white'
                          : 'border-slate-300 hover:border-slate-400 bg-white'
                      }`}
                    >
                      {isDone && <Check className="w-3.5 h-3.5" />}
                    </button>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-xs sm:text-sm font-bold text-slate-900">{item.name}</h3>
                      <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                        {item.category}
                      </span>
                      {item.isMandatory && (
                        <span className="text-[10px] font-bold text-rose-700 bg-rose-50 border border-rose-200 px-1.5 py-0.2 rounded">
                          Mandatory
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                      {item.description}
                    </p>

                    <div className="flex flex-wrap items-center gap-3 mt-2 text-[11px] text-slate-500">
                      <span><strong>Authority:</strong> {item.issuingAuthority}</span>
                      <span>•</span>
                      <span><strong>Est. Timeline:</strong> {item.estimatedDays} days</span>
                      <span>•</span>
                      <span>
                        <strong>Govt Fee:</strong> {item.estimatedGovtFee ? formatINR(item.estimatedGovtFee) : 'Nominal / Nil'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right: Status Pill Selector */}
                <div className="flex items-center gap-1.5 shrink-0 self-start lg:self-center">
                  {(['Not Started', 'In Progress', 'Completed'] as LegalItemStatus[]).map(status => (
                    <button
                      key={status}
                      onClick={() => handleStatusChange(item.id, status)}
                      className={`px-2.5 py-1 text-[11px] font-semibold rounded-lg border transition-all ${
                        item.status === status
                          ? status === 'Completed'
                            ? 'bg-emerald-600 text-white border-emerald-600'
                            : status === 'In Progress'
                            ? 'bg-amber-500 text-white border-amber-500'
                            : 'bg-slate-700 text-white border-slate-700'
                          : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>

              {/* Notes Area */}
              {editingNotesId === item.id ? (
                <div className="mt-3 pt-3 border-t border-slate-100 flex items-center gap-2">
                  <input
                    type="text"
                    value={tempNotes}
                    onChange={e => setTempNotes(e.target.value)}
                    placeholder="Add reference application number or officer remarks..."
                    className="flex-1 px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-700"
                  />
                  <button
                    onClick={() => handleSaveNotes(item.id)}
                    className="px-3 py-1.5 bg-teal-700 text-white text-xs font-semibold rounded-lg hover:bg-teal-800"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditingNotesId(null)}
                    className="px-3 py-1.5 text-slate-500 text-xs hover:text-slate-800"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                  <span className="truncate">
                    {item.notes ? `Note: ${item.notes}` : 'No filing notes added yet'}
                  </span>
                  <button
                    onClick={() => handleStartEditNotes(item)}
                    className="text-teal-700 hover:underline font-medium shrink-0 ml-2"
                  >
                    {item.notes ? 'Edit note' : '+ Add reference note'}
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </ModulePageShell>
  );
};
