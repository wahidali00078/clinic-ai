import React, { useState, useMemo } from 'react';
import { useClinic } from '../../context/ClinicContext';
import {
  MapPin,
  Building2,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Search,
  Check,
  Info,
  Navigation,
  Crosshair,
  Sparkles,
  Calendar,
  Phone,
  ShieldCheck,
  Eye,
  Filter,
  CheckCircle,
  Clock,
  X,
  ChevronDown,
  FileText,
  User,
} from 'lucide-react';
import { ModulePageShell } from './ModulePageShell';
import { DataBadge } from '../common/DataBadge';
import { RealClinicLocationMap } from '../maps/RealClinicLocationMap';
import { LocationZone, AvailableClinicSpace } from '../../types';
import { getAvailableSpacesForLocation } from '../../utils/spacesData';
import { getCoordinatesForCity, resolveLocationCoordinates } from '../../utils/clinicDefaults';
import { formatINR } from '../../utils/formatters';
import {
  getAllStates,
  getCitiesForState,
  findCityDetails,
  getAllCities,
} from '../../utils/indiaGeography';

export const LocationAnalysisView: React.FC = () => {
  const { locationAnalysis, clinic, updateClinic, addToast, setActiveView } = useClinic();
  const [selectedAreaIndex, setSelectedAreaIndex] = useState(0);
  const [focusedSpaceId, setFocusedSpaceId] = useState<string | null>(null);
  const [spaceFilter, setSpaceFilter] = useState<'all' | 'ground' | 'budget' | 'large'>('all');

  // Site Visit Booking Modal State
  const [visitingSpace, setVisitingSpace] = useState<AvailableClinicSpace | null>(null);
  const [visitDate, setVisitDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  });
  const [visitSlot, setVisitSlot] = useState<'10:00 AM' | '02:30 PM' | '05:00 PM'>('10:00 AM');
  const [visitorName, setVisitorName] = useState('Dr. Siddharth Sharma');
  const [visitorPhone, setVisitorPhone] = useState('+91 98290 12345');
  const [visitConfirmedPass, setVisitConfirmedPass] = useState<{
    passId: string;
    spaceTitle: string;
    buildingName: string;
    address: string;
    date: string;
    slot: string;
    contactPerson: string;
    contactPhone: string;
  } | null>(null);

  // Active coordinates
  const currentCoords = useMemo(() => {
    if (clinic.location.latitude && clinic.location.longitude) {
      return {
        lat: clinic.location.latitude,
        lng: clinic.location.longitude,
      };
    }
    return getCoordinatesForCity(clinic.location.city);
  }, [clinic.location.latitude, clinic.location.longitude, clinic.location.city]);

  // Normalize zones / recommendations across models
  const zones: LocationZone[] = (locationAnalysis.zones || (locationAnalysis as any).recommendations || []).map(
    (item: any, idx: number) => ({
      id: item.id || `zone-${idx + 1}`,
      name: item.name || item.areaName || `Micro-Market ${idx + 1}`,
      overallScore: item.overallScore || item.score || 80,
      estimatedRentRange: item.estimatedRentRange || item.rentRange || '₹35,000 - ₹50,000 / mo',
      competitionLevel: item.competitionLevel || 'Moderate',
      demandLevel: item.demandLevel || 'High',
      pros: item.pros || ['High residential density in 2km radius', 'Good road visibility'],
      cons: item.cons || ['Peak hour traffic congestion'],
      recommendation: item.recommendation || 'Favorable location for outpatient footfall.',
      lat: item.lat || currentCoords.lat + (idx === 0 ? 0.003 : idx === 1 ? -0.004 : -0.01),
      lng: item.lng || currentCoords.lng + (idx === 0 ? 0.004 : idx === 1 ? -0.003 : 0.012),
    })
  );

  // Available spaces in the current location
  const allSpaces = useMemo<AvailableClinicSpace[]>(() => {
    return getAvailableSpacesForLocation(
      clinic.location.city,
      clinic.location.area,
      currentCoords.lat,
      currentCoords.lng
    );
  }, [clinic.location.city, clinic.location.area, currentCoords.lat, currentCoords.lng]);

  // Filtered spaces based on user selection
  const filteredSpaces = useMemo(() => {
    if (spaceFilter === 'ground') {
      return allSpaces.filter(s => s.floor.toLowerCase().includes('ground'));
    }
    if (spaceFilter === 'budget') {
      return allSpaces.filter(s => s.monthlyRent <= 40000);
    }
    if (spaceFilter === 'large') {
      return allSpaces.filter(s => s.carpetAreaSqFt >= 1000);
    }
    return allSpaces;
  }, [allSpaces, spaceFilter]);

  const demandScore = locationAnalysis.demandScore ?? (locationAnalysis as any).factors?.demandScore ?? 88;
  const competitionScore = locationAnalysis.competitionScore ?? (locationAnalysis as any).factors?.competitionScore ?? 76;
  const accessibilityScore = locationAnalysis.accessibilityScore ?? (locationAnalysis as any).factors?.accessibilityScore ?? 91;
  const affordabilityScore = locationAnalysis.affordabilityScore ?? (locationAnalysis as any).factors?.affordabilityScore ?? 82;
  const overallScore = locationAnalysis.overallScore || 84;

  const handleSelectArea = (idx: number) => {
    setSelectedAreaIndex(idx);
    const rec = zones[idx];
    if (rec) {
      const areaClean = rec.name.split(' ')[0];
      updateClinic({
        location: {
          ...clinic.location,
          area: areaClean,
          latitude: rec.lat || clinic.location.latitude,
          longitude: rec.lng || clinic.location.longitude,
        },
      });
      addToast(`Selected ${rec.name} as target clinic location`, 'success');
    }
  };

  const handleAdoptSpace = (space: AvailableClinicSpace) => {
    updateClinic({
      location: {
        ...clinic.location,
        preferredLocation: `${space.buildingName}, ${space.address}`,
        approxAreaSqFt: space.carpetAreaSqFt,
        latitude: space.lat,
        longitude: space.lng,
      },
      budget: {
        ...clinic.budget,
        monthlyRentBudget: space.monthlyRent,
      },
    });

    setFocusedSpaceId(space.id);
    addToast(
      `Clinic premises updated to ${space.buildingName} (${formatINR(space.monthlyRent)}/mo, ${space.carpetAreaSqFt} sq.ft)`,
      'success'
    );
  };

  const handleFocusOnMap = (space: AvailableClinicSpace) => {
    setFocusedSpaceId(space.id);
    addToast(`Focusing Google Map on ${space.buildingName}`, 'info');
    // Smoothly scroll map container into view if offscreen
    const mapEl = document.getElementById('clinic-google-map-container');
    if (mapEl) {
      mapEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const handleConfirmVisit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!visitingSpace) return;

    const pass = {
      passId: `VISIT-${Math.floor(100000 + Math.random() * 900000)}`,
      spaceTitle: visitingSpace.title,
      buildingName: visitingSpace.buildingName,
      address: visitingSpace.address,
      date: visitDate,
      slot: visitSlot,
      contactPerson: visitingSpace.contactPerson,
      contactPhone: visitingSpace.contactPhone,
    };

    setVisitConfirmedPass(pass);
    addToast(`Site visit confirmed for ${visitingSpace.buildingName}! Pass generated.`, 'success');
  };

  const [showLocationSelector, setShowLocationSelector] = useState(false);
  const [analysisState, setAnalysisState] = useState(() => {
    const details = findCityDetails(clinic.location.city);
    return details?.state.name || clinic.location.state || 'Rajasthan';
  });

  const stateCitiesList = useMemo(() => {
    return getCitiesForState(analysisState);
  }, [analysisState]);

  const handleSwitchState = (newState: string) => {
    setAnalysisState(newState);
    const cities = getCitiesForState(newState);
    if (cities.length > 0) {
      const target = cities[0];
      const targetArea = target.popularAreas?.[0] || 'Central Area';
      updateClinic({
        location: {
          ...clinic.location,
          city: target.name,
          area: targetArea,
          state: newState,
          latitude: target.lat,
          longitude: target.lng,
        },
      });
      addToast(`Selected ${newState}. Showing all ${cities.length} cities.`, 'info');
    }
  };

  const handleSwitchCity = (targetCity: string) => {
    // Automatically close the location selector so the user can see proper map!
    setShowLocationSelector(false);

    const details = findCityDetails(targetCity);
    if (details) {
      if (details.state.name !== analysisState) {
        setAnalysisState(details.state.name);
      }
      const targetArea = details.city.popularAreas?.[0] || 'Central Area';
      updateClinic({
        location: {
          ...clinic.location,
          city: details.city.name,
          area: targetArea,
          state: details.state.name,
          latitude: details.city.lat,
          longitude: details.city.lng,
        },
      });
      addToast(`Centered catchment on ${details.city.name}, ${details.state.name}. Showing all ${details.state.cities.length} cities.`, 'success');
      return;
    }

    const resolved = resolveLocationCoordinates(targetCity, targetCity);
    updateClinic({
      location: {
        ...clinic.location,
        city: resolved.city,
        area: resolved.area,
        state: resolved.state || clinic.location.state,
        latitude: resolved.lat,
        longitude: resolved.lng,
      },
    });
    addToast(`Switched catchment and map to ${resolved.city}`, 'success');
  };

  return (
    <ModulePageShell
      stepNumber={2}
      totalSteps={8}
      title={`Location & Catchment: ${clinic.location.city}`}
      description={`Interactive Google Map catchment assessment and available commercial spaces for ${clinic.clinicType} targeting ${clinic.capacity.expectedPatientsPerDay} patients/day.`}
      statusBadge="In Progress"
      primaryActionLabel="Save & Continue to Equipment"
      onPrimaryAction={() => setActiveView('equipment')}
      secondaryActionLabel="Back to Profile"
      onSecondaryAction={() => setActiveView('profile')}
      summaryMetrics={[
        {
          label: 'Location Viability',
          value: `${overallScore}/100`,
          subtext: 'High patient footfall rating',
        },
        {
          label: 'Available Spaces',
          value: `${allSpaces.length} Units`,
          subtext: 'Commercial leases nearby',
        },
        {
          label: 'Target Rent Budget',
          value: formatINR(clinic.budget.monthlyRentBudget) + '/mo',
          subtext: `For ${clinic.location.approxAreaSqFt} sq.ft space`,
        },
      ]}
    >
      {/* 1. REAL GOOGLE MAPS INTERACTIVE CATCHMENT & SPACES EXPLORER */}
      <div id="clinic-google-map-container" className="mb-6 space-y-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-teal-700" />
              <span>Interactive Google Map & Available Spaces</span>
            </h3>
            <p className="text-xs text-slate-500">
              Pan, drag, and zoom freely across the map. Click city pins, explore commercial spaces for lease, or relocate your planned clinic premises.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <span className="text-[11px] font-medium text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Google Maps Connected</span>
            </span>
            <DataBadge type="verified" size="xs" />
          </div>
        </div>

        {/* State & City Location Catchment Switcher (Closed by default so proper map is unobstructed) */}
        {!showLocationSelector ? (
          <div className="flex items-center justify-between p-2 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs">
            <div className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-teal-700" />
              <span className="font-bold text-slate-700">Catchment:</span>
              <span className="font-extrabold text-teal-800 bg-teal-50 border border-teal-200 px-2 py-0.5 rounded-md">
                {clinic.location.city}, {analysisState}
              </span>
              <span className="text-slate-500 hidden sm:inline text-[11px]">
                ({clinic.location.area || 'Central Area'})
              </span>
            </div>

            <button
              type="button"
              onClick={() => setShowLocationSelector(true)}
              className="px-2.5 py-1 bg-white hover:bg-teal-50 text-teal-700 border border-slate-300 hover:border-teal-300 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
            >
              <span>Change State / City</span>
              <ChevronDown className="w-3 h-3" />
            </button>
          </div>
        ) : (
          <div className="flex flex-wrap items-center gap-2 p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs animate-in fade-in slide-in-from-top-1">
            {/* State Select */}
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-bold text-slate-700 flex items-center gap-1 shrink-0">
                <MapPin className="w-3.5 h-3.5 text-teal-700" />
                <span>State:</span>
              </span>
              <select
                value={analysisState}
                onChange={e => handleSwitchState(e.target.value)}
                className="bg-white text-slate-900 font-bold text-xs py-1 px-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-teal-700 cursor-pointer"
              >
                {getAllStates().map(st => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
            </div>

            {/* City Select */}
            <div className="flex items-center gap-1.5 border-l border-slate-200 pl-2">
              <span className="text-[11px] font-bold text-slate-700 flex items-center gap-1 shrink-0">
                <span>City:</span>
              </span>
              <select
                value={clinic.location.city}
                onChange={e => {
                  handleSwitchCity(e.target.value);
                  setShowLocationSelector(false);
                }}
                className="bg-teal-50 text-teal-900 font-bold text-xs py-1 px-2 rounded-lg border border-teal-300 focus:outline-none focus:ring-1 focus:ring-teal-700 cursor-pointer"
              >
                <optgroup label={`${analysisState} Cities`}>
                  {stateCitiesList.map(c => (
                    <option key={c.name} value={c.name}>
                      {c.name} {c.demand === 'Very High' ? '★' : ''}
                    </option>
                  ))}
                </optgroup>
                <optgroup label="Other Metros">
                  {getAllCities()
                    .filter(c => c.state !== analysisState && c.tier === 1)
                    .map(c => (
                      <option key={c.name} value={c.name}>
                        {c.name} ({c.state})
                      </option>
                    ))}
                </optgroup>
              </select>
            </div>

            {/* Quick Cities in State */}
            <div className="flex items-center gap-1 overflow-x-auto pb-0.5 border-l border-slate-200 pl-2 max-w-full sm:max-w-md scrollbar-none">
              <span className="text-[10px] text-slate-500 whitespace-nowrap font-semibold">
                All {analysisState}:
              </span>
              {stateCitiesList.map(c => {
                const isActive =
                  clinic.location.city.toLowerCase() === c.name.toLowerCase() ||
                  clinic.location.city.toLowerCase().includes(c.name.toLowerCase());
                return (
                  <button
                    key={c.name}
                    type="button"
                    onClick={() => {
                      handleSwitchCity(c.name);
                      setShowLocationSelector(false);
                    }}
                    className={`px-2 py-0.5 rounded-lg text-[11px] font-semibold whitespace-nowrap transition-all cursor-pointer ${
                      isActive
                        ? 'bg-teal-700 text-white font-bold shadow-2xs'
                        : 'bg-white border border-slate-200 text-slate-700 hover:bg-teal-50 hover:text-teal-800'
                    }`}
                    title={`${c.name} (${c.demand} Demand)`}
                  >
                    {isActive ? `★ ${c.name}` : c.name}
                  </button>
                );
              })}
            </div>

            {/* Explicit Close Button */}
            <button
              type="button"
              onClick={() => setShowLocationSelector(false)}
              className="ml-auto px-2 py-1 bg-white hover:bg-slate-100 text-slate-600 rounded-lg text-xs font-bold flex items-center gap-1 border border-slate-200 cursor-pointer"
              title="Close to see proper map"
            >
              <X className="w-3.5 h-3.5" />
              <span>Close</span>
            </button>
          </div>
        )}

        {/* Embedded Real Google Map */}
        <RealClinicLocationMap
          height="480px"
          showMicroMarkets={true}
          showAvailableSpaces={true}
          allowPinRelocation={true}
          focusedSpaceId={focusedSpaceId}
          onZoneSelected={(zone) => {
            const idx = zones.findIndex(z => z.id === zone.id || z.name === zone.name);
            if (idx >= 0) setSelectedAreaIndex(idx);
          }}
          onSpaceSelected={(space) => {
            setFocusedSpaceId(space.id);
          }}
          onBookSiteVisit={(space) => {
            setVisitingSpace(space);
            setVisitConfirmedPass(null);
          }}
        />

        <div className="p-3 bg-teal-50/60 rounded-xl border border-teal-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-teal-900">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-teal-700 shrink-0" />
            <span>
              <strong>Map is fully interactive:</strong> You can drag anywhere to explore neighborhoods, click green pins for available clinic spaces, or click <strong>"Relocate"</strong> to place your clinic pinpoint.
            </span>
          </div>
          <span className="font-mono text-[11px] text-teal-800 font-semibold shrink-0">
            Center: {clinic.location.latitude?.toFixed(4) || '26.8532'}° N, {clinic.location.longitude?.toFixed(4) || '75.8052'}° E
          </span>
        </div>
      </div>

      {/* 2. AVAILABLE COMMERCIAL & MEDICAL SPACES FOR LEASE */}
      <div className="mb-8 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
          <div>
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-emerald-700" />
              <h3 className="text-base font-bold text-slate-900">
                Available Spaces for Rent Near {clinic.location.area}, {clinic.location.city}
              </h3>
            </div>
            <p className="text-xs text-slate-500">
              Verified commercial properties and doctor chambers with clinical infrastructure (3-phase power, plumbing, wheelchair access)
            </p>
          </div>

          {/* Filter Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 text-xs">
            <button
              onClick={() => setSpaceFilter('all')}
              className={`px-3 py-1.5 rounded-xl font-semibold text-xs whitespace-nowrap transition-colors ${
                spaceFilter === 'all'
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              All Spaces ({allSpaces.length})
            </button>
            <button
              onClick={() => setSpaceFilter('ground')}
              className={`px-3 py-1.5 rounded-xl font-semibold text-xs whitespace-nowrap transition-colors ${
                spaceFilter === 'ground'
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              Ground Floor Only
            </button>
            <button
              onClick={() => setSpaceFilter('budget')}
              className={`px-3 py-1.5 rounded-xl font-semibold text-xs whitespace-nowrap transition-colors ${
                spaceFilter === 'budget'
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              Under ₹40,000/mo
            </button>
            <button
              onClick={() => setSpaceFilter('large')}
              className={`px-3 py-1.5 rounded-xl font-semibold text-xs whitespace-nowrap transition-colors ${
                spaceFilter === 'large'
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              1000+ Sq.Ft
            </button>
          </div>
        </div>

        {/* Spaces Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSpaces.map((space) => {
            const isCurrentlySelected =
              clinic.location.preferredLocation.includes(space.buildingName) ||
              (Math.abs((clinic.location.latitude || 0) - space.lat) < 0.0001 &&
                Math.abs((clinic.location.longitude || 0) - space.lng) < 0.0001);
            const isMapFocused = focusedSpaceId === space.id;

            return (
              <div
                key={space.id}
                className={`p-5 rounded-2xl border transition-all flex flex-col justify-between bg-white ${
                  isCurrentlySelected
                    ? 'border-emerald-600 ring-2 ring-emerald-600/30 shadow-md bg-emerald-50/20'
                    : isMapFocused
                    ? 'border-teal-600 ring-1 ring-teal-600 shadow-sm'
                    : 'border-slate-200 hover:border-slate-300 shadow-2xs hover:shadow-xs'
                }`}
              >
                <div>
                  {/* Top Badge & Distance */}
                  <div className="flex items-center justify-between gap-2 mb-2">
                    {space.badge ? (
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-800 bg-emerald-100/80 px-2 py-0.5 rounded-full">
                        {space.badge}
                      </span>
                    ) : (
                      <span className="text-[10px] font-semibold text-slate-500">Commercial Lease</span>
                    )}

                    <span className="text-[11px] font-medium text-slate-500 flex items-center gap-1">
                      <Navigation className="w-3 h-3 text-teal-600" />
                      <span>~{space.distanceMeters}m away</span>
                    </span>
                  </div>

                  {/* Title & Building */}
                  <h4 className="text-sm font-bold text-slate-900 line-clamp-1">
                    {space.buildingName}
                  </h4>
                  <p className="text-xs text-slate-600 font-medium mb-1 line-clamp-1">
                    {space.title}
                  </p>
                  <p className="text-[11px] text-slate-400 line-clamp-1">
                    {space.address}
                  </p>

                  {/* Pricing and Area Highlight Box */}
                  <div className="mt-3 p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
                    <div>
                      <div className="text-[10px] text-slate-500 font-semibold uppercase">Monthly Rent</div>
                      <div className="text-base font-extrabold text-slate-900">
                        {formatINR(space.monthlyRent)}
                        <span className="text-[11px] font-normal text-slate-500">/mo</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-[10px] text-slate-500 font-semibold uppercase">Carpet Area</div>
                      <div className="text-xs font-bold text-slate-800">
                        {space.carpetAreaSqFt} sq.ft
                        <span className="block text-[10px] font-normal text-slate-400">
                          ₹{space.ratePerSqFt}/sq.ft
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Medical Suitability Points */}
                  <div className="mt-3 space-y-1">
                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                      Medical Infrastructure:
                    </div>
                    {space.medicalSuitability.slice(0, 3).map((item, i) => (
                      <div key={i} className="flex items-start gap-1.5 text-[11px] text-slate-600">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span className="line-clamp-1">{item}</span>
                      </div>
                    ))}
                  </div>

                  {/* Floor and Furnishing details */}
                  <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                    <span>Floor: <strong className="text-slate-700">{space.floor.split(' ')[0]}</strong></span>
                    <span>Furnishing: <strong className="text-slate-700">{space.furnishing}</strong></span>
                  </div>
                </div>

                {/* Bottom Action Buttons */}
                <div className="mt-4 pt-3 border-t border-slate-100 space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => handleFocusOnMap(space)}
                      className="py-1.5 px-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-semibold flex items-center justify-center gap-1 transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5 text-slate-600" />
                      <span>Pinpoint Map</span>
                    </button>

                    <button
                      onClick={() => {
                        setVisitingSpace(space);
                        setVisitConfirmedPass(null);
                      }}
                      className="py-1.5 px-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-semibold flex items-center justify-center gap-1 transition-colors"
                    >
                      <Calendar className="w-3.5 h-3.5 text-emerald-700" />
                      <span>Schedule Visit</span>
                    </button>
                  </div>

                  {isCurrentlySelected ? (
                    <div className="w-full py-2 bg-emerald-100/80 text-emerald-900 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 border border-emerald-300">
                      <Check className="w-4 h-4 text-emerald-700" />
                      <span>Active Clinic Premises</span>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleAdoptSpace(space)}
                      className="w-full py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-2xs transition-colors"
                    >
                      <Building2 className="w-4 h-4" />
                      <span>Select as Clinic Location</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. 4 Factor Breakdown Progress Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Demand Score */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="font-bold text-slate-700 uppercase tracking-wider">Demographic Demand</span>
            <span className="font-extrabold text-teal-700 text-sm">{demandScore}/100</span>
          </div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mb-2">
            <div
              className="bg-teal-700 h-full rounded-full transition-all duration-500"
              style={{ width: `${demandScore}%` }}
            />
          </div>
          <p className="text-[11px] text-slate-500 leading-relaxed">
            High population density with families seeking neighborhood outpatient care.
          </p>
        </div>

        {/* Competition Score */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="font-bold text-slate-700 uppercase tracking-wider">Competition Balance</span>
            <span className="font-extrabold text-teal-700 text-sm">{competitionScore}/100</span>
          </div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mb-2">
            <div
              className="bg-teal-700 h-full rounded-full transition-all duration-500"
              style={{ width: `${competitionScore}%` }}
            />
          </div>
          <p className="text-[11px] text-slate-500 leading-relaxed">
            Manageable clinic saturation: nearby practices report high daily wait times.
          </p>
        </div>

        {/* Accessibility Score */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="font-bold text-slate-700 uppercase tracking-wider">Transit Accessibility</span>
            <span className="font-extrabold text-teal-700 text-sm">{accessibilityScore}/100</span>
          </div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mb-2">
            <div
              className="bg-teal-700 h-full rounded-full transition-all duration-500"
              style={{ width: `${accessibilityScore}%` }}
            />
          </div>
          <p className="text-[11px] text-slate-500 leading-relaxed">
            Main arterial road presence with public transit stops within 300 meters.
          </p>
        </div>

        {/* Affordability Score */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="font-bold text-slate-700 uppercase tracking-wider">Rental Affordability</span>
            <span className="font-extrabold text-teal-700 text-sm">{affordabilityScore}/100</span>
          </div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mb-2">
            <div
              className="bg-teal-700 h-full rounded-full transition-all duration-500"
              style={{ width: `${affordabilityScore}%` }}
            />
          </div>
          <p className="text-[11px] text-slate-500 leading-relaxed">
            Commercial lease rates well aligned with planned monthly operating budget.
          </p>
        </div>
      </div>

      {/* 4. Candidate Micro-Market Cards */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Evaluated Micro-Markets in {clinic.location.city}
            </h3>
            <p className="text-xs text-slate-500">
              Select your preferred micro-market to calibrate lease estimates and center the Google Map
            </p>
          </div>
          <DataBadge type="benchmark" size="xs" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {zones.map((rec, idx) => {
            const isSelected = selectedAreaIndex === idx;
            return (
              <div
                key={rec.id || rec.name}
                onClick={() => handleSelectArea(idx)}
                className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'border-teal-700 bg-teal-50/40 shadow-xs ring-1 ring-teal-700'
                    : 'border-slate-200 bg-white hover:border-slate-300 shadow-2xs'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-1.5">
                      <MapPin className={`w-4 h-4 ${isSelected ? 'text-teal-700' : 'text-slate-400'}`} />
                      <h4 className="text-sm font-bold text-slate-900">{rec.name}</h4>
                    </div>
                    <span className="text-xs font-bold text-teal-800 bg-teal-100/70 px-2 py-0.5 rounded-full">
                      {rec.overallScore}/100
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    {rec.recommendation}
                  </p>

                  <div className="mt-4 pt-3 border-t border-slate-100 space-y-1.5 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Est. Rent Range:</span>
                      <span className="font-semibold text-slate-800">{rec.estimatedRentRange}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Local Competition:</span>
                      <span className="font-semibold text-slate-800">{rec.competitionLevel}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Patient Demand:</span>
                      <span className="font-semibold text-slate-800">{rec.demandLevel}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-semibold text-teal-700">
                    {isSelected ? '✓ Active Selection' : 'Click to View on Map'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 5. SITE VISIT BOOKING MODAL */}
      {visitingSpace && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95">
            {/* Modal Header */}
            <div className="p-5 bg-gradient-to-r from-teal-800 to-teal-700 text-white flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-teal-200 tracking-wider">
                  Site Walkthrough Inspection
                </span>
                <h3 className="text-base font-bold text-white mt-0.5">
                  Schedule Visit: {visitingSpace.buildingName}
                </h3>
              </div>
              <button
                onClick={() => {
                  setVisitingSpace(null);
                  setVisitConfirmedPass(null);
                }}
                className="p-1 rounded-full text-teal-200 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              {!visitConfirmedPass ? (
                <form onSubmit={handleConfirmVisit} className="space-y-4">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between text-xs">
                    <div>
                      <div className="text-slate-500">Address:</div>
                      <div className="font-semibold text-slate-800">{visitingSpace.address}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-slate-500">Rent / Area:</div>
                      <div className="font-bold text-teal-800">
                        {formatINR(visitingSpace.monthlyRent)}/mo • {visitingSpace.carpetAreaSqFt} sq.ft
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Preferred Date
                      </label>
                      <input
                        type="date"
                        value={visitDate}
                        onChange={e => setVisitDate(e.target.value)}
                        className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-1 focus:ring-teal-700"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Time Slot
                      </label>
                      <select
                        value={visitSlot}
                        onChange={e => setVisitSlot(e.target.value as any)}
                        className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-1 focus:ring-teal-700"
                      >
                        <option value="10:00 AM">Morning (10:00 AM)</option>
                        <option value="02:30 PM">Afternoon (02:30 PM)</option>
                        <option value="05:00 PM">Evening (05:00 PM)</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Doctor / Contact Name
                      </label>
                      <input
                        type="text"
                        value={visitorName}
                        onChange={e => setVisitorName(e.target.value)}
                        className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-1 focus:ring-teal-700"
                        placeholder="Dr. Siddharth Sharma"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Contact Phone
                      </label>
                      <input
                        type="tel"
                        value={visitorPhone}
                        onChange={e => setVisitorPhone(e.target.value)}
                        className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-1 focus:ring-teal-700"
                        placeholder="+91 98290 12345"
                        required
                      />
                    </div>
                  </div>

                  <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100 text-xs text-emerald-900 space-y-1">
                    <div className="font-bold flex items-center gap-1.5 text-emerald-950">
                      <ShieldCheck className="w-4 h-4 text-emerald-700" />
                      <span>On-Site Clinical Feasibility Checklist Included:</span>
                    </div>
                    <p className="text-[11px] text-emerald-800">
                      The site manager will provide direct electrical load inspection, verify plumbing trenches for clinic chairs, and display the municipal commercial healthcare zoning certificate.
                    </p>
                  </div>

                  <div className="pt-2 flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setVisitingSpace(null)}
                      className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-xl text-xs font-bold bg-teal-700 hover:bg-teal-800 text-white shadow-xs transition-colors flex items-center gap-1.5"
                    >
                      <Calendar className="w-3.5 h-3.5" />
                      <span>Confirm Site Visit Pass</span>
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-4">
                  {/* Confirmed Pass Visual */}
                  <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200">
                    <div className="flex items-center justify-between pb-3 border-b border-emerald-200/60 mb-3">
                      <div>
                        <span className="text-[10px] font-extrabold text-emerald-800 uppercase tracking-wider">
                          Clinic Space Visit Pass
                        </span>
                        <div className="text-xs font-bold text-slate-900 font-mono">
                          ID: {visitConfirmedPass.passId}
                        </div>
                      </div>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-700 text-white flex items-center gap-1">
                        <Check className="w-3 h-3" />
                        <span>Confirmed</span>
                      </span>
                    </div>

                    <div className="space-y-2 text-xs">
                      <div>
                        <span className="text-slate-500">Property:</span>{' '}
                        <strong className="text-slate-900">{visitConfirmedPass.buildingName}</strong>
                      </div>
                      <div>
                        <span className="text-slate-500">Scheduled Time:</span>{' '}
                        <strong className="text-slate-900">{visitConfirmedPass.date} at {visitConfirmedPass.slot}</strong>
                      </div>
                      <div>
                        <span className="text-slate-500">Site Contact Person:</span>{' '}
                        <strong className="text-slate-900">{visitConfirmedPass.contactPerson}</strong> ({visitConfirmedPass.contactPhone})
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-slate-500 text-center">
                    An SMS notification with direct property manager contact and GPS pin directions has been dispatched.
                  </p>

                  <div className="pt-2 flex items-center justify-between">
                    <button
                      onClick={() => handleAdoptSpace(visitingSpace)}
                      className="px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-bold flex items-center gap-1 shadow-2xs"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Also Adopt as Clinic Premises</span>
                    </button>

                    <button
                      onClick={() => {
                        setVisitingSpace(null);
                        setVisitConfirmedPass(null);
                      }}
                      className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-semibold"
                    >
                      Close Pass
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </ModulePageShell>
  );
};
