import { StockItem, EQATrial, StaffMember, ShiftAssignment, DirectorySection, LabAnalysisSample, NotificationItem, DailyNote, UserAccount } from '../types';

export const INITIAL_STOCK_ITEMS: StockItem[] = [
  {
    id: 'stock-1',
    name: 'EDTA Tube 4ml',
    code: '#BT-402',
    category: 'blood_tubes',
    categoryLabel: 'BLOOD TUBES',
    quantity: 12,
    minQuantity: 50,
    unit: 'units',
    status: 'critical',
    location: 'Rack B-04',
    expiryDate: '2026-11-30',
    lotNumber: 'ED2026-994',
    supplier: 'BD Vacutainer'
  },
  {
    id: 'stock-2',
    name: 'Urine Cup 60ml',
    code: '#CN-105',
    category: 'containers',
    categoryLabel: 'CONTAINERS',
    quantity: 45,
    minQuantity: 100,
    unit: 'units',
    status: 'low',
    location: 'Aisle 2, Bin 12',
    expiryDate: '2027-06-15',
    lotNumber: 'UC-8821',
    supplier: 'Sarstedt'
  },
  {
    id: 'stock-3',
    name: 'Serum Separator',
    code: '#BT-882',
    category: 'blood_tubes',
    categoryLabel: 'BLOOD TUBES',
    quantity: 320,
    minQuantity: 150,
    unit: 'units',
    status: 'normal',
    location: 'Rack A-01',
    expiryDate: '2027-01-20',
    lotNumber: 'SST-4091',
    supplier: 'BD Vacutainer'
  },
  {
    id: 'stock-4',
    name: 'Gram Stain Kit',
    code: '#RG-011',
    category: 'reagents',
    categoryLabel: 'REAGENTS',
    quantity: 18,
    minQuantity: 5,
    unit: 'kits',
    status: 'normal',
    location: 'Cold Room 4°C - Shelf 3',
    expiryDate: '2026-12-10',
    lotNumber: 'GSK-2026B',
    supplier: 'Sigma-Aldrich'
  },
  {
    id: 'stock-5',
    name: 'Sodium Citrate 3.2% 2.7ml',
    code: '#BT-309',
    category: 'blood_tubes',
    categoryLabel: 'BLOOD TUBES',
    quantity: 180,
    minQuantity: 100,
    unit: 'units',
    status: 'normal',
    location: 'Rack B-01',
    expiryDate: '2026-12-05',
    lotNumber: 'CT-7740',
    supplier: 'Greiner Bio-One'
  },
  {
    id: 'stock-6',
    name: 'Blood Culture Bottle (Aerobic)',
    code: '#CN-340',
    category: 'containers',
    categoryLabel: 'CONTAINERS',
    quantity: 28,
    minQuantity: 40,
    unit: 'bottles',
    status: 'low',
    location: 'Microbiology Prep Rm',
    expiryDate: '2026-10-30',
    lotNumber: 'BC-9901',
    supplier: 'bioMérieux'
  },
  {
    id: 'stock-7',
    name: 'Cobas ISE Cleaning Solution',
    code: '#RG-801',
    category: 'reagents',
    categoryLabel: 'REAGENTS',
    quantity: 4,
    minQuantity: 6,
    unit: 'bottles',
    status: 'low',
    location: 'Chemistry Reagent Bay',
    expiryDate: '2026-10-18',
    lotNumber: 'ISE-662',
    supplier: 'Roche Diagnostics'
  },
  {
    id: 'stock-8',
    name: 'Pipette Filter Tips 1000µl',
    code: '#CS-101',
    category: 'consumables',
    categoryLabel: 'CONSUMABLES',
    quantity: 850,
    minQuantity: 300,
    unit: 'tips',
    status: 'normal',
    location: 'Central Storage Cabinet',
    expiryDate: '2028-01-01',
    lotNumber: 'PFT-1000',
    supplier: 'Eppendorf'
  },
  {
    id: 'stock-9',
    name: 'Latex Examination Gloves (M)',
    code: '#CS-004',
    category: 'consumables',
    categoryLabel: 'CONSUMABLES',
    quantity: 14,
    minQuantity: 30,
    unit: 'boxes',
    status: 'low',
    location: 'PPE Locker 1',
    expiryDate: '2027-12-31',
    lotNumber: 'GLV-2026',
    supplier: 'Ansell'
  }
];

