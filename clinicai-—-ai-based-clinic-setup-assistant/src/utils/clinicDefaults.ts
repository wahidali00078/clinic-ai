import {
  Clinic,
  ClinicType,
  CostStructure,
  EquipmentItem,
  LegalChecklistItem,
  LocationAnalysis,
  RevenueForecast,
  StaffRoleItem,
} from '../types';

export const CLINIC_TYPES: ClinicType[] = [
  'General Clinic',
  'Dental Clinic',
  'Pediatric Clinic',
  'Dermatology Clinic',
  'Eye Clinic',
  'Physiotherapy Clinic',
  'Diagnostic Center',
  'Other',
];

export const CLINIC_SERVICES_PRESETS: Record<ClinicType, string[]> = {
  'General Clinic': [
    'General Consultations',
    'Routine Health Checkups',
    'Minor Wound Dressing & Suturing',
    'Vaccinations & Immunizations',
    'Blood Sugar & BP Screening',
    'Emergency First Aid & Triage',
    'ECG & Basic Diagnostics',
    'Preventive Health Counseling',
  ],
  'Dental Clinic': [
    'General Dentistry & Cleanings',
    'Root Canal Treatment (RCT)',
    'Teeth Whitening & Aesthetics',
    'Orthodontics & Aligners',
    'Dental Implants & Crowns',
    'Pediatric Dentistry',
    'Digital X-Rays & OPG',
    'Oral Surgery & Extractions',
  ],
  'Pediatric Clinic': [
    'Newborn & Child Health Check',
    'Growth & Milestone Tracking',
    'Childhood Immunizations',
    'Pediatric Asthma & Allergies',
    'Nutritional & Diet Counseling',
    'Pediatric Infections Treatment',
    'Behavioral & Development Screening',
  ],
  'Dermatology Clinic': [
    'Clinical Dermatology (Acne/Eczema)',
    'Laser Hair & Scar Treatments',
    'Chemical Peels & Hydra-facials',
    'Skin Biopsy & Mole Removal',
    'Anti-Aging Therapies (Botox/Fillers)',
    'Hair Loss Treatment (PRP)',
    'Dermato-surgery',
  ],
  'Eye Clinic': [
    'Comprehensive Eye Exams',
    'Computerized Refraction',
    'Glaucoma Screening & Tonometry',
    'Cataract Evaluation & Post-op',
    'Retina Screening & Fundus Imaging',
    'Contact Lens Fitting',
    'Pediatric Ophthalmology',
  ],
  'Physiotherapy Clinic': [
    'Musculoskeletal Rehabilitation',
    'Post-Surgical Joint Rehab',
    'Sports Injury Therapy',
    'Neurological Rehab & Stroke Recovery',
    'Ergonomic Posture Correction',
    'Electrotherapy & Ultrasound',
    'Dry Needling & Manual Therapy',
  ],
  'Diagnostic Center': [
    'Digital X-Ray & Radiography',
    'Ultrasound & Color Doppler',
    'Pathology & Biochemistry Blood Tests',
    'ECG & 2D Echocardiography',
    'TMT & Stress Testing',
    'Preventive Full Body Panels',
    'Microbiology & Urine Analysis',
  ],
  'Other': [
    'Specialist Outpatient Consultation',
    'Teleconsultations',
    'Health Screening & Diagnostics',
    'Lifestyle Medicine Counseling',
    'Patient Follow-up & Monitoring',
  ],
};

