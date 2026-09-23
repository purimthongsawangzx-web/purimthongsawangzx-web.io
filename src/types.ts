export type NavigationTab = 'dashboard' | 'stock' | 'outlab' | 'eqa' | 'roster' | 'contacts' | 'support' | 'settings';

export type StockCategory = 'all' | 'blood_tubes' | 'containers' | 'reagents' | 'consumables';

export type StockStatus = 'critical' | 'low' | 'normal';

export interface StockLot {
  id: string;
  lotNumber: string;
  expiryDate?: string;
  receivedDate?: string;
  quantity?: number;
  status?: 'active' | 'expired' | 'depleted';
  notes?: string;
}

export interface StockItem {
  id: string;
  name: string;
  code: string;
  category: 'blood_tubes' | 'containers' | 'reagents' | 'consumables';
  categoryLabel: string;
  quantity: number;
  minQuantity: number;
  unit: string;
  status: StockStatus;
  location?: string;
  expiryDate?: string;
  lotNumber?: string;
  supplier?: string;
  lots?: StockLot[];
}

export type EQAScheme =
  | 'RIQAS'
  | 'CAP'
  | 'UKNEQAS'
  | 'EQAS'
  | 'RCPA'
  | 'DMSC_BLQS'
  | 'EQAM_MAHIDOL'
  | 'INSTAND'
  | 'ONEWORLD'
  | 'ECAT'
  | 'WEQAS'
  | (string & {});

export interface EQASchemeDefinition {
  id: string;
  code: string;
  shortName: string;
  fullName: string;
  provider: string;
  country: string;
  category?: 'Global / International' | 'National / Regional' | 'Specialty' | 'Custom';
  description?: string;
  portalUrl?: string;
  accreditation?: string;
  badgeBg: string;
  badgeText: string;
  isCustom?: boolean;
}

export type EQAStatus = 'due_tomorrow' | 'pending' | 'submitted' | 'overdue';

export interface EQATrial {
  id: string;
  scheme: EQAScheme;
  title: string;
  cycle: string;
  trialNumber: string;
  receivedDate: string;
  deadlineDate: string;
  submittedDate?: string;
  instrument: string;
  assignedStaff: string;
  labSection: string;
  status: EQAStatus;
  statusLabel: string;
  parameters?: string[];
  resultValues?: Record<string, string>;
  fileName?: string;
  score?: string;
}

export type StaffRole =
  | 'SENIOR MT'
  | 'LAB ASSISTANT'
  | 'PATHOLOGY TECH'
  | 'CHIEF PATHOLOGIST'
  | 'MICROBIOLOGIST'
  | 'PHLEBOTOMIST'
  | 'MEDICAL TECHNOLOGIST'
  | string;

export type DutyStatus = 'ON DUTY' | 'OFF DUTY' | 'ON CALL' | 'LEAVE';

export interface StaffMember {
  id: string;
  name: string;
  fullName: string;
  role: StaffRole;
  department: string;
  dutyStatus: DutyStatus;
  avatarUrl?: string;
  phone?: string;
  email?: string;
  shiftsThisMonth?: number;
}

export interface ShiftAssignment {
  id: string;
  date: string; // YYYY-MM-DD
  staffId: string;
  staffName: string;
  role?: string;
  avatarUrl?: string;
  shiftType: string;
  section?: string;
  notes?: string;
}

export interface DirectoryMachine {
  id: string;
  name: string;
  category?: string;
  extension: string;
  leadSpecialist: string;
  model?: string;
  iconName?: string;
  status?: 'Operational' | 'Maintenance' | 'Calibrating';
  location?: string;
}

export interface DirectoryEngineer {
  id: string;
  name: string;
  title: string;
  vendor: string;
  machineSupport: string;
  phone: string;
  email?: string;
  category?: string;
  emergency24h?: boolean;
}

export interface DepartmentVideo {
  id: string;
  title: string;
  titleThai?: string;
  url: string;
  thumbnailUrl?: string;
  machineId?: string;
  machineName?: string;
  duration?: string;
  description?: string;
  steps?: string[];
  addedDate?: string;
  author?: string;
  tags?: string[];
}

export interface DirectorySection {
  id: string;
  title: string;
  titleThai: string;
  description?: string;
  machines: DirectoryMachine[];
  engineers: DirectoryEngineer[];
  videos?: DepartmentVideo[];
}