export const INITIAL_EQA_TRIALS: EQATrial[] = [
  {
    id: 'eqa-1',
    scheme: 'RIQAS',
    title: 'EQAS Hematology',
    cycle: 'Cycle 48',
    trialNumber: 'Trial 08',
    receivedDate: 'Aug 12, 2026',
    deadlineDate: 'Aug 26, 2026',
    instrument: 'Sysmex XN-1000',
    assignedStaff: 'Dr. Jane Doe, MT',
    labSection: 'Hematology Bay',
    status: 'due_tomorrow',
    statusLabel: 'Due Soon',
    parameters: ['WBC', 'RBC', 'HGB', 'HCT', 'PLT', 'MCV'],
    resultValues: { WBC: '6.45 10^3/uL', RBC: '4.82 10^6/uL', HGB: '14.2 g/dL', PLT: '240 10^3/uL' }
  },
  {
    id: 'eqa-2',
    scheme: 'CAP',
    title: 'Clinical Chemistry',
    cycle: 'Cycle 2026-B',
    trialNumber: 'Trial 02',
    receivedDate: 'Aug 10, 2026',
    deadlineDate: 'Sep 05, 2026',
    instrument: 'Cobas 8000',
    assignedStaff: 'Somchai P.',
    labSection: 'Core Lab',
    status: 'pending',
    statusLabel: 'Pending Analysis',
    parameters: ['Glucose', 'BUN', 'Creatinine', 'AST', 'ALT', 'Sodium', 'Potassium']
  },
  {
    id: 'eqa-3',
    scheme: 'UKNEQAS',
    title: 'Coagulation',
    cycle: 'Cycle 26',
    trialNumber: 'Trial 11',
    receivedDate: 'Jul 15, 2026',
    deadlineDate: 'Aug 02, 2026',
    submittedDate: 'Aug 01, 2026',
    instrument: 'ACL Top 550',
    assignedStaff: 'Dr. Jane Doe, MT',
    labSection: 'Hemostasis Lab',
    status: 'submitted',
    statusLabel: 'Submitted',
    parameters: ['PT/INR', 'APTT', 'Fibrinogen', 'D-Dimer'],
    score: '99.2% Acceptable (Z-score 0.42)'
  },
  {
    id: 'eqa-4',
    scheme: 'EQAS',
    title: 'Immunoassay Panel',
    cycle: 'Cycle 22',
    trialNumber: 'Trial 04',
    receivedDate: 'Aug 05, 2026',
    deadlineDate: 'Aug 22, 2026',
    instrument: 'Cobas 8000',
    assignedStaff: 'Somchai P.',
    labSection: 'Immunology',
    status: 'overdue',
    statusLabel: 'Overdue (1 Day)',
    parameters: ['TSH', 'Free T4', 'Ferritin', 'Troponin I']
  },
  {
    id: 'eqa-5',
    scheme: 'CAP',
    title: 'Urinalysis & Microscopy',
    cycle: 'Cycle 2026-C',
    trialNumber: 'Trial 01',
    receivedDate: 'Aug 18, 2026',
    deadlineDate: 'Sep 10, 2026',
    instrument: 'Iris iQ200',
    assignedStaff: 'Somchai P.',
    labSection: 'Microscopy Lab',
    status: 'pending',
    statusLabel: 'Pending Analysis',
    parameters: ['Specific Gravity', 'pH', 'Protein', 'Leukocyte Esterase', 'RBC Casts']
  }
];

