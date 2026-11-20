import React, { useState } from 'react';
import { useClinic } from '../../context/ClinicContext';
import { useAuth } from '../../context/AuthContext';
import {
  ShieldCheck,
  Server,
  Database,
  Cpu,
  Users,
  Building,
  Coins,
  Settings,
  Activity,
  CheckCircle2,
  RefreshCw,
  Search,
} from 'lucide-react';

export const AdminPanelView: React.FC = () => {
  const { clinic, addToast } = useClinic();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'benchmarks' | 'system'>('overview');

  const [benchmarks, setBenchmarks] = useState([
    { city: 'Jaipur', tier: 'Tier 2', avgRentSqFt: 45, doctorConsultAvg: 500, status: 'Active' },
    { city: 'Mumbai', tier: 'Tier 1', avgRentSqFt: 130, doctorConsultAvg: 1000, status: 'Active' },
    { city: 'Delhi NCR', tier: 'Tier 1', avgRentSqFt: 110, doctorConsultAvg: 900, status: 'Active' },
    { city: 'Bengaluru', tier: 'Tier 1', avgRentSqFt: 95, doctorConsultAvg: 800, status: 'Active' },
    { city: 'Indore', tier: 'Tier 2', avgRentSqFt: 40, doctorConsultAvg: 450, status: 'Active' },
    { city: 'Ahmedabad', tier: 'Tier 2', avgRentSqFt: 50, doctorConsultAvg: 550, status: 'Active' },
  ]);

  const recentClinics = [
    { id: 'cl-1', name: 'Apex Dental Care & Implant Center', type: 'Dental Clinic', city: 'Mumbai', capital: '₹18,50,000', date: 'Just now' },
    { id: 'cl-2', name: clinic.name, type: clinic.clinicType, city: clinic.location.city, capital: `₹${costsFormat(clinic.budget.totalBudget)}`, date: 'Active Session' },
    { id: 'cl-3', name: 'CareFirst Pediatric Wellness', type: 'Pediatric Clinic', city: 'Bengaluru', capital: '₹14,20,000', date: '2 hours ago' },
    { id: 'cl-4', name: 'Metro Skin & Aesthetic Dermatology', type: 'Dermatology', city: 'Delhi', capital: '₹22,00,000', date: 'Yesterday' },
    { id: 'cl-5', name: 'ProActive Spine & Physiotherapy', type: 'Physiotherapy', city: 'Jaipur', capital: '₹9,80,000', date: '2 days ago' },
  ];

  function costsFormat(val: number) {
    return val.toLocaleString();
  }

  const handleUpdateBenchmark = (idx: number, newRent: number) => {
    const updated = [...benchmarks];
    updated[idx].avgRentSqFt = newRent;
    setBenchmarks(updated);
    addToast(`Updated commercial rent index for ${updated[idx].city}`, 'success');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-2xl bg-white border border-slate-200 p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-200">
              Super Admin Console
            </span>
            <span className="text-xs text-slate-500 font-medium">Logged in as {user?.fullName}</span>
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900">
            ClinicAI Platform Operations
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage regional cost indices, equipment benchmark defaults, and clinical planning sessions.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
              activeTab === 'overview' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('benchmarks')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
              activeTab === 'benchmarks' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            City Benchmarks
          </button>
          <button
            onClick={() => setActiveTab('system')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
              activeTab === 'system' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            System Status
          </button>
        </div>
      </div>

      {/* 4 Platform Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Total Practice Plans</span>
          <div className="text-2xl font-extrabold text-slate-900 mt-1">1,482 Clinics</div>
          <span className="text-xs text-emerald-600 font-semibold mt-1 block">
            +38 new setups this week
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Cities Covered</span>
          <div className="text-2xl font-extrabold text-purple-700 mt-1">42 Cities</div>
          <span className="text-xs text-slate-500 mt-1 block">
            Tier 1 & Tier 2 healthcare hubs
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Modeled Capital</span>
          <div className="text-2xl font-extrabold text-slate-900 mt-1">₹184.6 Cr</div>
          <span className="text-xs text-slate-500 mt-1 block">
            Estimated capital investments
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">AI Inference Health</span>
          <div className="text-2xl font-extrabold text-emerald-600 mt-1">99.9% Uptime</div>
          <span className="text-xs text-emerald-600 font-medium mt-1 block">
            Gemini Flash 2.5 Active
          </span>
        </div>
      </div>

      {/* Tab: Overview */}
      {activeTab === 'overview' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">Recent Clinic Feasibility Plans</h3>
              <p className="text-xs text-slate-500">Live feed of doctors designing practices across India</p>
            </div>
          </div>

          <div className="divide-y divide-slate-100 text-xs">
            {recentClinics.map(item => (
              <div key={item.id} className="p-4 flex items-center justify-between hover:bg-slate-50">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center font-bold">
                    <Building className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900">{item.name}</div>
                    <div className="text-slate-500 text-[11px]">{item.type} • {item.city}</div>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <div className="font-bold font-mono text-slate-800">{item.capital}</div>
                    <span className="text-[10px] text-slate-400">{item.date}</span>
                  </div>
                  <span className="px-2 py-0.5 text-[10px] font-bold uppercase rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Validated
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Benchmarks */}
      {activeTab === 'benchmarks' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">City Healthcare Cost Benchmarks</h3>
              <p className="text-xs text-slate-500">Regional multipliers applied across Cost Estimator and Revenue Models</p>
            </div>
          </div>

          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-[10px] border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">City</th>
                <th className="py-3 px-4">Market Tier</th>
                <th className="py-3 px-4">Avg Commercial Rent / sq ft</th>
                <th className="py-3 px-4">Avg GP Consultation</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {benchmarks.map((b, idx) => (
                <tr key={b.city} className="hover:bg-slate-50">
                  <td className="py-3 px-4 font-bold text-slate-900">{b.city}</td>
                  <td className="py-3 px-4 text-slate-600">{b.tier}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-slate-800">₹{b.avgRentSqFt}/mo</span>
                      <button
                        onClick={() => handleUpdateBenchmark(idx, b.avgRentSqFt + 5)}
                        className="text-[10px] text-cyan-700 hover:underline"
                      >
                        +₹5
                      </button>
                    </div>
                  </td>
                  <td className="py-3 px-4 font-mono font-bold text-slate-800">₹{b.doctorConsultAvg}</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {b.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Tab: System Status */}
      {activeTab === 'system' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4 text-xs">
          <h3 className="text-base font-bold text-slate-900">Infrastructure Health & Integrations</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/40">
              <div className="flex items-center gap-2 font-bold text-emerald-900 mb-1">
                <Server className="w-4 h-4 text-emerald-600" />
                <span>Express API Server</span>
              </div>
              <p className="text-[11px] text-slate-600">Port 3000 • Status: Operational (200 OK)</p>
            </div>

            <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/40">
              <div className="flex items-center gap-2 font-bold text-emerald-900 mb-1">
                <Cpu className="w-4 h-4 text-emerald-600" />
                <span>Google GenAI Engine</span>
              </div>
              <p className="text-[11px] text-slate-600">Gemini 2.5 Flash • Latency: 420ms</p>
            </div>

            <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/40">
              <div className="flex items-center gap-2 font-bold text-emerald-900 mb-1">
                <Database className="w-4 h-4 text-emerald-600" />
                <span>State Synchronization</span>
              </div>
              <p className="text-[11px] text-slate-600">In-Memory Store with Local Persistence</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
