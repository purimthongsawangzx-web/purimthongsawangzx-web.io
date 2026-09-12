import React, { useState } from 'react';
import { UserAccount } from '../../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onResetData: () => void;
  hideOperations?: boolean;
  onToggleHideOperations?: (hide: boolean) => void;
  hideStock?: boolean;
  onToggleHideStock?: (hide: boolean) => void;
  currentUser?: UserAccount | null;
  onUpdateCurrentUser?: (updated: UserAccount) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  onResetData,
  hideOperations = false,
  onToggleHideOperations,
  hideStock = false,
  onToggleHideStock,
  currentUser,
  onUpdateCurrentUser
}) => {
  const [fullName, setFullName] = useState(currentUser?.fullName || 'LABVIBHARAM Team');
  const [userPassword, setUserPassword] = useState(currentUser?.password || 'password123');
  const [department, setDepartment] = useState(currentUser?.department || 'Diagnostic Pathology Core');
  const [role, setRole] = useState(currentUser?.role || 'Clinical Lab Staff');
  const [showPassword, setShowPassword] = useState(false);
  const [labName, setLabName] = useState('LABVIBHARAM Hospital Diagnostic Pathology Core');
  const [accreditationCode, setAccreditationCode] = useState('ISO-15189 / CAP #90218 / LA-TH-2026');
  const [autoSyncLIS, setAutoSyncLIS] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(true);
  const [confirmReset, setConfirmReset] = useState(false);
  const [saveAlert, setSaveAlert] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (onUpdateCurrentUser && currentUser) {
      onUpdateCurrentUser({
        ...currentUser,
        fullName: fullName.trim() || currentUser.fullName,
        password: userPassword || 'password123',
        department: department.trim() || currentUser.department,
        role: role.trim() || currentUser.role
      });
    }
    setSaveAlert(true);
    setTimeout(() => {
      setSaveAlert(false);
      onClose();
    }, 300);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-[#E2E8F0] overflow-hidden animate-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E2E8F0] bg-[#F8FAFC]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#1E40AF] text-white flex items-center justify-center">
              <span className="material-symbols-outlined text-[18px]">settings</span>
            </div>
            <div>
              <h2 className="font-['Noto_Serif',serif] font-bold text-lg text-[#0F172A]">
                Workspace & Account Settings
              </h2>
              <p className="text-xs text-[#64748B]">1 User = 1 Isolated Dataset configuration</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-[#94A3B8] hover:text-[#0F172A] p-1.5 rounded-full hover:bg-[#F1F5F9] cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <form onSubmit={handleSave} className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          {/* Active User Isolation Badge */}
          <div className="bg-[#EFF6FF] border border-[#BFDBFE] rounded-2xl p-3.5 flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-[#2563EB] text-white flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-lg">shield_person</span>
            </div>
            <div className="text-xs">
              <p className="font-bold text-[#1E40AF]">
                Active Private Workspace: @{currentUser?.username || 'lab'}
              </p>
              <p className="text-[#475569] mt-0.5">
                All inventory items, EQA trials, schedules, and notes here are strictly isolated to your account.
              </p>
            </div>
          </div>

          {/* User Account & Password Credentials */}
          <div className="space-y-3 pt-1">
            <label className="block text-xs font-bold uppercase tracking-wider text-[#1E40AF]">
              Account Profile & Security (รหัสผ่านและความปลอดภัย)
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-[#475569] mb-1">
                  Full Name / Lab Title
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-[#F1F5F9] border border-[#E2E8F0] focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 focus:bg-white rounded-xl outline-none text-[#0F172A]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#475569] mb-1">
                  My Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={userPassword}
                    onChange={(e) => setUserPassword(e.target.value)}
                    className="w-full px-3 py-2 pr-9 text-sm bg-[#F1F5F9] border border-[#E2E8F0] focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 focus:bg-white rounded-xl outline-none font-mono text-[#0F172A]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      {showPassword ? 'visibility_off' : 'visibility'}
                    </span>
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-[#475569] mb-1">
                  Role / Designation
                </label>
                <input
                  type="text"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-[#F1F5F9] border border-[#E2E8F0] focus:border-[#2563EB] focus:bg-white rounded-xl outline-none text-[#0F172A]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#475569] mb-1">
                  Department / Section
                </label>
                <input
                  type="text"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-[#F1F5F9] border border-[#E2E8F0] focus:border-[#2563EB] focus:bg-white rounded-xl outline-none text-[#0F172A]"
                />
              </div>
            </div>
          </div>

          {/* Module Visibility Section */}
          <div className="pt-3 border-t border-[#E2E8F0] space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#1E40AF]">
                Module Visibility (ซ่อน / แสดงโมดูล)
              </label>
              {(hideOperations || hideStock) && (
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                  {Number(hideOperations) + Number(hideStock)} module(s) hidden
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 gap-2.5">
              {/* Operations Toggle */}
              <div className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between ${
                hideOperations ? 'bg-slate-50 border-slate-200 opacity-80' : 'bg-[#EFF6FF]/60 border-[#BFDBFE]'
              }`}>
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                    hideOperations ? 'bg-slate-200 text-slate-500' : 'bg-[#1E40AF] text-white'
                  }`}>
                    <span className="material-symbols-outlined text-[18px]">
                      {hideOperations ? 'visibility_off' : 'visibility'}
                    </span>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#0F172A]">Lab Operations Center</p>
                    <p className="text-[11px] text-[#64748B]">
                      {hideOperations ? 'Currently Hidden from navigation bar' : 'Visible in navigation bar'}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => onToggleHideOperations && onToggleHideOperations(!hideOperations)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    hideOperations
                      ? 'bg-blue-600 text-white shadow-xs hover:bg-blue-700'
                      : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span className="material-symbols-outlined text-[16px]">
                    {hideOperations ? 'visibility' : 'visibility_off'}
                  </span>
                  {hideOperations ? 'Show' : 'Hide'}
                </button>
              </div>

              {/* Stock Toggle */}
              <div className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between ${
                hideStock ? 'bg-slate-50 border-slate-200 opacity-80' : 'bg-[#EFF6FF]/60 border-[#BFDBFE]'
              }`}>
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                    hideStock ? 'bg-slate-200 text-slate-500' : 'bg-[#1E40AF] text-white'
                  }`}>
                    <span className="material-symbols-outlined text-[18px]">
                      {hideStock ? 'visibility_off' : 'visibility'}
                    </span>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#0F172A]">Inventory & Stock Control</p>
                    <p className="text-[11px] text-[#64748B]">
                      {hideStock ? 'Currently Hidden from navigation bar' : 'Visible in navigation bar'}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => onToggleHideStock && onToggleHideStock(!hideStock)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    hideStock
                      ? 'bg-blue-600 text-white shadow-xs hover:bg-blue-700'
                      : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span className="material-symbols-outlined text-[16px]">
                    {hideStock ? 'visibility' : 'visibility_off'}
                  </span>
                  {hideStock ? 'Show' : 'Hide'}
                </button>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-[#E2E8F0]">
            <label className="block text-xs font-bold uppercase tracking-wider text-[#64748B] mb-1">
              Laboratory Institution Name
            </label>
            <input
              type="text"
              value={labName}
              onChange={(e) => setLabName(e.target.value)}
              className="w-full px-4 py-2.5 text-sm bg-[#F1F5F9] border border-[#E2E8F0] focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 focus:bg-white rounded-2xl outline-none text-[#0F172A]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#64748B] mb-1">
              Quality Accreditation Identifier
            </label>
            <input
              type="text"
              value={accreditationCode}
              onChange={(e) => setAccreditationCode(e.target.value)}
              className="w-full px-4 py-2.5 text-sm bg-[#F1F5F9] border border-[#E2E8F0] focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 focus:bg-white rounded-2xl outline-none font-mono text-[#0F172A]"
            />
          </div>

          {/* Switches */}
          <div className="space-y-3 pt-1">
            <label className="flex items-center justify-between p-3.5 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] cursor-pointer hover:bg-[#EFF6FF]/50 transition-colors">
              <div>
                <p className="text-xs font-bold text-[#0F172A]">Auto-Sync LIS HL7 Feed</p>
                <p className="text-[11px] text-[#64748B]">Transmit analyzer results directly to Hospital EHR</p>
              </div>
              <input
                type="checkbox"
                checked={autoSyncLIS}
                onChange={(e) => setAutoSyncLIS(e.target.checked)}
                className="w-4 h-4 rounded text-[#1E40AF] focus:ring-[#1E40AF]"
              />
            </label>

            <label className="flex items-center justify-between p-3.5 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] cursor-pointer hover:bg-[#EFF6FF]/50 transition-colors">
              <div>
                <p className="text-xs font-bold text-[#0F172A]">STAT Critical Value SMS & App Alerts</p>
                <p className="text-[11px] text-[#64748B]">Auto-alert physician upon critical panic result</p>
              </div>
              <input
                type="checkbox"
                checked={smsAlerts}
                onChange={(e) => setSmsAlerts(e.target.checked)}
                className="w-4 h-4 rounded text-[#1E40AF] focus:ring-[#1E40AF]"
              />
            </label>
          </div>

          {/* Reset Workspace Data Section */}
          <div className="pt-4 border-t border-[#E2E8F0]">
            {!confirmReset ? (
              <button
                type="button"
                onClick={() => setConfirmReset(true)}
                className="w-full py-2.5 rounded-full border border-red-200 hover:bg-red-50 text-red-600 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
              >
                Reset My Dataset to Template Baseline
              </button>
            ) : (
              <div className="p-4 rounded-2xl bg-red-50 border border-red-200 space-y-2">
                <p className="text-xs font-bold text-red-800">
                  Are you sure? This will restore clean template records for @{currentUser?.username || 'user'} only. (Other user datasets will not be affected).
                </p>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      onResetData();
                      setConfirmReset(false);
                      onClose();
                    }}
                    className="px-4 py-1.5 rounded-full bg-red-600 text-white text-xs font-bold cursor-pointer hover:bg-red-700 transition-colors"
                  >
                    Confirm Reset
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmReset(false)}
                    className="px-4 py-1.5 rounded-full bg-white text-[#0F172A] text-xs font-bold border border-slate-200 cursor-pointer hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-[#E2E8F0] flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-xs uppercase tracking-widest font-bold text-[#64748B] hover:text-[#0F172A]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-[#1E40AF] hover:bg-[#1D4ED8] text-white font-['Public_Sans',sans-serif] font-bold text-xs uppercase tracking-widest rounded-full shadow-xs transition-all active:scale-95 cursor-pointer"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
