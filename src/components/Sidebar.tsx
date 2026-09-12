import React, { useState } from 'react';
import { NavigationTab } from '../types';

interface SidebarProps {
  currentTab: NavigationTab;
  onSelectTab: (tab: NavigationTab) => void;
  criticalStockCount: number;
  urgentTrialsCount: number;
  onOpenSupport: () => void;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
  hideOperations?: boolean;
  hideStock?: boolean;
  onToggleHideOperations?: (hide: boolean) => void;
  onToggleHideStock?: (hide: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  criticalStockCount,
  urgentTrialsCount,
  onOpenSupport,
  isMobileOpen,
  onCloseMobile,
  hideOperations = false,
  hideStock = false,
  onToggleHideOperations,
  onToggleHideStock
}) => {
  const [showVisibilityMenu, setShowVisibilityMenu] = useState(false);

  const allNavItems: {
    id: NavigationTab;
    label: string;
    icon: string;
    badgeCount?: number;
    badgeVariant?: 'urgent' | 'warning' | 'neutral';
    hidden?: boolean;
  }[] = [
    {
      id: 'dashboard',
      label: 'Operations',
      icon: 'dashboard',
      hidden: hideOperations
    },
    {
      id: 'stock',
      label: 'Stock Management',
      icon: 'inventory_2',
      badgeCount: criticalStockCount > 0 ? criticalStockCount : undefined,
      badgeVariant: 'urgent',
      hidden: hideStock
    },
    {
      id: 'outlab',
      label: 'Outlab (ส่งตรวจนอก)',
      icon: 'local_shipping'
    },
    {
      id: 'eqa',
      label: 'EQA Assessment',
      icon: 'science',
      badgeCount: urgentTrialsCount > 0 ? urgentTrialsCount : undefined,
      badgeVariant: 'warning'
    },
    {
      id: 'roster',
      label: 'Monthly Roster',
      icon: 'calendar_month'
    },
    {
      id: 'contacts',
      label: 'Lab Directory',
      icon: 'contacts'
    }
  ];

  const visibleNavItems = allNavItems.filter((item) => !item.hidden);
  const hiddenCount = Number(hideOperations) + Number(hideStock);

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isMobileOpen && (
        <div
          id="mobile-sidebar-backdrop"
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs md:hidden transition-opacity"
          aria-label="Close menu"
        />
      )}

      {/* Sidebar Container */}
      <aside
        id="main-sidebar"
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 lg:w-72 bg-white border-r border-[#E2E8F0] flex flex-col justify-between p-6 transition-transform duration-300 ease-in-out md:translate-x-0 ${
          isMobileOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
        }`}
      >
        <div className="space-y-6">
          {/* Logo & Brand Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#1E40AF] text-white flex items-center justify-center shadow-xs">
                <span className="material-symbols-outlined text-[22px]">biotech</span>
              </div>
              <div>
                <h1 className="font-['Noto_Serif',serif] italic font-bold text-xl text-[#0F172A] tracking-tight leading-none">
                  LABVIBHARAM
                </h1>
                <p className="font-['Public_Sans',sans-serif] text-[10px] text-[#0284C7] font-bold tracking-[0.2em] uppercase mt-1">
                  Clinical Excellence
                </p>
              </div>
            </div>

            {/* Close button on mobile */}
            <button
              onClick={onCloseMobile}
              className="md:hidden p-1.5 rounded-lg text-[#64748B] hover:bg-[#F1F5F9] hover:text-[#0F172A] transition-colors"
              aria-label="Close navigation"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5">
            <div className="flex items-center justify-between px-3 mb-2">
              <p className="text-[11px] font-['Public_Sans',sans-serif] font-bold text-[#94A3B8] uppercase tracking-[0.2em]">
                Core Modules
              </p>
              {hiddenCount > 0 && (
                <span className="text-[10px] bg-amber-50 text-amber-700 border border-amber-200 font-semibold px-2 py-0.5 rounded-full">
                  {hiddenCount} Hidden
                </span>
              )}
            </div>

            {visibleNavItems.map((item) => {
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-btn-${item.id}`}
                  onClick={() => {
                    onSelectTab(item.id);
                    onCloseMobile();
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-sm transition-all duration-150 cursor-pointer text-left ${
                    isActive
                      ? 'bg-[#1E40AF] text-white font-bold shadow-xs'
                      : 'text-[#475569] hover:bg-[#EFF6FF] hover:text-[#1E40AF] font-medium'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`material-symbols-outlined text-[20px] ${
                        isActive ? 'text-white' : 'text-[#0284C7]'
                      }`}
                    >
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                  </div>

                  {item.badgeCount !== undefined && item.badgeCount > 0 && (
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-['Public_Sans',sans-serif] font-bold ${
                        isActive
                          ? 'bg-white/20 text-white'
                          : item.badgeVariant === 'urgent'
                          ? 'bg-[#FEE2E2] text-[#DC2626]'
                          : 'bg-[#FEF3C7] text-[#D97706]'
                      }`}
                    >
                      {item.badgeCount}
                    </span>
                  )}
                </button>
              );
            })}

            {/* Quick Module Visibility Toggle Box */}
            <div className="pt-3">
              <button
                type="button"
                onClick={() => setShowVisibilityMenu(!showVisibilityMenu)}
                className="w-full flex items-center justify-between px-3 py-2 text-xs font-semibold text-[#64748B] hover:text-[#1E40AF] hover:bg-[#F8FAFC] rounded-xl transition-all cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[16px]">tune</span>
                  <span>Module Visibility (ซ่อน/แสดง)</span>
                </div>
                <span className="material-symbols-outlined text-[16px] transition-transform duration-150" style={{ transform: showVisibilityMenu ? 'rotate(180deg)' : 'none' }}>
                  expand_more
                </span>
              </button>

              {showVisibilityMenu && (
                <div className="mt-2 p-3 bg-[#F8FAFC] rounded-2xl border border-[#E2E8F0] space-y-2 animate-in fade-in duration-150 text-xs">
                  {/* Operation Quick Toggle */}
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-[#334155] flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[16px] text-blue-600">dashboard</span>
                      Operations
                    </span>
                    <button
                      type="button"
                      onClick={() => onToggleHideOperations?.(!hideOperations)}
                      className={`px-2.5 py-1 rounded-full text-[11px] font-bold transition-all cursor-pointer ${
                        hideOperations
                          ? 'bg-slate-200 text-slate-700 hover:bg-blue-600 hover:text-white'
                          : 'bg-blue-600 text-white hover:bg-red-600'
                      }`}
                    >
                      {hideOperations ? 'Show' : 'Hide'}
                    </button>
                  </div>

                  {/* Stock Quick Toggle */}
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-[#334155] flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[16px] text-blue-600">inventory_2</span>
                      Stock
                    </span>
                    <button
                      type="button"
                      onClick={() => onToggleHideStock?.(!hideStock)}
                      className={`px-2.5 py-1 rounded-full text-[11px] font-bold transition-all cursor-pointer ${
                        hideStock
                          ? 'bg-slate-200 text-slate-700 hover:bg-blue-600 hover:text-white'
                          : 'bg-blue-600 text-white hover:bg-red-600'
                      }`}
                    >
                      {hideStock ? 'Show' : 'Hide'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </nav>
        </div>

        {/* Footer Area: System Status & Support */}
        <div className="space-y-4 pt-6 border-t border-[#E2E8F0]">
          <div className="bg-[#EFF6FF] rounded-2xl p-4 border border-[#DBEAFE]">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="w-2 h-2 rounded-full bg-[#2563EB] animate-pulse" />
              <span className="text-xs font-bold text-[#1E3A8A] font-['Public_Sans',sans-serif] uppercase tracking-wider">
                LIS Online
              </span>
            </div>
            <p className="text-[11px] text-[#3B82F6] leading-relaxed">
              HL7 interface active • 6 analyzers synchronized
            </p>
          </div>

          <button
            id="btn-sidebar-support"
            onClick={onOpenSupport}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-full border border-[#CBD5E1] text-xs uppercase tracking-widest font-semibold text-[#1E293B] hover:bg-[#1E40AF] hover:text-white hover:border-[#1E40AF] transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">help_outline</span>
            <span>Support / Dispatch</span>
          </button>
        </div>
      </aside>
    </>
  );
};