export const INITIAL_STAFF: StaffMember[] = [
  {
    id: 'staff-1',
    name: 'Dr. Jane D...',
    fullName: 'Dr. Jane Doe, MT (ASCP)',
    role: 'SENIOR MT',
    department: 'Hematology & Clinical Microscopy',
    dutyStatus: 'ON DUTY',
    avatarUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=160&q=80',
    phone: '+66 2 419 7001',
    email: 'jane.doe@labvibraram.hospital',
    shiftsThisMonth: 18
  },
  {
    id: 'staff-2',
    name: 'Mark L...',
    fullName: 'Mark Lewis',
    role: 'LAB ASSISTANT',
    department: 'Sample Reception & Pre-analytics',
    dutyStatus: 'OFF DUTY',
    avatarUrl: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=160&q=80',
    phone: '+66 2 419 7002',
    email: 'mark.l@labvibraram.hospital',
    shiftsThisMonth: 15
  },
  {
    id: 'staff-3',
    name: 'Alice Smi...',
    fullName: 'Alice Smith',
    role: 'PATHOLOGY TECH',
    department: 'Histopathology & Cytology',
    dutyStatus: 'ON DUTY',
    avatarUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=160&q=80',
    phone: '+66 2 419 7003',
    email: 'alice.smith@labvibraram.hospital',
    shiftsThisMonth: 16
  },
  {
    id: 'staff-4',
    name: 'Somchai P.',
    fullName: 'Somchai Prasert, MT',
    role: 'SENIOR MT',
    department: 'Clinical Chemistry',
    dutyStatus: 'ON DUTY',
    avatarUrl: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=160&q=80',
    phone: '+66 2 419 7004',
    email: 'somchai.p@labvibraram.hospital',
    shiftsThisMonth: 20
  },
  {
    id: 'staff-5',
    name: 'Nattapong K.',
    fullName: 'Nattapong Kittisak',
    role: 'PATHOLOGY TECH',
    department: 'Hematology',
    dutyStatus: 'ON DUTY',
    avatarUrl: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&w=160&q=80',
    phone: '+66 2 419 7005',
    email: 'nattapong.k@labvibraram.hospital',
    shiftsThisMonth: 17
  },
  {
    id: 'staff-6',
    name: 'Wipa W.',
    fullName: 'Wipa Wattanaporn',
    role: 'MICROBIOLOGIST',
    department: 'Microbiology & Infectious Diseases',
    dutyStatus: 'OFF DUTY',
    avatarUrl: 'https://images.unsplash.com/photo-1594824813589-49774640d2eb?auto=format&fit=crop&w=160&q=80',
    phone: '+66 2 419 7006',
    email: 'wipa.w@labvibraram.hospital',
    shiftsThisMonth: 14
  }
];

// Helper to create current year/month date strings
const getShiftDate = (day: number): string => {
  const now = new Date();
  const year = now.getFullYear();
  const month = (now.getMonth() + 1).toString().padStart(2, '0');
  const d = Math.max(1, Math.min(28, day)).toString().padStart(2, '0');
  return `${year}-${month}-${d}`;
};

export const INITIAL_SHIFTS: ShiftAssignment[] = [
  {
    id: 'shift-1',
    date: getShiftDate(1),
    staffId: 'staff-1',
    staffName: 'Dr. Jane D..',
    role: 'SENIOR MT',
    avatarUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=160&q=80',
    shiftType: 'Morning (07:00-15:00)',
    section: 'Hematology'
  },
  {
    id: 'shift-2',
    date: getShiftDate(2),
    staffId: 'staff-3',
    staffName: 'Alice S..',
    role: 'PATHOLOGY TECH',
    avatarUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=160&q=80',
    shiftType: 'Morning (07:00-15:00)',
    section: 'Pathology'
  },
  {
    id: 'shift-3',
    date: getShiftDate(2),
    staffId: 'staff-2',
    staffName: 'Mark L..',
    role: 'LAB ASSISTANT',
    avatarUrl: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=160&q=80',
    shiftType: 'Afternoon (15:00-23:00)',
    section: 'Sample Reception'
  },
  {
    id: 'shift-4',
    date: getShiftDate(5),
    staffId: 'staff-4',
    staffName: 'Somchai P.',
    role: 'SENIOR MT',
    avatarUrl: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=160&q=80',
    shiftType: 'Morning (07:00-15:00)',
    section: 'Chemistry'
  },
  {
    id: 'shift-5',
    date: getShiftDate(12),
    staffId: 'staff-5',
    staffName: 'Nattapong K.',
    role: 'PATHOLOGY TECH',
    avatarUrl: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&w=160&q=80',
    shiftType: 'Night (23:00-07:00)',
    section: 'Hematology STAT'
  },
  {
    id: 'shift-6',
    date: getShiftDate(18),
    staffId: 'staff-1',
    staffName: 'Dr. Jane D..',
    role: 'SENIOR MT',
    avatarUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=160&q=80',
    shiftType: 'General (08:30-17:00)',
    section: 'EQA Assessment'
  },
  {
    id: 'shift-7',
    date: getShiftDate(23),
    staffId: 'staff-4',
    staffName: 'Somchai P.',
    role: 'SENIOR MT',
    avatarUrl: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=160&q=80',
    shiftType: 'Morning (07:00-15:00)',
    section: 'Chemistry & Immunoassay'
  },
  {
    id: 'shift-8',
    date: getShiftDate(23),
    staffId: 'staff-6',
    staffName: 'Wipa W.',
    role: 'MICROBIOLOGIST',
    avatarUrl: 'https://images.unsplash.com/photo-1594824813589-49774640d2eb?auto=format&fit=crop&w=160&q=80',
    shiftType: 'Afternoon (15:00-23:00)',
    section: 'Microbiology Bay'
  },
  {
    id: 'shift-9',
    date: getShiftDate(24),
    staffId: 'staff-2',
    staffName: 'Mark L..',
    role: 'LAB ASSISTANT',
    avatarUrl: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=160&q=80',
    shiftType: 'Morning (07:00-15:00)',
    section: 'Sample Reception'
  }
];

