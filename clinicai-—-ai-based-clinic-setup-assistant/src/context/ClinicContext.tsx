import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  Clinic,
  CostStructure,
  EquipmentItem,
  LegalChecklistItem,
  LocationAnalysis,
  RevenueForecast,
  StaffRoleItem,
  AIRecommendation,
} from '../types';
import {
  calculateCostStructure,
  calculateRevenueForecast,
  createDemoClinic,
  generateInitialEquipment,
  generateInitialLegalChecklist,
  generateInitialStaff,
  generateLocationAnalysis,
  resolveLocationCoordinates,
} from '../utils/clinicDefaults';
import { useAuth } from './AuthContext';

export type ActiveView =
  | 'landing'
  | 'features'
  | 'how-it-works'
  | 'benefits'
  | 'pricing'
  | 'faq'
  | 'onboarding'
  | 'dashboard'
  | 'profile'
  | 'location'
  | 'equipment'
  | 'staff'
  | 'costs'
  | 'legal'
  | 'revenue'
  | 'ai-assistant'
  | 'reports'
  | 'admin'
  | 'settings';

export interface Toast {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  message: string;
  onUndo?: () => void;
  undoLabel?: string;
}

interface ClinicContextType {
  activeView: ActiveView;
  setActiveView: (view: ActiveView) => void;
  goBack: () => void;
  canGoBack: boolean;
  previousView: ActiveView | null;
  clinic: Clinic;
  locationAnalysis: LocationAnalysis;
  equipment: EquipmentItem[];
  staff: StaffRoleItem[];
  costs: CostStructure;
  revenue: RevenueForecast;
  legalChecklist: LegalChecklistItem[];
  aiRecommendations: AIRecommendation[];
  toasts: Toast[];
  addToast: (message: string, type?: Toast['type'], onUndo?: () => void, undoLabel?: string) => void;
  removeToast: (id: string) => void;
  isLoading: boolean;
  isFloatingAIAssistantOpen: boolean;
  setIsFloatingAIAssistantOpen: (open: boolean) => void;
  toggleFloatingAIAssistant: () => void;
  // Mutations
  updateClinic: (updated: Partial<Clinic>) => Promise<void>;
  createClinicFromWizard: (data: any) => Promise<void>;
  addEquipmentItem: (item: Omit<EquipmentItem, 'id' | 'clinicId'>) => Promise<void>;
  updateEquipmentItem: (id: string, updates: Partial<EquipmentItem>) => Promise<void>;
  deleteEquipmentItem: (id: string) => Promise<void>;
  toggleEquipmentPurchased: (id: string) => Promise<void>;
  updateStaffRole: (id: string, count: number, monthlySalary: number) => Promise<void>;
  updateCosts: (initialUpdates?: any, monthlyUpdates?: any) => Promise<void>;
  updateLegalItem: (id: string, updates: Partial<LegalChecklistItem>) => Promise<void>;
  updateRevenueAssumptions: (assumptions: {
    patientsPerDay?: number;
    consultationFee?: number;
    workingDaysPerMonth?: number;
    otherServicesRevenuePerPatient?: number;
  }) => Promise<void>;
  resetToDemoClinic: () => Promise<void>;
}

const ClinicContext = createContext<ClinicContextType | undefined>(undefined);

