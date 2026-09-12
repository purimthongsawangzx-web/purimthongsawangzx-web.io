import {
  StockItem,
  EQATrial,
  StaffMember,
  ShiftAssignment,
  DirectorySection,
  LabAnalysisSample,
  NotificationItem,
  DailyNote,
  UserAccount,
  OutlabTest,
  OutlabSendoutOrder,
  ReferralLab
} from '../types';
import {
  INITIAL_STOCK_ITEMS,
  INITIAL_EQA_TRIALS,
  INITIAL_STAFF,
  INITIAL_SHIFTS,
  DIRECTORY_SECTIONS,
  INITIAL_SAMPLES,
  INITIAL_NOTIFICATIONS,
  INITIAL_DAILY_NOTES,
  DEFAULT_TEAM_USER
} from '../data/mockData';
import {
  INITIAL_OUTLAB_TESTS,
  INITIAL_OUTLAB_ORDERS,
  INITIAL_REFERRAL_LABS
} from '../data/mockOutlabData';

export interface UserDataset {
  stockItems: StockItem[];
  trials: EQATrial[];
  staffList: StaffMember[];
  shifts: ShiftAssignment[];
  directorySections: DirectorySection[];
  samples: LabAnalysisSample[];
  dailyNotes: DailyNote[];
  notifications: NotificationItem[];
  outlabTests: OutlabTest[];
  outlabOrders: OutlabSendoutOrder[];
  referralLabs: ReferralLab[];
  hideOperations: boolean;
  hideStock: boolean;
}

const USERS_STORAGE_KEY = 'labvibharam_registered_users_v2';
const DATASET_PREFIX = 'labvibharam_dataset_user_';

/**
 * Creates a clean cloned template dataset
 */
export function getInitialTemplateDataset(): UserDataset {
  return {
    stockItems: JSON.parse(JSON.stringify(INITIAL_STOCK_ITEMS)),
    trials: JSON.parse(JSON.stringify(INITIAL_EQA_TRIALS)),
    staffList: JSON.parse(JSON.stringify(INITIAL_STAFF)),
    shifts: JSON.parse(JSON.stringify(INITIAL_SHIFTS)),
    directorySections: JSON.parse(JSON.stringify(DIRECTORY_SECTIONS)),
    samples: JSON.parse(JSON.stringify(INITIAL_SAMPLES)),
    dailyNotes: JSON.parse(JSON.stringify(INITIAL_DAILY_NOTES)),
    notifications: [
      {
        id: `notif-${Date.now()}`,
        title: 'New Workspace Initialized',
        message: 'Your isolated lab dataset is ready with all templates. Any edits made here are 100% private to your account.',
        time: 'Just now',
        type: 'info',
        read: false
      },
      ...JSON.parse(JSON.stringify(INITIAL_NOTIFICATIONS))
    ],
    outlabTests: JSON.parse(JSON.stringify(INITIAL_OUTLAB_TESTS)),
    outlabOrders: JSON.parse(JSON.stringify(INITIAL_OUTLAB_ORDERS)),
    referralLabs: JSON.parse(JSON.stringify(INITIAL_REFERRAL_LABS)),
    hideOperations: false,
    hideStock: false
  };
}

/**
 * Load all registered user accounts
 */
export function loadRegisteredUsers(): UserAccount[] {
  try {
    const saved = localStorage.getItem(USERS_STORAGE_KEY);
    if (saved) {
      const parsed: UserAccount[] = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.error('Failed to load registered users', err);
  }

  // Initial default team account
  const defaultUsers: UserAccount[] = [
    {
      ...DEFAULT_TEAM_USER,
      id: 'user-lab-main',
      username: 'lab',
      password: 'password123',
      fullName: 'LABVIBHARAM Team (Main)',
      role: 'Clinical Laboratory Staff',
      department: 'Diagnostic Pathology Core'
    }
  ];

  try {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(defaultUsers));
  } catch {
    // ignore
  }

  return defaultUsers;
}

/**
 * Save registered users list
 */
export function saveRegisteredUsers(users: UserAccount[]): void {
  try {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  } catch (err) {
    console.error('Failed to save registered users', err);
  }
}

/**
 * Load isolated dataset for a specific user ID
 */