export const DIRECTORY_SECTIONS: DirectorySection[] = [
  {
    id: 'chem',
    title: 'Clinical Chemistry',
    titleThai: 'เคมีคลินิก',
    description: 'Electrolytes, enzymes, cardiac biomarkers, metabolic profiling',
    machines: [
      {
        id: 'chem-m1',
        name: 'Cobas 8000',
        category: 'Clinical Chemistry',
        extension: 'Ext. 102',
        leadSpecialist: 'Somchai P.',
        model: 'Modular Analytics c702 / ISE',
        iconName: 'science',
        status: 'Operational',
        location: 'Core Lab Zone B'
      }
    ],
    engineers: [
      {
        id: 'chem-e1',
        name: 'Dr. Sarah Jenkins',
        title: 'SERVICE ENGINEER',
        vendor: 'Roche Diagnostics',
        machineSupport: 'Cobas 8000',
        phone: '+1 (800) 228-1990',
        email: 'sarah.jenkins@roche.com',
        category: 'Clinical Chemistry',
        emergency24h: true
      }
    ],
    videos: [
      {
        id: 'chem-v1',
        title: 'Cobas 8000 c702 Automation & Daily Loading Workflow',
        titleThai: 'ขั้นตอนการโหลดตัวอย่างและเริ่มรันเครื่อง Cobas 8000 อัตโนมัติ',
        url: 'https://www.youtube.com/watch?v=0k5iYyU0h0I',
        thumbnailUrl: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&w=600&q=80',
        machineId: 'chem-m1',
        machineName: 'Cobas 8000 (c702)',
        duration: '06:45',
        description: 'Complete guide on sample rack loading, reagent disk scanning, daily ISE calibration, and troubleshooting clot detection.',
        steps: [
          'Step 1: Check reagent disk inventory & wash solution levels on UI',
          'Step 2: Load barcoded 5-position sample racks into the input buffer tray',
          'Step 3: Verify ISE Calibrator 1 & 2 slope before initiating routine run',
          'Step 4: Monitor real-time STAT priority lane bypass'
        ],
        addedDate: '2026-08-15',
        author: 'Somchai P. (Senior MT)',
        tags: ['Automate', 'Calibration', 'Loading']
      },
      {
        id: 'chem-v2',
        title: 'Daily Photometer Lamp Check & Probe Rinse Protocol',
        titleThai: 'การบำรุงรักษาประจำวันและการล้างโพรบเครื่องวิเคราะห์เคมีคลินิก',
        url: 'https://www.youtube.com/watch?v=d_KzM8iR0aM',
        thumbnailUrl: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=600&q=80',
        machineId: 'chem-m1',
        machineName: 'Cobas 8000',
        duration: '04:12',
        description: 'Preventive maintenance protocol for cell wash detergent replenishment and optical photometer baseline check.',
        steps: [
          'Step 1: Perform Daily Sleep & Wake-up rinse routine from software',
          'Step 2: Clean sample probe tip with 70% isopropanol lint-free swab',
          'Step 3: Record optical intensity check in QC maintenance log'
        ],
        addedDate: '2026-08-18',
        author: 'Chief MT',
        tags: ['Maintenance', 'QC', 'Cleaning']
      }
    ]
  },
  {
    id: 'hema',
    title: 'Hematology',
    titleThai: 'ฮีมาโต',
    description: 'Complete blood count, differentials, coagulation, flow cytometry',
    machines: [
      {
        id: 'hema-m1',
        name: 'Sysmex XN-1000',
        category: 'Hematology',
        extension: 'Ext. 101',
        leadSpecialist: 'Nattapong K.',
        model: 'Automated Hematology Analyzer',
        iconName: 'bloodtype',
        status: 'Operational',
        location: 'Room 302 - Hematology Bay'
      },
      {
        id: 'hema-m2',
        name: 'Stago STAR Max',
        category: 'Hematology',
        extension: 'Ext. 104',
        leadSpecialist: 'Nattapong K.',
        model: 'Hemostasis Testing System',
        iconName: 'water_drop',
        status: 'Operational',
        location: 'Room 303 - Coagulation'
      }
    ],
    engineers: [
      {
        id: 'hema-e1',
        name: 'Marcus Chen',
        title: 'SERVICE ENGINEER',
        vendor: 'Sysmex Corp',
        machineSupport: 'XN-1000',
        phone: '+1 (888) 879-7639',
        email: 'marcus.chen@sysmex.com',
        category: 'Hematology',
        emergency24h: true
      }
    ],
    videos: [
      {
        id: 'hema-v1',
        title: 'Sysmex XN-1000 Automated CBC & Reticulocyte Mode Tutorial',
        titleThai: 'คู่มือการใช้งานเครื่องตรวจวิเคราะห์เม็ดเลือดอัตโนมัติ Sysmex XN-1000',
        url: 'https://www.youtube.com/watch?v=2Tz8XoI_q6g',
        thumbnailUrl: 'https://images.unsplash.com/photo-1579165466741-7f35e4755660?auto=format&fit=crop&w=600&q=80',
        machineId: 'hema-m1',
        machineName: 'Sysmex XN-1000',
        duration: '05:30',
        description: 'Step-by-step video on whole blood EDTA mixing, barcode rack alignment, automated flag review, and manual smear reflex.',
        steps: [
          'Step 1: Invert whole blood tubes 8-10 times gently before loading',
          'Step 2: Insert 10-tube rack with barcodes facing left scanning window',
          'Step 3: Press green Start button on sampler module',
          'Step 4: Check IPU flags (Blast?, Immature Granulocytes?, Platelet Clump?)'
        ],
        addedDate: '2026-08-10',
        author: 'Nattapong K. (Pathology Tech)',
        tags: ['Automate', 'CBC', 'Sysmex']
      },
      {
        id: 'hema-v2',
        title: 'Stago STAR Max Coagulation Automated Setup & Cuver Pipetting',
        titleThai: 'การใช้งานเครื่องตรวจการแข็งตัวของเลือด Stago STAR Max',
        url: 'https://www.youtube.com/watch?v=kYv_3c8W1R8',
        thumbnailUrl: 'https://images.unsplash.com/photo-1583912267550-d44d9c95b778?auto=format&fit=crop&w=600&q=80',
        machineId: 'hema-m2',
        machineName: 'Stago STAR Max',
        duration: '04:50',
        description: 'PT/INR, aPTT, and D-Dimer automated test profiling, reagent barcoding, and bead mechanical clot detection mechanism.',
        steps: [
          'Step 1: Check cuvette roll and steel ball dispenser status',
          'Step 2: Position citrated plasma micro-cups on sample rotor',
          'Step 3: Validate Thromborel S reagent lot on screen'
        ],
        addedDate: '2026-08-12',
        author: 'Nattapong K.',
        tags: ['Coagulation', 'PT/INR', 'Stago']
      }
    ]
  },
  {
    id: 'micro',
    title: 'Microbiology',
    titleThai: 'ไมครอส',
    description: 'Bacterial identification, antibiotic susceptibility testing, blood cultures',
    machines: [
      {
        id: 'micro-m1',
        name: 'VITEK 2',
        category: 'Microbiology',
        extension: 'Ext. 105',
        leadSpecialist: 'Wipa W.',
        model: 'Automated Microbial ID & AST',
        iconName: 'coronavirus',
        status: 'Operational',
        location: 'Biosafety Level 2 Cleanroom'
      }
    ],
    engineers: [
      {
        id: 'micro-e1',
        name: 'David Lee',
        title: 'SERVICE ENGINEER',
        vendor: 'bioMérieux',
        machineSupport: 'VITEK 2',
        phone: '+1 (800) 682-2666',
        email: 'david.lee@biomerieux.com',
        category: 'Microbiology',
        emergency24h: false
      }
    ],
    videos: [
      {
        id: 'micro-v1',
        title: 'VITEK 2 Automated Card Inoculation & Smart Incubation',
        titleThai: 'การเตรียมการ์ดและใส่เครื่องตรวจหาเชื้อ/ความไวต่อยา VITEK 2',
        url: 'https://www.youtube.com/watch?v=F1Y8y2P9s1k',
        thumbnailUrl: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=600&q=80',
        machineId: 'micro-m1',
        machineName: 'VITEK 2',
        duration: '07:15',
        description: 'How to prepare 0.5 McFarland bacterial suspension with DensiCHEK, attach GN/GP/AST cards, and initiate automated vacuum sealing.',
        steps: [
          'Step 1: Calibrate DensiCHEK meter with standard 0.5 McFarland tube',
          'Step 2: Prepare single isolated colony suspension in 0.45% saline',
          'Step 3: Insert cassette into vacuum chamber for automated filling',
          'Step 4: Transfer cassette into incubator reader slot'
        ],
        addedDate: '2026-08-08',
        author: 'Wipa W. (Microbiologist)',
        tags: ['Automate', 'VITEK2', 'AST']
      }
    ]
  },
  {
    id: 'immuno',
    title: 'Immunology',
    titleThai: 'ภูมิคุ้มวิทยา',
    description: 'Viral markers, hormone assays, tumor markers, autoimmunity',
    machines: [
      {
        id: 'immuno-m1',
        name: 'Architect i2000SR',
        category: 'Immunology',
        extension: 'Ext. 107',
        leadSpecialist: 'Ananya S.',
        model: 'Chemiluminescent Microparticle Immunoassay',
        iconName: 'vaccines',
        status: 'Operational',
        location: 'Core Lab Zone C'
      }
    ],
    engineers: [
      {
        id: 'immuno-e1',
        name: 'Emily Watson',
        title: 'FIELD SERVICE SPECIALIST',
        vendor: 'Abbott Diagnostics',
        machineSupport: 'Architect i2000SR',
        phone: '+1 (877) 422-2688',
        email: 'emily.watson@abbott.com',
        category: 'Immunology',
        emergency24h: true
      }
    ],
    videos: [
      {
        id: 'immuno-v1',
        title: 'Architect i2000SR CMIA Automated Immunoassay Operation',
        titleThai: 'คู่มือการใช้งานเครื่องตรวจภูมิคุ้มกันวิทยาและฮอร์โมนอัตโนมัติ Architect',
        url: 'https://www.youtube.com/watch?v=J_7bY9Yq1_w',
        thumbnailUrl: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=600&q=80',
        machineId: 'immuno-m1',
        machineName: 'Architect i2000SR',
        duration: '06:05',
        description: 'Automated loading of microparticle reagent bottles, reaction vessel bulk replenishment, and viral marker assay scheduling.',
        steps: [
          'Step 1: Scan master calibration 2D barcode on reagent kit box',
          'Step 2: Place microparticle bottles on chilled reagent carousel',
          'Step 3: Load sample carriers into RSH (Robotic Sample Handler)',
          'Step 4: Verify Trigger & Pre-Trigger reagent pressure lines'
        ],
        addedDate: '2026-08-14',
        author: 'Ananya S. (Senior MT)',
        tags: ['CMIA', 'Viral Markers', 'Automate']
      }
    ]
  },
  {
    id: 'bloodbank',
    title: 'Blood Bank',
    titleThai: 'คลังเลือด',
    description: 'ABO/Rh typing, antibody screening, cross-matching, component prep',
    machines: [
      {
        id: 'bb-m1',
        name: 'IH-1000',
        category: 'Blood Bank',
        extension: 'Ext. 110',
        leadSpecialist: 'Preecha M.',
        model: 'Fully Automated Immunohematology System',
        iconName: 'invert_colors',
        status: 'Operational',
        location: 'Transfusion Medicine Unit'
      }
    ],
    engineers: [
      {
        id: 'bb-e1',
        name: 'Michael Chang',
        title: 'SYSTEM SPECIALIST',
        vendor: 'Bio-Rad Laboratories',
        machineSupport: 'IH-1000',
        phone: '+1 (800) 224-6723',
        email: 'michael_chang@bio-rad.com',
        category: 'Blood Bank',
        emergency24h: true
      }
    ],
    videos: [
      {
        id: 'bb-v1',
        title: 'IH-1000 Automated Gel Card Blood Typing & Crossmatch Protocol',
        titleThai: 'การใช้งานระบบตรวจหมู่เลือดและเข้ากันได้อัตโนมัติ IH-1000 (Bio-Rad)',
        url: 'https://www.youtube.com/watch?v=3KqW2L9c_5E',
        thumbnailUrl: 'https://images.unsplash.com/photo-1615461066841-6116e61058f4?auto=format&fit=crop&w=600&q=80',
        machineId: 'bb-m1',
        machineName: 'IH-1000 Immunohematology',
        duration: '05:40',
        description: 'Complete walkthrough of automated IH-Card loading, camera image verification for agglutination grading (0 to 4+), and LIS auto-verification.',
        steps: [
          'Step 1: Unpack IH-Gel Cards and load into matrix rack tower',
          'Step 2: Check Red Blood Cell reagent suspension bottles (A1, B, O Cells)',
          'Step 3: Load patient plasma tubes and donor unit segment tubes',
          'Step 4: Machine performs automatic pipetting, centrifugation, and optical reading'
        ],
        addedDate: '2026-08-11',
        author: 'Preecha M. (Blood Bank Specialist)',
        tags: ['Gel Card', 'Blood Bank', 'Crossmatch']
      }
    ]
  },
  {
    id: 'special',
    title: 'Special Lab',
    titleThai: 'แลปพิเศษ',
    description: 'Tandem mass spectrometry, toxicological assays, genetic sequencing',
    machines: [
      {
        id: 'spec-m1',
        name: 'LC-MS/MS',
        category: 'Special Lab',
        extension: 'Ext. 115',
        leadSpecialist: 'Kanya T.',
        model: 'Triple Quadrupole Mass Spectrometer',
        iconName: 'biotech',
        status: 'Operational',
        location: 'Specialized Analytical Wing 4'
      }
    ],
    engineers: [
      {
        id: 'spec-e1',
        name: 'Robert Vance',
        title: 'APPLICATION SCIENTIST',
        vendor: 'Waters / Thermo Fisher',
        machineSupport: 'LC-MS/MS Platform',
        phone: '+1 (800) 252-4752',
        email: 'robert.vance@waters.com',
        category: 'Special Lab',
        emergency24h: false
      }
    ],
    videos: [
      {
        id: 'spec-v1',
        title: 'Automated Sample Prep & Autosampler Injection for Mass Spec',
        titleThai: 'การเตรียมตัวอย่างและการสั่งรัน Autosampler เครื่อง LC-MS/MS',
        url: 'https://www.youtube.com/watch?v=7h4R9kQ_5aM',
        thumbnailUrl: 'https://images.unsplash.com/photo-1530497610245-94d3c16cda28?auto=format&fit=crop&w=600&q=80',
        machineId: 'spec-m1',
        machineName: 'LC-MS/MS System',
        duration: '08:20',
        description: 'Operation of refrigerated autosampler 96-well plate, mobile phase gradient degassing, and electrospray ionization (ESI) source tuning.',
        steps: [
          'Step 1: Check high-purity HPLC-grade mobile phase levels A & B',
          'Step 2: Prime binary solvent pump at 1.0 mL/min flow rate',
          'Step 3: Seat 96-well deep-well filter plate into autosampler compartment',
          'Step 4: Launch sequence batch from MassLynx control workstation'
        ],
        addedDate: '2026-08-09',
        author: 'Kanya T. (Special Lab Lead)',
        tags: ['LC-MS/MS', 'MassSpec', 'Automation']
      }
    ]
  }
];