export const ClinicProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [activeView, setActiveViewState] = useState<ActiveView>('dashboard');
  const [history, setHistory] = useState<ActiveView[]>([]);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFloatingAIAssistantOpen, setIsFloatingAIAssistantOpen] = useState(false);

  const setActiveView = useCallback((newView: ActiveView) => {
    setActiveViewState(current => {
      if (current !== newView) {
        setHistory(prev => [...prev, current]);
      }
      return newView;
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const goBack = useCallback(() => {
    setHistory(prev => {
      if (prev.length > 0) {
        const nextHistory = [...prev];
        const prevView = nextHistory.pop()!;
        setActiveViewState(prevView);
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return nextHistory;
      } else {
        setActiveViewState(current => {
          if (['features', 'how-it-works', 'benefits', 'pricing', 'faq', 'onboarding'].includes(current)) {
            return 'landing';
          }
          if (['location', 'equipment', 'staff', 'costs', 'legal', 'revenue', 'reports', 'ai-assistant', 'profile', 'admin'].includes(current)) {
            return 'dashboard';
          }
          return 'landing';
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return [];
      }
    });
  }, []);

  const canGoBack = history.length > 0 || activeView !== 'landing';
  const previousView = history.length > 0 ? history[history.length - 1] : null;

  const toggleFloatingAIAssistant = useCallback(() => {
    setIsFloatingAIAssistantOpen(prev => !prev);
  }, []);

  // Initialize with Jaipur demo clinic
  const initialDemo = createDemoClinic();
  const [clinic, setClinic] = useState<Clinic>(initialDemo);
  const [equipment, setEquipment] = useState<EquipmentItem[]>(() =>
    generateInitialEquipment(initialDemo.id, initialDemo.clinicType)
  );
  const [staff, setStaff] = useState<StaffRoleItem[]>(() =>
    generateInitialStaff(initialDemo.id, initialDemo.clinicType, initialDemo.capacity.expectedPatientsPerDay)
  );
  const [legalChecklist, setLegalChecklist] = useState<LegalChecklistItem[]>(() =>
    generateInitialLegalChecklist(initialDemo.id, `${initialDemo.location.city}, ${initialDemo.location.state}`)
  );
  const [locationAnalysis, setLocationAnalysis] = useState<LocationAnalysis>(() =>
    generateLocationAnalysis(
      initialDemo.id,
      initialDemo.location.city,
      initialDemo.location.area,
      initialDemo.clinicType,
      initialDemo.capacity.expectedPatientsPerDay
    )
  );
  const [costs, setCosts] = useState<CostStructure>(() =>
    calculateCostStructure(
      initialDemo.id,
      initialDemo,
      generateInitialEquipment(initialDemo.id, initialDemo.clinicType),
      generateInitialStaff(initialDemo.id, initialDemo.clinicType, initialDemo.capacity.expectedPatientsPerDay)
    )
  );
  const [revenue, setRevenue] = useState<RevenueForecast>(() =>
    calculateRevenueForecast(
      initialDemo.id,
      30,
      500,
      26,
      180,
      costs.totalMonthlyOperatingCost,
      costs.totalInitialInvestment,
      initialDemo.budget.currency
    )
  );
  const [aiRecommendations, setAiRecommendations] = useState<AIRecommendation[]>([
    {
      id: 'rec-1',
      category: 'Equipment',
      title: 'Prioritize Core Diagnostic Equipment',
      description: 'Invest in diagnostic monitors and sterilization autoclave first. Delay procedural lasers until revenue surpasses ₹2,00,000/mo.',
      priority: 'high',
      impact: 'Reduces Day-1 capital outlay by up to 22%',
    },
    {
      id: 'rec-2',
      category: 'Budget',
      title: 'Negotiate Lease Fit-Out Rent Grace Period',
      description: 'Commercial landlords in Jaipur typically offer 30 to 45 days rent waiver during interior renovation and partition work.',
      priority: 'high',
      impact: 'Saves approx ₹38,000 in upfront costs',
    },
    {
      id: 'rec-3',
      category: 'Strategy',
      title: 'Pathology Sample Collection Synergy',
      description: 'Partner with an accredited central diagnostic laboratory for routine blood panels to earn 15% revenue without buying high-end analyzers.',
      priority: 'medium',
      impact: 'Shortens break-even by ~1.2 months',
    },
  ]);

  const addToast = useCallback((
    message: string,
    type: Toast['type'] = 'info',
    onUndo?: () => void,
    undoLabel: string = 'Undo'
  ) => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts(prev => [...prev, { id, message, type, onUndo, undoLabel }]);
    const duration = onUndo ? 7000 : 4000;
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, duration);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  // Sync data from backend if available
  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch(`/api/clinics/${clinic.id}`);
        if (res.ok) {
          const remoteClinic = await res.json();
          setClinic(remoteClinic);
        }

        const [eqRes, stRes, legRes, locRes, costRes, revRes] = await Promise.all([
          fetch(`/api/clinics/${clinic.id}/equipment`),
          fetch(`/api/clinics/${clinic.id}/staff`),
          fetch(`/api/clinics/${clinic.id}/legal`),
          fetch(`/api/clinics/${clinic.id}/location`),
          fetch(`/api/clinics/${clinic.id}/costs`),
          fetch(`/api/clinics/${clinic.id}/revenue`),
        ]);

        if (eqRes.ok) setEquipment(await eqRes.json());
        if (stRes.ok) setStaff(await stRes.json());
        if (legRes.ok) setLegalChecklist(await legRes.json());
        if (locRes.ok) setLocationAnalysis(await locRes.json());
        if (costRes.ok) setCosts(await costRes.json());
        if (revRes.ok) setRevenue(await revRes.json());
      } catch (e) {
        // Fallback to memory defaults
      }
    }
    loadData();
  }, [clinic.id]);

  // Recalculate costs & revenue when items change
  const recalculateAll = useCallback((
    updatedClinic: Clinic,
    updatedEq: EquipmentItem[],
    updatedStaff: StaffRoleItem[],
    revOverrides?: Partial<RevenueForecast>
  ) => {
    const newCosts = calculateCostStructure(updatedClinic.id, updatedClinic, updatedEq, updatedStaff);
    setCosts(newCosts);

    const newRev = calculateRevenueForecast(
      updatedClinic.id,
      revOverrides?.patientsPerDay ?? revenue.patientsPerDay,
      revOverrides?.consultationFee ?? revenue.consultationFee,
      revOverrides?.workingDaysPerMonth ?? revenue.workingDaysPerMonth,
      revOverrides?.otherServicesRevenuePerPatient ?? revenue.otherServicesRevenuePerPatient,
      newCosts.totalMonthlyOperatingCost,
      newCosts.totalInitialInvestment,
      updatedClinic.budget.currency
    );
    setRevenue(newRev);
  }, [revenue]);

  const updateClinic = async (updated: Partial<Clinic>) => {
    let mergedLocation = updated.location ? { ...clinic.location, ...updated.location } : { ...clinic.location };

    // Check if city, area, or address changed
    if (updated.location) {
      const cityChanged = updated.location.city && updated.location.city.trim().toLowerCase() !== clinic.location.city.trim().toLowerCase();
      const areaChanged = updated.location.area && updated.location.area.trim().toLowerCase() !== clinic.location.area.trim().toLowerCase();
      
      const hasExplicitNewCoords =
        updated.location.latitude !== undefined &&
        updated.location.longitude !== undefined &&
        (updated.location.latitude !== clinic.location.latitude || updated.location.longitude !== clinic.location.longitude);

      if ((cityChanged || areaChanged) && !hasExplicitNewCoords) {
        // Resolve coordinates for the new city or area
        const resolved = resolveLocationCoordinates(
          `${updated.location.area || ''} ${updated.location.city || ''}`.trim(),
          updated.location.city || clinic.location.city
        );
        mergedLocation.latitude = resolved.lat;
        mergedLocation.longitude = resolved.lng;
        if (resolved.state && !updated.location.state) {
          mergedLocation.state = resolved.state;
        }
      }
    }

    const merged = { ...clinic, ...updated, location: mergedLocation, updatedAt: new Date().toISOString() };
    setClinic(merged);
    recalculateAll(merged, equipment, staff);

    // If location changed, regenerate location analysis and legal checklist for the new city/catchment!
    if (updated.location) {
      const newLoc = generateLocationAnalysis(
        merged.id,
        merged.location.city,
        merged.location.area,
        merged.clinicType,
        merged.capacity.expectedPatientsPerDay
      );
      setLocationAnalysis(newLoc);

      if (merged.location.city !== clinic.location.city || merged.location.state !== clinic.location.state) {
        setLegalChecklist(
          generateInitialLegalChecklist(merged.id, `${merged.location.city}, ${merged.location.state}`)
        );
      }
    }

    addToast('Clinic profile updated successfully', 'success');

    try {
      await fetch(`/api/clinics/${clinic.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(merged),
      });
    } catch (e) {}
  };

  const createClinicFromWizard = async (wizardData: any) => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/clinics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...wizardData, userId: user?.id || 'demo-user-1' }),
      });

      let newClinicData: Clinic;
      if (res.ok) {
        newClinicData = await res.json();
      } else {
        const id = `clinic-${Date.now()}`;
        const rawLoc = wizardData.location || initialDemo.location;
        const resolvedCoords = resolveLocationCoordinates(`${rawLoc.area || ''} ${rawLoc.city || ''}`.trim(), rawLoc.city);
        
        newClinicData = {
          id,
          userId: user?.id || 'demo-user-1',
          name: wizardData.name || `${wizardData.location?.city || 'New'} ${wizardData.clinicType || 'Medical'} Clinic`,
          clinicType: wizardData.clinicType || 'General Clinic',
          location: {
            ...rawLoc,
            latitude: rawLoc.latitude || resolvedCoords.lat,
            longitude: rawLoc.longitude || resolvedCoords.lng,
          },
          capacity: wizardData.capacity || initialDemo.capacity,
          budget: wizardData.budget || initialDemo.budget,
          services: wizardData.services || ['Consultations'],
          status: 'configured',
          setupProgress: {
            profile: true,
            location: true,
            equipment: true,
            staff: true,
            budget: true,
            legal: true,
            revenue: true,
            report: true,
          },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
      }

      // Ensure coordinates are set for the target city
      if (!newClinicData.location.latitude || !newClinicData.location.longitude) {
        const resolved = resolveLocationCoordinates(
          `${newClinicData.location.area || ''} ${newClinicData.location.city || ''}`.trim(),
          newClinicData.location.city
        );
        newClinicData.location.latitude = resolved.lat;
        newClinicData.location.longitude = resolved.lng;
      }

      setClinic(newClinicData);
      const newEq = generateInitialEquipment(newClinicData.id, newClinicData.clinicType);
      const newStaff = generateInitialStaff(newClinicData.id, newClinicData.clinicType, newClinicData.capacity.expectedPatientsPerDay);
      const newLegal = generateInitialLegalChecklist(newClinicData.id, `${newClinicData.location.city}, ${newClinicData.location.state}`);
      const newLoc = generateLocationAnalysis(
        newClinicData.id,
        newClinicData.location.city,
        newClinicData.location.area,
        newClinicData.clinicType,
        newClinicData.capacity.expectedPatientsPerDay
      );

      setEquipment(newEq);
      setStaff(newStaff);
      setLegalChecklist(newLegal);
      setLocationAnalysis(newLoc);
      recalculateAll(newClinicData, newEq, newStaff);

      addToast('Your clinic setup plan has been generated with AI!', 'success');
      setActiveView('dashboard');
    } catch (e) {
      addToast('Generated plan locally.', 'info');
      setActiveView('dashboard');
    } finally {
      setIsLoading(false);
    }
  };

  const addEquipmentItem = async (item: Omit<EquipmentItem, 'id' | 'clinicId'>) => {
    const newItem: EquipmentItem = {
      ...item,
      id: `eq-${clinic.id}-${Date.now()}`,
      clinicId: clinic.id,
    };
    const updated = [...equipment, newItem];
    setEquipment(updated);
    recalculateAll(clinic, updated, staff);
    addToast(`Added "${item.name}" to equipment plan`, 'success');

    try {
      await fetch(`/api/clinics/${clinic.id}/equipment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item),
      });
    } catch (e) {}
  };

  const updateEquipmentItem = async (id: string, updates: Partial<EquipmentItem>) => {
    const updated = equipment.map(item => {
      if (item.id === id) {
        const merged = { ...item, ...updates };
        merged.estimatedTotalCost = merged.quantity * merged.estimatedUnitCost;
        return merged;
      }
      return item;
    });
    setEquipment(updated);
    recalculateAll(clinic, updated, staff);
    addToast('Equipment details updated', 'info');

    try {
      await fetch(`/api/clinics/${clinic.id}/equipment/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
    } catch (e) {}
  };

  const deleteEquipmentItem = async (id: string) => {
    const target = equipment.find(i => i.id === id);
    if (!target) return;
    const updated = equipment.filter(i => i.id !== id);
    setEquipment(updated);
    recalculateAll(clinic, updated, staff);

    addToast(
      `Removed "${target.name}" from equipment plan`,
      'warning',
      () => {
        setEquipment(prev => {
          const restored = [...prev, target];
          recalculateAll(clinic, restored, staff);
          return restored;
        });
        addToast(`Restored "${target.name}"`, 'success');
      },
      'Undo'
    );

    try {
      await fetch(`/api/clinics/${clinic.id}/equipment/${id}`, {
        method: 'DELETE',
      });
    } catch (e) {}
  };

  const toggleEquipmentPurchased = async (id: string) => {
    const item = equipment.find(i => i.id === id);
    if (!item) return;
    await updateEquipmentItem(id, { isPurchased: !item.isPurchased });
    addToast(item.isPurchased ? 'Marked as unpurchased' : 'Marked as purchased', 'info');
  };

  const updateStaffRole = async (id: string, count: number, monthlySalary: number) => {
    const updated = staff.map(s => {
      if (s.id === id) {
        return {
          ...s,
          recommendedCount: Math.max(0, count),
          monthlySalaryEstimate: monthlySalary,
          annualSalaryEstimate: monthlySalary * 12,
        };
      }
      return s;
    });
    setStaff(updated);
    recalculateAll(clinic, equipment, updated);
    addToast('Staff role updated', 'success');

    try {
      await fetch(`/api/clinics/${clinic.id}/staff/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ recommendedCount: count, monthlySalaryEstimate: monthlySalary }),
      });
    } catch (e) {}
  };

  const updateCosts = async (initialUpdates?: any, monthlyUpdates?: any) => {
    const updatedInitial = { ...costs.initialCapital, ...initialUpdates };
    const updatedMonthly = { ...costs.monthlyExpenses, ...monthlyUpdates };

    const initVals = Object.entries(updatedInitial)
      .filter(([k]) => k !== 'total')
      .map(([_, v]) => Number(v) || 0);
    updatedInitial.total = initVals.reduce((a, b) => a + b, 0);

    const mVals = Object.entries(updatedMonthly)
      .filter(([k]) => k !== 'total')
      .map(([_, v]) => Number(v) || 0);
    updatedMonthly.total = mVals.reduce((a, b) => a + b, 0);

    const updatedCostStructure: CostStructure = {
      ...costs,
      initialCapital: updatedInitial,
      monthlyExpenses: updatedMonthly,
      totalInitialInvestment: updatedInitial.total,
      totalMonthlyOperatingCost: updatedMonthly.total,
      totalAnnualOperatingCost: updatedMonthly.total * 12,
    };

    setCosts(updatedCostStructure);

    // Sync revenue forecast
    const updatedRev = calculateRevenueForecast(
      clinic.id,
      revenue.patientsPerDay,
      revenue.consultationFee,
      revenue.workingDaysPerMonth,
      revenue.otherServicesRevenuePerPatient,
      updatedCostStructure.totalMonthlyOperatingCost,
      updatedCostStructure.totalInitialInvestment,
      clinic.budget.currency
    );
    setRevenue(updatedRev);
    addToast('Financial cost model recalculated', 'success');

    try {
      await fetch(`/api/clinics/${clinic.id}/costs`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ initialCapital: initialUpdates, monthlyExpenses: monthlyUpdates }),
      });
    } catch (e) {}
  };

  const updateLegalItem = async (id: string, updates: Partial<LegalChecklistItem>) => {
    const updated = legalChecklist.map(l => (l.id === id ? { ...l, ...updates } : l));
    setLegalChecklist(updated);
    addToast('Legal requirement updated', 'info');

    try {
      await fetch(`/api/clinics/${clinic.id}/legal/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
    } catch (e) {}
  };

  const updateRevenueAssumptions = async (assumptions: {
    patientsPerDay?: number;
    consultationFee?: number;
    workingDaysPerMonth?: number;
    otherServicesRevenuePerPatient?: number;
  }) => {
    const updated = calculateRevenueForecast(
      clinic.id,
      assumptions.patientsPerDay ?? revenue.patientsPerDay,
      assumptions.consultationFee ?? revenue.consultationFee,
      assumptions.workingDaysPerMonth ?? revenue.workingDaysPerMonth,
      assumptions.otherServicesRevenuePerPatient ?? revenue.otherServicesRevenuePerPatient,
      costs.totalMonthlyOperatingCost,
      costs.totalInitialInvestment,
      clinic.budget.currency
    );
    setRevenue(updated);
    addToast('Revenue forecast updated', 'success');

    try {
      await fetch(`/api/clinics/${clinic.id}/revenue`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(assumptions),
      });
    } catch (e) {}
  };

  const resetToDemoClinic = async () => {
    setIsLoading(true);
    try {
      await fetch('/api/demo/seed', { method: 'POST' });
      const demo = createDemoClinic();
      setClinic(demo);
      const demoEq = generateInitialEquipment(demo.id, demo.clinicType);
      const demoSt = generateInitialStaff(demo.id, demo.clinicType, demo.capacity.expectedPatientsPerDay);
      const demoLeg = generateInitialLegalChecklist(demo.id, `${demo.location.city}, ${demo.location.state}`);
      const demoLoc = generateLocationAnalysis(demo.id, demo.location.city, demo.location.area, demo.clinicType, demo.capacity.expectedPatientsPerDay);
      setEquipment(demoEq);
      setStaff(demoSt);
      setLegalChecklist(demoLeg);
      setLocationAnalysis(demoLoc);
      recalculateAll(demo, demoEq, demoSt);
      addToast('Loaded Jaipur General Clinic Demo model', 'info');
      setActiveView('dashboard');
    } catch (e) {
      addToast('Loaded demo model locally.', 'info');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ClinicContext.Provider
      value={{
        activeView,
        setActiveView,
        goBack,
        canGoBack,
        previousView,
        clinic,
        locationAnalysis,
        equipment,
        staff,
        costs,
        revenue,
        legalChecklist,
        aiRecommendations,
        toasts,
        addToast,
        removeToast,
        isLoading,
        isFloatingAIAssistantOpen,
        setIsFloatingAIAssistantOpen,
        toggleFloatingAIAssistant,
        updateClinic,
        createClinicFromWizard,
        addEquipmentItem,
        updateEquipmentItem,
        deleteEquipmentItem,
        toggleEquipmentPurchased,
        updateStaffRole,
        updateCosts,
        updateLegalItem,
        updateRevenueAssumptions,
        resetToDemoClinic,
      }}
    >
      {children}
    </ClinicContext.Provider>
  );
};

export const useClinic = () => {
  const context = useContext(ClinicContext);
  if (!context) {
    throw new Error('useClinic must be used within a ClinicProvider');
  }
  return context;
};