// Generates equipment for a given clinic type
export function generateInitialEquipment(clinicId: string, clinicType: ClinicType, currency: string = '₹'): EquipmentItem[] {
  const commonEquipment: Omit<EquipmentItem, 'id' | 'clinicId'>[] = [
    {
      name: 'Doctor Consultation Desk & Ergonomic Chairs',
      category: 'Furniture',
      priority: 'Essential',
      quantity: 2,
      estimatedUnitCost: 18000,
      estimatedTotalCost: 36000,
      reasonRequired: 'Standard ergonomic workstations for consulting physicians and patients.',
      isPurchased: false,
    },
    {
      name: 'Patient Examination Bed with Paper Roll Holder',
      category: 'Furniture',
      priority: 'Essential',
      quantity: 1,
      estimatedUnitCost: 15000,
      estimatedTotalCost: 15000,
      reasonRequired: 'Mandatory clinical physical examinations and procedural assessments.',
      isPurchased: false,
    },
    {
      name: 'All-in-One Reception PC & Appointment Terminal',
      category: 'IT',
      priority: 'Essential',
      quantity: 1,
      estimatedUnitCost: 45000,
      estimatedTotalCost: 45000,
      reasonRequired: 'Billing, EHR patient records, and appointment scheduling management.',
      isPurchased: false,
    },
    {
      name: 'Waiting Area Comfortable Seating (10-seater)',
      category: 'Furniture',
      priority: 'Recommended',
      quantity: 1,
      estimatedUnitCost: 32000,
      estimatedTotalCost: 32000,
      reasonRequired: 'Patient and attendant seating compliant with clinic capacity standards.',
      isPurchased: false,
    },
    {
      name: 'Emergency Oxygen Cylinder Kit & Flowmeter',
      category: 'Emergency',
      priority: 'Essential',
      quantity: 1,
      estimatedUnitCost: 12500,
      estimatedTotalCost: 12500,
      reasonRequired: 'Mandatory clinical safety protocol for acute respiratory distress.',
      isPurchased: false,
    },
    {
      name: 'Automated External Defibrillator (AED) / Crash Cart',
      category: 'Emergency',
      priority: 'Recommended',
      quantity: 1,
      estimatedUnitCost: 65000,
      estimatedTotalCost: 65000,
      reasonRequired: 'Critical life-support compliance for cardiac emergencies.',
      isPurchased: false,
    },
    {
      name: 'High-Pressure Autoclave Sterilizer (20L)',
      category: 'Sterilization',
      priority: 'Essential',
      quantity: 1,
      estimatedUnitCost: 28000,
      estimatedTotalCost: 28000,
      reasonRequired: 'Hospital-grade infection control and sterilization of instruments.',
      isPurchased: false,
    },
  ];

  const specialtyEquipment: Record<ClinicType, Omit<EquipmentItem, 'id' | 'clinicId'>[]> = {
    'General Clinic': [
      {
        name: 'Digital 12-Lead ECG Machine with Thermal Printer',
        category: 'Diagnostic',
        priority: 'Essential',
        quantity: 1,
        estimatedUnitCost: 55000,
        estimatedTotalCost: 55000,
        reasonRequired: 'Detect arrhythmias, ischemic heart changes, and pre-op clearance.',
        isPurchased: false,
      },
      {
        name: 'Clinical Multi-Parameter Vital Signs Monitor',
        category: 'Diagnostic',
        priority: 'Essential',
        quantity: 1,
        estimatedUnitCost: 38000,
        estimatedTotalCost: 38000,
        reasonRequired: 'Continuous SpO2, NIBP, pulse, and temperature monitoring.',
        isPurchased: false,
      },
      {
        name: 'Digital Otoscope & Ophthalmoscope Diagnostic Set',
        category: 'Consultation',
        priority: 'Recommended',
        quantity: 1,
        estimatedUnitCost: 16000,
        estimatedTotalCost: 16000,
        reasonRequired: 'Ear, nose, throat and fundus clinical assessments.',
        isPurchased: false,
      },
      {
        name: 'Electronic Digital Scale with Stadiometer',
        category: 'Consultation',
        priority: 'Essential',
        quantity: 1,
        estimatedUnitCost: 8500,
        estimatedTotalCost: 8500,
        reasonRequired: 'Patient height, weight, and BMI measurement baseline.',
        isPurchased: false,
      },
      {
        name: 'Minor Procedure & Surgical Dressing Instrument Tray',
        category: 'Consultation',
        priority: 'Essential',
        quantity: 2,
        estimatedUnitCost: 9000,
        estimatedTotalCost: 18000,
        reasonRequired: 'Sterile trays for abscess drainage, suture kits, and wound debridement.',
        isPurchased: false,
      },
      {
        name: 'Medical Grade Vaccine Refrigerator (2-8°C)',
        category: 'Consultation',
        priority: 'Recommended',
        quantity: 1,
        estimatedUnitCost: 42000,
        estimatedTotalCost: 42000,
        reasonRequired: 'Preserving cold-chain stability for vaccines, toxoids, and insulin.',
        isPurchased: false,
      },
    ],
    'Dental Clinic': [
      {
        name: 'Fully Motorized Ergonomic Dental Chair with LED Light',
        category: 'Consultation',
        priority: 'Essential',
        quantity: 1,
        estimatedUnitCost: 280000,
        estimatedTotalCost: 280000,
        reasonRequired: 'Core operational asset with delivery unit, cuspidor, and suction.',
        isPurchased: false,
      },
      {
        name: 'Digital RVG Dental Sensor & High-Frequency X-Ray Unit',
        category: 'Diagnostic',
        priority: 'Essential',
        quantity: 1,
        estimatedUnitCost: 175000,
        estimatedTotalCost: 175000,
        reasonRequired: 'Instant chairside intraoral radiography for diagnosis and root canals.',
        isPurchased: false,
      },
      {
        name: 'Oil-Free Medical Air Compressor (1.5 HP)',
        category: 'IT',
        priority: 'Essential',
        quantity: 1,
        estimatedUnitCost: 35000,
        estimatedTotalCost: 35000,
        reasonRequired: 'Delivering moisture-free compressed air for air turbines and scalers.',
        isPurchased: false,
      },
      {
        name: 'Piezo Ultrasonic Scaler & Micromotor Kit',
        category: 'Consultation',
        priority: 'Essential',
        quantity: 1,
        estimatedUnitCost: 32000,
        estimatedTotalCost: 32000,
        reasonRequired: 'Plaque and calculus removal, polishing and basic tooth prep.',
        isPurchased: false,
      },
      {
        name: 'Cordless Endomotor with Apex Locator',
        category: 'Consultation',
        priority: 'Recommended',
        quantity: 1,
        estimatedUnitCost: 48000,
        estimatedTotalCost: 48000,
        reasonRequired: 'Precision rotary endodontics and accurate root apex measurement.',
        isPurchased: false,
      },
      {
        name: 'Class-B Vacuum Autoclave (18L)',
        category: 'Sterilization',
        priority: 'Essential',
        quantity: 1,
        estimatedUnitCost: 95000,
        estimatedTotalCost: 95000,
        reasonRequired: 'Required for hollow lumen handpiece and turbine sterilization.',
        isPurchased: false,
      },
    ],
    'Pediatric Clinic': [
      {
        name: 'Infant Pediatric Exam Table with Soft Padding & Scale',
        category: 'Furniture',
        priority: 'Essential',
        quantity: 1,
        estimatedUnitCost: 24000,
        estimatedTotalCost: 24000,
        reasonRequired: 'Child-safe examination platform with integrated height rule and weight.',
        isPurchased: false,
      },
      {
        name: 'Pediatric Vein Finder Device (Transilluminator)',
        category: 'Diagnostic',
        priority: 'Recommended',
        quantity: 1,
        estimatedUnitCost: 28000,
        estimatedTotalCost: 28000,
        reasonRequired: 'Quick, painless intravenous access in infants and young children.',
        isPurchased: false,
      },
      {
        name: 'Dedicated Vaccine Storage Refrigerator with Datalogger',
        category: 'Consultation',
        priority: 'Essential',
        quantity: 1,
        estimatedUnitCost: 55000,
        estimatedTotalCost: 55000,
        reasonRequired: 'Strict temperature tracking for pediatric vaccines and biologics.',
        isPurchased: false,
      },
      {
        name: 'Child-Friendly Waiting Play Corner & Safety Matting',
        category: 'Furniture',
        priority: 'Recommended',
        quantity: 1,
        estimatedUnitCost: 25000,
        estimatedTotalCost: 25000,
        reasonRequired: 'Calming pediatric waiting room atmosphere to reduce child anxiety.',
        isPurchased: false,
      },
    ],
    'Dermatology Clinic': [
      {
        name: 'High-Precision Digital Dermatoscope with HD Camera',
        category: 'Diagnostic',
        priority: 'Essential',
        quantity: 1,
        estimatedUnitCost: 85000,
        estimatedTotalCost: 85000,
        reasonRequired: 'High magnification skin lesion, pigment, and hair follicle analysis.',
        isPurchased: false,
      },
      {
        name: 'Electrocautery & Radiofrequency Surgical Unit',
        category: 'Consultation',
        priority: 'Essential',
        quantity: 1,
        estimatedUnitCost: 75000,
        estimatedTotalCost: 75000,
        reasonRequired: 'Excisions, skin tag and wart removal with minimal scarring.',
        isPurchased: false,
      },
      {
        name: 'Medical Grade Centrifuge Machine (for PRP)',
        category: 'Diagnostic',
        priority: 'Recommended',
        quantity: 1,
        estimatedUnitCost: 35000,
        estimatedTotalCost: 35000,
        reasonRequired: 'High yield platelet-rich plasma preparation for hair and facial therapy.',
        isPurchased: false,
      },
      {
        name: 'Adjustable Dermatology Procedure Chair / Bed',
        category: 'Furniture',
        priority: 'Essential',
        quantity: 1,
        estimatedUnitCost: 65000,
        estimatedTotalCost: 65000,
        reasonRequired: 'Multi-angle positioning for facial injections and laser treatments.',
        isPurchased: false,
      },
    ],
    'Eye Clinic': [
      {
        name: 'Slit Lamp Biomicroscope with Digital Imaging',
        category: 'Diagnostic',
        priority: 'Essential',
        quantity: 1,
        estimatedUnitCost: 195000,
        estimatedTotalCost: 195000,
        reasonRequired: 'Anterior segment inspection, cornea, lens, and iris examination.',
        isPurchased: false,
      },
      {
        name: 'Auto-Refractometer with Keratometer (ARK)',
        category: 'Diagnostic',
        priority: 'Essential',
        quantity: 1,
        estimatedUnitCost: 220000,
        estimatedTotalCost: 220000,
        reasonRequired: 'Objective measurement of refractive error and corneal curvature.',
        isPurchased: false,
      },
      {
        name: 'Non-Contact Tonometer (Air Puff Tonometry)',
        category: 'Diagnostic',
        priority: 'Recommended',
        quantity: 1,
        estimatedUnitCost: 180000,
        estimatedTotalCost: 180000,
        reasonRequired: 'Accurate, non-invasive intraocular pressure screening for glaucoma.',
        isPurchased: false,
      },
      {
        name: 'Digital LCD Vision Acuity Chart & Remote',
        category: 'Consultation',
        priority: 'Essential',
        quantity: 1,
        estimatedUnitCost: 35000,
        estimatedTotalCost: 35000,
        reasonRequired: 'Snellen and multi-lingual visual acuity evaluation.',
        isPurchased: false,
      },
    ],
    'Physiotherapy Clinic': [
      {
        name: 'Combination Electrotherapy & Ultrasound Unit',
        category: 'Consultation',
        priority: 'Essential',
        quantity: 1,
        estimatedUnitCost: 75000,
        estimatedTotalCost: 75000,
        reasonRequired: 'TENS, IFT, muscle stimulation, and therapeutic deep tissue ultrasound.',
        isPurchased: false,
      },
      {
        name: 'Motorized Traction Unit with Decompression Table',
        category: 'Consultation',
        priority: 'Recommended',
        quantity: 1,
        estimatedUnitCost: 110000,
        estimatedTotalCost: 110000,
        reasonRequired: 'Lumbar and cervical spinal traction for disc herniation relief.',
        isPurchased: false,
      },
      {
        name: 'Rehabilitation Gymnasium Set (Bands, Balls, Parallel Bars)',
        category: 'Furniture',
        priority: 'Essential',
        quantity: 1,
        estimatedUnitCost: 45000,
        estimatedTotalCost: 45000,
        reasonRequired: 'Active gait training, core stabilization, and range of motion recovery.',
        isPurchased: false,
      },
    ],
    'Diagnostic Center': [
      {
        name: 'High Frequency 100mA/300mA Stationary X-Ray Machine',
        category: 'Diagnostic',
        priority: 'Essential',
        quantity: 1,
        estimatedUnitCost: 650000,
        estimatedTotalCost: 650000,
        reasonRequired: 'Chest, skeletal, and abdominal general radiography imaging.',
        isPurchased: false,
      },
      {
        name: 'Color Doppler Ultrasound Scanner with Multi-Frequency Probes',
        category: 'Diagnostic',
        priority: 'Essential',
        quantity: 1,
        estimatedUnitCost: 1200000,
        estimatedTotalCost: 1200000,
        reasonRequired: 'Abdominal, vascular, obstetric, and small-parts sonography.',
        isPurchased: false,
      },
      {
        name: '3-Part Fully Automated Hematology Analyzer (CBC)',
        category: 'Diagnostic',
        priority: 'Essential',
        quantity: 1,
        estimatedUnitCost: 280000,
        estimatedTotalCost: 280000,
        reasonRequired: 'Complete blood count analysis with high sample throughput.',
        isPurchased: false,
      },
      {
        name: 'Semi-Automated Clinical Chemistry Analyzer',
        category: 'Diagnostic',
        priority: 'Essential',
        quantity: 1,
        estimatedUnitCost: 140000,
        estimatedTotalCost: 140000,
        reasonRequired: 'Liver function, kidney function, lipid profile, and blood glucose tests.',
        isPurchased: false,
      },
    ],
    'Other': [
      {
        name: 'Modular Clinical Examination Station',
        category: 'Consultation',
        priority: 'Essential',
        quantity: 1,
        estimatedUnitCost: 35000,
        estimatedTotalCost: 35000,
        reasonRequired: 'Primary clinical examination and consultation equipment.',
        isPurchased: false,
      },
    ],
  };

  const combined = [...commonEquipment, ...(specialtyEquipment[clinicType] || specialtyEquipment['General Clinic'])];

  return combined.map((item, idx) => ({
    ...item,
    id: `eq-${clinicId}-${idx + 1}`,
    clinicId,
  }));
}