export const INITIAL_SAMPLES: LabAnalysisSample[] = [
  {
    id: 'spl-101',
    sampleId: 'SMP-2026-9081',
    patientName: 'Kittipat Wongsuwan',
    patientHn: 'HN-890214',
    testPanel: 'CBC + Differential & Reticulocyte',
    priority: 'STAT',
    specimen: 'Whole Blood',
    instrument: 'Sysmex XN-1000',
    assignedTech: 'Nattapong K.',
    requestedAt: '10 mins ago',
    status: 'Analyzing',
    tatMinutes: 25
  },
  {
    id: 'spl-102',
    sampleId: 'SMP-2026-9082',
    patientName: 'Siriporn Rattana',
    patientHn: 'HN-410982',
    testPanel: 'Troponin I STAT & CK-MB',
    priority: 'STAT',
    specimen: 'Plasma',
    instrument: 'Cobas 8000',
    assignedTech: 'Somchai P.',
    requestedAt: '18 mins ago',
    status: 'Pending Review',
    tatMinutes: 30
  },
  {
    id: 'spl-103',
    sampleId: 'SMP-2026-9083',
    patientName: 'Arthur Pendelton',
    patientHn: 'HN-771209',
    testPanel: 'Blood Culture & Sensitivity',
    priority: 'Urgent',
    specimen: 'Whole Blood',
    instrument: 'VITEK 2',
    assignedTech: 'Wipa W.',
    requestedAt: '45 mins ago',
    status: 'Analyzing',
    tatMinutes: 120
  },
  {
    id: 'spl-104',
    sampleId: 'SMP-2026-9084',
    patientName: 'Pranee Srisuk',
    patientHn: 'HN-553201',
    testPanel: 'Lipid Panel + HbA1c + Renal Profile',
    priority: 'Routine',
    specimen: 'Serum',
    instrument: 'Cobas 8000',
    assignedTech: 'Somchai P.',
    requestedAt: '1 hr ago',
    status: 'Completed',
    tatMinutes: 60
  }
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    title: 'Low Stock Alert',
    message: 'EDTA Tube 4ml (#BT-402) has fallen to 12 units (Minimum: 50). Critical replenishment required.',
    time: '5m ago',
    type: 'urgent',
    read: false,
    tabTarget: 'stock'
  },
  {
    id: 'notif-2',
    title: 'EQA Due Soon',
    message: 'RIQAS EQAS Hematology (Cycle 48 / Trial 08) deadline is Aug 26, 2026.',
    time: '25m ago',
    type: 'warning',
    read: false,
    tabTarget: 'eqa'
  },
  {
    id: 'notif-3',
    title: 'Shift Schedule Updated',
    message: 'Dr. Jane Doe has been assigned to Hematology Morning Shift for tomorrow.',
    time: '1h ago',
    type: 'info',
    read: false,
    tabTarget: 'roster'
  },
  {
    id: 'notif-4',
    title: 'Calibration Verified',
    message: 'Cobas 8000 daily quality control Passed with all standard deviations < 1.5 SD.',
    time: '3h ago',
    type: 'success',
    read: true,
    tabTarget: 'dashboard'
  }
];

