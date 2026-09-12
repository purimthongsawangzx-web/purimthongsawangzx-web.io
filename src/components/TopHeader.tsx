import React, { useState, useEffect, useRef } from 'react';
import { NavigationTab, NotificationItem, UserAccount } from '../types';

interface TopHeaderProps {
  currentTab: NavigationTab;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  notifications: NotificationItem[];
  onMarkNotificationRead: (id: string) => void;
  onClearAllNotifications: () => void;
  onOpenSettings: () => void;
  onToggleMobileNav: () => void;
  onSelectTab: (tab: NavigationTab) => void;
  pendingNotesCount?: number;
  onOpenDailyNotes?: () => void;
  hideOperations?: boolean;
  hideStock?: boolean;
  onToggleHideOperations?: (hide: boolean) => void;
  onToggleHideStock?: (hide: boolean) => void;
  currentUser?: UserAccount | null;
  onLogout?: () => void;
  onSwitchUser?: () => void;
}

export const TopHeader: React.FC<TopHeaderProps> = ({
  currentTab,
  searchQuery,
  onSearchChange,
  notifications,
  onMarkNotificationRead,
  onClearAllNotifications,
  onOpenSettings,
  onToggleMobileNav,
  onSelectTab,
  pendingNotesCount = 0,
  onOpenDailyNotes,
  hideOperations = false,
  hideStock = false,
  onToggleHideOperations,
  onToggleHideStock,
  currentUser,
  onLogout,
  onSwitchUser
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [avatarError, setAvatarError] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const notifMenuRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setShowUserMenu(false);
      }
      if (notifMenuRef.current && !notifMenuRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getSearchPlaceholder = () => {
    switch (currentTab) {
      case 'stock':
        return 'Search inventory, reagents, codes...';
      case 'outlab':
        return 'Search outlab tests, destination labs (N Health, Siriraj...), tube type...';
      case 'eqa':
        return 'Search trials, cycles, instruments...';
      case 'roster':
        return 'Search staff, shifts, roles...';
      case 'contacts':
        return 'Search extensions, vendors, machines...';
      default:
        return 'Search lab records, samples, tests...';
    }
  };

  const getTabTitle = (tab: NavigationTab) => {
    switch (tab) {
      case 'dashboard':
        return 'Operations Dashboard';
      case 'stock':
        return 'Reagent & Stock Management';
      case 'outlab':
        return 'Outlab Referral & Send-Out Directory';
      case 'eqa':
        return 'EQA Assessment';
      case 'roster':
        return 'Monthly Staff Roster';
      case 'contacts':
        return 'Lab Directory & Machines';
      default:
        return tab;
    }
  };

  return (
    <header
      id="top-header"
      className="sticky top-0 z-30 flex items-center justify-between px-4 sm:px-6 md:px-8 py-4 w-full bg-white/95 backdrop-blur-md border-b border-[#E2E8F0] shadow-2xs"
    >
      {/* Mobile Hamburger & Breadcrumb */}
      <div className="flex items-center gap-3">
        <button
          id="btn-mobile-menu"
          onClick={onToggleMobileNav}
          className="md:hidden p-2 rounded-xl text-[#475569] hover:bg-[#EFF6FF] hover:text-[#1E40AF] active:scale-95 transition-all cursor-pointer"
          aria-label="Toggle navigation menu"
        >
          <span className="material-symbols-outlined text-[24px]">menu</span>
        </button>

        {/* Dynamic Mobile View Title */}
        <div className="md:hidden">
          <h2 className="font-['Noto_Serif',serif] text-base font-bold text-[#0F172A]">
            {getTabTitle(currentTab)}
          </h2>
        </div>
      </div>

      {/* Global Search Bar */}
      <div className="flex-1 max-w-lg mx-2 sm:mx-4 relative">
        <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8] text-[20px] pointer-events-none">
          search
        </span>
        <input
          id="global-search-input"
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={getSearchPlaceholder()}
          className="w-full bg-[#F1F5F9] hover:bg-[#E2E8F0]/70 focus:bg-white text-[#0F172A] placeholder:text-[#94A3B8] text-sm rounded-full py-2.5 pl-10 pr-9 border border-[#E2E8F0] focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 outline-none transition-all"
        />
        {searchQuery && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#0F172A] p-0.5 rounded-full cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">close</span>
          </button>
        )}
      </div>

      {/* Header Actions & Profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Hidden Module Badges (Quick Unhide) */}
        {(hideOperations || hideStock) && (
          <div className="hidden xl:flex items-center gap-1.5 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full text-xs text-amber-800">
            <span className="material-symbols-outlined text-[14px]">visibility_off</span>
            <span>Hidden:</span>
            {hideOperations && (
              <button
                type="button"
                onClick={() => onToggleHideOperations?.(false)}
                className="underline hover:text-blue-700 font-bold cursor-pointer"
                title="Click to show Operations"
              >
                Operations
              </button>
            )}
            {hideOperations && hideStock && <span>•</span>}
            {hideStock && (
              <button
                type="button"
                onClick={() => onToggleHideStock?.(false)}
                className="underline hover:text-blue-700 font-bold cursor-pointer"
                title="Click to show Stock"
              >
                Stock
              </button>
            )}
          </div>
        )}

        {/* Daily Short Notes / Reminder Button */}
        {onOpenDailyNotes && (
          <button
            id="btn-header-daily-notes"
            onClick={onOpenDailyNotes}
            className="h-10 px-3 sm:px-3.5 rounded-full flex items-center gap-1.5 text-[#0F172A] bg-[#F1F5F9] hover:bg-[#EFF6FF] hover:text-[#1E40AF] border border-[#E2E8F0] hover:border-[#1E40AF]/30 active:scale-95 transition-all cursor-pointer shadow-2xs font-medium text-xs"
            title="Daily Reminders & Short Notes (บันทึกเตือนความจำ)"
          >
            <span className="material-symbols-outlined text-[19px] text-[#1E40AF]">sticky_note_2</span>
            <span className="hidden sm:inline font-bold">Short Notes</span>
            {pendingNotesCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-[#1E40AF] text-white">
                {pendingNotesCount}
              </span>
            )}
          </button>
        )}

        {/* Notifications Dropdown */}
        <div className="relative" ref={notifMenuRef}>
          <button
            id="btn-notifications-toggle"
            onClick={() => setShowNotifications(!showNotifications)}
            className="w-10 h-10 rounded-full flex items-center justify-center text-[#475569] hover:bg-[#EFF6FF] hover:text-[#1E40AF] active:scale-95 transition-all relative cursor-pointer"
            aria-label="Notifications"
          >
            <span className="material-symbols-outlined text-[22px]">notifications</span>
            {unreadCount > 0 && (
              <span className="absolute top-2 right-2 w-2.5 h-2.5 rounded-full bg-[#DC2626] ring-2 ring-white" />
            )}
          </button>

          {showNotifications && (
            <div
              id="notifications-popover"
              className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-3xl shadow-xl border border-[#E2E8F0] p-5 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
            >
              <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
                <div className="flex items-center gap-2">
                  <h3 className="font-['Noto_Serif',serif] font-bold text-base text-[#0F172A]">
                    Notifications
                  </h3>
                  {unreadCount > 0 && (
                    <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-[#FEE2E2] text-[#DC2626]">
                      {unreadCount} new
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={onClearAllNotifications}
                    className="text-xs text-[#2563EB] hover:underline font-bold cursor-pointer"
                  >
                    Mark all read
                  </button>
                )}
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-[#E2E8F0]/70 mt-1">
                {notifications.length === 0 ? (
                  <div className="py-8 text-center text-sm text-[#94A3B8]">
                    No new alerts at this time.
                  </div>
                ) : (
                  notifications.map((notif) => (
                    <div
                      key={notif.id}
                      onClick={() => {
                        onMarkNotificationRead(notif.id);
                        if (notif.tabTarget) {
                          onSelectTab(notif.tabTarget);
                          setShowNotifications(false);
                        }
                      }}
                      className={`py-3 px-2 rounded-xl transition-colors cursor-pointer hover:bg-[#EFF6FF] ${
                        !notif.read ? 'bg-[#F8FAFC]' : ''
                      }`}
                    >
                      <div className="flex items-start gap-2.5">
                        <span
                          className={`material-symbols-outlined text-[18px] mt-0.5 ${
                            notif.type === 'urgent'
                              ? 'text-[#DC2626]'
                              : notif.type === 'warning'
                              ? 'text-[#D97706]'
                              : notif.type === 'success'
                              ? 'text-[#059669]'
                              : 'text-[#2563EB]'
                          }`}
                        >
                          {notif.type === 'urgent'
                            ? 'error'
                            : notif.type === 'warning'
                            ? 'warning'
                            : notif.type === 'success'
                            ? 'check_circle'
                            : 'info'}
                        </span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="text-xs font-bold text-[#0F172A] truncate">
                              {notif.title}
                            </p>
                            <span className="text-[10px] text-[#94A3B8]">{notif.time}</span>
                          </div>
                          <p className="text-xs text-[#475569] line-clamp-2 mt-0.5">
                            {notif.message}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Settings Button */}
        <button
          id="btn-header-settings"
          onClick={onOpenSettings}
          className="w-10 h-10 rounded-full flex items-center justify-center text-[#475569] hover:bg-[#EFF6FF] hover:text-[#1E40AF] active:scale-95 transition-all cursor-pointer"
          aria-label="Settings"
          title="System Settings & Module Visibility"
        >
          <span className="material-symbols-outlined text-[22px]">settings</span>
        </button>

        {/* User Account / Profile & Lock Button */}
        <div className="relative pl-2 border-l border-[#E2E8F0]" ref={userMenuRef}>
          <button
            type="button"
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2.5 py-1 px-1.5 sm:px-2 rounded-2xl hover:bg-[#F8FAFC] border border-transparent hover:border-[#E2E8F0] transition-all cursor-pointer text-left group"
            title="Logged In Staff Profile & Account Controls"
          >
            {currentUser?.avatarUrl && !avatarError ? (
              <img
                src={currentUser.avatarUrl}
                alt={currentUser.fullName}
                onError={() => setAvatarError(true)}
                className="w-9 h-9 rounded-full object-cover ring-2 ring-[#E2E8F0] group-hover:ring-[#2563EB] transition-all shrink-0"
              />
            ) : (
              <div className="w-9 h-9 rounded-full bg-linear-to-tr from-[#1E40AF] to-[#0284C7] text-white flex items-center justify-center font-bold text-xs shadow-xs shrink-0 ring-2 ring-[#E2E8F0]">
                {currentUser?.initials || 'MT'}
              </div>
            )}
            <div className="hidden lg:block text-left max-w-[150px]">
              <p className="text-xs font-bold text-[#0F172A] leading-tight truncate">
                {currentUser?.fullName || 'LABVIBHARAM Team'}
              </p>
              <p className="text-[10px] text-[#0284C7] font-semibold truncate">
                {currentUser?.role || 'Clinical Lab Staff'}
              </p>
            </div>
            <span className="material-symbols-outlined text-slate-400 group-hover:text-slate-600 text-[18px] transition-transform duration-150">
              {showUserMenu ? 'expand_less' : 'expand_more'}
            </span>
          </button>

          {/* User Profile Dropdown Menu */}
          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-72 bg-white rounded-3xl shadow-xl border border-[#E2E8F0] p-4 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="flex items-start gap-3 pb-3 border-b border-[#F1F5F9]">
                {currentUser?.avatarUrl && !avatarError ? (
                  <img
                    src={currentUser.avatarUrl}
                    alt={currentUser.fullName}
                    className="w-11 h-11 rounded-full object-cover ring-2 ring-[#E2E8F0] shrink-0"
                  />
                ) : (
                  <div className="w-11 h-11 rounded-full bg-linear-to-tr from-[#1E40AF] to-[#0284C7] text-white flex items-center justify-center font-bold text-sm shrink-0">
                    {currentUser?.initials || 'LT'}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-bold text-[#0F172A] truncate">
                    {currentUser?.fullName || 'LABVIBHARAM Team'}
                  </h4>
                  <p className="text-xs font-semibold text-[#0284C7] truncate">
                    @{currentUser?.username || 'lab'} • {currentUser?.role || 'Staff'}
                  </p>
                  <div className="mt-1 flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md w-fit">
                    <span className="material-symbols-outlined text-[12px]">shield</span>
                    <span>1 User 1 Private Dataset</span>
                  </div>
                </div>
              </div>

              <div className="py-2 space-y-1">
                <button
                  type="button"
                  onClick={() => {
                    setShowUserMenu(false);
                    onOpenSettings();
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-[#0F172A] hover:bg-[#EFF6FF] hover:text-[#1E40AF] rounded-xl transition-colors cursor-pointer text-left"
                >
                  <span className="material-symbols-outlined text-[18px] text-[#475569]">
                    settings
                  </span>
                  <span>System Preferences & Password</span>
                </button>
              </div>

              <div className="pt-2 border-t border-[#F1F5F9]">
                <button
                  type="button"
                  onClick={() => {
                    setShowUserMenu(false);
                    if (onLogout) onLogout();
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2.5 text-xs font-bold text-red-600 hover:bg-red-50 rounded-xl transition-colors cursor-pointer text-left"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    lock
                  </span>
                  <span>Lock Terminal / Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
