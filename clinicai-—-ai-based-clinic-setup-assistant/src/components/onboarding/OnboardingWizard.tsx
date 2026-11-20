import React, { useState } from 'react';
import { useClinic } from '../../context/ClinicContext';
import { useAuth } from '../../context/AuthContext';
import {
  CLINIC_TYPES,
  CLINIC_TYPE_SERVICES,
  DEFAULT_METRO_CITIES,
} from '../../utils/clinicDefaults';
import {
  getAllStates,
  getCitiesForState,
  findCityDetails,
} from '../../utils/indiaGeography';
import {
  Stethoscope,
  MapPin,
  Users,
  Coins,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Check,
  Plus,
  Trash2,
  Building2,
  Clock,
  Briefcase,
  HelpCircle,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const OnboardingWizard: React.FC = () => {
  const { createClinicFromWizard, setActiveView } = useClinic();
  const { user } = useAuth();

  const [currentStep, setCurrentStep] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationPhase, setGenerationPhase] = useState('Analyzing clinical volume...');

  // Form states
  const [clinicName, setClinicName] = useState('');
  const [clinicType, setClinicType] = useState('General Clinic');

  // Step 2: Location
  const [country, setCountry] = useState('India');
  const [state, setState] = useState('Rajasthan');
  const [city, setCity] = useState('Jaipur');
  const [area, setArea] = useState('Malviya Nagar');
  const [preferredLocation, setPreferredLocation] = useState('Main Road / Commercial Complex');
  const [approxAreaSqFt, setApproxAreaSqFt] = useState(850);

  // Step 3: Capacity
  const [consultationRooms, setConsultationRooms] = useState(2);
  const [expectedPatientsPerDay, setExpectedPatientsPerDay] = useState(30);
  const [workingHoursPerDay, setWorkingHoursPerDay] = useState(8);
  const [workingDaysPerWeek, setWorkingDaysPerWeek] = useState(6);

  // Step 4: Budget
  const [currency, setCurrency] = useState('₹');
  const [totalBudget, setTotalBudget] = useState(1200000);
  const [monthlyRentBudget, setMonthlyRentBudget] = useState(38000);
  const [equipmentBudget, setEquipmentBudget] = useState(400000);
  const [interiorBudget, setInteriorBudget] = useState(250000);
  const [staffBudget, setStaffBudget] = useState(150000);

  // Step 5: Services
  const [selectedServices, setSelectedServices] = useState<string[]>(() => {
    return CLINIC_TYPE_SERVICES['General Clinic'] || ['General Consultation', 'Preventive Checkups'];
  });
  const [newServiceInput, setNewServiceInput] = useState('');

  // Update default services when clinicType changes
  const handleClinicTypeChange = (type: string) => {
    setClinicType(type);
    setSelectedServices(CLINIC_TYPE_SERVICES[type] || ['Consultations']);
  };

  const toggleService = (srv: string) => {
    if (selectedServices.includes(srv)) {
      setSelectedServices(selectedServices.filter(s => s !== srv));
    } else {
      setSelectedServices([...selectedServices, srv]);
    }
  };

  const handleAddCustomService = () => {
    if (newServiceInput.trim() && !selectedServices.includes(newServiceInput.trim())) {
      setSelectedServices([...selectedServices, newServiceInput.trim()]);
      setNewServiceInput('');
    }
  };

  const handleSubmit = async () => {
    setIsGenerating(true);

    const phases = [
      'Analyzing clinical volume and specialty needs...',
      'Synthesizing essential equipment inventory...',
      'Calibrating staff ratios and regional payroll...',
      'Evaluating location demographics and footfall...',
      'Structuring capital and recurring operating budgets...',
      'Compiling regulatory & licensing compliance checklist...',
      'Generating turnkey clinic setup plan...',
    ];

    for (let i = 0; i < phases.length; i++) {
      setGenerationPhase(phases[i]);
      await new Promise(r => setTimeout(r, 650));
    }

    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch (e) {}

    await createClinicFromWizard({
      name: clinicName || `${city} ${clinicType}`,
      clinicType,
      location: {
        country,
        state,
        city,
        area,
        preferredLocation,
        approxAreaSqFt: Number(approxAreaSqFt),
      },
      capacity: {
        consultationRooms: Number(consultationRooms),
        expectedPatientsPerDay: Number(expectedPatientsPerDay),
        workingHoursPerDay: Number(workingHoursPerDay),
        workingDaysPerWeek: Number(workingDaysPerWeek),
      },
      budget: {
        currency,
        totalBudget: Number(totalBudget),
        monthlyRentBudget: Number(monthlyRentBudget),
        equipmentBudget: Number(equipmentBudget),
        interiorBudget: Number(interiorBudget),
        staffBudget: Number(staffBudget),
      },
      services: selectedServices,
    });

    setIsGenerating(false);
  };

  if (isGenerating) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-6 text-center">
        <div className="relative mb-8">
          <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-cyan-600 to-teal-400 flex items-center justify-center text-white shadow-xl shadow-cyan-500/20 animate-pulse">
            <Sparkles className="w-12 h-12" />
          </div>
          <div className="absolute -inset-2 rounded-3xl border border-cyan-500/30 animate-ping" />
        </div>

        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-3">
          Generating Your Custom Clinic Plan
        </h2>
        <p className="text-cyan-400 text-sm font-mono tracking-wide max-w-md animate-pulse mb-6">
          {generationPhase}
        </p>

        <div className="w-64 h-2 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
          <div className="h-full bg-gradient-to-r from-cyan-500 to-teal-400 rounded-full animate-[progress_4.5s_ease-in-out_infinite]" />
        </div>

        <div className="mt-8 text-xs text-slate-400 max-w-sm">
          Please hold on while ClinicAI calibrates clinical equipment lists, staffing payroll, and regulatory compliance.
        </div>
      </div>
    );
  }

  const steps = [
    { num: 1, title: 'Clinic Specialty' },
    { num: 2, title: 'Location' },
    { num: 3, title: 'Capacity' },
    { num: 4, title: 'Budget' },
    { num: 5, title: 'Services' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8 flex flex-col justify-between">
      <div className="max-w-3xl mx-auto w-full">
        {/* Top Header */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-200">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-cyan-600 flex items-center justify-center text-white">
              <Stethoscope className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-900 leading-tight">Clinic Setup Wizard</h1>
              <p className="text-xs text-slate-500">Step {currentStep} of 5 — Answer a few questions to build your blueprint</p>
            </div>
          </div>

          <button
            onClick={() => setActiveView('dashboard')}
            className="text-xs text-slate-500 hover:text-slate-800 font-medium px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-white"
          >
            Skip to Dashboard
          </button>
        </div>

        {/* Step Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            {steps.map(s => (
              <div
                key={s.num}
                className={`flex items-center gap-1.5 text-xs font-semibold ${
                  currentStep === s.num
                    ? 'text-cyan-700'
                    : currentStep > s.num
                    ? 'text-emerald-600'
                    : 'text-slate-400'
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold ${
                    currentStep === s.num
                      ? 'bg-cyan-600 text-white'
                      : currentStep > s.num
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-slate-200 text-slate-500'
                  }`}
                >
                  {currentStep > s.num ? <Check className="w-3.5 h-3.5" /> : s.num}
                </div>
                <span className="hidden sm:inline">{s.title}</span>
              </div>
            ))}
          </div>
          <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
            <div
              className="bg-cyan-600 h-full transition-all duration-300 rounded-full"
              style={{ width: `${((currentStep - 1) / 4) * 100}%` }}
            />
          </div>
        </div>

        {/* Step Content Card */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
          {/* STEP 1: CLINIC TYPE */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900 mb-1">What type of clinic are you planning?</h2>
                <p className="text-sm text-slate-500">
                  Select your medical discipline to calibrate appropriate equipment, staffing, and compliance checklists.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2">Clinic Name (Optional)</label>
                <input
                  type="text"
                  value={clinicName}
                  onChange={e => setClinicName(e.target.value)}
                  placeholder="e.g. Apex Family Health Center"
                  className="w-full px-4 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-3">Clinic Discipline / Specialty</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {CLINIC_TYPES.map(type => (
                    <div
                      key={type}
                      onClick={() => handleClinicTypeChange(type)}
                      className={`p-4 rounded-xl border text-left cursor-pointer transition-all ${
                        clinicType === type
                          ? 'border-cyan-600 bg-cyan-50/70 shadow-sm ring-1 ring-cyan-600'
                          : 'border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-slate-900">{type}</span>
                        {clinicType === type && (
                          <div className="w-5 h-5 rounded-full bg-cyan-600 text-white flex items-center justify-center">
                            <Check className="w-3 h-3" />
                          </div>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 mt-1">
                        {type === 'General Clinic' && 'Primary outpatient, consultation, chronic care'}
                        {type === 'Dental Clinic' && 'Operatory units, x-ray, prosthetics, scaling'}
                        {type === 'Pediatric Clinic' && 'Immunization, growth tracking, child triage'}
                        {type === 'Dermatology Clinic' && 'Cosmetic, laser, biopsying, skin diagnostics'}
                        {type === 'Eye Clinic' && 'Ophthalmic refractors, slit lamps, vision test'}
                        {type === 'Physiotherapy Clinic' && 'Rehabilitation, electrotherapy, ultrasound'}
                        {type === 'Diagnostic Center' && 'Sample collection, hematology, imaging'}
                        {type === 'Other' && 'Customized multi-specialty framework'}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: LOCATION */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900 mb-1">Where will your clinic be located?</h2>
                <p className="text-sm text-slate-500">
                  Target location helps analyze demographic footfall, competing practices, and average commercial rent.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">State / Union Territory</label>
                  <select
                    value={state}
                    onChange={e => {
                      const newState = e.target.value;
                      setState(newState);
                      const stateCities = getCitiesForState(newState);
                      if (stateCities.length > 0) {
                        setCity(stateCities[0].name);
                        setArea(stateCities[0].popularAreas?.[0] || 'Central Area');
                      }
                    }}
                    className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-cyan-500 bg-white font-semibold cursor-pointer"
                  >
                    {getAllStates().map(st => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">City in {state}</label>
                  <select
                    value={city}
                    onChange={e => {
                      const newCity = e.target.value;
                      setCity(newCity);
                      const details = findCityDetails(newCity);
                      if (details) {
                        setState(details.state.name);
                        setArea(details.city.popularAreas?.[0] || 'Central Area');
                      }
                    }}
                    className="w-full px-3.5 py-2.5 text-sm border border-cyan-400 rounded-xl focus:ring-2 focus:ring-cyan-500 bg-cyan-50/50 font-bold text-slate-900 cursor-pointer"
                  >
                    <optgroup label={`${state} Cities`}>
                      {getCitiesForState(state).map(ct => (
                        <option key={ct.name} value={ct.name}>
                          {ct.name} {ct.demand === 'Very High' ? '★' : ''}
                        </option>
                      ))}
                    </optgroup>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Target Neighborhood / Area</label>
                  <input
                    type="text"
                    value={area}
                    onChange={e => setArea(e.target.value)}
                    placeholder="e.g. Malviya Nagar or C-Scheme"
                    className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Country</label>
                  <input
                    type="text"
                    value={country}
                    onChange={e => setCountry(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-cyan-500"
                  />
                </div>
              </div>

              {/* All Cities in State Quick Buttons */}
              <div className="pt-2">
                <span className="text-[11px] font-bold text-slate-500 block mb-1.5">
                  All Cities in {state} ({getCitiesForState(state).length}):
                </span>
                <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
                  {getCitiesForState(state).map(ct => {
                    const isActive = city.toLowerCase() === ct.name.toLowerCase();
                    return (
                      <button
                        key={ct.name}
                        type="button"
                        onClick={() => {
                          setCity(ct.name);
                          setArea(ct.popularAreas?.[0] || 'Central Area');
                        }}
                        className={`text-xs px-2.5 py-1 rounded-lg font-medium transition-all cursor-pointer ${
                          isActive
                            ? 'bg-cyan-700 text-white font-bold shadow-xs'
                            : 'bg-slate-100 hover:bg-cyan-50 text-slate-700 hover:text-cyan-800 border border-slate-200'
                        }`}
                      >
                        {isActive ? `★ ${ct.name}` : ct.name}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Preferred Location Type</label>
                  <select
                    value={preferredLocation}
                    onChange={e => setPreferredLocation(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl bg-white"
                  >
                    <option>Main Road / Commercial Complex</option>
                    <option>High Street Retail Ground Floor</option>
                    <option>Residential Neighborhood Center</option>
                    <option>Hospital Adjacent / Medical Hub</option>
                    <option>Shopping Mall / Plazas</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Approximate Usable Area (Sq. Ft.)
                  </label>
                  <input
                    type="number"
                    value={approxAreaSqFt}
                    onChange={e => setApproxAreaSqFt(Number(e.target.value))}
                    min={200}
                    step={50}
                    className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-cyan-500"
                  />
                  <span className="text-[11px] text-slate-400 mt-1 block">Recommended: 600 - 1,200 sq ft</span>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: CAPACITY */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900 mb-1">Clinic Capacity & Patient Volume</h2>
                <p className="text-sm text-slate-500">
                  Defines operational scale to calibrate staffing rosters and revenue potential accurately.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50">
                  <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                    Consultation Rooms
                  </label>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setConsultationRooms(Math.max(1, consultationRooms - 1))}
                      className="w-9 h-9 rounded-lg bg-white border border-slate-300 text-slate-700 font-bold hover:bg-slate-100"
                    >
                      -
                    </button>
                    <span className="text-xl font-extrabold text-slate-900 w-12 text-center">
                      {consultationRooms}
                    </span>
                    <button
                      type="button"
                      onClick={() => setConsultationRooms(consultationRooms + 1)}
                      className="w-9 h-9 rounded-lg bg-white border border-slate-300 text-slate-700 font-bold hover:bg-slate-100"
                    >
                      +
                    </button>
                  </div>
                  <span className="text-[11px] text-slate-500 mt-2 block">
                    Number of dedicated doctor chambers
                  </span>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50">
                  <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                    Expected Patients / Day
                  </label>
                  <input
                    type="number"
                    value={expectedPatientsPerDay}
                    onChange={e => setExpectedPatientsPerDay(Number(e.target.value))}
                    min={5}
                    max={200}
                    className="w-full px-3.5 py-2 text-base font-bold border border-slate-300 rounded-lg"
                  />
                  <span className="text-[11px] text-slate-500 mt-2 block">
                    Typical benchmark: 20-35 patients/day
                  </span>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50">
                  <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                    Working Hours / Day
                  </label>
                  <select
                    value={workingHoursPerDay}
                    onChange={e => setWorkingHoursPerDay(Number(e.target.value))}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg bg-white"
                  >
                    <option value={6}>6 Hours (Half Day / Evening)</option>
                    <option value={8}>8 Hours (Standard Single Shift)</option>
                    <option value={10}>10 Hours (Extended Shift)</option>
                    <option value={12}>12 Hours (Double Shift)</option>
                  </select>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50">
                  <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                    Working Days / Week
                  </label>
                  <select
                    value={workingDaysPerWeek}
                    onChange={e => setWorkingDaysPerWeek(Number(e.target.value))}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg bg-white"
                  >
                    <option value={5}>5 Days (Monday - Friday)</option>
                    <option value={6}>6 Days (Monday - Saturday)</option>
                    <option value={7}>7 Days (All Week)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: BUDGET */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900 mb-1">Financial Budget Targets</h2>
                <p className="text-sm text-slate-500">
                  All figures are labeled as Estimates and can be tuned later in your Cost Estimator.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Total Planned Capital Budget ({currency})
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-3 text-slate-400 font-bold">{currency}</span>
                  <input
                    type="number"
                    value={totalBudget}
                    onChange={e => setTotalBudget(Number(e.target.value))}
                    step={50000}
                    className="w-full pl-9 pr-4 py-2.5 text-lg font-bold border border-slate-300 rounded-xl focus:ring-2 focus:ring-cyan-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Monthly Rent Budget ({currency})
                  </label>
                  <input
                    type="number"
                    value={monthlyRentBudget}
                    onChange={e => setMonthlyRentBudget(Number(e.target.value))}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Equipment Capital Budget ({currency})
                  </label>
                  <input
                    type="number"
                    value={equipmentBudget}
                    onChange={e => setEquipmentBudget(Number(e.target.value))}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Interior & Renovation Budget ({currency})
                  </label>
                  <input
                    type="number"
                    value={interiorBudget}
                    onChange={e => setInteriorBudget(Number(e.target.value))}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Monthly Staff Payroll Budget ({currency})
                  </label>
                  <input
                    type="number"
                    value={staffBudget}
                    onChange={e => setStaffBudget(Number(e.target.value))}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: SERVICES */}
          {currentStep === 5 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900 mb-1">Clinical Services Offered</h2>
                <p className="text-sm text-slate-500">
                  Select the services your clinic will deliver. This calibrates your revenue model and necessary equipment.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-60 overflow-y-auto pr-1">
                {(CLINIC_TYPE_SERVICES[clinicType] || []).map(service => {
                  const isChecked = selectedServices.includes(service);
                  return (
                    <div
                      key={service}
                      onClick={() => toggleService(service)}
                      className={`p-3 rounded-xl border text-xs font-medium flex items-center justify-between cursor-pointer transition-colors ${
                        isChecked
                          ? 'border-cyan-600 bg-cyan-50 text-cyan-900'
                          : 'border-slate-200 hover:border-slate-300 text-slate-700'
                      }`}
                    >
                      <span>{service}</span>
                      <div
                        className={`w-4 h-4 rounded flex items-center justify-center border ${
                          isChecked ? 'bg-cyan-600 border-cyan-600 text-white' : 'border-slate-300 bg-white'
                        }`}
                      >
                        {isChecked && <Check className="w-3 h-3" />}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Add Custom Service */}
              <div className="pt-2 border-t border-slate-200">
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Add Custom Service</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newServiceInput}
                    onChange={e => setNewServiceInput(e.target.value)}
                    placeholder="e.g., Minor Surgery, Telemedicine, Home Care"
                    className="flex-1 px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-cyan-500"
                    onKeyDown={e => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddCustomService();
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={handleAddCustomService}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-xl flex items-center gap-1.5 border border-slate-200"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add</span>
                  </button>
                </div>
              </div>

              {/* Selected summary */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600">
                <span className="font-semibold text-slate-800">Selected Services ({selectedServices.length}): </span>
                {selectedServices.join(', ')}
              </div>
            </div>
          )}

          {/* Navigation Controls */}
          <div className="mt-8 pt-6 border-t border-slate-200 flex items-center justify-between">
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={() => setCurrentStep(currentStep - 1)}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium text-slate-600 hover:text-slate-900 border border-slate-200 hover:bg-slate-50 rounded-xl transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
            ) : (
              <div />
            )}

            {currentStep < 5 ? (
              <button
                type="button"
                onClick={() => setCurrentStep(currentStep + 1)}
                className="inline-flex items-center gap-1.5 px-6 py-2.5 text-sm font-semibold text-white bg-cyan-600 hover:bg-cyan-700 rounded-xl transition-all shadow-md shadow-cyan-600/20"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                className="inline-flex items-center gap-2 px-7 py-3 text-sm font-bold text-white bg-gradient-to-r from-cyan-600 to-teal-500 hover:from-cyan-700 hover:to-teal-600 rounded-xl transition-all shadow-lg shadow-cyan-600/25 animate-pulse"
                id="generate-plan-btn"
              >
                <Sparkles className="w-4 h-4" />
                <span>Generate My Clinic Plan</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