// Generates recommended staff roles based on clinic capacity & type
export function generateInitialStaff(clinicId: string, clinicType: ClinicType, patientsPerDay: number = 30): StaffRoleItem[] {
  const isHighVolume = patientsPerDay > 35;

  const staffList: Omit<StaffRoleItem, 'id' | 'clinicId'>[] = [
    {
      roleTitle: clinicType === 'Dental Clinic' ? 'Chief Dental Surgeon' : 'Consultant Physician / Specialist',
      recommendedCount: 1,
      monthlySalaryEstimate: 95000,
      annualSalaryEstimate: 1140000,
      responsibility: 'Lead patient consultations, diagnosis, clinical treatment protocols, and supervision.',
      category: 'Clinical',
    },
    {
      roleTitle: clinicType === 'Dental Clinic' ? 'Associate Dentist' : 'Duty Medical Officer (Junior Doctor)',
      recommendedCount: isHighVolume ? 1 : 0,
      monthlySalaryEstimate: 50000,
      annualSalaryEstimate: 600000,
      responsibility: 'Secondary consultations, urgent triage, patient history taking, and follow-ups.',
      category: 'Clinical',
    },
    {
      roleTitle: 'Clinic Front-Desk & Billing Executive',
      recommendedCount: 1,
      monthlySalaryEstimate: 22000,
      annualSalaryEstimate: 264000,
      responsibility: 'Patient registration, appointment scheduling, billing, insurance, and telephone triage.',
      category: 'Administrative',
    },
    {
      roleTitle: clinicType === 'Dental Clinic' ? 'Dental Chairside Assistant' : 'Registered Staff Nurse (GNM/B.Sc)',
      recommendedCount: clinicType === 'Dental Clinic' ? 1 : (isHighVolume ? 2 : 1),
      monthlySalaryEstimate: 26000,
      annualSalaryEstimate: 312000,
      responsibility: 'Vital signs assessment, injections, patient prep, instrument handling, and emergency support.',
      category: 'Clinical',
    },
    {
      roleTitle: 'Clinical Hygiene & Sterilization Attendant',
      recommendedCount: 1,
      monthlySalaryEstimate: 15000,
      annualSalaryEstimate: 180000,
      responsibility: 'Bio-waste handling, daily clinic disinfection, instrument autoclaving, and general maintenance.',
      category: 'Support',
    },
  ];

  if (clinicType === 'Diagnostic Center') {
    staffList.push(
      {
        roleTitle: 'Medical Lab Technologist (DMLT/BMLT)',
        recommendedCount: 1,
        monthlySalaryEstimate: 30000,
        annualSalaryEstimate: 360000,
        responsibility: 'Sample collection, analyzer calibration, CBC and biochemistry test processing.',
        category: 'Clinical',
      },
      {
        roleTitle: 'Radiology / X-Ray Technician',
        recommendedCount: 1,
        monthlySalaryEstimate: 32000,
        annualSalaryEstimate: 384000,
        responsibility: 'Patient positioning, X-Ray exposure, radiation badge compliance, image archiving.',
        category: 'Clinical',
      }
    );
  }

  if (clinicType === 'Physiotherapy Clinic') {
    staffList.push({
      roleTitle: 'Assistant Physiotherapist (BPT)',
      recommendedCount: 1,
      monthlySalaryEstimate: 32000,
      annualSalaryEstimate: 384000,
      responsibility: 'Supervising exercise therapy, modality applications, and patient progress logs.',
      category: 'Clinical',
    });
  }

  return staffList.map((item, idx) => ({
    ...item,
    id: `staff-${clinicId}-${idx + 1}`,
    clinicId,
  }));
}

