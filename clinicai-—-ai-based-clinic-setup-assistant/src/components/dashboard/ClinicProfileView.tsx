import React, { useState, useEffect } from 'react';
import { useClinic } from '../../context/ClinicContext';
import { ClinicType } from '../../types';
import {
  Building,
  Save,
  CheckCircle2,
  MapPin,
  Stethoscope,
  Coins,
  DoorOpen,
  Users,
} from 'lucide-react';
import { ModulePageShell } from './ModulePageShell';
import { formatINR } from '../../utils/formatters';
import { RealClinicLocationMap } from '../maps/RealClinicLocationMap';
import { resolveLocationCoordinates } from '../../utils/clinicDefaults';
import {
  getAllStates,
  getCitiesForState,
  findCityDetails,
  getAllCities,
} from '../../utils/indiaGeography';

export const ClinicProfileView: React.FC = () => {
  const { clinic, updateClinic, addToast, setActiveView } = useClinic();

  const [name, setName] = useState(clinic.name);
  const [clinicType, setClinicType] = useState<ClinicType>(clinic.clinicType);
  const [city, setCity] = useState(clinic.location.city);
  const [area, setArea] = useState(clinic.location.area);
  const [state, setState] = useState(clinic.location.state || 'Rajasthan');
  const [preferredLocation, setPreferredLocation] = useState(clinic.location.preferredLocation || '');
  const [consultationRooms, setConsultationRooms] = useState(clinic.capacity.consultationRooms);
  const [expectedPatientsPerDay, setExpectedPatientsPerDay] = useState(clinic.capacity.expectedPatientsPerDay);
  const [approxAreaSqFt, setApproxAreaSqFt] = useState(clinic.capacity.approxAreaSqFt);
  const [totalBudget, setTotalBudget] = useState(clinic.budget.totalBudget);

  // Sync state if clinic location is updated externally (e.g. from map search or space selection)
  useEffect(() => {
    setCity(clinic.location.city);
    setArea(clinic.location.area);
    if (clinic.location.state) {
      setState(clinic.location.state);
    } else {
      const details = findCityDetails(clinic.location.city);
      if (details) setState(details.state.name);
    }
    if (clinic.location.preferredLocation) {
      setPreferredLocation(clinic.location.preferredLocation);
    }
  }, [clinic.location.city, clinic.location.area, clinic.location.state, clinic.location.preferredLocation]);

  // Cities belonging to the currently selected state
  const citiesInState = getCitiesForState(state);

  const handleStateChange = (newState: string) => {
    setState(newState);
    const newCities = getCitiesForState(newState);
    if (newCities.length > 0) {
      const firstCity = newCities[0];
      const newArea = firstCity.popularAreas?.[0] || 'Central Area';
      setCity(firstCity.name);
      setArea(newArea);
      updateClinic({
        location: {
          ...clinic.location,
          city: firstCity.name,
          state: newState,
          area: newArea,
          latitude: firstCity.lat,
          longitude: firstCity.lng,
        },
      });
      addToast(`Selected ${newState}. Showing all ${newCities.length} cities.`, 'info');
    }
  };

  const handleQuickCity = (targetCity: string) => {
    const details = findCityDetails(targetCity);
    if (details) {
      const newState = details.state.name;
      const newArea = details.city.popularAreas?.[0] || 'Central Hub';
      setCity(details.city.name);
      setArea(newArea);
      setState(newState);
      updateClinic({
        location: {
          ...clinic.location,
          city: details.city.name,
          area: newArea,
          state: newState,
          latitude: details.city.lat,
          longitude: details.city.lng,
        },
      });
      addToast(`Selected ${details.city.name}, ${newState}. Showing all ${details.state.cities.length} cities.`, 'success');
      return;
    }

    const resolved = resolveLocationCoordinates(targetCity, targetCity);
    setCity(resolved.city);
    setArea(resolved.area);
    if (resolved.state) setState(resolved.state);
    updateClinic({
      location: {
        ...clinic.location,
        city: resolved.city,
        area: resolved.area,
        state: resolved.state || state,
        latitude: resolved.lat,
        longitude: resolved.lng,
      },
    });
    addToast(`Panned map and updated clinic to ${resolved.city}`, 'success');
  };

  const handleLocateCityOnMap = () => {
    const query = `${area} ${city}`.trim() || city;
    const resolved = resolveLocationCoordinates(query, city);
    setCity(resolved.city);
    setArea(resolved.area);
    if (resolved.state) setState(resolved.state);
    updateClinic({
      location: {
        ...clinic.location,
        city: resolved.city,
        area: resolved.area,
        state: resolved.state || state,
        latitude: resolved.lat,
        longitude: resolved.lng,
      },
    });
    addToast(`Map updated to ${resolved.city} (${resolved.area})`, 'success');
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const isLocationChanged =
      city.trim().toLowerCase() !== clinic.location.city.trim().toLowerCase() ||
      area.trim().toLowerCase() !== clinic.location.area.trim().toLowerCase();

    const resolved = isLocationChanged
      ? resolveLocationCoordinates(`${area} ${city}`.trim(), city)
      : {
          lat: clinic.location.latitude || 26.8532,
          lng: clinic.location.longitude || 75.8052,
          state,
        };

    updateClinic({
      name,
      clinicType,
      location: {
        ...clinic.location,
        city,
        area,
        state: resolved.state || state,
        preferredLocation,
        latitude: resolved.lat,
        longitude: resolved.lng,
      },
      capacity: {
        ...clinic.capacity,
        consultationRooms: Number(consultationRooms),
        expectedPatientsPerDay: Number(expectedPatientsPerDay),
        approxAreaSqFt: Number(approxAreaSqFt),
      },
      budget: {
        ...clinic.budget,
        totalBudget: Number(totalBudget),
      },
      setupProgress: {
        ...clinic.setupProgress,
        profile: true,
      },
    });
    addToast('Clinic profile updated successfully!', 'success');
  };

  const handleContinue = () => {
    handleSubmit();
    setActiveView('location');
  };

  return (
    <ModulePageShell
      stepNumber={1}
      totalSteps={8}
      title="Clinic Concept & Practice Profile"
      description="Define core clinical specialty, consultation room capacity, and target location parameters."
      statusBadge="Completed"
      primaryActionLabel="Save & Continue to Location"
      onPrimaryAction={handleContinue}
      summaryMetrics={[
        {
          label: 'Practice Model',
          value: clinicType.split(' ')[0],
          subtext: `${consultationRooms} consultation rooms`,
        },
        {
          label: 'Target Daily Volume',
          value: `${expectedPatientsPerDay} Patients`,
          subtext: 'Optimal steady-state target',
        },
        {
          label: 'Planned Target Budget',
          value: formatINR(totalBudget, { compact: true }),
          subtext: `${approxAreaSqFt} sq. ft. planned area`,
        },
      ]}
    >
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-6 space-y-6 text-xs">
        {/* Practice Identity */}
        <div>
          <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
            <Building className="w-4 h-4 text-teal-700" />
            <span>Practice Identity</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Practice / Clinic Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full px-3.5 py-2 border border-slate-200 bg-slate-50 rounded-xl focus:ring-1 focus:ring-teal-700 text-xs text-slate-900 font-semibold"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Clinical Specialty</label>
              <select
                value={clinicType}
                onChange={e => setClinicType(e.target.value as ClinicType)}
                className="w-full px-3.5 py-2 border border-slate-200 bg-slate-50 rounded-xl text-xs text-slate-900 font-semibold"
              >
                <option value="General Practice (GP)">General Practice (GP)</option>
                <option value="Dental Clinic">Dental Clinic</option>
                <option value="Pediatric Clinic">Pediatric Clinic</option>
                <option value="Dermatology Clinic">Dermatology Clinic</option>
                <option value="Orthopedic Clinic">Orthopedic Clinic</option>
                <option value="Polyclinic">Multi-Specialty Polyclinic</option>
              </select>
            </div>
          </div>
        </div>

        {/* Location & Catchment */}
        <div className="pt-4 border-t border-slate-100 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-teal-700" />
              <span>Location & Physical Premises</span>
            </h3>
            <span className="text-[11px] font-semibold text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
              Google Maps Enabled
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">State / Union Territory</label>
              <select
                value={state}
                onChange={e => handleStateChange(e.target.value)}
                className="w-full px-3.5 py-2 border border-slate-200 bg-slate-50 rounded-xl text-xs font-bold text-slate-800 focus:ring-1 focus:ring-teal-700 cursor-pointer"
              >
                {getAllStates().map(st => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block font-bold text-slate-700">City in {state}</label>
                <button
                  type="button"
                  onClick={handleLocateCityOnMap}
                  className="text-[10px] text-teal-700 hover:text-teal-900 font-bold hover:underline"
                >
                  Locate on Map →
                </button>
              </div>
              <div className="flex gap-1.5">
                <select
                  value={city}
                  onChange={e => handleQuickCity(e.target.value)}
                  className="w-full px-3 py-2 border border-teal-200 bg-teal-50/50 rounded-xl text-xs font-bold text-teal-900 focus:ring-1 focus:ring-teal-700 cursor-pointer"
                >
                  <optgroup label={`${state} Cities`}>
                    {citiesInState.map(c => (
                      <option key={c.name} value={c.name}>
                        {c.name} {c.demand === 'Very High' ? '★' : ''}
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label="Other Major Cities">
                    {getAllCities()
                      .filter(c => c.state !== state && c.tier === 1)
                      .map(c => (
                        <option key={c.name} value={c.name}>
                          {c.name} ({c.state})
                        </option>
                      ))}
                  </optgroup>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Neighborhood / Micro-Market</label>
              <input
                type="text"
                required
                value={area}
                onChange={e => setArea(e.target.value)}
                onBlur={handleLocateCityOnMap}
                placeholder="e.g. Andheri West, Indiranagar, Malviya Nagar"
                className="w-full px-3.5 py-2 border border-slate-200 bg-slate-50 rounded-xl text-xs font-semibold"
              />
            </div>
          </div>

          {/* Quick City Presets - Auto shows all cities for current state */}
          <div className="flex items-center gap-1.5 overflow-x-auto py-1 text-xs scrollbar-none">
            <span className="text-[11px] font-bold text-slate-600 mr-1 flex items-center gap-1 shrink-0 whitespace-nowrap">
              <MapPin className="w-3 h-3 text-teal-700" />
              <span>Cities in {state} ({citiesInState.length}):</span>
            </span>
            {citiesInState.map(c => {
              const isActive = city.toLowerCase() === c.name.toLowerCase();
              return (
                <button
                  key={c.name}
                  type="button"
                  onClick={() => handleQuickCity(c.name)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-teal-700 text-white shadow-2xs font-bold'
                      : 'bg-slate-100 hover:bg-teal-50 text-slate-700 hover:text-teal-800 border border-slate-200'
                  }`}
                  title={`${c.name} (${c.demand} Demand)`}
                >
                  {isActive ? `★ ${c.name}` : c.name}
                </button>
              );
            })}
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Commercial Street Address / Landmark</label>
            <input
              type="text"
              placeholder="e.g. Ground Floor, Commercial Complex, Sector 4 Main Road"
              value={preferredLocation}
              onChange={e => setPreferredLocation(e.target.value)}
              className="w-full px-3.5 py-2 border border-slate-200 bg-slate-50 rounded-xl text-xs"
            />
          </div>

          {/* Interactive Google Map Pinpoint Preview */}
          <div className="space-y-1.5 pt-1">
            <div className="flex items-center justify-between text-xs text-slate-600">
              <span className="font-semibold text-slate-800">Pinpoint Exact Clinic Location on Google Map:</span>
              <span className="font-mono text-[11px] text-teal-800">
                {clinic.location.latitude?.toFixed(4) || '26.8532'}° N, {clinic.location.longitude?.toFixed(4) || '75.8052'}° E
              </span>
            </div>
            <RealClinicLocationMap
              height="260px"
              showMicroMarkets={false}
              allowPinRelocation={true}
            />
          </div>
        </div>

        {/* Physical Layout Capacity */}
        <div className="pt-4 border-t border-slate-100">
          <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
            <DoorOpen className="w-4 h-4 text-teal-700" />
            <span>Facility Capacity & Layout</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Consultation Rooms</label>
              <input
                type="number"
                min={1}
                max={10}
                value={consultationRooms}
                onChange={e => setConsultationRooms(Number(e.target.value))}
                className="w-full px-3.5 py-2 border border-slate-200 bg-slate-50 rounded-xl text-xs font-semibold"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Approx Carpet Area (sq. ft.)</label>
              <input
                type="number"
                min={200}
                max={5000}
                step={50}
                value={approxAreaSqFt}
                onChange={e => setApproxAreaSqFt(Number(e.target.value))}
                className="w-full px-3.5 py-2 border border-slate-200 bg-slate-50 rounded-xl text-xs font-semibold"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Planned Patient Footfall / Day</label>
              <input
                type="number"
                min={5}
                max={150}
                value={expectedPatientsPerDay}
                onChange={e => setExpectedPatientsPerDay(Number(e.target.value))}
                className="w-full px-3.5 py-2 border border-slate-200 bg-slate-50 rounded-xl text-xs font-semibold"
              />
            </div>
          </div>
        </div>

        {/* Capital Target */}
        <div className="pt-4 border-t border-slate-100">
          <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
            <Coins className="w-4 h-4 text-teal-700" />
            <span>Target Capital Allocation</span>
          </h3>

          <div className="max-w-xs">
            <label className="block font-bold text-slate-700 mb-1">Planned Setup Budget (₹)</label>
            <input
              type="number"
              step={50000}
              value={totalBudget}
              onChange={e => setTotalBudget(Number(e.target.value))}
              className="w-full px-3.5 py-2 border border-slate-200 bg-slate-50 rounded-xl text-xs font-mono font-bold text-slate-900"
            />
            <span className="text-[11px] text-slate-400 mt-1 block">
              Formatted: {formatINR(totalBudget)}
            </span>
          </div>
        </div>
      </div>
    </ModulePageShell>
  );
};
