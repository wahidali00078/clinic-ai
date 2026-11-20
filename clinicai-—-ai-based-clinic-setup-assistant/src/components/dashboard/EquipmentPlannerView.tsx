import React, { useState } from 'react';
import { useClinic } from '../../context/ClinicContext';
import { EquipmentCategory, EquipmentItem, EquipmentPriority } from '../../types';
import {
  Package,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  AlertCircle,
  Trash2,
  Edit2,
  X,
  Stethoscope,
  Coins,
  Check,
  RotateCcw,
} from 'lucide-react';
import { ModulePageShell } from './ModulePageShell';
import { DataBadge } from '../common/DataBadge';
import { formatINR } from '../../utils/formatters';

export const EquipmentPlannerView: React.FC = () => {
  const {
    equipment,
    clinic,
    addEquipmentItem,
    updateEquipmentItem,
    deleteEquipmentItem,
    toggleEquipmentPurchased,
    costs,
    setActiveView,
  } = useClinic();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedPriority, setSelectedPriority] = useState<string>('All');

  // Modal state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<EquipmentItem | null>(null);

  // Add/Edit form state
  const [itemName, setItemName] = useState('');
  const [itemCategory, setItemCategory] = useState<EquipmentCategory>('Consultation');
  const [itemPriority, setItemPriority] = useState<EquipmentPriority>('Essential');
  const [itemQuantity, setItemQuantity] = useState(1);
  const [itemUnitCost, setItemUnitCost] = useState(15000);
  const [itemReason, setItemReason] = useState('Standard clinical requirement');

  const categories: string[] = [
    'All',
    'Consultation',
    'Diagnostic',
    'Treatment',
    'Furniture',
    'IT',
    'Emergency',
    'Sterilization',
    'Other',
  ];

  const priorities: string[] = ['All', 'Essential', 'Recommended', 'Optional'];

  // Filtered equipment list
  const filteredEquipment = equipment.filter(item => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.reasonRequired.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesPriority = selectedPriority === 'All' || item.priority === selectedPriority;
    return matchesSearch && matchesCategory && matchesPriority;
  });

  // Calculate totals
  const totalEquipmentCost = equipment.reduce((sum, it) => sum + it.estimatedTotalCost, 0);
  const purchasedCost = equipment
    .filter(it => it.isPurchased)
    .reduce((sum, it) => sum + it.estimatedTotalCost, 0);
  const essentialCost = equipment
    .filter(it => it.priority === 'Essential')
    .reduce((sum, it) => sum + it.estimatedTotalCost, 0);

  const plannedBudget = clinic.budget.equipmentBudget || 400000;

  const handleOpenAdd = () => {
    setEditingItem(null);
    setItemName('');
    setItemCategory('Consultation');
    setItemPriority('Essential');
    setItemQuantity(1);
    setItemUnitCost(15000);
    setItemReason('Required for daily outpatient examination.');
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (item: EquipmentItem) => {
    setEditingItem(item);
    setItemName(item.name);
    setItemCategory(item.category);
    setItemPriority(item.priority);
    setItemQuantity(item.quantity);
    setItemUnitCost(item.estimatedUnitCost);
    setItemReason(item.reasonRequired);
    setIsAddModalOpen(true);
  };

  const handleSaveItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!itemName.trim()) return;

    if (editingItem) {
      await updateEquipmentItem(editingItem.id, {
        name: itemName.trim(),
        category: itemCategory,
        priority: itemPriority,
        quantity: itemQuantity,
        estimatedUnitCost: itemUnitCost,
        reasonRequired: itemReason.trim(),
      });
    } else {
      await addEquipmentItem({
        name: itemName.trim(),
        category: itemCategory,
        priority: itemPriority,
        quantity: itemQuantity,
        estimatedUnitCost: itemUnitCost,
        reasonRequired: itemReason.trim(),
        isPurchased: false,
      });
    }

    setIsAddModalOpen(false);
  };

  return (
    <ModulePageShell
      stepNumber={3}
      totalSteps={8}
      title="Essential Medical Equipment & Diagnostics"
      description={`Curated for ${clinic.clinicType} outpatient setup with day-1 essential tools and procurement estimates.`}
      statusBadge="In Progress"
      primaryActionLabel="Save & Continue to Staffing"
      onPrimaryAction={() => setActiveView('staff')}
      secondaryActionLabel="Back to Location"
      onSecondaryAction={() => setActiveView('location')}
      summaryMetrics={[
        {
          label: 'Total Equipment CapEx',
          value: formatINR(totalEquipmentCost),
          subtext: `${equipment.length} items planned`,
        },
        {
          label: 'Essential for Day 1',
          value: formatINR(essentialCost),
          subtext: `${equipment.filter(e => e.priority === 'Essential').length} must-have items`,
        },
        {
          label: 'Procurement Status',
          value: `${Math.round((purchasedCost / (totalEquipmentCost || 1)) * 100)}% Purchased`,
          subtext: `${formatINR(purchasedCost, { compact: true })} acquired`,
        },
      ]}
    >
      {/* Search & Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2 flex-1 max-w-md">
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search equipment or clinical reason..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-teal-700"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold shadow-2xs transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Custom Item</span>
          </button>
        </div>
      </div>

      {/* Category Pills */}
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

      {/* Desktop Table (> 768px) */}
      <div className="hidden md:block bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[10px]">
            <tr>
              <th className="py-3 px-4 font-bold">Acquired</th>
              <th className="py-3 px-4 font-bold">Item Name</th>
              <th className="py-3 px-4 font-bold">Category</th>
              <th className="py-3 px-4 font-bold">Priority</th>
              <th className="py-3 px-4 font-bold text-center">Qty</th>
              <th className="py-3 px-4 font-bold text-right">Est. Unit Cost</th>
              <th className="py-3 px-4 font-bold text-right">Total</th>
              <th className="py-3 px-4 font-bold">Clinical Use</th>
              <th className="py-3 px-4 font-bold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredEquipment.length === 0 ? (
              <tr>
                <td colSpan={9} className="py-8 text-center text-slate-400">
                  No equipment matched your filters.
                </td>
              </tr>
            ) : (
              filteredEquipment.map(item => (
                <tr
                  key={item.id}
                  className={`hover:bg-slate-50/70 transition-colors ${
                    item.isPurchased ? 'bg-emerald-50/20' : ''
                  }`}
                >
                  <td className="py-2.5 px-4">
                    <button
                      onClick={() => toggleEquipmentPurchased(item.id)}
                      className={`w-4 h-4 rounded flex items-center justify-center border transition-all ${
                        item.isPurchased
                          ? 'bg-emerald-600 border-emerald-600 text-white'
                          : 'border-slate-300 hover:border-slate-400 bg-white'
                      }`}
                      title={item.isPurchased ? 'Mark as pending' : 'Mark as purchased'}
                    >
                      {item.isPurchased && <Check className="w-3 h-3" />}
                    </button>
                  </td>

                  <td className="py-2.5 px-4 font-bold text-slate-900">
                    <div className="flex items-center gap-1.5">
                      <span>{item.name}</span>
                      {item.isPurchased && (
                        <span className="text-[9px] font-semibold text-emerald-700 bg-emerald-100 px-1 py-0.2 rounded">
                          Acquired
                        </span>
                      )}
                    </div>
                  </td>

                  <td className="py-2.5 px-4 text-slate-600 font-medium">
                    {item.category}
                  </td>

                  <td className="py-2.5 px-4">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                        item.priority === 'Essential'
                          ? 'bg-rose-50 text-rose-700 border-rose-200'
                          : item.priority === 'Recommended'
                          ? 'bg-teal-50 text-teal-700 border-teal-200'
                          : 'bg-slate-100 text-slate-600 border-slate-200'
                      }`}
                    >
                      {item.priority}
                    </span>
                  </td>

                  <td className="py-2.5 px-4 text-center font-bold text-slate-800">
                    {item.quantity}
                  </td>

                  <td className="py-2.5 px-4 text-right font-mono text-slate-600">
                    {formatINR(item.estimatedUnitCost)}
                  </td>

                  <td className="py-2.5 px-4 text-right font-bold font-mono text-slate-900">
                    {formatINR(item.estimatedTotalCost)}
                  </td>

                  <td className="py-2.5 px-4 text-slate-500 max-w-xs truncate" title={item.reasonRequired}>
                    {item.reasonRequired}
                  </td>

                  <td className="py-2.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => handleOpenEdit(item)}
                        className="p-1 text-slate-400 hover:text-teal-700 rounded hover:bg-slate-100"
                        title="Edit Item"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => deleteEquipmentItem(item.id)}
                        className="p-1 text-slate-400 hover:text-rose-600 rounded hover:bg-rose-50"
                        title="Delete (Includes Undo)"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Stacked Cards (< 768px) */}
      <div className="md:hidden space-y-3">
        {filteredEquipment.map(item => (
          <div
            key={item.id}
            className={`p-3.5 rounded-xl border bg-white shadow-2xs space-y-2 ${
              item.isPurchased ? 'border-emerald-200 bg-emerald-50/20' : 'border-slate-200'
            }`}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleEquipmentPurchased(item.id)}
                  className={`w-5 h-5 rounded flex items-center justify-center border transition-all ${
                    item.isPurchased
                      ? 'bg-emerald-600 border-emerald-600 text-white'
                      : 'border-slate-300 hover:border-slate-400 bg-white'
                  }`}
                >
                  {item.isPurchased && <Check className="w-3.5 h-3.5" />}
                </button>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">{item.name}</h4>
                  <span className="text-[10px] text-slate-400">{item.category}</span>
                </div>
              </div>

              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                  item.priority === 'Essential'
                    ? 'bg-rose-50 text-rose-700 border-rose-200'
                    : 'bg-slate-100 text-slate-600 border-slate-200'
                }`}
              >
                {item.priority}
              </span>
            </div>

            <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100">
              <span className="text-slate-500">
                {item.quantity} × {formatINR(item.estimatedUnitCost)}
              </span>
              <span className="font-bold font-mono text-slate-900">
                {formatINR(item.estimatedTotalCost)}
              </span>
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <span className="text-[11px] text-slate-400 truncate flex-1 mr-2">{item.reasonRequired}</span>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => handleOpenEdit(item)}
                  className="text-teal-700 hover:underline text-[11px] font-medium"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteEquipmentItem(item.id)}
                  className="text-rose-600 hover:underline text-[11px] font-medium"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">
                {editingItem ? 'Edit Medical Equipment' : 'Add Medical Equipment'}
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveItem} className="space-y-4 mt-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Equipment Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 12-Lead ECG Machine, Autoclave 20L"
                  value={itemName}
                  onChange={e => setItemName(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-teal-700"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Category</label>
                  <select
                    value={itemCategory}
                    onChange={e => setItemCategory(e.target.value as EquipmentCategory)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-teal-700"
                  >
                    {categories.filter(c => c !== 'All').map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Priority</label>
                  <select
                    value={itemPriority}
                    onChange={e => setItemPriority(e.target.value as EquipmentPriority)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-teal-700"
                  >
                    <option value="Essential">Essential (Day-1 Launch)</option>
                    <option value="Recommended">Recommended (Month 1-3)</option>
                    <option value="Optional">Optional (Future Phase)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Quantity</label>
                  <input
                    type="number"
                    min={1}
                    max={50}
                    value={itemQuantity}
                    onChange={e => setItemQuantity(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-teal-700"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Estimated Unit Cost (₹)</label>
                  <input
                    type="number"
                    step={1000}
                    value={itemUnitCost}
                    onChange={e => setItemUnitCost(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-teal-700"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Clinical Requirement Reason</label>
                <textarea
                  rows={2}
                  value={itemReason}
                  onChange={e => setItemReason(e.target.value)}
                  placeholder="Clinical necessity (e.g., Required for initial cardiac rhythm screening)"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-teal-700"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded-xl shadow-xs"
                >
                  {editingItem ? 'Update Item' : 'Add Item'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </ModulePageShell>
  );
};