// Generates initial legal checklist
export function generateInitialLegalChecklist(clinicId: string, location: string = 'Jaipur, Rajasthan'): LegalChecklistItem[] {
  return [
    {
      id: `legal-${clinicId}-1`,
      clinicId,
      category: 'Clinic registration',
      requirement: 'Clinical Establishments Registration Act (CEA)',
      description: 'Mandatory certificate issued by the District Registration Authority (CMHO) permitting clinical operations.',
      status: 'In Progress',
      priority: 'High',
      notes: 'Requires building floor plan, doctor degree certificates, and staff qualifications.',
      officialSourceUrl: 'https://clinicalestablishments.gov.in',
    },
    {
      id: `legal-${clinicId}-2`,
      clinicId,
      category: 'Healthcare-related registrations',
      requirement: 'State Medical Council / Dental Council Clinic Practice License',
      description: 'Registration verifying all practicing doctors hold active state council registrations without disciplinary bar.',
      status: 'Completed',
      priority: 'High',
      notes: 'Doctor registration certificate verified with Rajasthan Medical Council.',
      officialSourceUrl: 'https://www.nmc.org.in',
    },
    {
      id: `legal-${clinicId}-3`,
      clinicId,
      category: 'Waste management requirements',
      requirement: 'Bio-Medical Waste (BMW) Management Authorization & Agreement',
      description: 'Formal tie-up with Common Bio-Medical Waste Treatment Facility (CBWTF) & State Pollution Control Board NOC.',
      status: 'In Progress',
      priority: 'High',
      notes: 'Separate yellow, red, blue, and puncture-proof white sharp disposal bins designated.',
      officialSourceUrl: 'https://cpcb.nic.in/bio-medical-waste-rules/',
    },
    {
      id: `legal-${clinicId}-4`,
      clinicId,
      category: 'Local permissions',
      requirement: 'Municipal Corporation Trade License & Health NOC',
      description: 'Sanitary NOC from local municipal body (e.g., Jaipur Nagar Nigam) certifying commercial health premises.',
      status: 'Not Started',
      priority: 'High',
      notes: 'Apply after commercial lease deed registration.',
      officialSourceUrl: 'https://urban.rajasthan.gov.in',
    },
    {
      id: `legal-${clinicId}-5`,
      clinicId,
      category: 'Fire/safety requirements',
      requirement: 'Fire Safety NOC / ABC Extinguisher Compliance Certificate',
      description: 'Installation of verified ABC fire extinguishers, clear emergency evacuation plan, and fire signage.',
      status: 'Not Started',
      priority: 'Medium',
      notes: 'Required for premises above ground floor or clinical occupancy over 500 sq ft.',
      officialSourceUrl: 'https://fire.rajasthan.gov.in',
    },
    {
      id: `legal-${clinicId}-6`,
      clinicId,
      category: 'Business registration',
      requirement: 'Entity Incorporation (LLP / Private Limited / Sole Proprietorship)',
      description: 'Legal business registration certificate for tax purposes, banking, and vendor contracts.',
      status: 'Completed',
      priority: 'High',
      notes: 'Sole Proprietorship GST registered with local bank current account.',
      officialSourceUrl: 'https://www.mca.gov.in',
    },
    {
      id: `legal-${clinicId}-7`,
      clinicId,
      category: 'Tax-related requirements',
      requirement: 'GST Registration & Professional Tax Compliance',
      description: 'Healthcare diagnostic and consult services GST exemption categorization along with commercial pharmacy GST.',
      status: 'Completed',
      priority: 'Medium',
      notes: 'GSTIN allotted. Note: Healthcare services generally exempt under Notification 12/2017.',
      officialSourceUrl: 'https://www.gst.gov.in',
    },
    {
      id: `legal-${clinicId}-8`,
      clinicId,
      category: 'Healthcare-related registrations',
      requirement: 'Pharmacy Retail Drug License (Form 20/21) [If dispensing in-house]',
      description: 'State Drug Controller license required only if clinic operates an in-house dispensing medicine store.',
      status: 'Not Started',
      priority: 'Low',
      notes: 'Optional: only needed if dispensing beyond direct physician sample administration.',
      officialSourceUrl: 'https://cdsco.gov.in',
    },
  ];
}

