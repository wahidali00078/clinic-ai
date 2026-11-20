import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import {
  APIProvider,
  Map,
  AdvancedMarker,
  Pin,
  InfoWindow,
  useMap,
} from '@vis.gl/react-google-maps';
import {
  MapPin,
  Navigation,
  Layers,
  Search,
  Crosshair,
  Building2,
  Stethoscope,
  Pill,
  Activity,
  Check,
  Maximize2,
  Minimize2,
  Info,
  ShieldCheck,
  Calendar,
  Phone,
  ArrowRight,
  Sparkles,
  Eye,
  CheckCircle2,
  Compass,
  ChevronDown,
  X,
} from 'lucide-react';
import { useClinic } from '../../context/ClinicContext';
import { LocationZone, AvailableClinicSpace } from '../../types';
import { getCoordinatesForCity, resolveLocationCoordinates } from '../../utils/clinicDefaults';
import { getAvailableSpacesForLocation } from '../../utils/spacesData';
import { formatINR } from '../../utils/formatters';
import {
  INDIA_STATES_DATA,
  getAllStates,
  getCitiesForState,
  findCityDetails,
  getAllCities,
  CityInfo,
} from '../../utils/indiaGeography';

// Google Maps API Key provisioned via Maps Demo Service
const FALLBACK_KEY = 'AIzaSyB54DExQ_EtrivuIxlCsyJX2x3w3p2F8ys';

interface NearbyFacility {
  id: string;
  name: string;
  type: 'pharmacy' | 'diagnostic' | 'hospital' | 'transit';
  lat: number;
  lng: number;
  distance: string;
}

export interface RealClinicLocationMapProps {
  height?: string;
  showMicroMarkets?: boolean;
  showAvailableSpaces?: boolean;
  allowPinRelocation?: boolean;
  className?: string;
  onZoneSelected?: (zone: LocationZone) => void;
  onSpaceSelected?: (space: AvailableClinicSpace) => void;
  focusedSpaceId?: string | null;
  onBookSiteVisit?: (space: AvailableClinicSpace) => void;
}

/**
 * Inner Map Controller
 * Allows smooth programmatic panning/zooming without locking the map's camera,
 * ensuring the user can freely drag, pan, and zoom without rubber-banding.
 */
const MapCameraController: React.FC<{
  targetLocation: { lat: number; lng: number } | null;
  targetZoom?: number | null;
  trigger: number;
}> = ({ targetLocation, targetZoom, trigger }) => {
  const map = useMap();

  useEffect(() => {
    if (!map || !targetLocation || trigger === 0) return;
    map.panTo(targetLocation);
    if (targetZoom) {
      map.setZoom(targetZoom);
    }
  }, [map, trigger, targetLocation, targetZoom]);

  return null;
};

