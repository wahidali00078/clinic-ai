import { AvailableClinicSpace } from '../types';

/**
 * Calculates straight line distance in meters between two coordinates using Haversine formula
 */
export function calculateDistanceMeters(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371e3; // Earth radius in meters
  const phi1 = (lat1 * Math.PI) / 180;
  const phi2 = (lat2 * Math.PI) / 180;
  const deltaPhi = ((lat2 - lat1) * Math.PI) / 180;
  const deltaLambda = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
    Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return Math.round(R * c);
}

/**
 * Generates available commercial & healthcare spaces near target clinic coordinates
 */
export function getAvailableSpacesForLocation(
  city: string = 'Jaipur',
  area: string = 'Malviya Nagar',
  baseLat: number = 26.8532,
  baseLng: number = 75.8052
): AvailableClinicSpace[] {
  const normalizedCity = city.trim();
  const normalizedArea = area.trim();

  // Curated spaces relative to base coordinates with realistic variations
  return [
    {
      id: 'space-1',
      title: 'Ground Floor Corner Commercial Space',
      buildingName: 'Apex Health Galleria',
      address: `Plot 14-B, Main Boulevard Road, Near Central Park, ${normalizedArea}, ${normalizedCity}`,
      city: normalizedCity,
      area: normalizedArea,
      lat: baseLat + 0.0016,
      lng: baseLng + 0.0012,
      distanceMeters: calculateDistanceMeters(baseLat, baseLng, baseLat + 0.0016, baseLng + 0.0012),
      carpetAreaSqFt: 850,
      monthlyRent: 42000,
      depositMonths: 3,
      depositAmount: 126000,
      ratePerSqFt: 49.4,
      floor: 'Ground Floor (Direct Road Access)',
      furnishing: 'Warm Shell',
      medicalSuitability: [
        'Commercial Healthcare NOC approved',
        'Direct wheelchair ramp & wide double door entrance',
        'Dedicated water inlet & drain lines for clinic sinks/chairs',
        'Biomedical waste collection point access',
        '15 kVA 3-Phase commercial power connection',
      ],
      suitableFor: ['General Clinic', 'Dental Clinic', 'Pediatric Clinic', 'Dermatology Clinic'],
      contactPerson: 'Suresh Singhania (Property Manager)',
      contactPhone: '+91 98290 41289',
      badge: 'High Footfall Corner',
      parkingSpots: 3,
      facing: 'North-East (Main Road Facing)',
      waterSupply: '24/7 Municipal + Overhead Tank',
      powerBackup: '100% DG Backup for common areas',
      status: 'Available',
    },
    {
      id: 'space-2',
      title: 'Fully Furnished Doctor Chamber & Consultation Suite',
      buildingName: 'MediPlaza Healthcare Tower',
      address: `2nd Floor, MediPlaza, Opposite Civil Hospital Road, ${normalizedArea}, ${normalizedCity}`,
      city: normalizedCity,
      area: normalizedArea,
      lat: baseLat - 0.0021,
      lng: baseLng + 0.0019,
      distanceMeters: calculateDistanceMeters(baseLat, baseLng, baseLat - 0.0021, baseLng + 0.0019),
      carpetAreaSqFt: 620,
      monthlyRent: 35000,
      depositMonths: 2,
      depositAmount: 70000,
      ratePerSqFt: 56.4,
      floor: '1st Floor (Stretcher Elevator & Escalator)',
      furnishing: 'Fully Furnished Clinic',
      medicalSuitability: [
        'Turnkey setup: 2 doctor consultation cabins + reception desk',
        'Pre-installed patient examination couch & partition glass',
        'Central waiting lounge for 14 patients',
        'Stretcher-compliant elevator available 24/7',
        'Adjacent to 24/7 Apollo Pharmacy in ground atrium',
      ],
      suitableFor: ['General Clinic', 'Pediatric Clinic', 'Dermatology Clinic', 'Eye Clinic'],
      contactPerson: 'Dr. Anand Verma (Owner/Doctor Syndicate)',
      contactPhone: '+91 94140 77312',
      badge: 'Ready to Move In',
      parkingSpots: 2,
      facing: 'East Facing (Well ventilated)',
      waterSupply: 'Dedicated RO Drinking + Clinical Supply',
      powerBackup: 'Full Inverter & DG Backup connected',
      status: 'Available',
    },
    {
      id: 'space-3',
      title: 'Expansive Multi-Specialty / Diagnostic Retail Floor',
      buildingName: 'Crystal Avenue Commercial Complex',
      address: `Ground Floor Rear & 1st Floor Wing, Crystal Avenue, Sector 3, ${normalizedArea}, ${normalizedCity}`,
      city: normalizedCity,
      area: normalizedArea,
      lat: baseLat + 0.0034,
      lng: baseLng - 0.0025,
      distanceMeters: calculateDistanceMeters(baseLat, baseLng, baseLat + 0.0034, baseLng - 0.0025),
      carpetAreaSqFt: 1450,
      monthlyRent: 68000,
      depositMonths: 3,
      depositAmount: 204000,
      ratePerSqFt: 46.8,
      floor: 'Ground Floor (Direct Parking Access)',
      furnishing: 'Semi-Furnished',
      medicalSuitability: [
        'Lead-lined partition provisions for X-Ray / OPG diagnostics',
        'Dedicated sample collection bay & sample processing room',
        'Heavy electrical load approval (25 kVA sanctioned)',
        'Biomedical waste disposal compliance approved by Municipal Corp',
        'Ample ambulance bay and barrier-free patient drop-off',
      ],
      suitableFor: ['Diagnostic Center', 'Physiotherapy Clinic', 'General Clinic', 'Dental Clinic'],
      contactPerson: 'Vikram Choudhary (Leasing Head)',
      contactPhone: '+91 98281 99045',
      badge: 'Multi-Specialty Ready',
      parkingSpots: 6,
      facing: 'Main Road Frontage (40 ft wide)',
      waterSupply: 'Borewell + Municipal High-Pressure Supply',
      powerBackup: 'Dedicated 20 kVA DG Generator',
      status: 'Available',
    },
    {
      id: 'space-4',
      title: 'Boutique Clinical Studio / Dental Chamber',
      buildingName: 'Heritage Square Commercial Walkway',
      address: `Shop 108, 1st Floor, Heritage Square, Market Circle, ${normalizedArea}, ${normalizedCity}`,
      city: normalizedCity,
      area: normalizedArea,
      lat: baseLat - 0.0014,
      lng: baseLng - 0.0028,
      distanceMeters: calculateDistanceMeters(baseLat, baseLng, baseLat - 0.0014, baseLng - 0.0028),
      carpetAreaSqFt: 520,
      monthlyRent: 26000,
      depositMonths: 2,
      depositAmount: 52000,
      ratePerSqFt: 50.0,
      floor: '1st Floor (Wide Staircase & Patient Lift)',
      furnishing: 'Semi-Furnished',
      medicalSuitability: [
        'Water drainage trenches already cast in floor for dental chairs',
        'Low maintenance society with reasonable common charges',
        'High footfall from nearby residential colonies and schools',
        'Separate doctor private washroom & patient washroom',
      ],
      suitableFor: ['Dental Clinic', 'General Clinic', 'Eye Clinic'],
      contactPerson: 'Mukesh Pareek (Landlord)',
      contactPhone: '+91 97840 23118',
      badge: 'Budget Friendly',
      parkingSpots: 1,
      facing: 'North Facing',
      waterSupply: '24/7 Water Supply',
      powerBackup: 'Dual Inverter Line installed',
      status: 'Available',
    },
    {
      id: 'space-5',
      title: 'Spacious Rehab & Physiotherapy Wellness Floor',
      buildingName: 'Aura Heights Commercial Arcade',
      address: `Upper Ground Floor, Aura Heights, Ring Road Arterial, ${normalizedArea}, ${normalizedCity}`,
      city: normalizedCity,
      area: normalizedArea,
      lat: baseLat + 0.0027,
      lng: baseLng + 0.0031,
      distanceMeters: calculateDistanceMeters(baseLat, baseLng, baseLat + 0.0027, baseLng + 0.0031),
      carpetAreaSqFt: 1800,
      monthlyRent: 82000,
      depositMonths: 3,
      depositAmount: 246000,
      ratePerSqFt: 45.5,
      floor: 'Upper Ground Floor (Ramp Access)',
      furnishing: 'Warm Shell',
      medicalSuitability: [
        'Open-plan layout with shock-absorbent flooring readiness',
        'Separate electrotherapy cubicles and exercise gym space',
        'Direct patient stretcher access from covered drop-off porch',
        'Doctor personal rest cabin with attached bath',
      ],
      suitableFor: ['Physiotherapy Clinic', 'Pediatric Clinic', 'Diagnostic Center'],
      contactPerson: 'Pooja Mathur (Property Syndicate)',
      contactPhone: '+91 96020 88471',
      badge: 'Large Open Floor',
      parkingSpots: 5,
      facing: 'Corner Plot (Double Road)',
      waterSupply: 'Continuous Pressure Supply',
      powerBackup: '30 kVA Shared DG Backup',
      status: 'Available',
    },
  ];
}