export const CITY_COORDINATES: Record<string, { lat: number; lng: number; city?: string; area?: string; state?: string }> = {
  // Metro Cities & Capital Hubs
  jaipur: { lat: 26.8532, lng: 75.8052, city: 'Jaipur', state: 'Rajasthan' },
  mumbai: { lat: 19.076, lng: 72.8777, city: 'Mumbai', state: 'Maharashtra' },
  delhi: { lat: 28.6139, lng: 77.209, city: 'Delhi', state: 'Delhi NCR' },
  'delhi ncr': { lat: 28.6139, lng: 77.209, city: 'Delhi NCR', state: 'Delhi NCR' },
  'new delhi': { lat: 28.6139, lng: 77.209, city: 'New Delhi', state: 'Delhi NCR' },
  bengaluru: { lat: 12.9716, lng: 77.5946, city: 'Bengaluru', state: 'Karnataka' },
  bangalore: { lat: 12.9716, lng: 77.5946, city: 'Bengaluru', state: 'Karnataka' },
  hyderabad: { lat: 17.385, lng: 78.4867, city: 'Hyderabad', state: 'Telangana' },
  chennai: { lat: 13.0827, lng: 80.2707, city: 'Chennai', state: 'Tamil Nadu' },
  pune: { lat: 18.5204, lng: 73.8567, city: 'Pune', state: 'Maharashtra' },
  ahmedabad: { lat: 23.0225, lng: 72.5714, city: 'Ahmedabad', state: 'Gujarat' },
  kolkata: { lat: 22.5726, lng: 88.3639, city: 'Kolkata', state: 'West Bengal' },
  surat: { lat: 21.1702, lng: 72.8311, city: 'Surat', state: 'Gujarat' },
  indore: { lat: 22.7196, lng: 75.8577, city: 'Indore', state: 'Madhya Pradesh' },
  lucknow: { lat: 26.8467, lng: 80.9462, city: 'Lucknow', state: 'Uttar Pradesh' },
  chandigarh: { lat: 30.7333, lng: 76.7794, city: 'Chandigarh', state: 'Punjab / Haryana' },
  bhopal: { lat: 23.2599, lng: 77.4126, city: 'Bhopal', state: 'Madhya Pradesh' },
  patna: { lat: 25.6116, lng: 85.144, city: 'Patna', state: 'Bihar' },
  vadodara: { lat: 22.3072, lng: 73.1812, city: 'Vadodara', state: 'Gujarat' },
  nagpur: { lat: 21.1458, lng: 79.0882, city: 'Nagpur', state: 'Maharashtra' },
  kochi: { lat: 9.9312, lng: 76.2673, city: 'Kochi', state: 'Kerala' },
  cochin: { lat: 9.9312, lng: 76.2673, city: 'Kochi', state: 'Kerala' },
  thiruvananthapuram: { lat: 8.5241, lng: 76.9366, city: 'Thiruvananthapuram', state: 'Kerala' },
  trivandrum: { lat: 8.5241, lng: 76.9366, city: 'Thiruvananthapuram', state: 'Kerala' },
  coimbatore: { lat: 11.0168, lng: 76.9558, city: 'Coimbatore', state: 'Tamil Nadu' },
  visakhapatnam: { lat: 17.6868, lng: 83.2185, city: 'Visakhapatnam', state: 'Andhra Pradesh' },
  vizag: { lat: 17.6868, lng: 83.2185, city: 'Visakhapatnam', state: 'Andhra Pradesh' },
  dehradun: { lat: 30.3165, lng: 78.0322, city: 'Dehradun', state: 'Uttarakhand' },
  jodhpur: { lat: 26.2389, lng: 73.0243, city: 'Jodhpur', state: 'Rajasthan' },
  udaipur: { lat: 24.5854, lng: 73.7125, city: 'Udaipur', state: 'Rajasthan' },
  kota: { lat: 25.2138, lng: 75.8648, city: 'Kota', state: 'Rajasthan' },
  noida: { lat: 28.5355, lng: 77.391, city: 'Noida', state: 'Uttar Pradesh' },
  'greater noida': { lat: 28.4744, lng: 77.504, city: 'Greater Noida', state: 'Uttar Pradesh' },
  gurgaon: { lat: 28.4595, lng: 77.0266, city: 'Gurugram', state: 'Haryana' },
  gurugram: { lat: 28.4595, lng: 77.0266, city: 'Gurugram', state: 'Haryana' },
  faridabad: { lat: 28.4089, lng: 77.3178, city: 'Faridabad', state: 'Haryana' },
  ghaziabad: { lat: 28.6692, lng: 77.4538, city: 'Ghaziabad', state: 'Uttar Pradesh' },
  nashik: { lat: 19.9975, lng: 73.7898, city: 'Nashik', state: 'Maharashtra' },
  aurangabad: { lat: 19.8762, lng: 75.3433, city: 'Chhatrapati Sambhajinagar', state: 'Maharashtra' },
  thane: { lat: 19.2183, lng: 72.9781, city: 'Thane', state: 'Maharashtra' },
  'navi mumbai': { lat: 19.033, lng: 73.0297, city: 'Navi Mumbai', state: 'Maharashtra' },
  goa: { lat: 15.2993, lng: 74.124, city: 'Goa (Panaji)', state: 'Goa' },
  panaji: { lat: 15.4909, lng: 73.8278, city: 'Panaji', state: 'Goa' },
  varanasi: { lat: 25.3176, lng: 82.9739, city: 'Varanasi', state: 'Uttar Pradesh' },
  kanpur: { lat: 26.4499, lng: 80.3319, city: 'Kanpur', state: 'Uttar Pradesh' },
  amritsar: { lat: 31.634, lng: 74.8723, city: 'Amritsar', state: 'Punjab' },
  ludhiana: { lat: 30.901, lng: 75.8573, city: 'Ludhiana', state: 'Punjab' },
  guwahati: { lat: 26.1445, lng: 91.7362, city: 'Guwahati', state: 'Assam' },
  bhubaneswar: { lat: 20.2961, lng: 85.8245, city: 'Bhubaneswar', state: 'Odisha' },
  raipur: { lat: 21.2514, lng: 81.6296, city: 'Raipur', state: 'Chhattisgarh' },
  ranchi: { lat: 23.3441, lng: 85.3096, city: 'Ranchi', state: 'Jharkhand' },
  mysore: { lat: 12.2958, lng: 76.6394, city: 'Mysuru', state: 'Karnataka' },
  mangalore: { lat: 12.9141, lng: 74.856, city: 'Mangaluru', state: 'Karnataka' },

  // Key Micro-Markets - Mumbai
  andheri: { lat: 19.1136, lng: 72.8697, city: 'Mumbai', area: 'Andheri', state: 'Maharashtra' },
  'andheri east': { lat: 19.1177, lng: 72.8631, city: 'Mumbai', area: 'Andheri East', state: 'Maharashtra' },
  'andheri west': { lat: 19.1363, lng: 72.8277, city: 'Mumbai', area: 'Andheri West', state: 'Maharashtra' },
  bandra: { lat: 19.0596, lng: 72.8295, city: 'Mumbai', area: 'Bandra West', state: 'Maharashtra' },
  'bandra west': { lat: 19.0596, lng: 72.8295, city: 'Mumbai', area: 'Bandra West', state: 'Maharashtra' },
  juhu: { lat: 19.1075, lng: 72.8263, city: 'Mumbai', area: 'Juhu', state: 'Maharashtra' },
  powai: { lat: 19.1197, lng: 72.9051, city: 'Mumbai', area: 'Powai', state: 'Maharashtra' },
  borivali: { lat: 19.2307, lng: 72.8567, city: 'Mumbai', area: 'Borivali', state: 'Maharashtra' },
  dadar: { lat: 19.0178, lng: 72.8478, city: 'Mumbai', area: 'Dadar', state: 'Maharashtra' },
  goregaon: { lat: 19.1663, lng: 72.8526, city: 'Mumbai', area: 'Goregaon', state: 'Maharashtra' },
  malad: { lat: 19.1874, lng: 72.8484, city: 'Mumbai', area: 'Malad', state: 'Maharashtra' },
  colaba: { lat: 18.9067, lng: 72.8147, city: 'Mumbai', area: 'Colaba', state: 'Maharashtra' },
  worli: { lat: 19.0176, lng: 72.8194, city: 'Mumbai', area: 'Worli', state: 'Maharashtra' },
  ghatkopar: { lat: 19.086, lng: 72.909, city: 'Mumbai', area: 'Ghatkopar', state: 'Maharashtra' },
  chembur: { lat: 19.0622, lng: 72.8997, city: 'Mumbai', area: 'Chembur', state: 'Maharashtra' },
  vashi: { lat: 19.0771, lng: 72.9986, city: 'Navi Mumbai', area: 'Vashi', state: 'Maharashtra' },

  // Key Micro-Markets - Bengaluru
  indiranagar: { lat: 12.9784, lng: 73.6445, city: 'Bengaluru', area: 'Indiranagar', state: 'Karnataka' },
  koramangala: { lat: 12.9352, lng: 77.6245, city: 'Bengaluru', area: 'Koramangala', state: 'Karnataka' },
  whitefield: { lat: 12.9698, lng: 77.75, city: 'Bengaluru', area: 'Whitefield', state: 'Karnataka' },
  'hsr layout': { lat: 12.9121, lng: 77.6446, city: 'Bengaluru', area: 'HSR Layout', state: 'Karnataka' },
  jayanagar: { lat: 12.9308, lng: 77.5838, city: 'Bengaluru', area: 'Jayanagar', state: 'Karnataka' },
  'jp nagar': { lat: 12.9077, lng: 77.5855, city: 'Bengaluru', area: 'JP Nagar', state: 'Karnataka' },
  'electronic city': { lat: 12.8452, lng: 77.6602, city: 'Bengaluru', area: 'Electronic City', state: 'Karnataka' },
  marathahalli: { lat: 12.9591, lng: 77.6974, city: 'Bengaluru', area: 'Marathahalli', state: 'Karnataka' },
  hebbal: { lat: 13.0358, lng: 77.597, city: 'Bengaluru', area: 'Hebbal', state: 'Karnataka' },
  malleshwaram: { lat: 13.0031, lng: 77.5643, city: 'Bengaluru', area: 'Malleshwaram', state: 'Karnataka' },
  bellandur: { lat: 12.9304, lng: 77.6784, city: 'Bengaluru', area: 'Bellandur', state: 'Karnataka' },

  // Key Micro-Markets - Delhi NCR
  'connaught place': { lat: 28.6304, lng: 77.2177, city: 'New Delhi', area: 'Connaught Place', state: 'Delhi NCR' },
  'south extension': { lat: 28.5728, lng: 77.2215, city: 'New Delhi', area: 'South Extension', state: 'Delhi NCR' },
  rohini: { lat: 28.716, lng: 77.118, city: 'Delhi', area: 'Rohini', state: 'Delhi NCR' },
  dwarka: { lat: 28.5921, lng: 77.046, city: 'Delhi', area: 'Dwarka', state: 'Delhi NCR' },
  saket: { lat: 28.5245, lng: 77.2066, city: 'New Delhi', area: 'Saket', state: 'Delhi NCR' },
  'hauz khas': { lat: 28.5494, lng: 77.2001, city: 'New Delhi', area: 'Hauz Khas', state: 'Delhi NCR' },
  'lajpat nagar': { lat: 28.57, lng: 77.2434, city: 'New Delhi', area: 'Lajpat Nagar', state: 'Delhi NCR' },
  'karol bagh': { lat: 28.6514, lng: 77.1907, city: 'New Delhi', area: 'Karol Bagh', state: 'Delhi NCR' },
  'dlf cyber city': { lat: 28.4952, lng: 77.0895, city: 'Gurugram', area: 'DLF Cyber City', state: 'Haryana' },
  'sector 18 noida': { lat: 28.5708, lng: 77.3261, city: 'Noida', area: 'Sector 18', state: 'Uttar Pradesh' },
  'sector 62 noida': { lat: 28.6278, lng: 77.3625, city: 'Noida', area: 'Sector 62', state: 'Uttar Pradesh' },

  // Key Micro-Markets - Pune
  kothrud: { lat: 18.5074, lng: 73.8077, city: 'Pune', area: 'Kothrud', state: 'Maharashtra' },
  wakad: { lat: 18.5987, lng: 73.7667, city: 'Pune', area: 'Wakad', state: 'Maharashtra' },
  baner: { lat: 18.559, lng: 73.7868, city: 'Pune', area: 'Baner', state: 'Maharashtra' },
  hinjawadi: { lat: 18.5913, lng: 73.7389, city: 'Pune', area: 'Hinjawadi', state: 'Maharashtra' },
  'viman nagar': { lat: 18.5679, lng: 73.9143, city: 'Pune', area: 'Viman Nagar', state: 'Maharashtra' },
  'kalyani nagar': { lat: 18.5482, lng: 73.9025, city: 'Pune', area: 'Kalyani Nagar', state: 'Maharashtra' },
  aundh: { lat: 18.5626, lng: 73.8087, city: 'Pune', area: 'Aundh', state: 'Maharashtra' },
  hadapsar: { lat: 18.5089, lng: 73.926, city: 'Pune', area: 'Hadapsar', state: 'Maharashtra' },

  // Key Micro-Markets - Hyderabad
  'banjara hills': { lat: 17.4156, lng: 78.4357, city: 'Hyderabad', area: 'Banjara Hills', state: 'Telangana' },
  'jubilee hills': { lat: 17.4319, lng: 78.4074, city: 'Hyderabad', area: 'Jubilee Hills', state: 'Telangana' },
  gachibowli: { lat: 17.4401, lng: 78.3489, city: 'Hyderabad', area: 'Gachibowli', state: 'Telangana' },
  'hitec city': { lat: 17.4474, lng: 78.3762, city: 'Hyderabad', area: 'Hitec City', state: 'Telangana' },
  madhapur: { lat: 17.4483, lng: 78.3915, city: 'Hyderabad', area: 'Madhapur', state: 'Telangana' },
  kukatpally: { lat: 17.4849, lng: 78.4138, city: 'Hyderabad', area: 'Kukatpally', state: 'Telangana' },
  kondapur: { lat: 17.4699, lng: 78.3578, city: 'Hyderabad', area: 'Kondapur', state: 'Telangana' },

  // Key Micro-Markets - Jaipur
  'malviya nagar': { lat: 26.8532, lng: 75.8052, city: 'Jaipur', area: 'Malviya Nagar', state: 'Rajasthan' },
  'vaishali nagar': { lat: 26.906, lng: 75.7431, city: 'Jaipur', area: 'Vaishali Nagar', state: 'Rajasthan' },
  mansarovar: { lat: 26.8549, lng: 75.7663, city: 'Jaipur', area: 'Mansarovar', state: 'Rajasthan' },
  'c-scheme': { lat: 26.9084, lng: 75.7997, city: 'Jaipur', area: 'C-Scheme', state: 'Rajasthan' },
  'raja park': { lat: 26.8972, lng: 75.8267, city: 'Jaipur', area: 'Raja Park', state: 'Rajasthan' },
  jagatpura: { lat: 26.8229, lng: 75.8398, city: 'Jaipur', area: 'Jagatpura', state: 'Rajasthan' },
  'tonk road': { lat: 26.8617, lng: 75.795, city: 'Jaipur', area: 'Tonk Road', state: 'Rajasthan' },

  // Key Micro-Markets - Chennai
  'anna nagar': { lat: 13.085, lng: 80.2101, city: 'Chennai', area: 'Anna Nagar', state: 'Tamil Nadu' },
  't nagar': { lat: 13.0418, lng: 80.2341, city: 'Chennai', area: 'T. Nagar', state: 'Tamil Nadu' },
  adyar: { lat: 13.0012, lng: 80.2565, city: 'Chennai', area: 'Adyar', state: 'Tamil Nadu' },
  velachery: { lat: 12.9815, lng: 80.218, city: 'Chennai', area: 'Velachery', state: 'Tamil Nadu' },
  omr: { lat: 12.9249, lng: 80.2311, city: 'Chennai', area: 'Old Mahabalipuram Road', state: 'Tamil Nadu' },

  // Key Micro-Markets - Kolkata
  'salt lake': { lat: 22.5867, lng: 88.4178, city: 'Kolkata', area: 'Salt Lake Sector V', state: 'West Bengal' },
  'new town': { lat: 22.5857, lng: 88.4727, city: 'Kolkata', area: 'New Town Action Area I', state: 'West Bengal' },
  'park street': { lat: 22.5535, lng: 88.3524, city: 'Kolkata', area: 'Park Street', state: 'West Bengal' },
  ballygunge: { lat: 22.528, lng: 88.3653, city: 'Kolkata', area: 'Ballygunge', state: 'West Bengal' },

  // Key Micro-Markets - Ahmedabad
  satellite: { lat: 23.0305, lng: 72.5178, city: 'Ahmedabad', area: 'Satellite', state: 'Gujarat' },
  bodakdev: { lat: 23.0454, lng: 72.5108, city: 'Ahmedabad', area: 'Bodakdev', state: 'Gujarat' },
  'sg highway': { lat: 23.0754, lng: 72.5278, city: 'Ahmedabad', area: 'SG Highway', state: 'Gujarat' },
  vastrapur: { lat: 23.035, lng: 72.5293, city: 'Ahmedabad', area: 'Vastrapur', state: 'Gujarat' },
  'prahlad nagar': { lat: 23.0118, lng: 72.5113, city: 'Ahmedabad', area: 'Prahlad Nagar', state: 'Gujarat' },
};