export function loadUserDataset(userId: string): UserDataset {
  const userKey = `${DATASET_PREFIX}${userId}`;
  try {
    const saved = localStorage.getItem(userKey);
    if (saved) {
      const parsed: UserDataset = JSON.parse(saved);
      // Validate schema has core arrays
      if (
        Array.isArray(parsed.stockItems) &&
        Array.isArray(parsed.trials) &&
        Array.isArray(parsed.staffList) &&
        Array.isArray(parsed.directorySections)
      ) {
        // Ensure new Outlab collections exist for existing user datasets
        if (!Array.isArray(parsed.outlabTests) || parsed.outlabTests.length === 0) {
          parsed.outlabTests = JSON.parse(JSON.stringify(INITIAL_OUTLAB_TESTS));
        }
        if (!Array.isArray(parsed.outlabOrders)) {
          parsed.outlabOrders = JSON.parse(JSON.stringify(INITIAL_OUTLAB_ORDERS));
        }
        if (!Array.isArray(parsed.referralLabs) || parsed.referralLabs.length === 0) {
          parsed.referralLabs = JSON.parse(JSON.stringify(INITIAL_REFERRAL_LABS));
        }
        return parsed;
      }
    }

    // For the main team user, migrate legacy global localStorage keys if available
    if (userId === 'user-lab-main' || userId === 'lab-team' || userId === 'lab') {
      const legacyStock = localStorage.getItem('labvibharam_stock');
      const legacyTrials = localStorage.getItem('labvibharam_trials');
      const legacyStaff = localStorage.getItem('labvibharam_staff');
      const legacyShifts = localStorage.getItem('labvibharam_shifts_2026') || localStorage.getItem('labvibharam_shifts');
      const legacyDirectory = localStorage.getItem('labvibharam_directory');
      const legacySamples = localStorage.getItem('labvibharam_samples');
      const legacyDailyNotes = localStorage.getItem('labvibharam_daily_notes');
      const legacyNotifs = localStorage.getItem('labvibharam_notifications');

      if (legacyStock || legacyTrials || legacyStaff) {
        const migratedDataset: UserDataset = {
          stockItems: legacyStock ? JSON.parse(legacyStock) : JSON.parse(JSON.stringify(INITIAL_STOCK_ITEMS)),
          trials: legacyTrials ? JSON.parse(legacyTrials) : JSON.parse(JSON.stringify(INITIAL_EQA_TRIALS)),
          staffList: legacyStaff ? JSON.parse(legacyStaff) : JSON.parse(JSON.stringify(INITIAL_STAFF)),
          shifts: legacyShifts ? JSON.parse(legacyShifts) : JSON.parse(JSON.stringify(INITIAL_SHIFTS)),
          directorySections: legacyDirectory ? JSON.parse(legacyDirectory) : JSON.parse(JSON.stringify(DIRECTORY_SECTIONS)),
          samples: legacySamples ? JSON.parse(legacySamples) : JSON.parse(JSON.stringify(INITIAL_SAMPLES)),
          dailyNotes: legacyDailyNotes ? JSON.parse(legacyDailyNotes) : JSON.parse(JSON.stringify(INITIAL_DAILY_NOTES)),
          notifications: legacyNotifs ? JSON.parse(legacyNotifs) : JSON.parse(JSON.stringify(INITIAL_NOTIFICATIONS)),
          outlabTests: JSON.parse(JSON.stringify(INITIAL_OUTLAB_TESTS)),
          outlabOrders: JSON.parse(JSON.stringify(INITIAL_OUTLAB_ORDERS)),
          referralLabs: JSON.parse(JSON.stringify(INITIAL_REFERRAL_LABS)),
          hideOperations: false,
          hideStock: false
        };
        saveUserDataset(userId, migratedDataset);
        return migratedDataset;
      }
    }
  } catch (err) {
    console.error(`Error loading dataset for user ${userId}:`, err);
  }

  // If no existing dataset, create a fresh one from templates and persist it
  const initial = getInitialTemplateDataset();
  saveUserDataset(userId, initial);
  return initial;
}

/**
 * Save isolated dataset for a specific user ID
 */
export function saveUserDataset(userId: string, dataset: UserDataset): void {
  const userKey = `${DATASET_PREFIX}${userId}`;
  try {
    localStorage.setItem(userKey, JSON.stringify(dataset));
  } catch (err) {
    console.error(`Error saving dataset for user ${userId}:`, err);
  }
}