export interface LabAnalysisSample {
  id: string;
  sampleId: string;
  patientName: string;
  patientHn: string;
  testPanel: string;
  priority: 'STAT' | 'Urgent' | 'Routine';
  specimen: 'Serum' | 'Plasma' | 'Whole Blood' | 'Urine' | 'CSF' | 'Swab';
  instrument: string;
  assignedTech: string;
  requestedAt: string;
  status: 'Received' | 'Analyzing' | 'Pending Review' | 'Completed';
  tatMinutes: number;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  type: 'urgent' | 'warning' | 'info' | 'success';
  read: boolean;
  tabTarget?: NavigationTab;
}

export interface DailyNote {
  id: string;
  text: string;
  category: 'urgent' | 'routine' | 'handover' | 'maintenance';
  completed: boolean;
  time?: string;
  date?: string;
  author?: string;
}

export interface UserAccount {
  id: string;
  username: string;
  password?: string;
  pin?: string;
  fullName: string;
  role: string;
  department: string;
  avatarUrl?: string;
  initials: string;
  email?: string;
  staffId?: string;
  badgeNumber?: string;
}

export interface AuthSession {
  user: UserAccount;
  loginTime: string;
  rememberMe: boolean;
}

// ==========================================
// OUTLAB (Send-Out / Referral Lab) Types
// ==========================================

export type OutlabTransportTemp =
  | 'Frozen (-20°C)'
  | 'Refrigerated (2-8°C)'
  | 'Ambient (20-25°C)'
  | 'Dry Ice (-70°C)'
  | 'Protect from Light';

export type OutlabCategory =
  | 'Molecular & Genetics'
  | 'Special Chemistry & Hormones'
  | 'Immunology & Autoimmune'
  | 'Special Hematology & Coagulation'
  | 'Infectious & Virology'
  | 'Toxicology & Heavy Metals'
  | 'Pathology & Cytogenetics'
  | string;

export interface OutlabTest {
  id: string;
  testCode: string;
  testName: string;
  testNameThai?: string;
  aliases?: string[];
  category: OutlabCategory;
  destinationLab: string; // e.g., 'N Health', 'Siriraj Central Lab', 'Chulalongkorn Lab', 'BRIA', 'Ramathibodi Lab', 'DMSC'
  specimenType: string; // e.g., 'Serum (Clot Blood)', 'Whole Blood (EDTA)', 'Plasma (Sodium Citrate 3.2%)'
  tubeType: string; // e.g., 'Red / SST (Clot Activator)', 'Purple / Lavender (EDTA)', 'Light Blue (Citrate)', 'Green (Heparin)'
  tubeColorHex?: string;
  minVolume: string; // e.g., '3.0 mL', '5.0 mL'
  transportTemperature: OutlabTransportTemp;
  tatWorkingDays: string; // e.g., '3 - 5 days', '7 days', '24 hours'
  testingSchedule: string; // e.g., 'Daily', 'Mon, Wed, Fri', 'Every Tuesday'
  courierCutoff: string; // e.g., '11:00 AM & 15:00 PM'
  instructions: string; // centrifugation, fasting, protection from light, dry ice
  clinicalSignificance?: string;
  costTHB?: number;
  priceTHB?: number;
  contactPhone?: string;
  methodology?: string;
}

export type OutlabSendoutStatus =
  | 'Pending Pickup'
  | 'In Transit'
  | 'Processing at Outlab'
  | 'Result Received'
  | 'Rejected / Cancelled';

export interface OutlabSendoutOrder {
  id: string;
  orderNumber: string; // e.g., 'OUT-2026-0812'
  patientHn: string;
  patientName: string;
  testId: string;
  testName: string;
  destinationLab: string;
  specimenType: string;
  transportTemp: OutlabTransportTemp | string;
  tubeType?: string;
  collectionDateTime: string;
  sentDateTime?: string;
  courierTrackingNo?: string;
  courierCompany?: string;
  status: OutlabSendoutStatus;
  urgency: 'Routine' | 'Urgent' | 'STAT';
  recordedBy: string;
  notes?: string;
  expectedResultDate?: string;
  resultSummary?: string;
  resultReceivedDate?: string;
}

export interface ReferralLab {
  id: string;
  name: string;
  shortName: string;
  address: string;
  hotline: string;
  courierDispatch: string;
  email?: string;
  regularPickupTimes: string;
  emergencyCourier: boolean;
  website?: string;
  notes?: string;
}