export function getCoordinatesForCity(cityName: string): { lat: number; lng: number } {
  const resolved = resolveLocationCoordinates(cityName);
  return { lat: resolved.lat, lng: resolved.lng };
}

export interface ResolvedLocation {
  lat: number;
  lng: number;
  city: string;
  area: string;
  state?: string;
  matchedName: string;
}

/**
 * Intelligent location coordinate resolution across cities and micro-markets
 */
export function resolveLocationCoordinates(locationInput: string, fallbackCity?: string): ResolvedLocation {
  const raw = (locationInput || '').trim();
  const normalized = raw.toLowerCase().replace(/[,.-]/g, ' ');

  // 1. Exact or partial match in dictionary (prefer longest key match for micro-markets)
  const keys = Object.keys(CITY_COORDINATES).sort((a, b) => b.length - a.length);

  for (const k of keys) {
    // Check if input contains the key as a word or substring
    const regex = new RegExp(`\\b${k}\\b`, 'i');
    if (regex.test(normalized) || normalized.includes(k)) {
      const data = CITY_COORDINATES[k];
      return {
        lat: data.lat,
        lng: data.lng,
        city: data.city || (k.charAt(0).toUpperCase() + k.slice(1)),
        area: data.area || (k.charAt(0).toUpperCase() + k.slice(1)),
        state: data.state || 'India',
        matchedName: k,
      };
    }
  }

  // 2. Fallback to fallbackCity if provided
  if (fallbackCity && fallbackCity !== locationInput) {
    return resolveLocationCoordinates(fallbackCity);
  }

  // 3. Fallback default
  return {
    lat: 26.8532,
    lng: 75.8052,
    city: raw || 'Jaipur',
    area: raw || 'Central Market',
    state: 'Rajasthan',
    matchedName: 'default',
  };
}

