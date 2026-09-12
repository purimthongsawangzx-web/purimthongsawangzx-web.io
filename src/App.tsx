import React, { useState, useEffect } from 'react';
import {
  NavigationTab,
  StockItem,
  StockLot,
  EQATrial,
  StaffMember,
  ShiftAssignment,
  DirectorySection,
  LabAnalysisSample,
  NotificationItem,
  DirectoryMachine,
  DirectoryEngineer,
  DepartmentVideo,
  DailyNote,
  UserAccount,
  OutlabTest,
  OutlabSendoutOrder,
  ReferralLab
} from './types';
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
} from './data/mockData';
import {
  loadRegisteredUsers,
  saveRegisteredUsers,
  loadUserDataset,
  saveUserDataset,
  getInitialTemplateDataset
} from './utils/userDatasetManager';
import { LoginGateway } from './components/LoginGateway';
import { Sidebar } from './components/Sidebar';
import { TopHeader } from './components/TopHeader';
import { DashboardView } from './components/views/DashboardView';
import { StockView } from './components/views/StockView';
import { OutlabView } from './components/views/OutlabView';
import { EQAView } from './components/views/EQAView';
import { RosterView } from './components/views/RosterView';
import { ContactsView } from './components/views/ContactsView';

// Modals
import { NewAnalysisModal } from './components/modals/NewAnalysisModal';
import { AddItemModal } from './components/modals/AddItemModal';
import { AddOutlabTestModal } from './components/modals/AddOutlabTestModal';
import { NewSendoutOrderModal } from './components/modals/NewSendoutOrderModal';
import { OutlabDetailModal } from './components/modals/OutlabDetailModal';
import { AddTrialModal } from './components/modals/AddTrialModal';
import { UploadResultModal } from './components/modals/UploadResultModal';
import { ViewSubmissionModal } from './components/modals/ViewSubmissionModal';
import { AddStaffModal } from './components/modals/AddStaffModal';
import { UploadRosterImageModal } from './components/modals/UploadRosterImageModal';
import { AddMachineModal } from './components/modals/AddMachineModal';
import { AddContactModal } from './components/modals/AddContactModal';
import { AddDepartmentVideoModal } from './components/modals/AddDepartmentVideoModal';
import { VideoPlayerModal } from './components/modals/VideoPlayerModal';
import { SettingsModal } from './components/modals/SettingsModal';
import { SupportModal } from './components/modals/SupportModal';
import { DailyNotesModal } from './components/modals/DailyNotesModal';