export const RealClinicLocationMap: React.FC<RealClinicLocationMapProps> = ({
  height = '480px',
  showMicroMarkets = true,
  showAvailableSpaces = true,
  allowPinRelocation = true,
  className = '',
  onZoneSelected,
  onSpaceSelected,
  focusedSpaceId = null,
  onBookSiteVisit,
}) => {
  const { clinic, locationAnalysis, updateClinic, addToast } = useClinic();

  const [apiKey, setApiKey] = useState<string>(() => {
    return (
      (import.meta as any).env?.VITE_GOOGLE_MAPS_API_KEY ||
      (typeof window !== 'undefined' && (window as any).VITE_GOOGLE_MAPS_API_KEY) ||
      FALLBACK_KEY
    );
  });

  // Fetch fresh Maps API key dynamically from server or env
  useEffect(() => {
    fetch('/api/config/maps')
      .then(res => res.json())
      .then(data => {
        if (data.apiKey) {
          setApiKey(data.apiKey);
        }
      })
      .catch(() => {
        setApiKey(FALLBACK_KEY);
      });
  }, []);

  // Determine current active coordinates
  const currentCoords = useMemo<{ lat: number; lng: number }>(() => {
    if (clinic.location.latitude && clinic.location.longitude) {
      return {
        lat: clinic.location.latitude,
        lng: clinic.location.longitude,
      };
    }
    return getCoordinatesForCity(clinic.location.city);
  }, [clinic.location.latitude, clinic.location.longitude, clinic.location.city]);

  // Active State & Auto-Cities State Management
  const [selectedState, setSelectedState] = useState<string>(() => {
    const details = findCityDetails(clinic.location.city);
    return details?.state.name || clinic.location.state || 'Rajasthan';
  });

  // Whenever clinic.location.city changes externally, auto-sync the state
  useEffect(() => {
    const details = findCityDetails(clinic.location.city);
    if (details && details.state.name !== selectedState) {
      setSelectedState(details.state.name);
    }
  }, [clinic.location.city]);

  // Cities belonging to the currently selected state
  const citiesInSelectedState = useMemo<CityInfo[]>(() => {
    const list = getCitiesForState(selectedState);
    if (list.length > 0) return list;
    // Fallback: search in all states
    return getCitiesForState('Rajasthan');
  }, [selectedState]);

  // Programmatic camera triggers
  const [cameraTarget, setCameraTarget] = useState<{ lat: number; lng: number } | null>(currentCoords);
  const [cameraZoom, setCameraZoom] = useState<number | null>(14);
  const [cameraTrigger, setCameraTrigger] = useState<number>(1);
  const [isSearching, setIsSearching] = useState(false);

  // Synchronize camera when clinic coordinates change (e.g. from Profile view, city switcher, search, or wizard)
  const prevCoordsRef = useRef<{ lat: number; lng: number }>({ lat: currentCoords.lat, lng: currentCoords.lng });
  useEffect(() => {
    const latDiff = Math.abs(prevCoordsRef.current.lat - currentCoords.lat);
    const lngDiff = Math.abs(prevCoordsRef.current.lng - currentCoords.lng);
    if (latDiff > 0.0001 || lngDiff > 0.0001) {
      prevCoordsRef.current = { lat: currentCoords.lat, lng: currentCoords.lng };
      setCameraTarget(currentCoords);
      setCameraZoom(14);
      setCameraTrigger(prev => prev + 1);
      // Close open InfoWindow so the map is unobstructed after choosing
      setSelectedMarker(null);
    }
  }, [currentCoords.lat, currentCoords.lng]);

  // Map layer settings
  const [mapType, setMapType] = useState<'roadmap' | 'satellite' | 'hybrid'>('roadmap');
  const [showHealthcareLayer, setShowHealthcareLayer] = useState(true);
  const [showSpacesLayer, setShowSpacesLayer] = useState(showAvailableSpaces);
  const [showCityMarkers, setShowCityMarkers] = useState(true); // City name markers on map
  const [isLocationSelectorOpen, setIsLocationSelectorOpen] = useState(false); // Collapsed by default so user can see proper map!
  const [searchQuery, setSearchQuery] = useState('');
  const [isRelocatingPin, setIsRelocatingPin] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // InfoWindow state
  const [selectedMarker, setSelectedMarker] = useState<{
    type: 'clinic' | 'zone' | 'facility' | 'space' | 'city';
    data: any;
    position: { lat: number; lng: number };
  } | null>(null);

  // Available commercial / medical spaces for lease in this area
  const availableSpaces = useMemo<AvailableClinicSpace[]>(() => {
    return getAvailableSpacesForLocation(
      clinic.location.city,
      clinic.location.area,
      currentCoords.lat,
      currentCoords.lng
    );
  }, [clinic.location.city, clinic.location.area, currentCoords.lat, currentCoords.lng]);

  // Synchronize when focusedSpaceId changes externally from parent card list
  useEffect(() => {
    if (focusedSpaceId) {
      const target = availableSpaces.find(s => s.id === focusedSpaceId);
      if (target) {
        setCameraTarget({ lat: target.lat, lng: target.lng });
        setCameraZoom(16);
        setCameraTrigger(prev => prev + 1);
        setSelectedMarker({
          type: 'space',
          data: target,
          position: { lat: target.lat, lng: target.lng },
        });
      }
    }
  }, [focusedSpaceId, availableSpaces]);

  // Healthcare facilities surrounding the clinic coordinates
  const nearbyFacilities = useMemo<NearbyFacility[]>(() => {
    const lat = currentCoords.lat;
    const lng = currentCoords.lng;
    return [
      {
        id: 'fac-1',
        name: 'Apollo 24|7 Pharmacy & Health Store',
        type: 'pharmacy',
        lat: lat + 0.0021,
        lng: lng + 0.0018,
        distance: '240m away',
      },
      {
        id: 'fac-2',
        name: 'Dr. Lal PathLabs Blood Collection Center',
        type: 'diagnostic',
        lat: lat - 0.0019,
        lng: lng + 0.0025,
        distance: '310m away',
      },
      {
        id: 'fac-3',
        name: 'MedPlus Discount Chemist',
        type: 'pharmacy',
        lat: lat + 0.0035,
        lng: lng - 0.0022,
        distance: '480m away',
      },
      {
        id: 'fac-4',
        name: `${clinic.location.city} District Care & Nursing`,
        type: 'hospital',
        lat: lat - 0.0042,
        lng: lng - 0.0038,
        distance: '750m away',
      },
      {
        id: 'fac-5',
        name: `${clinic.location.area} Metro & Transit Hub`,
        type: 'transit',
        lat: lat + 0.0048,
        lng: lng + 0.0031,
        distance: '620m away',
      },
    ];
  }, [currentCoords, clinic.location.city, clinic.location.area]);

  // Apply location updates across camera & clinic context
  const applyLocationUpdate = useCallback(
    (targetLat: number, targetLng: number, city: string, area: string, state?: string, preferredLocation?: string) => {
      setCameraTarget({ lat: targetLat, lng: targetLng });
      setCameraZoom(14);
      setCameraTrigger(prev => prev + 1);

      updateClinic({
        location: {
          ...clinic.location,
          city,
          area,
          state: state || clinic.location.state,
          preferredLocation: preferredLocation || `${area}, ${city}`,
          latitude: targetLat,
          longitude: targetLng,
        },
      });

      // Close any open InfoWindows so the user can see the full, proper map!
      setSelectedMarker(null);
    },
    [clinic, updateClinic]
  );

  // Handle State Change: auto-shows all cities in this state and centers on capital/first city
  const handleStateChange = (newState: string) => {
    setSelectedState(newState);
    const stateCities = getCitiesForState(newState);
    if (stateCities.length > 0) {
      const firstCity = stateCities[0];
      const area = firstCity.popularAreas?.[0] || 'Central Hub';
      applyLocationUpdate(firstCity.lat, firstCity.lng, firstCity.name, area, newState);
      addToast(`Selected ${newState}. Displaying all ${stateCities.length} cities on map.`, 'info');
    }
  };

  // Handle City Select: auto-detects state, closes selector bar to see map, and centers map
  const handleCitySelect = (cityName: string) => {
    // Close the state and city selector immediately so user can see proper map
    setIsLocationSelectorOpen(false);

    const details = findCityDetails(cityName);
    if (details) {
      if (details.state.name !== selectedState) {
        setSelectedState(details.state.name);
      }
      const area = details.city.popularAreas?.[0] || 'Central Hub';
      applyLocationUpdate(details.city.lat, details.city.lng, details.city.name, area, details.state.name);
      addToast(
        `Centered on ${details.city.name}, ${details.state.name}. Map view updated.`,
        'success'
      );
    } else {
      // Fallback
      const resolved = resolveLocationCoordinates(cityName, cityName);
      applyLocationUpdate(resolved.lat, resolved.lng, resolved.city, resolved.area, resolved.state);
      addToast(`Centered map on ${resolved.city}`, 'info');
    }
  };

  // Handle Map Click to Reposition Clinic Pin
  const handleMapClick = useCallback(
    (e: any) => {
      if (!allowPinRelocation && !isRelocatingPin) return;

      const latLng = e.detail?.latLng;
      if (latLng) {
        const newLat = Number(latLng.lat.toFixed(6));
        const newLng = Number(latLng.lng.toFixed(6));

        applyLocationUpdate(newLat, newLng, clinic.location.city, clinic.location.area, clinic.location.state);
        setIsRelocatingPin(false);
        addToast(`Clinic pin updated to ${newLat}° N, ${newLng}° E`, 'success');
      }
    },
    [allowPinRelocation, isRelocatingPin, clinic.location, applyLocationUpdate, addToast]
  );

  // Address search submit with Google Maps Geocoder support
  const handleSearchSubmit = async (e?: React.FormEvent | React.KeyboardEvent | React.MouseEvent) => {
    if (e) e.preventDefault();
    const query = searchQuery.trim();
    if (!query) return;

    setIsSearching(true);

    // 1. Check if the query matches a city directly
    const directCity = findCityDetails(query);
    if (directCity) {
      handleCitySelect(directCity.city.name);
      setIsSearching(false);
      return;
    }

    // 2. Try real Google Maps Geocoder if loaded in window
    if (typeof window !== 'undefined' && (window as any).google?.maps?.Geocoder) {
      try {
        const geocoder = new (window as any).google.maps.Geocoder();
        const request = {
          address: query,
          componentRestrictions: { country: 'in' },
        };

        geocoder.geocode(request, (results: any[], status: string) => {
          setIsSearching(false);
          if (status === 'OK' && results && results[0]) {
            const result = results[0];
            const loc = result.geometry.location;
            const newLat = Number(loc.lat().toFixed(6));
            const newLng = Number(loc.lng().toFixed(6));

            let resolvedCity = clinic.location.city;
            let resolvedState = clinic.location.state;
            let resolvedArea = query;

            for (const comp of result.address_components || []) {
              if (comp.types.includes('locality')) {
                resolvedCity = comp.long_name;
              } else if (comp.types.includes('administrative_area_level_1')) {
                resolvedState = comp.long_name;
              } else if (comp.types.includes('sublocality') || comp.types.includes('neighborhood')) {
                resolvedArea = comp.long_name;
              }
            }

            // Sync state if matched
            const cityInfo = findCityDetails(resolvedCity);
            if (cityInfo) {
              setSelectedState(cityInfo.state.name);
            }

            applyLocationUpdate(newLat, newLng, resolvedCity, resolvedArea, resolvedState, result.formatted_address);
            addToast(`Location resolved: ${result.formatted_address}`, 'success');
          } else {
            fallbackSearch(query);
          }
        });
        return;
      } catch (err) {
        console.warn('Geocoder error, falling back to dictionary lookup:', err);
      }
    }

    // 3. Fallback dictionary search
    fallbackSearch(query);
    setIsSearching(false);
  };

  const fallbackSearch = useCallback(
    (query: string) => {
      const resolved = resolveLocationCoordinates(query, clinic.location.city);
      const details = findCityDetails(resolved.city);
      if (details) {
        setSelectedState(details.state.name);
      }
      applyLocationUpdate(resolved.lat, resolved.lng, resolved.city, resolved.area, resolved.state, query);
      addToast(`Centered map on ${resolved.city} (${resolved.area})`, 'success');
    },
    [clinic.location.city, applyLocationUpdate, addToast]
  );

  const handleZoneClick = (zone: LocationZone) => {
    if (onZoneSelected) onZoneSelected(zone);
    setSelectedMarker({
      type: 'zone',
      data: zone,
      position: { lat: zone.lat || currentCoords.lat, lng: zone.lng || currentCoords.lng },
    });
  };

  const handleSpaceClick = (space: AvailableClinicSpace) => {
    if (onSpaceSelected) onSpaceSelected(space);
    setSelectedMarker({
      type: 'space',
      data: space,
      position: { lat: space.lat, lng: space.lng },
    });
  };

  const handleCityMarkerClick = (cityItem: CityInfo) => {
    setSelectedMarker({
      type: 'city',
      data: cityItem,
      position: { lat: cityItem.lat, lng: cityItem.lng },
    });
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

    setCameraTarget({ lat: space.lat, lng: space.lng });
    setCameraTrigger(prev => prev + 1);
    setSelectedMarker(null);
    addToast(
      `Clinic premises set to ${space.buildingName} (${formatINR(space.monthlyRent)}/mo, ${space.carpetAreaSqFt} sq.ft)`,
      'success'
    );
  };

  const allStatesList = useMemo(() => getAllStates(), []);

  return (
    <div
      className={`relative rounded-2xl overflow-hidden border border-slate-200 shadow-2xs bg-slate-900 ${
        isFullscreen ? 'fixed inset-4 z-50 h-[calc(100vh-2rem)] shadow-2xl' : ''
      } ${className}`}
      style={{ height: isFullscreen ? 'calc(100vh - 2rem)' : height }}
    >
      {/* Top Floating Control Bar */}
      <div className="absolute top-2.5 left-2.5 right-2.5 z-10 flex flex-col gap-2 pointer-events-none">
        {/* Row 1: Search & Controls */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          {/* Search Bar (Uses div instead of form to prevent nested form errors when embedded) */}
          <div
            className="pointer-events-auto flex items-center bg-white/95 backdrop-blur-md rounded-xl shadow-md border border-slate-200/80 px-2.5 py-1.5 w-full sm:w-72"
          >
            {isSearching ? (
              <div className="w-3.5 h-3.5 border-2 border-teal-700 border-t-transparent rounded-full animate-spin mr-2 shrink-0" />
            ) : (
              <Search className="w-3.5 h-3.5 text-slate-400 mr-2 shrink-0" />
            )}
            <input
              type="text"
              placeholder="Search address, neighborhood or city..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleSearchSubmit();
                }
              }}
              className="w-full text-xs text-slate-800 placeholder-slate-400 bg-transparent focus:outline-none"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="text-slate-400 hover:text-slate-600 text-xs px-1 font-bold cursor-pointer"
              >
                ×
              </button>
            )}
            <button
              type="button"
              onClick={() => handleSearchSubmit()}
              disabled={isSearching}
              className="bg-teal-700 hover:bg-teal-800 text-white text-[11px] font-bold px-2 py-0.5 rounded-lg ml-1 shrink-0 cursor-pointer disabled:opacity-60"
            >
              Locate
            </button>
          </div>

          {/* Action Pills */}
          <div className="pointer-events-auto flex flex-wrap items-center gap-1.5 bg-white/95 backdrop-blur-md p-1 rounded-xl shadow-md border border-slate-200/80 text-xs">
            {/* State & City Location Selector Toggle (Click to open/close) */}
            <button
              onClick={() => setIsLocationSelectorOpen(prev => !prev)}
              className={`px-2 py-1 rounded-lg font-bold text-[11px] flex items-center gap-1.5 transition-colors cursor-pointer ${
                isLocationSelectorOpen
                  ? 'bg-teal-700 text-white shadow-xs'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
              title="Open or close State & City location selector"
            >
              <Compass className="w-3.5 h-3.5 text-teal-600" />
              <span>{clinic.location.city}, {clinic.location.state || selectedState}</span>
              <span
                className={`text-[9px] px-1.5 py-0.2 rounded-full font-bold ${
                  isLocationSelectorOpen ? 'bg-teal-900 text-teal-100' : 'bg-slate-200 text-slate-700'
                }`}
              >
                {isLocationSelectorOpen ? '✕ Close' : '▾ Change'}
              </span>
            </button>

            {/* City Markers on Map Toggle */}
            <button
              onClick={() => setShowCityMarkers(prev => !prev)}
              className={`px-2 py-1 rounded-lg font-bold text-[11px] flex items-center gap-1 transition-colors ${
                showCityMarkers
                  ? 'bg-teal-700 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
              title="Show City Name Markers directly on the map"
            >
              <MapPin className="w-3 h-3" />
              <span>City Pins</span>
              <span
                className={`text-[9px] px-1 py-0.2 rounded-full font-bold ${
                  showCityMarkers ? 'bg-teal-900 text-teal-100' : 'bg-slate-200 text-slate-700'
                }`}
              >
                {citiesInSelectedState.length}
              </span>
            </button>

            {/* Available Spaces Layer Toggle */}
            <button
              onClick={() => setShowSpacesLayer(prev => !prev)}
              className={`px-2 py-1 rounded-lg font-bold text-[11px] flex items-center gap-1.5 transition-colors ${
                showSpacesLayer
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
              title="Toggle Available Commercial & Medical Spaces"
            >
              <Building2 className="w-3 h-3" />
              <span>Spaces</span>
              <span
                className={`text-[9px] px-1.5 py-0.2 rounded-full font-extrabold ${
                  showSpacesLayer ? 'bg-emerald-800 text-emerald-100' : 'bg-slate-200 text-slate-700'
                }`}
              >
                {availableSpaces.length}
              </span>
            </button>

            {/* Map Type Toggle */}
            <button
              onClick={() => setMapType(prev => (prev === 'roadmap' ? 'hybrid' : 'roadmap'))}
              className={`px-2 py-1 rounded-lg font-semibold text-[11px] flex items-center gap-1 transition-colors ${
                mapType === 'hybrid'
                  ? 'bg-teal-700 text-white'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
              title="Toggle Satellite / Roadmap view"
            >
              <Layers className="w-3 h-3" />
              <span>{mapType === 'hybrid' ? 'Satellite' : 'Roadmap'}</span>
            </button>

            {/* Relocate Pin Trigger */}
            {allowPinRelocation && (
              <button
                onClick={() => {
                  setIsRelocatingPin(prev => !prev);
                  if (!isRelocatingPin) {
                    addToast('Click anywhere on the map to place your clinic pin', 'info');
                  }
                }}
                className={`px-2 py-1 rounded-lg font-semibold text-[11px] flex items-center gap-1 transition-all ${
                  isRelocatingPin
                    ? 'bg-amber-600 text-white animate-pulse shadow-xs'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
                title="Click anywhere on the map to relocate the clinic"
              >
                <Crosshair className="w-3 h-3" />
                <span>{isRelocatingPin ? 'Click Map' : 'Relocate'}</span>
              </button>
            )}

            {/* Recenter button */}
            <button
              onClick={() => {
                setCameraTarget(currentCoords);
                setCameraZoom(14);
                setCameraTrigger(prev => prev + 1);
                addToast('Map centered to clinic coordinates', 'info');
              }}
              className="p-1.5 text-slate-600 hover:text-teal-700 hover:bg-slate-100 rounded-lg transition-colors"
              title="Recenter to planned clinic location"
            >
              <Navigation className="w-3.5 h-3.5" />
            </button>

            {/* Fullscreen Toggle */}
            <button
              onClick={() => setIsFullscreen(prev => !prev)}
              className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
              title={isFullscreen ? 'Exit Fullscreen' : 'Expand Fullscreen'}
            >
              {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Row 2: STATE & AUTO-SHOW CITIES SELECTOR BAR (Collapsible / Closable - Closes so user can see proper map) */}
        {isLocationSelectorOpen && (
          <div className="pointer-events-auto flex flex-wrap items-center gap-2 bg-white/95 backdrop-blur-md p-1.5 px-2.5 rounded-xl shadow-lg border border-teal-200 text-xs animate-in fade-in slide-in-from-top-1">
            {/* Linked State Selector */}
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider flex items-center gap-1 shrink-0">
                <Compass className="w-3 h-3 text-teal-700" />
                <span>State:</span>
              </span>
              <select
                value={selectedState}
                onChange={e => handleStateChange(e.target.value)}
                className="bg-slate-100 hover:bg-slate-200 text-slate-900 font-bold text-xs py-1 px-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-teal-700 cursor-pointer"
              >
                {allStatesList.map(st => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
            </div>

            {/* Linked City Selector (Auto populated with cities in selected state) */}
            <div className="flex items-center gap-1.5 border-l border-slate-200 pl-2">
              <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider flex items-center gap-1 shrink-0">
                <MapPin className="w-3 h-3 text-teal-700" />
                <span>City:</span>
              </span>
              <select
                value={clinic.location.city}
                onChange={e => {
                  handleCitySelect(e.target.value);
                  setIsLocationSelectorOpen(false);
                }}
                className="bg-teal-50 hover:bg-teal-100 text-teal-900 font-bold text-xs py-1 px-2 rounded-lg border border-teal-300 focus:outline-none focus:ring-1 focus:ring-teal-700 cursor-pointer max-w-[140px]"
              >
                <optgroup label={`${selectedState} Cities`}>
                  {citiesInSelectedState.map(ct => (
                    <option key={ct.name} value={ct.name}>
                      {ct.name} {ct.demand === 'Very High' ? '★' : ''}
                    </option>
                  ))}
                </optgroup>
                <optgroup label="Other Metros">
                  {getAllCities()
                    .filter(c => c.state !== selectedState && c.tier === 1)
                    .map(c => (
                      <option key={c.name} value={c.name}>
                        {c.name} ({c.state})
                      </option>
                    ))}
                </optgroup>
              </select>
            </div>

            {/* Quick Cities Pill Strip for Selected State */}
            <div className="flex items-center gap-1 overflow-x-auto py-0.5 border-l border-slate-200 pl-2 max-w-full sm:max-w-md scrollbar-none">
              <span className="text-[10px] font-semibold text-slate-400 whitespace-nowrap shrink-0">
                All {selectedState} Cities:
              </span>
              {citiesInSelectedState.map(ct => {
                const isActive =
                  clinic.location.city.toLowerCase() === ct.name.toLowerCase() ||
                  clinic.location.city.toLowerCase().includes(ct.name.toLowerCase());
                return (
                  <button
                    key={ct.name}
                    type="button"
                    onClick={() => {
                      handleCitySelect(ct.name);
                      setIsLocationSelectorOpen(false);
                    }}
                    className={`px-2 py-0.5 rounded-lg text-[11px] font-medium whitespace-nowrap transition-all shrink-0 cursor-pointer ${
                      isActive
                        ? 'bg-teal-700 text-white font-bold shadow-2xs'
                        : 'bg-slate-100 text-slate-700 hover:bg-teal-50 hover:text-teal-800 hover:border-teal-200 border border-slate-200'
                    }`}
                    title={`${ct.name} (${ct.demand} healthcare demand)`}
                  >
                    {isActive ? `★ ${ct.name}` : ct.name}
                  </button>
                );
              })}
            </div>

            {/* Explicit Close Button to see proper map */}
            <button
              type="button"
              onClick={() => setIsLocationSelectorOpen(false)}
              className="ml-auto px-2 py-1 text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg text-xs font-bold flex items-center gap-1 shrink-0 transition-colors cursor-pointer border border-slate-200"
              title="Close to see proper map"
            >
              <X className="w-3.5 h-3.5 text-slate-600" />
              <span>Close</span>
            </button>
          </div>
        )}
      </div>

      {/* Relocation Guidance Banner */}
      {isRelocatingPin && (
        <div className="absolute top-28 left-1/2 -translate-x-1/2 z-20 bg-amber-500 text-slate-950 px-3.5 py-1.5 rounded-full shadow-lg font-bold text-xs flex items-center gap-2 border border-amber-600 animate-in fade-in slide-in-from-top-2">
          <Crosshair className="w-3.5 h-3.5 animate-spin" />
          <span>Click anywhere on the map to pinpoint your clinic premises</span>
          <button
            onClick={() => setIsRelocatingPin(false)}
            className="text-[10px] bg-black/20 hover:bg-black/30 text-white px-2 py-0.5 rounded-full ml-1"
          >
            Cancel
          </button>
        </div>
      )}

      {/* Real Google Map Container */}
      <APIProvider apiKey={apiKey} libraries={['marker', 'places']}>
        <Map
          mapId="DEMO_MAP_ID"
          defaultCenter={currentCoords}
          defaultZoom={14}
          mapTypeId={mapType}
          gestureHandling="greedy"
          disableDefaultUI={false}
          scrollwheel={true}
          draggable={true}
          clickableIcons={true}
          onClick={handleMapClick}
          internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
          style={{ width: '100%', height: '100%' }}
        >
          <MapCameraController
            targetLocation={cameraTarget}
            targetZoom={cameraZoom}
            trigger={cameraTrigger}
          />

          {/* 1. CLINIC MAIN PINPOINT */}
          <AdvancedMarker
            position={currentCoords}
            onClick={() =>
              setSelectedMarker({
                type: 'clinic',
                data: clinic,
                position: currentCoords,
              })
            }
            title={`${clinic.name} (${clinic.clinicType})`}
          >
            <div className="relative group cursor-pointer animate-in zoom-in-50 duration-300">
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-teal-400 rounded-full animate-ping opacity-75" />
              <div className="bg-gradient-to-tr from-teal-800 to-teal-600 text-white p-2.5 rounded-2xl shadow-xl border-2 border-white flex items-center justify-center transform transition-transform group-hover:scale-110">
                <Stethoscope className="w-5 h-5" />
              </div>
              <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-teal-800 rotate-45" />
            </div>
          </AdvancedMarker>

          {/* 2. CITY NAME MARKERS ON MAP (Visible city name locations across selected state) */}
          {showCityMarkers &&
            citiesInSelectedState.map(cityItem => {
              const isCurrentCity =
                clinic.location.city.toLowerCase() === cityItem.name.toLowerCase() ||
                clinic.location.city.toLowerCase().includes(cityItem.name.toLowerCase());
              return (
                <AdvancedMarker
                  key={cityItem.name}
                  position={{ lat: cityItem.lat, lng: cityItem.lng }}
                  onClick={() => handleCityMarkerClick(cityItem)}
                  title={`${cityItem.name}, ${cityItem.state} (Click to inspect or set location)`}
                >
                  <div
                    className={`cursor-pointer transition-all duration-200 hover:scale-110 flex items-center gap-1.5 px-2.5 py-1 rounded-full shadow-md border ${
                      isCurrentCity
                        ? 'bg-teal-700 text-white border-white font-extrabold ring-2 ring-teal-400/80 shadow-teal-700/50 scale-105'
                        : 'bg-white/95 text-slate-800 border-slate-300 font-bold hover:bg-teal-50 hover:border-teal-400'
                    }`}
                  >
                    <MapPin
                      className={`w-3.5 h-3.5 ${isCurrentCity ? 'text-teal-200' : 'text-teal-600'}`}
                    />
                    <span className="text-xs whitespace-nowrap">{cityItem.name}</span>
                    {cityItem.demand === 'Very High' && (
                      <span
                        className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"
                        title="Very High Healthcare Demand"
                      />
                    )}
                  </div>
                </AdvancedMarker>
              );
            })}

          {/* 3. AVAILABLE COMMERCIAL SPACES FOR RENT (GREEN PINPOINTS) */}
          {showSpacesLayer &&
            availableSpaces.map(space => {
              const isSelected = focusedSpaceId === space.id;
              return (
                <AdvancedMarker
                  key={space.id}
                  position={{ lat: space.lat, lng: space.lng }}
                  onClick={() => handleSpaceClick(space)}
                  title={`${space.title} - ${formatINR(space.monthlyRent)}/mo`}
                >
                  <div className="relative group cursor-pointer transition-transform duration-200 hover:scale-110">
                    {isSelected && (
                      <div className="absolute -inset-1.5 rounded-full bg-emerald-400/40 animate-ping" />
                    )}
                    <div
                      className={`flex items-center gap-1 px-2 py-1 rounded-xl shadow-lg border-2 text-white font-bold text-[11px] whitespace-nowrap ${
                        isSelected
                          ? 'bg-emerald-800 border-amber-300 scale-110 shadow-emerald-500/50'
                          : 'bg-emerald-700 border-white hover:bg-emerald-800'
                      }`}
                    >
                      <Building2 className="w-3.5 h-3.5 shrink-0" />
                      <span>{formatINR(space.monthlyRent, { compact: true })}/mo</span>
                    </div>
                    <div className="w-2 h-2 bg-emerald-700 rotate-45 mx-auto -mt-1" />
                  </div>
                </AdvancedMarker>
              );
            })}

          {/* 4. MICRO-MARKET CATCHMENT ZONES */}
          {showMicroMarkets &&
            locationAnalysis?.zones?.map(zone => {
              if (!zone.lat || !zone.lng) return null;
              return (
                <AdvancedMarker
                  key={zone.id}
                  position={{ lat: zone.lat, lng: zone.lng }}
                  onClick={() => handleZoneClick(zone)}
                  title={zone.name}
                >
                  <Pin
                    background="#0284c7"
                    glyphColor="#ffffff"
                    borderColor="#0369a1"
                    scale={0.9}
                  />
                </AdvancedMarker>
              );
            })}

          {/* 5. HEALTHCARE ECOSYSTEM POIs */}
          {showHealthcareLayer &&
            nearbyFacilities.map(fac => (
              <AdvancedMarker
                key={fac.id}
                position={{ lat: fac.lat, lng: fac.lng }}
                onClick={() =>
                  setSelectedMarker({
                    type: 'facility',
                    data: fac,
                    position: { lat: fac.lat, lng: fac.lng },
                  })
                }
                title={fac.name}
              >
                <div className="bg-white/90 backdrop-blur-xs p-1 rounded-full shadow border border-slate-300 text-slate-700 hover:scale-110 transition-transform">
                  {fac.type === 'pharmacy' && <Pill className="w-3.5 h-3.5 text-blue-600" />}
                  {fac.type === 'diagnostic' && <Activity className="w-3.5 h-3.5 text-purple-600" />}
                  {fac.type === 'hospital' && <Building2 className="w-3.5 h-3.5 text-rose-600" />}
                  {fac.type === 'transit' && <Navigation className="w-3.5 h-3.5 text-amber-600" />}
                </div>
              </AdvancedMarker>
            ))}

          {/* 6. INTERACTIVE INFOWINDOW */}
          {selectedMarker && (
            <InfoWindow
              position={selectedMarker.position}
              onCloseClick={() => setSelectedMarker(null)}
              headerContent={
                <div className="font-bold text-xs text-slate-800 pr-4">
                  {selectedMarker.type === 'clinic' && `${clinic.name} (Planned Premises)`}
                  {selectedMarker.type === 'city' && `${selectedMarker.data.name}, ${selectedMarker.data.state}`}
                  {selectedMarker.type === 'space' && 'Available Commercial Space for Rent'}
                  {selectedMarker.type === 'zone' && selectedMarker.data.name}
                  {selectedMarker.type === 'facility' && selectedMarker.data.name}
                </div>
              }
            >
              <div className="p-1 max-w-xs space-y-2 text-xs">
                {/* CITY MARKER CONTENT */}
                {selectedMarker.type === 'city' && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                        {selectedMarker.data.state}
                      </span>
                      <span className="text-[10px] text-emerald-700 font-bold">
                        {selectedMarker.data.demand} Healthcare Demand
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-1.5 text-[11px] bg-slate-50 p-2 rounded-lg border border-slate-100">
                      <div>
                        <span className="text-slate-500 block text-[10px]">Tier Level:</span>
                        <strong className="text-slate-800">Tier {selectedMarker.data.tier} City</strong>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[10px]">Population:</span>
                        <strong className="text-slate-800">
                          {selectedMarker.data.population || 'Regional Hub'}
                        </strong>
                      </div>
                    </div>

                    {selectedMarker.data.popularAreas && (
                      <div>
                        <span className="text-[10px] font-bold text-slate-600 block mb-1">
                          Key Medical & Commercial Micro-Markets:
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {selectedMarker.data.popularAreas.map((pa: string) => (
                            <span
                              key={pa}
                              className="text-[9px] bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded font-medium"
                            >
                              {pa}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex gap-1.5 pt-1">
                      <button
                        onClick={() => {
                          handleCitySelect(selectedMarker.data.name);
                          setSelectedMarker(null);
                        }}
                        className="flex-1 bg-teal-700 hover:bg-teal-800 text-white font-bold py-1.5 px-2 rounded-lg text-[11px] flex items-center justify-center gap-1 transition-colors"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Set Clinic in {selectedMarker.data.name}</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* CLINIC PINPOINT CONTENT */}
                {selectedMarker.type === 'clinic' && (
                  <div>
                    <p className="text-slate-600 text-[11px] mb-2">
                      {clinic.location.preferredLocation || clinic.location.area},{' '}
                      {clinic.location.city}, {clinic.location.state}
                    </p>
                    <div className="grid grid-cols-2 gap-1.5 text-[11px] bg-slate-50 p-2 rounded-lg border border-slate-100">
                      <div>
                        <span className="text-slate-500 block text-[10px]">Specialty:</span>
                        <strong className="text-slate-800">{clinic.clinicType}</strong>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[10px]">Expected Footfall:</span>
                        <strong className="text-slate-800">
                          {clinic.capacity.expectedPatientsPerDay} Patients/Day
                        </strong>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[10px]">Carpet Area:</span>
                        <strong className="text-slate-800">{clinic.location.approxAreaSqFt} Sq.Ft</strong>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[10px]">Rent Budget:</span>
                        <strong className="text-slate-800">
                          {formatINR(clinic.budget.monthlyRentBudget)}/mo
                        </strong>
                      </div>
                    </div>
                  </div>
                )}

                {/* AVAILABLE COMMERCIAL SPACE CONTENT */}
                {selectedMarker.type === 'space' && (
                  <div className="space-y-2">
                    <div>
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                          {selectedMarker.data.badge || 'Available for Lease'}
                        </span>
                        <span className="text-[10px] text-slate-500">
                          {selectedMarker.data.distanceMeters}m from center
                        </span>
                      </div>
                      <h4 className="font-bold text-slate-900 text-xs">
                        {selectedMarker.data.buildingName}
                      </h4>
                      <p className="text-slate-500 text-[11px] leading-tight">
                        {selectedMarker.data.address}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-1 bg-emerald-50/70 p-2 rounded-lg border border-emerald-100 text-[11px]">
                      <div>
                        <span className="text-slate-500 text-[10px] block">Monthly Rent:</span>
                        <span className="font-extrabold text-emerald-900 text-xs">
                          {formatINR(selectedMarker.data.monthlyRent)}/mo
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-500 text-[10px] block">Carpet Area:</span>
                        <span className="font-bold text-slate-800">
                          {selectedMarker.data.carpetAreaSqFt} Sq. Ft.
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-500 text-[10px] block">Floor:</span>
                        <span className="font-medium text-slate-700">{selectedMarker.data.floor}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 text-[10px] block">Security Deposit:</span>
                        <span className="font-medium text-slate-700">
                          {formatINR(selectedMarker.data.depositAmount, { compact: true })} (
                          {selectedMarker.data.depositMonths} mo)
                        </span>
                      </div>
                    </div>

                    {/* Clinical suitability check */}
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-slate-700 block">
                        Clinic Compliance Features:
                      </span>
                      <ul className="text-[10px] text-slate-600 space-y-0.5">
                        {selectedMarker.data.medicalSuitability?.slice(0, 3).map((feat: string, i: number) => (
                          <li key={i} className="flex items-center gap-1">
                            <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600 shrink-0" />
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1.5 pt-1">
                      <button
                        onClick={() => handleAdoptSpace(selectedMarker.data)}
                        className="flex-1 bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-1.5 px-2 rounded-lg text-[10px] flex items-center justify-center gap-1 transition-colors"
                      >
                        <Check className="w-3 h-3" />
                        <span>Select as Clinic Premises</span>
                      </button>

                      {onBookSiteVisit && (
                        <button
                          onClick={() => {
                            onBookSiteVisit(selectedMarker.data);
                            setSelectedMarker(null);
                          }}
                          className="bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold py-1.5 px-2 rounded-lg text-[10px] flex items-center justify-center gap-1 transition-colors"
                          title="Schedule inspection walkthrough"
                        >
                          <Calendar className="w-3 h-3 text-slate-500" />
                          <span>Visit</span>
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {/* ZONE CONTENT */}
                {selectedMarker.type === 'zone' && (
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-slate-500 text-[11px]">Score:</span>
                      <strong className="text-teal-700">{selectedMarker.data.overallScore}/100</strong>
                    </div>
                    <p className="text-slate-600 text-[11px] mb-2">{selectedMarker.data.recommendation}</p>
                    <div className="text-[11px] bg-slate-50 p-1.5 rounded border border-slate-100">
                      <span className="text-slate-500">Estimated Rent: </span>
                      <strong className="text-slate-800">{selectedMarker.data.estimatedRentRange}</strong>
                    </div>
                  </div>
                )}

                {/* FACILITY CONTENT */}
                {selectedMarker.type === 'facility' && (
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400">
                      {selectedMarker.data.type}
                    </span>
                    <p className="text-slate-700 font-medium text-[11px] mt-0.5">
                      {selectedMarker.data.distance}
                    </p>
                    <p className="text-slate-500 text-[10px] mt-1">
                      Nearby healthcare provider driving high local pharmacy & diagnostic footfall.
                    </p>
                  </div>
                )}
              </div>
            </InfoWindow>
          )}
        </Map>
      </APIProvider>
    </div>
  );
};