export const INITIAL_DAILY_NOTES: DailyNote[] = [
  {
    id: 'note-1',
    text: 'Cobas 8000 daily photometer lamp check & probe rinse cycle before 14:00',
    category: 'maintenance',
    completed: false,
    time: '14:00',
    date: 'Today',
    author: 'Chief MT'
  },
  {
    id: 'note-2',
    text: 'Follow up on hemolyzed specimen from ER Ward 4 (Patient HN-489102)',
    category: 'urgent',
    completed: false,
    time: '11:30',
    date: 'Today',
    author: 'Hematology Tech'
  },
  {
    id: 'note-3',
    text: 'Shift Handover: New EDTA Tube batch arrives at Central Storage at 16:00',
    category: 'handover',
    completed: false,
    time: '16:00',
    date: 'Today',
    author: 'Day Shift'
  },
  {
    id: 'note-4',
    text: 'Check and record reagent refrigerator temperatures (2°C - 8°C)',
    category: 'routine',
    completed: true,
    time: '08:30',
    date: 'Today',
    author: 'Lab Staff'
  }
];

export const DEFAULT_TEAM_USER: UserAccount = {
  id: 'lab-team',
  username: 'lab',
  password: 'password123',
  pin: '1234',
  fullName: 'LABVIBHARAM Team',
  role: 'Clinical Laboratory Staff',
  department: 'Diagnostic Pathology Core',
  avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCRDgie8LK_3kewV2vro0B0tP7542xL00uoisyQ9Ppp8aDcIkz56NsZ7Q1nPIOwOxP-wOBztmjzazsZhlNo1_oIRC8AJcBWSGvO_QuiTue9pT0khpGeYESgCv-losTCThG3Z3jXU7qcBTt5Hli2Repc0Xc6PLdaaZrps6mS0TL4ykPaFN7AfwgHdl_ac1RtBfHIyFknD8FHaKimx-tgZGwBgxAuYuWLTLiqYBLmA3QgRZ_-qsGdljE',
  initials: 'LT',
  email: 'lab@labvibharam.hospital',
  staffId: 'LAB-TEAM',
  badgeNumber: 'LAB-ALL-01'
};

export const DEFAULT_USERS: UserAccount[] = [
  DEFAULT_TEAM_USER
];