export default function App() {
  // Registered Users Registry
  const [registeredUsers, setRegisteredUsers] = useState<UserAccount[]>(() => {
    return loadRegisteredUsers();
  });

  const [currentUser, setCurrentUser] = useState<UserAccount | null>(() => {
    const saved = localStorage.getItem('labvibharam_current_user') || sessionStorage.getItem('labvibharam_current_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return null;
      }
    }
    return null;
  });

  // Module Visibility & Navigation
  const [hideOperations, setHideOperations] = useState<boolean>(false);
  const [hideStock, setHideStock] = useState<boolean>(false);
  const [currentTab, setCurrentTab] = useState<NavigationTab>('stock');
  const [mobileNavOpen, setMobileNavOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Primary Domain States (Isolated per user)
  const [stockItems, setStockItems] = useState<StockItem[]>([]);
  const [trials, setTrials] = useState<EQATrial[]>([]);
  const [staffList, setStaffList] = useState<StaffMember[]>([]);
  const [shifts, setShifts] = useState<ShiftAssignment[]>([]);
  const [directorySections, setDirectorySections] = useState<DirectorySection[]>([]);
  const [samples, setSamples] = useState<LabAnalysisSample[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [dailyNotes, setDailyNotes] = useState<DailyNote[]>([]);
  const [outlabTests, setOutlabTests] = useState<OutlabTest[]>([]);
  const [outlabOrders, setOutlabOrders] = useState<OutlabSendoutOrder[]>([]);
  const [referralLabs, setReferralLabs] = useState<ReferralLab[]>([]);

  // Function to load dataset for a specific user ID
  const loadDatasetForUser = (userId: string) => {
    const ds = loadUserDataset(userId);
    setStockItems(ds.stockItems);
    setTrials(ds.trials);
    setStaffList(ds.staffList);
    setShifts(ds.shifts);
    setDirectorySections(ds.directorySections);
    setSamples(ds.samples);
    setDailyNotes(ds.dailyNotes);
    setNotifications(ds.notifications);
    setHideOperations(Boolean(ds.hideOperations));
    setHideStock(Boolean(ds.hideStock));
    setOutlabTests(ds.outlabTests || []);
    setOutlabOrders(ds.outlabOrders || []);
    setReferralLabs(ds.referralLabs || []);
  };

  // Initial load when currentUser is present on app mount
  useEffect(() => {
    if (currentUser?.id) {
      loadDatasetForUser(currentUser.id);
    }
  }, []);

  // Sync isolated user dataset whenever data changes
  useEffect(() => {
    if (currentUser?.id && stockItems.length > 0) {
      saveUserDataset(currentUser.id, {
        stockItems,
        trials,
        staffList,
        shifts,
        directorySections,
        samples,
        dailyNotes,
        notifications,
        hideOperations,
        hideStock,
        outlabTests,
        outlabOrders,
        referralLabs
      });
    }
  }, [
    currentUser,
    stockItems,
    trials,
    staffList,
    shifts,
    directorySections,
    samples,
    dailyNotes,
    notifications,
    hideOperations,
    hideStock,
    outlabTests,
    outlabOrders,
    referralLabs
  ]);

  // Sync registered users list to storage
  useEffect(() => {
    saveRegisteredUsers(registeredUsers);
  }, [registeredUsers]);

  // Authentication Handlers
  const handleLogin = (user: UserAccount, rememberMe: boolean) => {
    setCurrentUser(user);
    loadDatasetForUser(user.id);

    if (rememberMe) {
      localStorage.setItem('labvibharam_current_user', JSON.stringify(user));
      localStorage.setItem('labvibharam_remember_me', 'true');
    } else {
      localStorage.removeItem('labvibharam_current_user');
      localStorage.removeItem('labvibharam_remember_me');
    }
    sessionStorage.setItem('labvibharam_current_user', JSON.stringify(user));

    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        title: 'Private Workspace Active',
        message: `Welcome, ${user.fullName} (@${user.username}). Your private dataset is loaded securely.`,
        time: 'Just now',
        type: 'success',
        read: false
      },
      ...prev
    ]);
  };

  const handleLogout = () => {
    localStorage.removeItem('labvibharam_current_user');
    sessionStorage.removeItem('labvibharam_current_user');
    setCurrentUser(null);
  };

  const handleRegisterUser = (newUser: UserAccount) => {
    const updatedUsers = [...registeredUsers.filter((u) => u.username !== newUser.username), newUser];
    setRegisteredUsers(updatedUsers);
    saveRegisteredUsers(updatedUsers);

    // Initialize fresh template dataset for this new user
    const starterDataset = getInitialTemplateDataset();
    saveUserDataset(newUser.id, starterDataset);
  };

  const handleUpdateCurrentUser = (updated: UserAccount) => {
    setCurrentUser(updated);
    const list = registeredUsers.map((u) => (u.id === updated.id ? updated : u));
    setRegisteredUsers(list);
    saveRegisteredUsers(list);

    if (localStorage.getItem('labvibharam_remember_me') === 'true') {
      localStorage.setItem('labvibharam_current_user', JSON.stringify(updated));
    }
    sessionStorage.setItem('labvibharam_current_user', JSON.stringify(updated));
  };

  // Adjust active tab if current tab becomes hidden
  const handleToggleHideOperations = (hide: boolean) => {
    setHideOperations(hide);
    if (hide && currentTab === 'dashboard') {
      if (!hideStock) {
        setCurrentTab('stock');
      } else {
        setCurrentTab('eqa');
      }
    }
  };

  const handleToggleHideStock = (hide: boolean) => {
    setHideStock(hide);
    if (hide && currentTab === 'stock') {
      if (!hideOperations) {
        setCurrentTab('dashboard');
      } else {
        setCurrentTab('eqa');
      }
    }
  };

  // Modal Visibility States
  const [showNewAnalysisModal, setShowNewAnalysisModal] = useState<boolean>(false);
  const [showAddItemModal, setShowAddItemModal] = useState<boolean>(false);
  const [showAddTrialModal, setShowAddTrialModal] = useState<boolean>(false);
  const [activeUploadTrial, setActiveUploadTrial] = useState<EQATrial | null>(null);
  const [activeViewTrial, setActiveViewTrial] = useState<EQATrial | null>(null);
  const [showAddStaffModal, setShowAddStaffModal] = useState<boolean>(false);
  const [editingStaffMember, setEditingStaffMember] = useState<StaffMember | null>(null);
  const [showUploadRosterImageModal, setShowUploadRosterImageModal] = useState<boolean>(false);
  const [targetDirectorySectionId, setTargetDirectorySectionId] = useState<string>('');
  const [showAddMachineModal, setShowAddMachineModal] = useState<boolean>(false);
  const [showAddContactModal, setShowAddContactModal] = useState<boolean>(false);
  const [showAddVideoModal, setShowAddVideoModal] = useState<boolean>(false);
  const [activePlayingVideo, setActivePlayingVideo] = useState<{
    section: DirectorySection;
    video: DepartmentVideo;
  } | null>(null);
  const [showSettingsModal, setShowSettingsModal] = useState<boolean>(false);
  const [showSupportModal, setShowSupportModal] = useState<boolean>(false);
  const [showDailyNotesModal, setShowDailyNotesModal] = useState<boolean>(false);

  // Outlab Modal States
  const [showAddOutlabModal, setShowAddOutlabModal] = useState<boolean>(false);
  const [editingOutlabTest, setEditingOutlabTest] = useState<OutlabTest | null>(null);
  const [showNewSendoutModal, setShowNewSendoutModal] = useState<boolean>(false);
  const [preselectedSendoutTest, setPreselectedSendoutTest] = useState<OutlabTest | null>(null);
  const [showOutlabDetailModal, setShowOutlabDetailModal] = useState<boolean>(false);
  const [activeDetailOutlabTest, setActiveDetailOutlabTest] = useState<OutlabTest | null>(null);

  // Dynamic Badge Counts for Navigation
  const criticalStockCount = stockItems.filter(
    (item) => item.quantity <= item.minQuantity * 0.3
  ).length;

  const urgentTrialsCount = trials.filter(
    (t) => t.status === 'due_tomorrow' || t.status === 'overdue'
  ).length;

  // --- Handlers: Stock Management ---
  const handleUpdateStockQuantity = (id: string, delta: number) => {
    setStockItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const newQty = Math.max(0, item.quantity + delta);
          const newStatus =
            newQty <= item.minQuantity * 0.3
              ? 'critical'
              : newQty <= item.minQuantity
              ? 'low'
              : 'normal';
          return { ...item, quantity: newQty, status: newStatus };
        }
        return item;
      })
    );
  };

  const handleAddNewStockItem = (newItem: Partial<StockItem>) => {
    const item: StockItem = {
      id: `stock-${Date.now()}`,
      name: newItem.name || 'New Item',
      code: newItem.code || '#BT-000',
      category: newItem.category || 'consumables',
      categoryLabel: newItem.categoryLabel || 'CONSUMABLES',
      quantity: newItem.quantity ?? 50,
      minQuantity: newItem.minQuantity ?? 20,
      unit: newItem.unit || 'units',
      status: newItem.status || 'normal',
      location: newItem.location || 'Central Storage',
      supplier: newItem.supplier || 'Standard Medical Supplies',
      lotNumber: newItem.lotNumber || `LOT-${Date.now().toString().slice(-4)}`
    };
    setStockItems((prev) => [item, ...prev]);
  };

  const handleDeleteStockItem = (id: string) => {
    setStockItems((prev) => prev.filter((i) => i.id !== id));
  };

  const handleSaveStockLot = (
    itemId: string,
    lotData: {
      lotNumber: string;
      expiryDate?: string;
      receivedDate?: string;
      quantity?: number;
      notes?: string;
    }
  ) => {
    let affectedItemName = '';
    setStockItems((prev) =>
      prev.map((item) => {
        if (item.id === itemId) {
          affectedItemName = item.name;
          const updatedLots = item.lots ? [...item.lots] : [];
          const existingLotIndex = updatedLots.findIndex(
            (l) => l.lotNumber.toUpperCase() === lotData.lotNumber.toUpperCase()
          );

          const newLotEntry: StockLot = {
            id: existingLotIndex >= 0 ? updatedLots[existingLotIndex].id : `lot-${Date.now()}`,
            lotNumber: lotData.lotNumber,
            expiryDate: lotData.expiryDate,
            receivedDate: lotData.receivedDate || new Date().toISOString().split('T')[0],
            quantity: lotData.quantity !== undefined ? lotData.quantity : item.quantity,
            status: 'active',
            notes: lotData.notes
          };

          if (existingLotIndex >= 0) {
            updatedLots[existingLotIndex] = newLotEntry;
          } else {
            updatedLots.unshift(newLotEntry);
          }

          return {
            ...item,
            lotNumber: lotData.lotNumber,
            expiryDate: lotData.expiryDate || item.expiryDate,
            lots: updatedLots
          };
        }
        return item;
      })
    );

    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        title: 'Inventory Lot Updated',
        message: `Assigned Lot ${lotData.lotNumber} to "${affectedItemName}"${
          lotData.expiryDate ? ` (Exp: ${lotData.expiryDate})` : ''
        }.`,
        time: 'Just now',
        type: 'info',
        read: false,
        tabTarget: 'stock'
      },
      ...prev
    ]);
  };

  const handleDeleteStockLot = (itemId: string, specificLotNumber?: string) => {
    let affectedItemName = '';
    let deletedLotName = specificLotNumber || '';

    setStockItems((prev) =>
      prev.map((item) => {
        if (item.id === itemId) {
          affectedItemName = item.name;
          const targetLotNumber = specificLotNumber || item.lotNumber;
          deletedLotName = targetLotNumber || 'Active Lot';

          const remainingLots = (item.lots || []).filter(
            (l) => l.lotNumber.toUpperCase() !== (targetLotNumber || '').toUpperCase()
          );

          const wasActiveLot =
            !targetLotNumber ||
            item.lotNumber?.toUpperCase() === targetLotNumber.toUpperCase();
          const nextActiveLot = wasActiveLot ? remainingLots[0] || null : null;

          return {
            ...item,
            lotNumber: wasActiveLot ? (nextActiveLot ? nextActiveLot.lotNumber : undefined) : item.lotNumber,
            expiryDate: wasActiveLot ? (nextActiveLot ? nextActiveLot.expiryDate : undefined) : item.expiryDate,
            lots: remainingLots
          };
        }
        return item;
      })
    );

    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        title: 'Inventory Lot Removed',
        message: `Lot "${deletedLotName}" was deleted from ${affectedItemName || 'item'}.`,
        time: 'Just now',
        type: 'warning',
        read: false,
        tabTarget: 'stock'
      },
      ...prev
    ]);
  };

  const handleSwitchActiveLot = (itemId: string, targetLotNumber: string) => {
    setStockItems((prev) =>
      prev.map((item) => {
        if (item.id === itemId) {
          const matchedLot = (item.lots || []).find(
            (l) => l.lotNumber.toUpperCase() === targetLotNumber.toUpperCase()
          );
          return {
            ...item,
            lotNumber: targetLotNumber,
            expiryDate: matchedLot?.expiryDate || item.expiryDate
          };
        }
        return item;
      })
    );
  };

  // --- Handlers: EQA Quality Assurance ---
  const handleAddTrial = (newTrial: Partial<EQATrial>) => {
    const trial: EQATrial = {
      id: `trial-${Date.now()}`,
      scheme: newTrial.scheme || 'RIQAS',
      title: newTrial.title || 'General Laboratory Survey',
      cycle: newTrial.cycle || 'Cycle 2023',
      trialNumber: newTrial.trialNumber || 'Trial 01',
      status: 'pending',
      statusLabel: 'Pending Analysis',
      receivedDate: newTrial.receivedDate || 'Oct 20, 2023',
      deadlineDate: newTrial.deadlineDate || 'Nov 15, 2023',
      instrument: newTrial.instrument || 'Cobas 8000',
      assignedStaff: newTrial.assignedStaff || 'Dr. Sarah Chen',
      labSection: newTrial.labSection || 'Core Lab',
      parameters: newTrial.parameters || ['Analyte 1', 'Analyte 2']
    };
    setTrials((prev) => [trial, ...prev]);
  };

  const handleUploadTrialResults = (
    trialId: string,
    resultValues: Record<string, string>,
    fileName?: string
  ) => {
    setTrials((prev) =>
      prev.map((t) => {
        if (t.id === trialId) {
          return {
            ...t,
            status: 'submitted',
            statusLabel: 'Submitted',
            submittedDate: 'Today, ' + new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            fileName: fileName || 'verified_run.pdf'
          };
        }
        return t;
      })
    );

    // Add success notification
    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        title: 'EQA Submission Transmitted',
        message: `Results for trial ${trialId} have been encrypted and sent to the QA provider.`,
        time: 'Just now',
        type: 'success',
        read: false,
        tabTarget: 'eqa'
      },
      ...prev
    ]);
  };

  const handleDeleteTrial = (id: string) => {
    setTrials((prev) => prev.filter((t) => t.id !== id));
  };

  // --- Handlers: Staff & Monthly Roster ---
  const handleAddOrEditStaff = (staffData: Partial<StaffMember>) => {
    if (editingStaffMember) {
      setStaffList((prev) =>
        prev.map((s) =>
          s.id === editingStaffMember.id
            ? {
                ...s,
                ...staffData,
                fullName: staffData.fullName || staffData.name || s.fullName,
                avatarUrl: staffData.avatarUrl !== undefined ? staffData.avatarUrl : s.avatarUrl
              }
            : s
        )
      );

      // Sync avatar and name to existing assigned shifts
      setShifts((prev) =>
        prev.map((sh) =>
          sh.staffId === editingStaffMember.id
            ? {
                ...sh,
                staffName: staffData.name || sh.staffName,
                avatarUrl: staffData.avatarUrl !== undefined ? staffData.avatarUrl : sh.avatarUrl,
                role: staffData.role || sh.role
              }
            : sh
        )
      );

      setEditingStaffMember(null);
    } else {
      const newStaff: StaffMember = {
        id: `staff-${Date.now()}`,
        name: staffData.name || 'New Staff',
        fullName: staffData.fullName || staffData.name || 'New Staff Member',
        role: staffData.role || 'MEDICAL TECHNOLOGIST',
        dutyStatus: staffData.dutyStatus || 'ON DUTY',
        avatarUrl: staffData.avatarUrl || undefined,
        department: staffData.department || 'Clinical Chemistry',
        shiftsThisMonth: 0,
        phone: staffData.phone || '+66 2 419 7000',
        email: staffData.email || 'staff@labvibraram.hospital'
      };
      setStaffList((prev) => [newStaff, ...prev]);
    }
  };

  const handleDeleteStaff = (id: string) => {
    setStaffList((prev) => prev.filter((s) => s.id !== id));
    setShifts((prev) => prev.filter((sh) => sh.staffId !== id));

    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        title: 'Staff Member Deleted',
        message: 'Laboratory personnel record and their shifts have been removed from the roster.',
        time: 'Just now',
        type: 'info',
        read: false,
        tabTarget: 'roster'
      },
      ...prev
    ]);
  };

  const handleUpdateStaffAvatar = (staffId: string, newAvatarUrl: string | undefined) => {
    setStaffList((prev) =>
      prev.map((s) => (s.id === staffId ? { ...s, avatarUrl: newAvatarUrl } : s))
    );
    setShifts((prev) =>
      prev.map((sh) => (sh.staffId === staffId ? { ...sh, avatarUrl: newAvatarUrl } : sh))
    );
  };

  const handleAssignStaffToDate = (staff: StaffMember, dateStr?: string) => {
    const targetDate = dateStr || '2023-10-02';
    const newShift: ShiftAssignment = {
      id: `shift-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      staffId: staff.id,
      staffName: staff.name,
      avatarUrl: staff.avatarUrl,
      date: targetDate,
      shiftType: 'Day Shift (08:00 - 16:00)'
    };
    setShifts((prev) => [...prev, newShift]);
  };

  const handleRemoveShift = (shiftId: string) => {
    setShifts((prev) => prev.filter((s) => s.id !== shiftId));
  };

  const handleApplyRosterFromOCR = (date: string, staffName: string) => {
    const matched = staffList.find(
      (s) =>
        s.name.toLowerCase().includes(staffName.toLowerCase()) ||
        s.fullName.toLowerCase().includes(staffName.toLowerCase())
    );

    const newShift: ShiftAssignment = {
      id: `shift-ocr-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      staffId: matched ? matched.id : `staff-gen-${Date.now()}`,
      staffName: matched ? matched.name : staffName,
      avatarUrl: matched ? matched.avatarUrl : undefined,
      date: date,
      shiftType: 'Assigned via Timetable Scan'
    };
    setShifts((prev) => [...prev, newShift]);
  };

  // --- Handlers: Directory ---
  const handleAddMachine = (sectionId: string, machine: Partial<DirectoryMachine>) => {
    const newM: DirectoryMachine = {
      id: `mach-${Date.now()}`,
      name: machine.name || 'New Analyzer',
      extension: machine.extension || 'Ext. 199',
      leadSpecialist: machine.leadSpecialist || 'Lab Technologist',
      model: machine.model,
      iconName: machine.iconName || 'science'
    };

    setDirectorySections((prev) =>
      prev.map((sec) => {
        if (sec.id === sectionId) {
          return { ...sec, machines: [...sec.machines, newM] };
        }
        return sec;
      })
    );
  };

  const handleAddContact = (sectionId: string, engineer: Partial<DirectoryEngineer>) => {
    const newE: DirectoryEngineer = {
      id: `eng-${Date.now()}`,
      name: engineer.name || 'Support Engineer',
      title: engineer.title || 'SERVICE ENGINEER',
      vendor: engineer.vendor || 'Diagnostics Vendor',
      machineSupport: engineer.machineSupport || 'Instruments',
      phone: engineer.phone || '+1 (800) 000-0000'
    };

    setDirectorySections((prev) =>
      prev.map((sec) => {
        if (sec.id === sectionId) {
          return { ...sec, engineers: [...sec.engineers, newE] };
        }
        return sec;
      })
    );
  };

  const handleDeleteMachine = (sectionId: string, machineId: string) => {
    setDirectorySections((prev) =>
      prev.map((sec) => {
        if (sec.id === sectionId) {
          return {
            ...sec,
            machines: sec.machines.filter((m) => m.id !== machineId)
          };
        }
        return sec;
      })
    );
  };

  const handleDeleteEngineer = (sectionId: string, engineerId: string) => {
    setDirectorySections((prev) =>
      prev.map((sec) => {
        if (sec.id === sectionId) {
          return {
            ...sec,
            engineers: sec.engineers.filter((e) => e.id !== engineerId)
          };
        }
        return sec;
      })
    );
  };

  const handleAddNewDepartmentVideo = (
    sectionId: string,
    videoData: Omit<DepartmentVideo, 'id'>
  ) => {
    const newVideo: DepartmentVideo = {
      id: `vid-${Date.now()}`,
      ...videoData
    };

    setDirectorySections((prev) =>
      prev.map((sec) => {
        if (sec.id === sectionId) {
          return {
            ...sec,
            videos: [newVideo, ...(sec.videos || [])]
          };
        }
        return sec;
      })
    );

    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        title: 'New Automation Guide Added',
        message: `Video tutorial "${newVideo.title}" added to ${
          directorySections.find((s) => s.id === sectionId)?.title || 'department'
        }.`,
        time: 'Just now',
        type: 'info',
        read: false,
        tabTarget: 'contacts'
      },
      ...prev
    ]);
  };

  const handleDeleteDepartmentVideo = (sectionId: string, videoId: string) => {
    const sec = directorySections.find((s) => s.id === sectionId);
    const video = sec?.videos?.find((v) => v.id === videoId);

    setDirectorySections((prev) =>
      prev.map((s) => {
        if (s.id === sectionId) {
          return {
            ...s,
            videos: (s.videos || []).filter((v) => v.id !== videoId)
          };
        }
        return s;
      })
    );

    setActivePlayingVideo((prev) => (prev?.video.id === videoId ? null : prev));

    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        title: 'Video Guide Removed',
        message: `Video tutorial "${video?.title || 'Guide'}" was deleted from ${sec?.title || 'directory'}.`,
        time: 'Just now',
        type: 'info',
        read: false,
        tabTarget: 'contacts'
      },
      ...prev
    ]);
  };

  // --- Handlers: Samples ---
  const handleAddNewSample = (sampleData: Partial<LabAnalysisSample>) => {
    const newSample: LabAnalysisSample = {
      id: `sample-${Date.now()}`,
      sampleId: sampleData.sampleId || `SMP-${Date.now().toString().slice(-6)}`,
      patientName: sampleData.patientName || 'Anonymous Patient',
      patientHn: sampleData.patientHn || 'HN-000000',
      testPanel: sampleData.testPanel || 'CBC + Differential',
      specimen: sampleData.specimen || 'Whole Blood',
      priority: sampleData.priority || 'STAT',
      instrument: sampleData.instrument || 'Sysmex XN-1000',
      assignedTech: sampleData.assignedTech || 'Dr. Jane Doe',
      requestedAt: 'Just now',
      status: 'Analyzing',
      tatMinutes: sampleData.tatMinutes || 30
    };

    setSamples((prev) => [newSample, ...prev]);

    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        title: `${newSample.priority} Sample Dispatched`,
        message: `${newSample.testPanel} for ${newSample.patientName} (${newSample.patientHn}) queued on ${newSample.instrument}.`,
        time: 'Just now',
        type: newSample.priority === 'STAT' ? 'urgent' : 'normal',
        read: false,
        tabTarget: 'dashboard'
      },
      ...prev
    ]);
  };

  // --- Handlers: Outlab Referral Management ---
  const handleAddOrEditOutlabTest = (testData: OutlabTest) => {
    setOutlabTests((prev) => {
      const exists = prev.some((t) => t.id === testData.id);
      if (exists) {
        return prev.map((t) => (t.id === testData.id ? testData : t));
      }
      return [testData, ...prev];
    });

    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        title: 'Outlab Test Protocol Updated',
        message: `Assay "${testData.testName}" send-out protocol saved (Sent to ${testData.destinationLab}).`,
        time: 'Just now',
        type: 'info',
        read: false,
        tabTarget: 'outlab'
      },
      ...prev
    ]);
  };

  const handleDeleteOutlabTest = (testId: string) => {
    setOutlabTests((prev) => prev.filter((t) => t.id !== testId));
  };

  const handleAddNewSendoutOrder = (newOrder: OutlabSendoutOrder) => {
    setOutlabOrders((prev) => [newOrder, ...prev]);

    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        title: 'Send-Out Specimen Dispatched',
        message: `Order ${newOrder.orderNumber} for ${newOrder.patientName} (${newOrder.patientHn}) sent to ${newOrder.destinationLab}.`,
        time: 'Just now',
        type: newOrder.urgency === 'STAT' ? 'urgent' : 'normal',
        read: false,
        tabTarget: 'outlab'
      },
      ...prev
    ]);
  };

  const handleUpdateOrderStatus = (
    orderId: string,
    status: OutlabSendoutOrder['status'],
    resultSummary?: string
  ) => {
    setOutlabOrders((prev) =>
      prev.map((order) => {
        if (order.id === orderId) {
          return {
            ...order,
            status,
            resultSummary: resultSummary !== undefined ? resultSummary : order.resultSummary,
            receivedDateTime:
              status === 'Result Received'
                ? new Date().toISOString().replace('T', ' ').slice(0, 16)
                : order.receivedDateTime
          };
        }
        return order;
      })
    );

    if (status === 'Result Received') {
      const matched = outlabOrders.find((o) => o.id === orderId);
      setNotifications((prev) => [
        {
          id: `notif-${Date.now()}`,
          title: 'Outlab Result Received',
          message: `External result logged for ${matched?.patientName || 'Patient'} (${matched?.testName || 'Test'}).`,
          time: 'Just now',
          type: 'info',
          read: false,
          tabTarget: 'outlab'
        },
        ...prev
      ]);
    }
  };

  const handleDeleteSendoutOrder = (orderId: string) => {
    setOutlabOrders((prev) => prev.filter((o) => o.id !== orderId));
  };

  // --- Handlers: Daily Notes & Reminders ---
  const handleAddNewDailyNote = (noteData: Partial<DailyNote>) => {
    const newNote: DailyNote = {
      id: `note-${Date.now()}`,
      text: noteData.text || '',
      category: noteData.category || 'routine',
      completed: false,
      time: noteData.time,
      date: noteData.date || 'Today',
      author: 'Lab Staff'
    };
    setDailyNotes((prev) => [newNote, ...prev]);
  };

  const handleToggleDailyNote = (id: string) => {
    setDailyNotes((prev) =>
      prev.map((note) =>
        note.id === id ? { ...note, completed: !note.completed } : note
      )
    );
  };

  const handleDeleteDailyNote = (id: string) => {
    setDailyNotes((prev) => prev.filter((note) => note.id !== id));
  };

  const handleClearCompletedDailyNotes = () => {
    setDailyNotes((prev) => prev.filter((note) => !note.completed));
  };

  // --- Handlers: Notifications & System Reset ---
  const handleMarkNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const handleClearAllNotifications = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleResetAllData = () => {
    if (!currentUser) return;
    const fresh = getInitialTemplateDataset();
    setStockItems(fresh.stockItems);
    setTrials(fresh.trials);
    setStaffList(fresh.staffList);
    setShifts(fresh.shifts);
    setDirectorySections(fresh.directorySections);
    setSamples(fresh.samples);
    setNotifications(fresh.notifications);
    setDailyNotes(fresh.dailyNotes);
    setHideOperations(fresh.hideOperations);
    setHideStock(fresh.hideStock);
    setOutlabTests(fresh.outlabTests || []);
    setOutlabOrders(fresh.outlabOrders || []);
    setReferralLabs(fresh.referralLabs || []);
    saveUserDataset(currentUser.id, fresh);
    setCurrentTab('stock');
  };

  const pendingDailyNotesCount = dailyNotes.filter((n) => !n.completed).length;

  // If not authenticated, display the Login Gateway before accessing any lab operations
  if (!currentUser) {
    return (
      <LoginGateway
        onLogin={handleLogin}
        registeredUsers={registeredUsers}
        onRegisterUser={handleRegisterUser}
      />
    );
  }

  return (
    <div className="min-h-screen flex bg-[#F8FAFC] text-[#0F172A] font-['Inter',sans-serif] selection:bg-blue-600 selection:text-white">
      {/* Sidebar Navigation */}
      <Sidebar
        currentTab={currentTab}
        onSelectTab={(tab) => {
          setCurrentTab(tab);
          setMobileNavOpen(false);
        }}
        criticalStockCount={criticalStockCount}
        urgentTrialsCount={urgentTrialsCount}
        onOpenSupport={() => setShowSupportModal(true)}
        isMobileOpen={mobileNavOpen}
        onCloseMobile={() => setMobileNavOpen(false)}
        hideOperations={hideOperations}
        hideStock={hideStock}
        onToggleHideOperations={handleToggleHideOperations}
        onToggleHideStock={handleToggleHideStock}
      />

      {/* Main View Area */}
      <div className="flex-1 flex flex-col min-w-0 md:ml-64 lg:ml-72 min-h-screen overflow-x-hidden">
        {/* Top Header */}
        <TopHeader
          currentTab={currentTab}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          notifications={notifications}
          onMarkNotificationRead={handleMarkNotificationRead}
          onClearAllNotifications={handleClearAllNotifications}
          onOpenSettings={() => setShowSettingsModal(true)}
          onToggleMobileNav={() => setMobileNavOpen(!mobileNavOpen)}
          onSelectTab={setCurrentTab}
          pendingNotesCount={pendingDailyNotesCount}
          onOpenDailyNotes={() => setShowDailyNotesModal(true)}
          hideOperations={hideOperations}
          hideStock={hideStock}
          onToggleHideOperations={handleToggleHideOperations}
          onToggleHideStock={handleToggleHideStock}
          currentUser={currentUser}
          onLogout={handleLogout}
        />

        {/* View Router */}
        <main className="flex-1 pb-16">
          {currentTab === 'dashboard' && !hideOperations && (
            <DashboardView
              samples={samples}
              stockItems={stockItems}
              trials={trials}
              staffList={staffList}
              onSelectTab={setCurrentTab}
              onOpenNewAnalysis={() => setShowNewAnalysisModal(true)}
              onOpenUploadResult={(trial) => setActiveUploadTrial(trial)}
              dailyNotes={dailyNotes}
              onOpenDailyNotes={() => setShowDailyNotesModal(true)}
              onToggleDailyNote={handleToggleDailyNote}
            />
          )}

          {currentTab === 'stock' && !hideStock && (
            <StockView
              items={stockItems}
              searchQuery={searchQuery}
              onUpdateQuantity={handleUpdateStockQuantity}
              onOpenAddItem={() => setShowAddItemModal(true)}
              onDeleteItem={handleDeleteStockItem}
              onSaveLot={handleSaveStockLot}
              onDeleteLot={handleDeleteStockLot}
              onSwitchActiveLot={handleSwitchActiveLot}
            />
          )}

          {currentTab === 'outlab' && (
            <OutlabView
              tests={outlabTests}
              orders={outlabOrders}
              referralLabs={referralLabs}
              searchQuery={searchQuery}
              onOpenAddTest={() => {
                setEditingOutlabTest(null);
                setShowAddOutlabModal(true);
              }}
              onOpenNewOrder={(preselectedTest) => {
                setPreselectedSendoutTest(preselectedTest || null);
                setShowNewSendoutModal(true);
              }}
              onViewTestDetail={(test) => {
                setActiveDetailOutlabTest(test);
                setShowOutlabDetailModal(true);
              }}
              onEditTest={(test) => {
                setEditingOutlabTest(test);
                setShowAddOutlabModal(true);
              }}
              onDeleteTest={handleDeleteOutlabTest}
              onUpdateOrderStatus={handleUpdateOrderStatus}
              onDeleteOrder={handleDeleteSendoutOrder}
            />
          )}

          {currentTab === 'eqa' && (
            <EQAView
              trials={trials}
              searchQuery={searchQuery}
              onOpenAddTrial={() => setShowAddTrialModal(true)}
              onOpenUploadResult={(trial) => setActiveUploadTrial(trial)}
              onViewSubmission={(trial) => setActiveViewTrial(trial)}
              onDeleteTrial={handleDeleteTrial}
            />
          )}

          {currentTab === 'roster' && (
            <RosterView
              staffList={staffList}
              shifts={shifts}
              searchQuery={searchQuery}
              onOpenAddStaff={() => {
                setEditingStaffMember(null);
                setShowAddStaffModal(true);
              }}
              onOpenUploadRosterImage={() => setShowUploadRosterImageModal(true)}
              onAssignStaffToDate={handleAssignStaffToDate}
              onEditStaff={(staff) => {
                setEditingStaffMember(staff);
                setShowAddStaffModal(true);
              }}
              onDeleteStaff={handleDeleteStaff}
              onRemoveShift={handleRemoveShift}
              onUpdateStaffAvatar={handleUpdateStaffAvatar}
            />
          )}

          {currentTab === 'contacts' && (
            <ContactsView
              sections={directorySections}
              searchQuery={searchQuery}
              onOpenAddMachine={(secId) => {
                setTargetDirectorySectionId(secId);
                setShowAddMachineModal(true);
              }}
              onOpenAddContact={(secId) => {
                setTargetDirectorySectionId(secId);
                setShowAddContactModal(true);
              }}
              onOpenAddVideo={(secId) => {
                setTargetDirectorySectionId(secId);
                setShowAddVideoModal(true);
              }}
              onPlayVideo={(section, video) => {
                setActivePlayingVideo({ section, video });
              }}
              onDeleteMachine={handleDeleteMachine}
              onDeleteEngineer={handleDeleteEngineer}
              onDeleteVideo={handleDeleteDepartmentVideo}
            />
          )}
        </main>
      </div>

      {/* Interactive Modal Dialogs */}
      <NewAnalysisModal
        isOpen={showNewAnalysisModal}
        onClose={() => setShowNewAnalysisModal(false)}
        onSubmit={handleAddNewSample}
      />

      <AddItemModal
        isOpen={showAddItemModal}
        onClose={() => setShowAddItemModal(false)}
        onSubmit={handleAddNewStockItem}
      />

      {/* Outlab Referral Modals */}
      <AddOutlabTestModal
        isOpen={showAddOutlabModal}
        editingTest={editingOutlabTest}
        referralLabs={referralLabs}
        onClose={() => {
          setShowAddOutlabModal(false);
          setEditingOutlabTest(null);
        }}
        onSubmit={handleAddOrEditOutlabTest}
      />

      <NewSendoutOrderModal
        isOpen={showNewSendoutModal}
        onClose={() => {
          setShowNewSendoutModal(false);
          setPreselectedSendoutTest(null);
        }}
        onSubmit={handleAddNewSendoutOrder}
        outlabTests={outlabTests}
        initialSelectedTest={preselectedSendoutTest}
        currentUser={currentUser}
      />

      <OutlabDetailModal
        isOpen={showOutlabDetailModal}
        onClose={() => {
          setShowOutlabDetailModal(false);
          setActiveDetailOutlabTest(null);
        }}
        test={activeDetailOutlabTest}
        referralLabs={referralLabs}
        onOpenSendout={(test) => {
          setPreselectedSendoutTest(test);
          setShowNewSendoutModal(true);
        }}
        onEditTest={(test) => {
          setEditingOutlabTest(test);
          setShowAddOutlabModal(true);
        }}
      />

      <AddTrialModal
        isOpen={showAddTrialModal}
        onClose={() => setShowAddTrialModal(false)}
        onSubmit={handleAddTrial}
      />

      <UploadResultModal
        trial={activeUploadTrial}
        isOpen={Boolean(activeUploadTrial)}
        onClose={() => setActiveUploadTrial(null)}
        onSubmitResults={handleUploadTrialResults}
      />

      <ViewSubmissionModal
        trial={activeViewTrial}
        isOpen={Boolean(activeViewTrial)}
        onClose={() => setActiveViewTrial(null)}
      />

      <AddStaffModal
        isOpen={showAddStaffModal}
        editingStaff={editingStaffMember}
        onClose={() => {
          setShowAddStaffModal(false);
          setEditingStaffMember(null);
        }}
        onSubmit={handleAddOrEditStaff}
        onDeleteStaff={handleDeleteStaff}
      />

      <UploadRosterImageModal
        isOpen={showUploadRosterImageModal}
        onClose={() => setShowUploadRosterImageModal(false)}
        onApplyRoster={handleApplyRosterFromOCR}
      />

      <AddMachineModal
        isOpen={showAddMachineModal}
        sectionId={targetDirectorySectionId}
        sectionTitle={
          directorySections.find((s) => s.id === targetDirectorySectionId)?.title
        }
        onClose={() => setShowAddMachineModal(false)}
        onSubmit={handleAddMachine}
      />

      <AddContactModal
        isOpen={showAddContactModal}
        sectionId={targetDirectorySectionId}
        sectionTitle={
          directorySections.find((s) => s.id === targetDirectorySectionId)?.title
        }
        onClose={() => setShowAddContactModal(false)}
        onSubmit={handleAddContact}
      />

      <AddDepartmentVideoModal
        isOpen={showAddVideoModal}
        section={directorySections.find((s) => s.id === targetDirectorySectionId) || null}
        onClose={() => setShowAddVideoModal(false)}
        onSubmit={handleAddNewDepartmentVideo}
      />

      <VideoPlayerModal
        isOpen={Boolean(activePlayingVideo)}
        video={activePlayingVideo?.video || null}
        section={activePlayingVideo?.section || null}
        onClose={() => setActivePlayingVideo(null)}
        onDeleteVideo={handleDeleteDepartmentVideo}
      />

      <SettingsModal
        isOpen={showSettingsModal}
        onClose={() => setShowSettingsModal(false)}
        onResetData={handleResetAllData}
        hideOperations={hideOperations}
        onToggleHideOperations={handleToggleHideOperations}
        hideStock={hideStock}
        onToggleHideStock={handleToggleHideStock}
        currentUser={currentUser}
        onUpdateCurrentUser={handleUpdateCurrentUser}
      />

      <SupportModal
        isOpen={showSupportModal}
        onClose={() => setShowSupportModal(false)}
      />

      <DailyNotesModal
        isOpen={showDailyNotesModal}
        notes={dailyNotes}
        onClose={() => setShowDailyNotesModal(false)}
        onAddNote={handleAddNewDailyNote}
        onToggleNote={handleToggleDailyNote}
        onDeleteNote={handleDeleteDailyNote}
        onClearCompleted={handleClearCompletedDailyNotes}
      />
    </div>
  );
}
