import React, { useState, useMemo, useRef } from 'react';
import { StaffMember, ShiftAssignment } from '../../types';

interface RosterViewProps {
  staffList: StaffMember[];
  shifts: ShiftAssignment[];
  searchQuery: string;
  onOpenAddStaff: () => void;
  onOpenUploadRosterImage: () => void;
  onAssignStaffToDate: (staff: StaffMember, dateStr?: string) => void;
  onEditStaff: (staff: StaffMember) => void;
  onDeleteStaff: (id: string) => void;
  onRemoveShift: (shiftId: string) => void;
  onUpdateStaffAvatar?: (staffId: string, avatarUrl: string | undefined) => void;
}

export const RosterView: React.FC<RosterViewProps> = ({
  staffList,
  shifts,
  searchQuery,
  onOpenAddStaff,
  onOpenUploadRosterImage,
  onAssignStaffToDate,
  onEditStaff,
  onDeleteStaff,
  onRemoveShift,
  onUpdateStaffAvatar
}) => {
  // Initialize calendar dynamically to the real current date (2026)
  const today = useMemo(() => new Date(), []);
  const todayStr = useMemo(() => {
    const y = today.getFullYear();
    const m = (today.getMonth() + 1).toString().padStart(2, '0');
    const d = today.getDate().toString().padStart(2, '0');
    return `${y}-${m}-${d}`;
  }, [today]);

  const [selectedDate, setSelectedDate] = useState<string>(todayStr);
  const [currentMonthIndex, setCurrentMonthIndex] = useState<number>(today.getMonth());
  const [currentYear, setCurrentYear] = useState<number>(today.getFullYear());
  const [staffIdToDelete, setStaffIdToDelete] = useState<string | null>(null);
  const [activeUploadStaffId, setActiveUploadStaffId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const daysOfWeek = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];

  const handlePrevMonth = () => {
    if (currentMonthIndex === 0) {
      setCurrentMonthIndex(11);
      setCurrentYear((prev) => prev - 1);
    } else {
      setCurrentMonthIndex((prev) => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonthIndex === 11) {
      setCurrentMonthIndex(0);
      setCurrentYear((prev) => prev + 1);
    } else {
      setCurrentMonthIndex((prev) => prev + 1);
    }
  };

  const handleJumpToToday = () => {
    const now = new Date();
    setCurrentYear(now.getFullYear());
    setCurrentMonthIndex(now.getMonth());
    const y = now.getFullYear();
    const m = (now.getMonth() + 1).toString().padStart(2, '0');
    const d = now.getDate().toString().padStart(2, '0');
    setSelectedDate(`${y}-${m}-${d}`);
  };

  const calendarDays = useMemo(() => {
    const year = currentYear;
    const month = currentMonthIndex; // 0-indexed

    // First day of current month
    const firstDay = new Date(year, month, 1);
    // getDay() gives 0 for Sunday, 1 for Monday... 6 for Saturday
    // We want Monday (1) to be index 0, Sunday (0) to be index 6
    let startingDayOfWeek = firstDay.getDay() - 1;
    if (startingDayOfWeek < 0) startingDayOfWeek = 6;

    // Days in current month
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    // Days in previous month
    const daysInPrevMonth = new Date(year, month, 0).getDate();

    const days: { dayNumber: number; dateStr: string; isCurrentMonth: boolean }[] = [];

    // Previous month trailing days
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      const d = daysInPrevMonth - i;
      const prevDate = new Date(year, month - 1, d);
      const yStr = prevDate.getFullYear();
      const mStr = (prevDate.getMonth() + 1).toString().padStart(2, '0');
      const dStr = d.toString().padStart(2, '0');
      days.push({
        dayNumber: d,
        dateStr: `${yStr}-${mStr}-${dStr}`,
        isCurrentMonth: false
      });
    }

    // Current month days
    for (let d = 1; d <= daysInMonth; d++) {
      const mStr = (month + 1).toString().padStart(2, '0');
      const dStr = d.toString().padStart(2, '0');
      days.push({
        dayNumber: d,
        dateStr: `${year}-${mStr}-${dStr}`,
        isCurrentMonth: true
      });
    }

    // Next month leading days to complete grid (multiples of 7, at least 35)
    const totalNeeded = days.length % 7 === 0 ? days.length : days.length + (7 - (days.length % 7));
    const finalSlots = totalNeeded < 35 ? 35 : totalNeeded;
    const nextDaysCount = finalSlots - days.length;

    for (let d = 1; d <= nextDaysCount; d++) {
      const nextDate = new Date(year, month + 1, d);
      const yStr = nextDate.getFullYear();
      const mStr = (nextDate.getMonth() + 1).toString().padStart(2, '0');
      const dStr = d.toString().padStart(2, '0');
      days.push({
        dayNumber: d,
        dateStr: `${yStr}-${mStr}-${dStr}`,
        isCurrentMonth: false
      });
    }

    return days;
  }, [currentYear, currentMonthIndex]);

  const shiftsOnSelectedDate = useMemo(() => {
    return shifts.filter((s) => s.date === selectedDate);
  }, [shifts, selectedDate]);

  const filteredStaff = useMemo(() => {
    return staffList.filter((staff) => {
      const q = searchQuery.toLowerCase();
      return (
        staff.name.toLowerCase().includes(q) ||
        staff.fullName.toLowerCase().includes(q) ||
        staff.role.toLowerCase().includes(q) ||
        staff.department.toLowerCase().includes(q)
      );
    });
  }, [staffList, searchQuery]);

  const getInitials = (name: string) => {
    if (!name.trim()) return 'ST';
    const parts = name.trim().split(' ').filter(Boolean);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const handleTriggerPhotoUpload = (staffId: string) => {
    setActiveUploadStaffId(staffId);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
      fileInputRef.current.click();
    }
  };

  const handleCardFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && activeUploadStaffId && onUpdateStaffAvatar) {
      if (file.size > 5 * 1024 * 1024) {
        alert('File size exceeds 5MB. Please choose a smaller image.');
        return;
      }
      const reader = new FileReader();
      reader.onload = (loadEvt) => {
        if (loadEvt.target?.result) {
          onUpdateStaffAvatar(activeUploadStaffId, loadEvt.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
    setActiveUploadStaffId(null);
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 lg:p-10 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-200">
      {/* Hidden File Input for quick avatar replacement */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleCardFileChange}
        accept="image/png, image/jpeg, image/webp, image/gif"
        className="hidden"
      />

      {/* View Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[#0284C7] font-['Noto_Serif',serif] italic text-sm block mb-1">
            Duty Scheduling & Shifts
          </span>
          <h1 className="font-['Noto_Serif',serif] text-3xl sm:text-4xl font-bold text-[#0F172A] tracking-tight">
            Monthly Roster
          </h1>
          <p className="text-sm text-[#475569] mt-1">
            Department duty rotations, laboratory personnel management, and shift roster synchronization.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 flex-wrap">
          <button
            id="btn-upload-timetable-image"
            onClick={onOpenUploadRosterImage}
            className="px-5 py-2.5 rounded-full border border-[#CBD5E1] hover:bg-[#1E40AF] hover:text-white text-[#0F172A] font-['Public_Sans',sans-serif] font-bold text-xs uppercase tracking-widest flex items-center gap-2 transition-all cursor-pointer shadow-2xs"
          >
            <span className="material-symbols-outlined text-[18px]">photo_camera</span>
            Scan Timetable Photo
          </button>

          <button
            id="btn-add-staff-member"
            onClick={onOpenAddStaff}
            className="px-6 py-2.5 rounded-full bg-[#1E40AF] hover:bg-[#1D4ED8] text-white font-['Public_Sans',sans-serif] font-bold text-xs uppercase tracking-widest flex items-center gap-2 shadow-xs transition-all active:scale-95 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">person_add</span>
            Add Staff Member
          </button>
        </div>
      </div>

      {/* Main Grid: Calendar on Left, Staff List on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Calendar Left (8 Cols) */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E2E8F0] shadow-xs space-y-6">
            {/* Month Switcher Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#EFF6FF] text-[#1E40AF] flex items-center justify-center">
                  <span className="material-symbols-outlined text-[22px]">calendar_month</span>
                </div>
                <div>
                  <h2 className="font-['Noto_Serif',serif] text-2xl font-bold text-[#0F172A]">
                    {monthNames[currentMonthIndex]} {currentYear}
                  </h2>
                  <p className="text-xs text-[#64748B]">Core Diagnostic Laboratory</p>
                </div>
              </div>

              {/* Month Switch Controls & Today Button */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleJumpToToday}
                  className="px-3 py-1.5 rounded-full bg-white hover:bg-[#F8FAFC] text-[#1E40AF] border border-[#CBD5E1] text-xs font-bold font-['Public_Sans',sans-serif] transition-colors cursor-pointer shadow-2xs"
                >
                  Today
                </button>
                <div className="flex items-center gap-1.5 bg-[#F1F5F9] p-1.5 rounded-full border border-[#E2E8F0]">
                  <button
                    type="button"
                    onClick={handlePrevMonth}
                    className="w-8 h-8 rounded-full hover:bg-white text-[#0F172A] flex items-center justify-center cursor-pointer transition-colors shadow-2xs"
                    aria-label="Previous month"
                  >
                    <span className="material-symbols-outlined text-[18px]">chevron_left</span>
                  </button>
                  <span className="text-xs font-bold text-[#0F172A] px-2 uppercase font-['Public_Sans',sans-serif]">
                    {monthNames[currentMonthIndex].slice(0, 3)} {currentYear}
                  </span>
                  <button
                    type="button"
                    onClick={handleNextMonth}
                    className="w-8 h-8 rounded-full hover:bg-white text-[#0F172A] flex items-center justify-center cursor-pointer transition-colors shadow-2xs"
                    aria-label="Next month"
                  >
                    <span className="material-symbols-outlined text-[18px]">chevron_right</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Days of Week Header */}
            <div className="grid grid-cols-7 gap-2 text-center pb-2 border-b border-[#E2E8F0]">
              {daysOfWeek.map((day) => (
                <div
                  key={day}
                  className="font-['Public_Sans',sans-serif] text-xs font-bold text-[#94A3B8] tracking-wider py-1"
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Cells Grid */}
            <div className="grid grid-cols-7 gap-2">
              {calendarDays.map((cell) => {
                const isSelected = selectedDate === cell.dateStr;
                const cellShifts = shifts.filter((s) => s.date === cell.dateStr);
                const hasShifts = cellShifts.length > 0;

                return (
                  <div
                    key={cell.dateStr}
                    onClick={() => setSelectedDate(cell.dateStr)}
                    className={`min-h-[85px] sm:min-h-[96px] p-2 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'border-2 border-[#1E40AF] bg-[#EFF6FF] shadow-xs'
                        : cell.isCurrentMonth
                        ? 'bg-white border-[#E2E8F0] hover:border-[#1E40AF]/50 hover:bg-[#F8FAFC]'
                        : 'bg-[#F1F5F9]/50 border-transparent text-[#94A3B8] opacity-60'
                    }`}
                  >
                    {/* Day Number */}
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-xs sm:text-sm font-bold ${
                          isSelected
                            ? 'w-6 h-6 rounded-full bg-[#1E40AF] text-white flex items-center justify-center shadow-2xs'
                            : cell.dateStr === todayStr
                            ? 'w-6 h-6 rounded-full bg-[#DBEAFE] text-[#1E40AF] flex items-center justify-center font-extrabold'
                            : cell.isCurrentMonth
                            ? 'text-[#0F172A]'
                            : 'text-[#94A3B8]'
                        }`}
                      >
                        {cell.dayNumber}
                      </span>

                      {hasShifts && (
                        <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-[#DBEAFE] text-[#1E40AF]">
                          {cellShifts.length}
                        </span>
                      )}
                    </div>

                    {/* Shifts mini list inside cell */}
                    <div className="space-y-1 mt-1 overflow-hidden">
                      {cellShifts.slice(0, 2).map((s) => (
                        <div
                          key={s.id}
                          className="text-[10px] px-1.5 py-0.5 rounded-lg bg-white border border-[#E2E8F0] text-[#0F172A] font-medium truncate flex items-center gap-1"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB] shrink-0" />
                          <span className="truncate">{s.staffName.split(' ')[0]}</span>
                        </div>
                      ))}
                      {cellShifts.length > 2 && (
                        <p className="text-[9px] text-[#64748B] font-bold text-center">
                          +{cellShifts.length - 2} more
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Selected Date Inspector Card */}
          <div className="bg-[#F8FAFC] rounded-3xl p-6 border border-[#E2E8F0] space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-['Noto_Serif',serif] text-lg font-bold text-[#0F172A]">
                  Shifts Scheduled for{' '}
                  {new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-US', {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </h3>
                <p className="text-xs text-[#64748B]">
                  {shiftsOnSelectedDate.length} personnel on duty
                </p>
              </div>

              <div className="text-xs font-bold text-[#1E40AF] bg-white px-3 py-1.5 rounded-full border border-[#E2E8F0]">
                {selectedDate}
              </div>
            </div>

            {shiftsOnSelectedDate.length === 0 ? (
              <div className="text-center py-6 text-sm text-[#94A3B8]">
                No shifts assigned on this date yet. Select staff on the right to assign them to {selectedDate}.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {shiftsOnSelectedDate.map((shift) => (
                  <div
                    key={shift.id}
                    className="p-3.5 rounded-2xl bg-white border border-[#E2E8F0] flex items-center justify-between group shadow-2xs"
                  >
                    <div className="flex items-center gap-3">
                      {shift.avatarUrl ? (
                        <img
                          src={shift.avatarUrl}
                          alt={shift.staffName}
                          className="w-10 h-10 rounded-full object-cover ring-2 ring-[#E2E8F0]"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#1E40AF] to-[#0284C7] text-white flex items-center justify-center font-bold text-xs ring-2 ring-slate-200">
                          {getInitials(shift.staffName)}
                        </div>
                      )}
                      <div>
                        <p className="text-sm font-bold text-[#0F172A]">{shift.staffName}</p>
                        <p className="text-xs text-[#64748B]">{shift.shiftType}</p>
                      </div>
                    </div>

                    <button
                      onClick={() => onRemoveShift(shift.id)}
                      className="text-[#94A3B8] hover:text-[#DC2626] p-1.5 rounded-full hover:bg-[#FEE2E2] transition-colors cursor-pointer"
                      title="Remove from shift"
                    >
                      <span className="material-symbols-outlined text-[18px]">close</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Staff Directory Column Right (4 Cols) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-[#E2E8F0] shadow-xs space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
              <div>
                <h3 className="font-['Noto_Serif',serif] text-xl font-bold text-[#0F172A]">
                  Laboratory Staff
                </h3>
                <p className="text-xs text-[#64748B]">Manage personnel & profile pictures</p>
              </div>

              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-[#EFF6FF] text-[#1E40AF] border border-[#DBEAFE]">
                {filteredStaff.length} active
              </span>
            </div>

            {/* Quick Add Staff Button */}
            <button
              type="button"
              onClick={onOpenAddStaff}
              className="w-full py-2.5 px-4 rounded-2xl bg-[#EFF6FF] hover:bg-[#DBEAFE] text-[#1E40AF] font-['Public_Sans',sans-serif] font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer border border-[#BFDBFE]"
            >
              <span className="material-symbols-outlined text-[18px]">person_add</span>
              <span>+ Add New Staff Member</span>
            </button>

            {/* Staff Cards List */}
            <div className="space-y-3.5 max-h-[620px] overflow-y-auto pr-1">
              {filteredStaff.length === 0 ? (
                <div className="text-center py-10 text-sm text-[#94A3B8] space-y-2">
                  <span className="material-symbols-outlined text-[36px] text-slate-300">group_off</span>
                  <p>No staff found matching query.</p>
                  <button
                    type="button"
                    onClick={onOpenAddStaff}
                    className="text-xs font-bold text-[#1E40AF] hover:underline"
                  >
                    + Add New Staff
                  </button>
                </div>
              ) : (
                filteredStaff.map((staff) => {
                  const isOnDuty = staff.dutyStatus === 'ON DUTY';
                  const isDeleting = staffIdToDelete === staff.id;

                  return (
                    <div
                      key={staff.id}
                      id={`staff-card-${staff.id}`}
                      className="p-4 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] hover:border-[#1E40AF] transition-all duration-150 space-y-3 relative group"
                    >
                      {/* Top Header of Card: Avatar, Name, Delete and Status */}
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-3">
                          {/* Avatar with quick photo action overlay */}
                          <div className="relative group/avatar shrink-0">
                            {staff.avatarUrl ? (
                              <img
                                src={staff.avatarUrl}
                                alt={staff.name}
                                className="w-12 h-12 rounded-full object-cover ring-2 ring-[#E2E8F0] group-hover/avatar:ring-[#1E40AF] transition-all"
                              />
                            ) : (
                              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#1E40AF] to-[#0284C7] text-white flex flex-col items-center justify-center font-bold text-xs ring-2 ring-slate-200">
                                <span>{getInitials(staff.fullName || staff.name)}</span>
                              </div>
                            )}

                            {/* Hover overlay to Change / Delete Picture */}
                            <div className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover/avatar:opacity-100 flex items-center justify-center gap-1 transition-opacity cursor-pointer">
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleTriggerPhotoUpload(staff.id);
                                }}
                                className="w-6 h-6 rounded-full bg-white text-slate-800 flex items-center justify-center hover:bg-blue-50 hover:text-blue-700 shadow-sm"
                                title="Upload / Change Picture"
                              >
                                <span className="material-symbols-outlined text-[13px]">upload</span>
                              </button>
                              {staff.avatarUrl && onUpdateStaffAvatar && (
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onUpdateStaffAvatar(staff.id, undefined);
                                  }}
                                  className="w-6 h-6 rounded-full bg-red-600 text-white flex items-center justify-center hover:bg-red-700 shadow-sm"
                                  title="Delete Picture"
                                >
                                  <span className="material-symbols-outlined text-[13px]">delete</span>
                                </button>
                              )}
                            </div>
                          </div>

                          <div>
                            <h4 className="font-bold text-sm text-[#0F172A] leading-tight">
                              {staff.fullName}
                            </h4>
                            <p className="font-['Public_Sans',sans-serif] text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider mt-0.5">
                              {staff.role}
                            </p>
                          </div>
                        </div>

                        {/* Status badge & Quick Delete Staff Button */}
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full tracking-wider ${
                              isOnDuty
                                ? 'bg-[#ECFDF5] text-[#059669]'
                                : 'bg-[#F1F5F9] text-[#64748B]'
                            }`}
                          >
                            {staff.dutyStatus}
                          </span>

                          <button
                            type="button"
                            onClick={() => setStaffIdToDelete(staff.id)}
                            className="p-1 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                            title="Delete staff from roster"
                            aria-label={`Delete ${staff.fullName}`}
                          >
                            <span className="material-symbols-outlined text-[18px]">delete</span>
                          </button>
                        </div>
                      </div>

                      {/* Inline Delete Confirmation */}
                      {isDeleting && (
                        <div className="p-3 bg-red-50 border border-red-200 rounded-xl space-y-2 animate-in fade-in duration-150">
                          <p className="text-xs font-bold text-red-800">
                            Delete {staff.fullName} from roster?
                          </p>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                onDeleteStaff(staff.id);
                                setStaffIdToDelete(null);
                              }}
                              className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded-full text-xs font-bold transition-colors cursor-pointer shadow-2xs"
                            >
                              Confirm Delete
                            </button>
                            <button
                              type="button"
                              onClick={() => setStaffIdToDelete(null)}
                              className="px-3 py-1 bg-white border border-slate-200 text-slate-700 rounded-full text-xs font-bold hover:bg-slate-50 cursor-pointer"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Photo management pills */}
                      <div className="flex items-center gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => handleTriggerPhotoUpload(staff.id)}
                          className="text-[11px] font-bold text-[#1E40AF] hover:text-[#1D4ED8] hover:underline flex items-center gap-1 cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-[14px]">add_a_photo</span>
                          <span>{staff.avatarUrl ? 'Change Pic' : 'Add Pic'}</span>
                        </button>

                        {staff.avatarUrl && onUpdateStaffAvatar && (
                          <>
                            <span className="text-slate-300">•</span>
                            <button
                              type="button"
                              onClick={() => onUpdateStaffAvatar(staff.id, undefined)}
                              className="text-[11px] font-bold text-red-600 hover:text-red-700 hover:underline flex items-center gap-1 cursor-pointer"
                            >
                              <span className="material-symbols-outlined text-[14px]">delete</span>
                              <span>Delete Pic</span>
                            </button>
                          </>
                        )}
                      </div>

                      <div className="text-xs text-[#64748B] space-y-1 pt-1 border-t border-[#E2E8F0]/70">
                        <div className="flex items-center justify-between">
                          <span>Department:</span>
                          <span className="font-medium text-[#0F172A]">{staff.department}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Shifts This Month:</span>
                          <span className="font-bold text-[#0F172A]">
                            {shifts.filter((s) => s.staffId === staff.id).length || staff.shiftsThisMonth || 0}
                          </span>
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="pt-2 flex items-center justify-between gap-2 border-t border-[#E2E8F0]/70">
                        <button
                          onClick={() => onEditStaff(staff)}
                          className="text-xs text-[#1E40AF] hover:text-[#1D4ED8] font-semibold underline cursor-pointer"
                        >
                          Edit Profile
                        </button>

                        <button
                          onClick={() => onAssignStaffToDate(staff, selectedDate)}
                          className="px-4 py-1.5 rounded-full bg-[#1E40AF] hover:bg-[#1D4ED8] text-white font-['Public_Sans',sans-serif] font-bold text-xs uppercase tracking-wider transition-all active:scale-95 cursor-pointer flex items-center gap-1.5 shadow-2xs"
                        >
                          <span className="material-symbols-outlined text-[15px]">add</span>
                          Assign to {selectedDate.slice(5)}
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
