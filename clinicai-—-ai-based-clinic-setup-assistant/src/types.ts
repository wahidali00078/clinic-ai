export type UserRole = 'user' | 'admin';

export interface User {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  profession?: string;
  city?: string;
  clinicType?: string;
  role: UserRole;
  createdAt: string;
}

export type ClinicType =
  | 'General Clinic'
  | 'Dental Clinic'
  | 'Pediatric Clinic'
  | 'Dermatology Clinic'
  | 'Eye Clinic'
  | 'Physiotherapy Clinic'
  | 'Diagnostic Center'
  | 'Other';

export interface ClinicLocation {
  country: string;
  state: string;
  city: string;
  area: string;
  preferredLocation: string;
  approxAreaSqFt: number;
  latitude?: number;
  longitude?: number;
}

export interface ClinicCapacity {
  consultationRooms: number;
  expectedPatientsPerDay: number;
  workingHoursPerDay: number;
  workingDaysPerWeek: number;
}

export interface ClinicBudget {
  currency: string;
  totalBudget: number;
  monthlyRentBudget: number;
  equipmentBudget: number;
  interiorBudget: number;
  staffBudget: number;
}

export interface SetupProgress {
  profile: boolean;
  location: boolean;
  equipment: boolean;
  staff: boolean;
  budget: boolean;
  legal: boolean;
  revenue: boolean;
  report: boolean;
}

export interface Clinic {
  id: string;
  userId: string;
  name: string;
  clinicType: ClinicType;
  location: ClinicLocation;
  capacity: ClinicCapacity;
  budget: ClinicBudget;
  services: string[];
  status: 'planning' | 'configured' | 'ready';
  setupProgress: SetupProgress;
  createdAt: string;
  updatedAt: string;
}

export interface LocationZone {
  id: string;
  name: string;
  overallScore: number;
  estimatedRentRange: string;
  competitionLevel: 'Low' | 'Moderate' | 'High';
  demandLevel: 'High' | 'Very High' | 'Moderate' | 'Low';
  pros: string[];
  cons: string[];
  recommendation: string;
  lat?: number;
  lng?: number;
  address?: string;
}

export interface AvailableClinicSpace {
  id: string;
  title: string;
  buildingName: string;
  address: string;
  city: string;
  area: string;
  lat: number;
  lng: number;
  distanceMeters: number;
  carpetAreaSqFt: number;
  monthlyRent: number;
  depositAmount: number;
  depositMonths: number;
  ratePerSqFt: number;
  floor: string;
  furnishing: 'Warm Shell' | 'Fully Furnished Clinic' | 'Semi-Furnished' | 'Bare Shell';
  medicalSuitability: string[];
  suitableFor: string[];
  contactPerson: string;
  contactPhone: string;
  badge?: string;
  parkingSpots: number;
  facing: string;
  waterSupply: string;
  powerBackup: string;
  status: 'Available' | 'Reserved' | 'In Discussion';
}

export interface LocationAnalysis {
  clinicId: string;
  overallScore: number;
  demandScore: number;
  competitionScore: number;
  accessibilityScore: number;
  affordabilityScore: number;
  zones: LocationZone[];
  lastUpdated: string;
  disclaimer: string;
}

export type EquipmentCategory =
  | 'Consultation'
  | 'Diagnostic'
  | 'Furniture'
  | 'IT'
  | 'Emergency'
  | 'Sterilization'
  | 'Other';

export type PriorityLevel = 'Essential' | 'Recommended' | 'Optional';
export type EquipmentPriority = PriorityLevel;

export interface EquipmentItem {
  id: string;
  clinicId: string;
  name: string;
  category: EquipmentCategory;
  priority: PriorityLevel;
  quantity: number;
  estimatedUnitCost: number;
  estimatedTotalCost: number;
  reasonRequired: string;
  isPurchased: boolean;
}

export interface StaffRoleItem {
  id: string;
  clinicId: string;
  roleTitle: string;
  recommendedCount: number;
  monthlySalaryEstimate: number;
  annualSalaryEstimate: number;
  responsibility: string;
  category: 'Clinical' | 'Administrative' | 'Support';
}

export interface InitialCostItems {
  securityDeposit: number;
  interiorSetup: number;
  furniture: number;
  medicalEquipment: number;
  itEquipment: number;
  registrationLegal: number;
  brandingSignage: number;
  initialInventory: number;
  miscellaneous: number;
}

export interface MonthlyOperatingItems {
  rent: number;
  salaries: number;
  electricity: number;
  internet: number;
  maintenance: number;
  consumables: number;
  marketing: number;
  software: number;
  miscellaneous: number;
}

export interface CostStructure {
  clinicId: string;
  currency: string;
  initialCapital: InitialCostItems;
  monthlyExpenses: MonthlyOperatingItems;
  totalInitialInvestment: number;
  totalMonthlyOperatingCost: number;
  totalAnnualOperatingCost: number;
}

export type LegalCategory =
  | 'Clinic registration'
  | 'Business registration'
  | 'Local permissions'
  | 'Healthcare-related registrations'
  | 'Waste management requirements'
  | 'Fire/safety requirements'
  | 'Tax-related requirements'
  | 'Other applicable requirements';

export type LegalStatus = 'Not Started' | 'In Progress' | 'Completed';
export type LegalItemStatus = LegalStatus;

export interface LegalChecklistItem {
  id: string;
  clinicId: string;
  category: LegalCategory;
  requirement: string;
  description: string;
  status: LegalStatus;
  priority: 'High' | 'Medium' | 'Low';
  notes: string;
  officialSourceUrl: string;
}

export interface RevenueForecast {
  clinicId: string;
  currency: string;
  patientsPerDay: number;
  consultationFee: number;
  workingDaysPerMonth: number;
  otherServicesRevenuePerPatient: number;
  averageRevenuePerPatient: number;
  dailyRevenue: number;
  monthlyRevenue: number;
  annualRevenue: number;
  monthlyOperatingExpenses: number;
  monthlyProfit: number;
  annualProfit: number;
  profitMarginPercent: number;
  estimatedBreakEvenMonths: number;
  cumulativeCashflow: Array<{
    month: number;
    monthName: string;
    revenue: number;
    expenses: number;
    netProfit: number;
    cumulativeCash: number;
  }>;
}

export interface AIMessage {
  id: string;
  sender: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  suggestedAction?: string;
}

export interface AIRecommendation {
  id: string;
  category: 'Budget' | 'Equipment' | 'Location' | 'Staff' | 'Legal' | 'Strategy';
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'info';
  impact: string;
}

export interface ClinicReport {
  id: string;
  clinicId: string;
  title: string;
  generatedAt: string;
  executiveSummary: string;
  keyMetrics: {
    totalInvestment: number;
    monthlyRevenue: number;
    monthlyOperatingCost: number;
    projectedMonthlyProfit: number;
    breakEvenPeriodMonths: number;
    locationScore: number;
  };
  recommendations: string[];
  disclaimer: string;
}

export interface AdminAnalytics {
  totalUsers: number;
  totalClinics: number;
  totalEquipmentCatalogItems: number;
  totalLegalTemplates: number;
  aiQueriesProcessed: number;
  averageBreakEvenMonths: number;
  recentActivity: Array<{
    id: string;
    action: string;
    user: string;
    clinic: string;
    time: string;
  }>;
}
