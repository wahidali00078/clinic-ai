import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ClinicProvider, useClinic } from './context/ClinicContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { LandingPage } from './components/landing/LandingPage';
import { OnboardingWizard } from './components/onboarding/OnboardingWizard';
import { FeaturesPage } from './components/pages/FeaturesPage';
import { HowItWorksPage } from './components/pages/HowItWorksPage';
import { BenefitsPage } from './components/pages/BenefitsPage';
import { PricingPage } from './components/pages/PricingPage';
import { FAQPage } from './components/pages/FAQPage';
import { AuthModal } from './components/auth/AuthModal';
import { ToastContainer } from './components/common/ToastContainer';

// Dashboard Views
import { DashboardLayout } from './components/dashboard/DashboardLayout';
import { OverviewView } from './components/dashboard/OverviewView';
import { LocationAnalysisView } from './components/dashboard/LocationAnalysisView';
import { EquipmentPlannerView } from './components/dashboard/EquipmentPlannerView';
import { StaffPlannerView } from './components/dashboard/StaffPlannerView';
import { CostEstimatorView } from './components/dashboard/CostEstimatorView';
import { LegalChecklistView } from './components/dashboard/LegalChecklistView';
import { RevenueForecastView } from './components/dashboard/RevenueForecastView';
import { AIAssistantView } from './components/dashboard/AIAssistantView';
import { ReportGeneratorView } from './components/dashboard/ReportGeneratorView';
import { ClinicProfileView } from './components/dashboard/ClinicProfileView';
import { AdminPanelView } from './components/dashboard/AdminPanelView';
import { FloatingAIAssistant } from './components/dashboard/FloatingAIAssistant';

const MainApp: React.FC = () => {
  const { activeView, toasts, removeToast } = useClinic();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authInitialMode, setAuthInitialMode] = useState<'login' | 'register'>('login');

  const handleOpenAuth = (mode: 'login' | 'register') => {
    setAuthInitialMode(mode);
    setAuthModalOpen(true);
  };

  // Render view based on state
  const renderContent = () => {
    if (activeView === 'landing') {
      return (
        <div className="min-h-screen flex flex-col bg-slate-50">
          <Navbar onOpenAuth={handleOpenAuth} />
          <main className="flex-1">
            <LandingPage onOpenAuth={handleOpenAuth} />
          </main>
          <Footer />
        </div>
      );
    }

    if (activeView === 'features') {
      return (
        <div className="min-h-screen flex flex-col bg-slate-50">
          <Navbar onOpenAuth={handleOpenAuth} />
          <main className="flex-1">
            <FeaturesPage />
          </main>
          <Footer />
        </div>
      );
    }

    if (activeView === 'how-it-works') {
      return (
        <div className="min-h-screen flex flex-col bg-slate-50">
          <Navbar onOpenAuth={handleOpenAuth} />
          <main className="flex-1">
            <HowItWorksPage />
          </main>
          <Footer />
        </div>
      );
    }

    if (activeView === 'benefits') {
      return (
        <div className="min-h-screen flex flex-col bg-slate-50">
          <Navbar onOpenAuth={handleOpenAuth} />
          <main className="flex-1">
            <BenefitsPage />
          </main>
          <Footer />
        </div>
      );
    }

    if (activeView === 'pricing') {
      return (
        <div className="min-h-screen flex flex-col bg-slate-50">
          <Navbar onOpenAuth={handleOpenAuth} />
          <main className="flex-1">
            <PricingPage />
          </main>
          <Footer />
        </div>
      );
    }

    if (activeView === 'faq') {
      return (
        <div className="min-h-screen flex flex-col bg-slate-50">
          <Navbar onOpenAuth={handleOpenAuth} />
          <main className="flex-1">
            <FAQPage />
          </main>
          <Footer />
        </div>
      );
    }

    if (activeView === 'onboarding') {
      return (
        <div className="min-h-screen flex flex-col bg-slate-50">
          <Navbar onOpenAuth={handleOpenAuth} />
          <main className="flex-1 py-8 px-4">
            <OnboardingWizard />
          </main>
          <Footer />
        </div>
      );
    }

    // Otherwise, render inside DashboardLayout
    return (
      <DashboardLayout>
        {activeView === 'dashboard' && <OverviewView />}
        {activeView === 'profile' && <ClinicProfileView />}
        {activeView === 'location' && <LocationAnalysisView />}
        {activeView === 'equipment' && <EquipmentPlannerView />}
        {activeView === 'staff' && <StaffPlannerView />}
        {activeView === 'costs' && <CostEstimatorView />}
        {activeView === 'legal' && <LegalChecklistView />}
        {activeView === 'revenue' && <RevenueForecastView />}
        {activeView === 'ai-assistant' && <AIAssistantView />}
        {activeView === 'reports' && <ReportGeneratorView />}
        {activeView === 'admin' && <AdminPanelView />}
      </DashboardLayout>
    );
  };

  return (
    <>
      {renderContent()}
      <FloatingAIAssistant />
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialMode={authInitialMode}
      />
      <ToastContainer toasts={toasts} onDismiss={removeToast} />
    </>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <ClinicProvider>
        <MainApp />
      </ClinicProvider>
    </AuthProvider>
  );
}