// Generates location analysis & scoring
export function generateLocationAnalysis(
  clinicId: string,
  city: string = 'Jaipur',
  area: string = 'Malviya Nagar',
  clinicType: ClinicType = 'General Clinic',
  patientsPerDay: number = 30
): LocationAnalysis {
  const baseCoords = getCoordinatesForCity(city);

  return {
    clinicId,
    overallScore: 84,
    demandScore: 88,
    competitionScore: 76,
    accessibilityScore: 91,
    affordabilityScore: 82,
    lastUpdated: new Date().toISOString(),
    disclaimer: 'Estimated using available demographic and geographic input models. Verify on-site footfalls and commercial zoning locally before committing to long-term leases.',
    zones: [
      {
        id: 'zone-1',
        name: `${area} Main Market / Commercial Hub (${city})`,
        overallScore: 88,
        estimatedRentRange: '₹45,000 - ₹65,000 / mo',
        competitionLevel: 'Moderate',
        demandLevel: 'Very High',
        lat: Number((baseCoords.lat + 0.0035).toFixed(6)),
        lng: Number((baseCoords.lng + 0.0042).toFixed(6)),
        address: `${area} Commercial Sector, ${city}`,
        pros: [
          'High density residential catchments within 1.5 km radius',
          'Excellent road visibility and ground-floor accessibility for elderly patients',
          'Adjacent pharmacies and medical diagnostic labs create a healthcare synergy',
        ],
        cons: [
          'Higher commercial deposit requirement (typically 4-6 months)',
          'Evening rush hour parking constraints',
        ],
        recommendation: 'Top pick for patient convenience and brand visibility. High footfall accelerates break-even time.',
      },
      {
        id: 'zone-2',
        name: `${area} Residential Sectors 3 & 4 (${city})`,
        overallScore: 81,
        estimatedRentRange: '₹28,000 - ₹38,000 / mo',
        competitionLevel: 'Low',
        demandLevel: 'High',
        lat: Number((baseCoords.lat - 0.0045).toFixed(6)),
        lng: Number((baseCoords.lng - 0.0032).toFixed(6)),
        address: `${area} Residential Colony, ${city}`,
        pros: [
          'Significantly lower rental overheads reducing break-even threshold',
          'Dedicated car and two-wheeler parking available',
          'Loyal neighborhood family practice patient base',
        ],
        cons: [
          'Lower organic drive-by visibility; requires targeted local digital marketing',
          'May require local municipal zoning clearance for commercial clinic in mixed use',
        ],
        recommendation: 'Ideal if budget conscious. Very strong for pediatric, dental, or family medicine clinics.',
      },
      {
        id: 'zone-3',
        name: `Arterial Ring Road & Transit Hub (${city})`,
        overallScore: 74,
        estimatedRentRange: '₹35,000 - ₹48,000 / mo',
        competitionLevel: 'High',
        demandLevel: 'Moderate',
        lat: Number((baseCoords.lat - 0.0125).toFixed(6)),
        lng: Number((baseCoords.lng + 0.0138).toFixed(6)),
        address: `Ring Road / Metro Approach, ${city}`,
        pros: [
          'Easy public transit and ambulance approach roads',
          'Spacious floor plans suitable for future expansion or physiotherapy gym',
        ],
        cons: [
          'High competition from established multi-specialty nursing homes nearby',
          'Pedestrian crossing can be challenging for mobility-impaired patients',
        ],
        recommendation: 'Best suited if prioritizing easy regional patient transit over local walk-ins.',
      },
    ],
  };
}


