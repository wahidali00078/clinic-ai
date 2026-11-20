import React, { useState, useEffect } from 'react';
import { useClinic, ActiveView } from '../../context/ClinicContext';
import { useAuth } from '../../context/AuthContext';
import {
  Stethoscope,
  LayoutDashboard,
  MapPin,
  Package,
  Users,
  Calculator,
  Scale,
  TrendingUp,
  FileText,
  ShieldCheck,
  Building,
  RotateCcw,
  Menu,
  X,
  ChevronRight,
  LogOut,
  Sparkles,
  ChevronDown,
  ArrowLeft,
  Home,
  CheckCircle2,
  Sliders,
  HelpCircle,
  Compass,
} from 'lucide-react';
import { AssumptionsModal } from '../common/AssumptionsModal';
import { ProductTour } from '../common/ProductTour';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const {
    activeView,
    setActiveView,
    goBack,
    canGoBack,
    clinic,
    resetToDemoClinic,
    isLoading,
    isFloatingAIAssistantOpen,
    setIsFloatingAIAssistantOpen,
  } = useClinic();
  const { user, logout, loginAsDemoAdmin, loginAsDemoDoctor } = useAuth();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [assumptionsModalOpen, setAssumptionsModalOpen] = useState(false);
  const [tourOpen, setTourOpen] = useState(false);

  // Check if product tour has been shown before
  useEffect(() => {
    try {
      const dismissed = localStorage.getItem(`clinicai_tour_dismissed_${user?.id || 'guest'}`);
      if (!dismissed) {
        // Automatically show tour on first load
        setTourOpen(true);
      }
    } catch (e) {}
  }, [user?.id]);

  // The 8 sequential setup steps strictly matching requirement A
  const setupStages: {
    id: ActiveView;
    stepNum: number;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    isDone: boolean;
  }[] = [
    { id: 'profile', stepNum: 1, label: 'Clinic Profile', icon: Building, isDone: !!clinic.setupProgress.profile },
    { id: 'location', stepNum: 2, label: 'Location & Market', icon: MapPin, isDone: !!clinic.setupProgress.location },
    { id: 'equipment', stepNum: 3, label: 'Medical Equipment', icon: Package, isDone: !!clinic.setupProgress.equipment },
    { id: 'staff', stepNum: 4, label: 'Staffing & Roles', icon: Users, isDone: !!clinic.setupProgress.staff },
    { id: 'costs', stepNum: 5, label: 'Startup Budget', icon: Calculator, isDone: !!clinic.setupProgress.budget },
    { id: 'legal', stepNum: 6, label: 'Permits & Legal', icon: Scale, isDone: !!clinic.setupProgress.legal },
    { id: 'revenue', stepNum: 7, label: 'Revenue Forecast', icon: TrendingUp, isDone: !!clinic.setupProgress.revenue },
    { id: 'reports', stepNum: 8, label: 'Feasibility Report', icon: FileText, isDone: !!clinic.setupProgress.report },
  ];

  const totalSteps = setupStages.length;
  const completedSteps = setupStages.filter(s => s.isDone).length;
  const progressPercent = Math.round((completedSteps / totalSteps) * 100);

  // Find next incomplete step
  const nextIncomplete = setupStages.find(s => !s.isDone) || setupStages[setupStages.length - 1];

  const getViewTitle = () => {
    switch (activeView) {
      case 'dashboard': return 'Practice Overview';
      case 'profile': return 'Step 1: Clinic Concept & Details';
      case 'location': return 'Step 2: Location Demographics & Catchment';
      case 'equipment': return 'Step 3: Essential Medical Equipment';
      case 'staff': return 'Step 4: Clinical & Support Staff Roster';
      case 'costs': return 'Step 5: Capital Investment & Running Costs';
      case 'legal': return 'Step 6: Permits, Licenses & Healthcare Regulations';
      case 'revenue': return 'Step 7: Patient Revenue & Break-Even Projections';
      case 'reports': return 'Step 8: Executive Feasibility Report';
      case 'ai-assistant': return 'AI Healthcare Copilot';
      case 'admin': return 'System Administration';
      default: return 'Clinic Setup';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row text-slate-900 pb-16 md:pb-0">
      {/* Desktop Sidebar: Clean White Surface + Teal Primary Branding */}
      <aside className="hidden md:flex flex-col w-64 bg-white text-slate-700 border-r border-slate-200 shrink-0 select-none">
        {/* Brand & Healthcare Tagline */}
        <div className="p-4 flex items-center justify-between border-b border-slate-100">
          <button
            onClick={() => setActiveView('landing')}
            className="flex items-center gap-2.5 text-left group"
          >
            <div className="w-8 h-8 bg-teal-700 rounded-lg flex items-center justify-center text-white font-bold text-sm shadow-xs group-hover:bg-teal-800 transition-colors">
              <Stethoscope className="w-4 h-4" />
            </div>
            <div>
              <span className="text-base font-bold tracking-tight text-slate-900">
                Clinic<span className="text-teal-700">AI</span>
              </span>
              <p className="text-[10px] text-slate-400 font-medium">Healthcare Setup Assistant</p>
            </div>
          </button>

          {/* Product Tour Trigger */}
          <button
            onClick={() => setTourOpen(true)}
            className="p-1.5 text-slate-400 hover:text-teal-700 rounded-lg hover:bg-teal-50 transition-colors"
            title="Take Product Tour"
            aria-label="Take Product Tour"
          >
            <HelpCircle className="w-4 h-4" />
          </button>
        </div>

        {/* Active Practice Card with Quick Progress */}
        <div className="p-3 mx-3 mt-3 rounded-xl bg-slate-50 border border-slate-200">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="font-semibold uppercase tracking-wider text-[10px]">Active Clinic</span>
            <span className="px-1.5 py-0.5 rounded bg-teal-100 text-teal-800 text-[10px] font-bold">
              {clinic.clinicType.split(' ')[0]}
            </span>
          </div>
          <div className="font-bold text-slate-900 text-xs truncate">{clinic.name}</div>
          <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
            <MapPin className="w-3 h-3 text-teal-700 shrink-0" />
            <span className="truncate">{clinic.location.area}, {clinic.location.city}</span>
          </div>

          {/* Setup Progress Bar */}
          <div className="mt-2.5 pt-2 border-t border-slate-200/70 flex items-center justify-between text-[11px]">
            <span className="text-slate-500 font-medium">Roadmap Progress</span>
            <span className="font-bold text-teal-800">{progressPercent}%</span>
          </div>
          <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden mt-1">
            <div
              className="bg-teal-700 h-full rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Navigation Modules */}
        <nav className="flex-1 px-3 py-3 space-y-4 overflow-y-auto">
          {/* Main Dashboard */}
          <div>
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-3 mb-1">
              Overview
            </div>
            <button
              onClick={() => setActiveView('dashboard')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                activeView === 'dashboard'
                  ? 'bg-teal-50 text-teal-800 font-semibold border border-teal-200/60'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <LayoutDashboard className={`w-4 h-4 ${activeView === 'dashboard' ? 'text-teal-700' : 'text-slate-400'}`} />
                <span>Dashboard Home</span>
              </div>
            </button>
          </div>

          {/* 8-Stage Setup Roadmap */}
          <div>
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-3 mb-1 flex items-center justify-between">
              <span>8 Setup Stages</span>
              <span className="text-[10px] text-slate-400 font-normal">{completedSteps}/{totalSteps} Done</span>
            </div>
            <div className="space-y-0.5">
              {setupStages.map(step => {
                const Icon = step.icon;
                const isActive = activeView === step.id;
                return (
                  <button
                    key={step.id}
                    onClick={() => setActiveView(step.id)}
                    className={`w-full flex items-center justify-between px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                      isActive
                        ? 'bg-teal-50 text-teal-800 font-semibold border border-teal-200/60'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-teal-700' : 'text-slate-400'}`} />
                      <span className="truncate">{step.stepNum}. {step.label}</span>
                    </div>
                    {step.isDone ? (
                      <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 text-[10px] flex items-center justify-center shrink-0 font-bold" title="Completed">
                        ✓
                      </span>
                    ) : (
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-200 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Central Tools */}
          <div>
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-3 mb-1">
              Tools & Reports
            </div>
            {/* Global Assumptions */}
            <button
              onClick={() => setAssumptionsModalOpen(true)}
              className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-all"
            >
              <div className="flex items-center gap-2.5">
                <Sliders className="w-4 h-4 text-teal-700" />
                <span>Assumptions Panel</span>
              </div>
              <span className="text-[10px] text-teal-700 font-bold bg-teal-50 px-1.5 py-0.5 rounded">
                Edit
              </span>
            </button>

            {/* Feasibility Report */}
            <button
              onClick={() => setActiveView('reports')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                activeView === 'reports'
                  ? 'bg-teal-50 text-teal-800 font-semibold border border-teal-200/60'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <FileText className={`w-4 h-4 ${activeView === 'reports' ? 'text-teal-700' : 'text-slate-400'}`} />
                <span>Feasibility Report</span>
              </div>
              <span className="text-[10px] text-teal-700 font-bold bg-teal-50 px-1.5 py-0.5 rounded">
                PDF
              </span>
            </button>

            {/* AI Assistant */}
            <button
              onClick={() => setIsFloatingAIAssistantOpen(true)}
              className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-all"
            >
              <div className="flex items-center gap-2.5">
                <Sparkles className="w-4 h-4 text-teal-700" />
                <span>Ask AI Advisor</span>
              </div>
              <span className="text-[10px] text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                Ask
              </span>
            </button>
          </div>
        </nav>

        {/* User Card in Sidebar Bottom */}
        <div className="p-3 border-t border-slate-100">
          <div className="flex items-center gap-2.5 p-2 bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors relative">
            <div className="w-8 h-8 rounded-lg bg-teal-100 flex items-center justify-center text-teal-800 font-bold text-xs">
              {user?.fullName ? user.fullName.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase() : 'DA'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-slate-900 truncate">
                {user?.fullName || 'Dr. Aris Patel'}
              </p>
              <p className="text-[10px] text-slate-500 capitalize">
                {user?.role === 'admin' ? 'Super Admin' : 'Clinic Director'}
              </p>
            </div>
            <button
              onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
              className="p-1 rounded-lg hover:bg-slate-200 text-slate-500"
              title="Options"
            >
              <ChevronDown className="w-3.5 h-3.5" />
            </button>

            {/* Profile Dropdown */}
            {profileDropdownOpen && (
              <div className="absolute bottom-full left-0 mb-2 w-56 bg-white rounded-xl shadow-lg border border-slate-200 py-1.5 z-50 animate-in fade-in">
                <div className="px-3 py-1.5 border-b border-slate-100">
                  <p className="text-xs font-semibold text-slate-900">{user?.fullName}</p>
                  <p className="text-[11px] text-slate-400 truncate">{user?.email}</p>
                </div>
                <div className="p-1">
                  <button
                    onClick={() => {
                      loginAsDemoDoctor();
                      setProfileDropdownOpen(false);
                    }}
                    className="w-full text-left px-2 py-1.5 text-xs text-slate-700 hover:bg-slate-50 rounded-lg flex items-center justify-between"
                  >
                    <span>Doctor View</span>
                    <Stethoscope className="w-3.5 h-3.5 text-teal-700" />
                  </button>
                  <button
                    onClick={() => {
                      setTourOpen(true);
                      setProfileDropdownOpen(false);
                    }}
                    className="w-full text-left px-2 py-1.5 text-xs text-slate-700 hover:bg-slate-50 rounded-lg flex items-center justify-between"
                  >
                    <span>Replay Product Tour</span>
                    <HelpCircle className="w-3.5 h-3.5 text-teal-700" />
                  </button>
                  <button
                    onClick={() => {
                      resetToDemoClinic();
                      setProfileDropdownOpen(false);
                    }}
                    className="w-full text-left px-2 py-1.5 text-xs text-slate-700 hover:bg-slate-50 rounded-lg flex items-center justify-between"
                  >
                    <span>Reset Demo Data</span>
                    <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
                  </button>
                  <button
                    onClick={() => {
                      logout();
                      setActiveView('landing');
                      setProfileDropdownOpen(false);
                    }}
                    className="w-full text-left px-2 py-1.5 text-xs text-rose-600 hover:bg-rose-50 rounded-lg flex items-center gap-2 mt-1 border-t border-slate-100 pt-1.5"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Sticky Header Bar */}
        <header className="h-16 bg-white border-b border-slate-200 px-3 sm:px-6 flex items-center justify-between z-30 sticky top-0 gap-2 sm:gap-4 shadow-2xs">
          {/* Left: Back Button + Title */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <button
              onClick={goBack}
              className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-bold text-slate-700 hover:text-teal-800 bg-slate-100 hover:bg-teal-50 border border-slate-200 transition-colors shadow-xs"
              title={activeView === 'dashboard' ? 'Back to Public Home' : 'Back to previous view'}
              id="dashboard-header-back-btn"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Back</span>
            </button>

            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100"
              aria-label="Open sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="min-w-0">
              <h1 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2 truncate">
                <span>{getViewTitle()}</span>
              </h1>
              <div className="flex items-center gap-2 text-[10px] sm:text-[11px] text-slate-500">
                <span className="truncate">{clinic.name} • {clinic.location.city}</span>
                <span className="hidden md:inline-flex items-center gap-1 text-emerald-700 font-medium bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-100">
                  <CheckCircle2 className="w-2.5 h-2.5" />
                  <span>Autosaved</span>
                </span>
              </div>
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Assumptions Panel Button */}
            <button
              onClick={() => setAssumptionsModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-colors shrink-0"
              title="Edit Central Cost & Revenue Assumptions"
            >
              <Sliders className="w-3.5 h-3.5 text-teal-700" />
              <span className="hidden md:inline">Assumptions</span>
            </button>

            {/* AI Advisor Button */}
            <button
              onClick={() => setIsFloatingAIAssistantOpen(true)}
              className="inline-flex items-center gap-1.5 bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors shrink-0"
              title="Open AI Copilot"
              id="dashboard-header-ai-btn"
            >
              <Sparkles className="w-3.5 h-3.5 text-teal-700" />
              <span>Ask AI</span>
            </button>

            {/* Feasibility Report Button (Single Primary Button on Header) */}
            <button
              onClick={() => setActiveView('reports')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-white transition-colors shadow-xs shrink-0 ${
                activeView === 'reports'
                  ? 'bg-teal-800'
                  : 'bg-teal-700 hover:bg-teal-800'
              }`}
              id="dashboard-header-report-btn"
            >
              <FileText className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Report</span>
            </button>

            {/* Return to Public Website */}
            <button
              onClick={() => setActiveView('landing')}
              className="hidden lg:inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 transition-colors shrink-0"
              title="Return to Public Website"
            >
              <Home className="w-3.5 h-3.5" />
              <span>Website</span>
            </button>
          </div>
        </header>

        {/* Mobile Navigation Drawer */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 md:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <div
              className="w-72 bg-white h-full p-4 flex flex-col justify-between overflow-y-auto"
              onClick={e => e.stopPropagation()}
            >
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-teal-700 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                      <Stethoscope className="w-4 h-4" />
                    </div>
                    <span className="font-bold text-slate-900">ClinicAI</span>
                  </div>
                  <button
                    onClick={() => setSidebarOpen(false)}
                    className="p-1.5 text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="py-2">
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2 py-1">
                    Setup Roadmap
                  </p>
                  <button
                    onClick={() => {
                      setActiveView('dashboard');
                      setSidebarOpen(false);
                    }}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium rounded-xl text-left ${
                      activeView === 'dashboard' ? 'bg-teal-50 text-teal-800 font-bold' : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <LayoutDashboard className="w-4 h-4 text-teal-700" />
                    <span>Practice Overview</span>
                  </button>
                  {setupStages.map(step => (
                    <button
                      key={step.id}
                      onClick={() => {
                        setActiveView(step.id);
                        setSidebarOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 text-xs font-medium rounded-xl text-left ${
                        activeView === step.id ? 'bg-teal-50 text-teal-800 font-bold' : 'text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <step.icon className="w-4 h-4 text-slate-400" />
                        <span>{step.stepNum}. {step.label}</span>
                      </div>
                      {step.isDone && <span className="text-emerald-600 text-xs font-bold">✓</span>}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex flex-col gap-2">
                <button
                  onClick={() => {
                    setAssumptionsModalOpen(true);
                    setSidebarOpen(false);
                  }}
                  className="w-full py-2 bg-slate-100 text-slate-800 text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5"
                >
                  <Sliders className="w-3.5 h-3.5 text-teal-700" />
                  <span>Assumptions Panel</span>
                </button>
                <button
                  onClick={() => {
                    setTourOpen(true);
                    setSidebarOpen(false);
                  }}
                  className="w-full py-2 bg-slate-100 text-slate-800 text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5"
                >
                  <HelpCircle className="w-3.5 h-3.5 text-teal-700" />
                  <span>Product Tour</span>
                </button>
                <button
                  onClick={() => {
                    resetToDemoClinic();
                    setSidebarOpen(false);
                  }}
                  className="w-full py-1.5 text-xs text-slate-500 hover:text-slate-800"
                >
                  Reset Demo Data
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Dashboard Main Viewport */}
        <main className="flex-1 p-3.5 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>

      {/* Sticky Mobile Bottom Navigation Bar (< 768px) - Strictly satisfying Section E */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200 px-2 py-1.5 shadow-lg flex items-center justify-around">
        {/* Item 1: Overview */}
        <button
          onClick={() => setActiveView('dashboard')}
          className={`flex flex-col items-center justify-center min-h-[44px] min-w-[44px] px-2 py-1 rounded-xl transition-colors ${
            activeView === 'dashboard' ? 'text-teal-700 font-bold' : 'text-slate-500 hover:text-slate-900'
          }`}
          aria-label="Overview"
        >
          <LayoutDashboard className="w-4 h-4 mb-0.5" />
          <span className="text-[10px] leading-tight">Overview</span>
        </button>

        {/* Item 2: Next Step / Roadmap */}
        <button
          onClick={() => setActiveView(nextIncomplete.id)}
          className={`flex flex-col items-center justify-center min-h-[44px] min-w-[44px] px-2 py-1 rounded-xl transition-colors ${
            activeView === nextIncomplete.id ? 'text-teal-700 font-bold' : 'text-slate-500 hover:text-slate-900'
          }`}
          aria-label="Current Setup Step"
        >
          <Compass className="w-4 h-4 mb-0.5" />
          <span className="text-[10px] leading-tight">Step {nextIncomplete.stepNum}</span>
        </button>

        {/* Item 3: Ask AI */}
        <button
          onClick={() => setIsFloatingAIAssistantOpen(true)}
          className="flex flex-col items-center justify-center min-h-[44px] min-w-[44px] px-2 py-1 rounded-xl text-teal-800 font-bold transition-colors"
          aria-label="Ask AI Assistant"
        >
          <Sparkles className="w-4 h-4 mb-0.5 text-teal-700" />
          <span className="text-[10px] leading-tight">Ask AI</span>
        </button>

        {/* Item 4: Report */}
        <button
          onClick={() => setActiveView('reports')}
          className={`flex flex-col items-center justify-center min-h-[44px] min-w-[44px] px-2 py-1 rounded-xl transition-colors ${
            activeView === 'reports' ? 'text-teal-700 font-bold' : 'text-slate-500 hover:text-slate-900'
          }`}
          aria-label="Feasibility Report"
        >
          <FileText className="w-4 h-4 mb-0.5" />
          <span className="text-[10px] leading-tight">Report</span>
        </button>

        {/* Item 5: More / Drawer */}
        <button
          onClick={() => setSidebarOpen(true)}
          className="flex flex-col items-center justify-center min-h-[44px] min-w-[44px] px-2 py-1 rounded-xl text-slate-500 hover:text-slate-900 transition-colors"
          aria-label="More Navigation Options"
        >
          <Menu className="w-4 h-4 mb-0.5" />
          <span className="text-[10px] leading-tight">More</span>
        </button>
      </div>

      {/* Central Global Modals */}
      <AssumptionsModal
        isOpen={assumptionsModalOpen}
        onClose={() => setAssumptionsModalOpen(false)}
      />
      <ProductTour
        userId={user?.id || 'guest'}
        isOpen={tourOpen}
        onClose={() => setTourOpen(false)}
      />
    </div>
  );
};
