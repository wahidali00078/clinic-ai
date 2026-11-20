import React, { useState } from 'react';
import { useClinic, ActiveView } from '../../context/ClinicContext';
import { useAuth } from '../../context/AuthContext';
import {
  Stethoscope,
  Sparkles,
  ChevronRight,
  Menu,
  X,
  ShieldCheck,
  User as UserIcon,
  ArrowLeft,
} from 'lucide-react';

interface NavbarProps {
  onOpenAuth?: (mode: 'login' | 'register') => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenAuth }) => {
  const { activeView, setActiveView, goBack, canGoBack } = useClinic();
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: { label: string; view: ActiveView }[] = [
    { label: 'Features', view: 'features' },
    { label: 'How It Works', view: 'how-it-works' },
    { label: 'Benefits', view: 'benefits' },
    { label: 'Pricing', view: 'pricing' },
    { label: 'FAQ', view: 'faq' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Left Side: Back Button (if applicable) + Brand Logo */}
        <div className="flex items-center gap-3">
          {canGoBack && activeView !== 'landing' && (
            <button
              onClick={goBack}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-slate-700 hover:text-sky-700 bg-slate-100 hover:bg-sky-50 border border-slate-200 transition-colors shadow-xs"
              title="Go back to previous page"
              id="navbar-back-button"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
          )}

          <div
            onClick={() => setActiveView('landing')}
            className="flex items-center gap-2.5 cursor-pointer group"
            id="nav-logo"
          >
            <div className="w-8 h-8 rounded-lg bg-sky-600 flex items-center justify-center text-white font-bold text-base shadow-sm group-hover:bg-sky-700 transition-colors">
              C
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-slate-800 flex items-center gap-1.5">
                Clinic<span className="text-sky-600">AI</span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-sky-50 text-sky-700 border border-sky-200">
                  Assistant
                </span>
              </span>
            </div>
          </div>
        </div>

        {/* Desktop Header Navigation Buttons - Each opens a dedicated new page */}
        <nav className="hidden md:flex items-center gap-1.5">
          {navItems.map(item => {
            const isActive = activeView === item.view;
            return (
              <button
                key={item.view}
                onClick={() => setActiveView(item.view)}
                className={`px-3.5 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                  isActive
                    ? 'bg-sky-50 text-sky-700 font-bold border border-sky-200 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
                id={`nav-btn-${item.view}`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Action Controls */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-2.5">
              <button
                onClick={() => setActiveView('dashboard')}
                className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg transition-all shadow-sm ${
                  activeView === 'dashboard'
                    ? 'bg-slate-900 text-white'
                    : 'bg-sky-600 hover:bg-sky-700 text-white'
                }`}
                id="nav-go-dashboard"
              >
                Go to Dashboard
                <ChevronRight className="w-4 h-4 text-sky-200" />
              </button>
              <button
                onClick={logout}
                className="px-3 py-2 text-sm text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
              >
                Log Out
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => onOpenAuth?.('login')}
                className="px-3.5 py-2 text-sm font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                id="nav-login-btn"
              >
                Log In
              </button>
              <button
                onClick={() => setActiveView('onboarding')}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-sky-600 hover:bg-sky-700 rounded-lg transition-all shadow-sm"
                id="nav-getstarted-btn"
              >
                <Sparkles className="w-4 h-4 text-sky-200" />
                Get Started Free
              </button>
            </div>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden flex items-center gap-2">
          {canGoBack && activeView !== 'landing' && (
            <button
              onClick={goBack}
              className="p-1.5 text-xs font-bold text-slate-700 bg-slate-100 rounded-lg flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
          )}
          {user && (
            <button
              onClick={() => setActiveView('dashboard')}
              className="p-2 text-xs font-semibold bg-sky-600 text-white rounded-lg"
            >
              Dashboard
            </button>
          )}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100"
            aria-label="Toggle navigation"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-4 pt-3 pb-5 space-y-2">
          {canGoBack && activeView !== 'landing' && (
            <button
              onClick={() => {
                goBack();
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center gap-2 py-2 px-3 bg-slate-100 text-slate-800 rounded-lg text-xs font-bold mb-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>← Back to Previous Page</span>
            </button>
          )}

          {navItems.map(item => (
            <button
              key={item.view}
              onClick={() => {
                setActiveView(item.view);
                setMobileMenuOpen(false);
              }}
              className={`w-full text-left py-2.5 px-3 rounded-lg text-sm font-medium transition-colors ${
                activeView === item.view
                  ? 'bg-sky-50 text-sky-700 font-bold'
                  : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              {item.label}
            </button>
          ))}

          <div className="pt-3 border-t border-slate-200 flex flex-col gap-2">
            {user ? (
              <>
                <button
                  onClick={() => {
                    setActiveView('dashboard');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-center py-2.5 bg-slate-900 text-white rounded-xl text-sm font-medium"
                >
                  Go to Dashboard
                </button>
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-center py-2 text-slate-600 text-sm"
                >
                  Log Out
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => {
                    onOpenAuth?.('login');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-center py-2 text-slate-700 font-medium text-sm border border-slate-200 rounded-xl"
                >
                  Log In
                </button>
                <button
                  onClick={() => {
                    setActiveView('onboarding');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-center py-2.5 bg-sky-600 text-white rounded-xl text-sm font-semibold"
                >
                  Get Started Free
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