// Computes full cost structure
export function calculateCostStructure(
  clinicId: string,
  clinic: Clinic,
  equipment: EquipmentItem[],
  staff: StaffRoleItem[]
): CostStructure {
  const currency = clinic.budget.currency || '₹';
  const monthlyRent = clinic.budget.monthlyRentBudget || 35000;

  // Equipment total from items
  const equipmentTotal = equipment.reduce((sum, item) => sum + item.estimatedTotalCost, 0);

  // Staff monthly salaries total
  const staffMonthlyTotal = staff.reduce(
    (sum, item) => sum + item.monthlySalaryEstimate * item.recommendedCount,
    0
  );

  const initialCapital = {
    securityDeposit: monthlyRent * 3,
    interiorSetup: clinic.budget.interiorBudget || 250000,
    furniture: 95000,
    medicalEquipment: equipmentTotal > 0 ? equipmentTotal : (clinic.budget.equipmentBudget || 350000),
    itEquipment: 65000,
    registrationLegal: 35000,
    brandingSignage: 30000,
    initialInventory: 45000,
    miscellaneous: 25000,
    total: 0,
  };

  initialCapital.total = Object.values(initialCapital).reduce((a, b) => a + b, 0);

  const monthlyExpenses = {
    rent: monthlyRent,
    salaries: staffMonthlyTotal > 0 ? staffMonthlyTotal : (clinic.budget.staffBudget || 140000),
    electricity: 9000,
    internet: 2000,
    maintenance: 4500,
    consumables: 15000,
    marketing: 10000,
    software: 3500,
    miscellaneous: 6000,
    total: 0,
  };

  monthlyExpenses.total = Object.values(monthlyExpenses).reduce((a, b) => a + b, 0);

  return {
    clinicId,
    currency,
    initialCapital,
    monthlyExpenses,
    totalInitialInvestment: initialCapital.total,
    totalMonthlyOperatingCost: monthlyExpenses.total,
    totalAnnualOperatingCost: monthlyExpenses.total * 12,
  };
}

// Computes complete revenue forecast
export function calculateRevenueForecast(
  clinicId: string,
  patientsPerDay: number = 30,
  consultationFee: number = 500,
  workingDaysPerMonth: number = 26,
  otherServicesRevenuePerPatient: number = 180,
  monthlyOperatingExpenses: number = 215000,
  initialInvestment: number = 950000,
  currency: string = '₹'
): RevenueForecast {
  const averageRevenuePerPatient = consultationFee + otherServicesRevenuePerPatient;
  const dailyRevenue = patientsPerDay * averageRevenuePerPatient;
  const monthlyRevenue = dailyRevenue * workingDaysPerMonth;
  const annualRevenue = monthlyRevenue * 12;

  const monthlyProfit = monthlyRevenue - monthlyOperatingExpenses;
  const annualProfit = monthlyProfit * 12;
  const profitMarginPercent = monthlyRevenue > 0 ? Math.round((monthlyProfit / monthlyRevenue) * 100) : 0;

  // Estimated break even months: Initial Investment / Monthly profit (if profit > 0)
  const estimatedBreakEvenMonths =
    monthlyProfit > 0
      ? Math.max(1, Math.round((initialInvestment / monthlyProfit) * 10) / 10)
      : 999;

  // Cumulative cashflow projection for 12 months with ramp-up curve
  // Month 1 starts at 60% capacity, scaling to 100% by month 4
  const cumulativeCashflow = [];
  let cumulativeCash = -initialInvestment;

  const monthNames = [
    'Month 1', 'Month 2', 'Month 3', 'Month 4', 'Month 5', 'Month 6',
    'Month 7', 'Month 8', 'Month 9', 'Month 10', 'Month 11', 'Month 12',
  ];

  for (let i = 0; i < 12; i++) {
    const rampFactor = i === 0 ? 0.6 : i === 1 ? 0.75 : i === 2 ? 0.9 : 1.0;
    const mRev = Math.round(monthlyRevenue * rampFactor);
    const mExp = monthlyOperatingExpenses;
    const net = mRev - mExp;
    cumulativeCash += net;

    cumulativeCashflow.push({
      month: i + 1,
      monthName: monthNames[i],
      revenue: mRev,
      expenses: mExp,
      netProfit: net,
      cumulativeCash: Math.round(cumulativeCash),
    });
  }

  return {
    clinicId,
    currency,
    patientsPerDay,
    consultationFee,
    workingDaysPerMonth,
    otherServicesRevenuePerPatient,
    averageRevenuePerPatient,
    dailyRevenue,
    monthlyRevenue,
    annualRevenue,
    monthlyOperatingExpenses,
    monthlyProfit,
    annualProfit,
    profitMarginPercent,
    estimatedBreakEvenMonths,
    cumulativeCashflow,
  };
}

// Realistic Demo Clinic as requested in Section 24
// "Example clinic: General Clinic, City: Jaipur, Expected patients/day: 30, Consultation fee: ₹500, Working days: 26"
export function createDemoClinic(): Clinic {
  const clinicId = 'demo-jaipur-general-clinic';
  return {
    id: clinicId,
    userId: 'demo-user-1',
    name: 'Aarogya Family Health Clinic',
    clinicType: 'General Clinic',
    location: {
      country: 'India',
      state: 'Rajasthan',
      city: 'Jaipur',
      area: 'Malviya Nagar',
      preferredLocation: 'Calgiri Marg Main Market',
      approxAreaSqFt: 850,
      latitude: 26.8532,
      longitude: 75.8052,
    },
    capacity: {
      consultationRooms: 2,
      expectedPatientsPerDay: 30,
      workingHoursPerDay: 9,
      workingDaysPerWeek: 6,
    },
    budget: {
      currency: '₹',
      totalBudget: 1200000,
      monthlyRentBudget: 38000,
      equipmentBudget: 380000,
      interiorBudget: 240000,
      staffBudget: 140000,
    },
    services: [
      'General Consultations',
      'Routine Health Checkups',
      'Minor Wound Dressing & Suturing',
      'Vaccinations & Immunizations',
      'Blood Sugar & BP Screening',
      'Emergency First Aid & Triage',
      'ECG & Basic Diagnostics',
      'Preventive Health Counseling',
    ],
    status: 'configured',
    setupProgress: {
      profile: true,
      location: true,
      equipment: true,
      staff: true,
      budget: true,
      legal: true,
      revenue: true,
      report: true,
    },
    createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

export const CLINIC_TYPE_SERVICES = CLINIC_SERVICES_PRESETS;
export const DEFAULT_METRO_CITIES = [
  'Jaipur',
  'Mumbai',
  'Delhi NCR',
  'Bengaluru',
  'Hyderabad',
  'Chennai',
  'Pune',
  'Ahmedabad',
  'Kolkata',
  'Indore',
  'Lucknow',
  'Chandigarh',
];

