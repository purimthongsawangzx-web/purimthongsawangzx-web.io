import React, { useState, useMemo, useRef, useEffect } from 'react';
import { EQATrial, EQAStatus } from '../../types';

interface EQAViewProps {
  trials: EQATrial[];
  searchQuery: string;
  onOpenAddTrial: () => void;
  onOpenUploadResult: (trial: EQATrial) => void;
  onViewSubmission: (trial: EQATrial) => void;
  onDeleteTrial: (id: string) => void;
}

export const EQAView: React.FC<EQAViewProps> = ({
  trials,
  searchQuery,
  onOpenAddTrial,
  onOpenUploadResult,
  onViewSubmission,
  onDeleteTrial
}) => {
  const [selectedSchemeFilter, setSelectedSchemeFilter] = useState<string>('ALL');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('ALL');
  const [showFilterMenu, setShowFilterMenu] = useState<boolean>(false);
  const filterMenuRef = useRef<HTMLDivElement>(null);

  const activeCount = trials.filter((t) => t.status !== 'submitted').length;
  const pendingCount = trials.filter((t) => t.status === 'pending').length;
  const overdueCount = trials.filter((t) => t.status === 'overdue' || t.status === 'due_tomorrow').length;
  const complianceRate = 98;

  // Close filter menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filterMenuRef.current && !filterMenuRef.current.contains(event.target as Node)) {
        setShowFilterMenu(false);
      }
    };
    if (showFilterMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showFilterMenu]);

  const filteredTrials = useMemo(() => {
    return trials.filter((trial) => {
      const matchesSearch =
        trial.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        trial.scheme.toLowerCase().includes(searchQuery.toLowerCase()) ||
        trial.cycle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        trial.instrument.toLowerCase().includes(searchQuery.toLowerCase()) ||
        trial.assignedStaff.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesScheme =
        selectedSchemeFilter === 'ALL' || trial.scheme === selectedSchemeFilter;

      const matchesStatus =
        selectedStatusFilter === 'ALL' ||
        (selectedStatusFilter === 'PENDING' && trial.status === 'pending') ||
        (selectedStatusFilter === 'SUBMITTED' && trial.status === 'submitted') ||
        (selectedStatusFilter === 'URGENT' && (trial.status === 'due_tomorrow' || trial.status === 'overdue'));

      return matchesSearch && matchesScheme && matchesStatus;
    });
  }, [trials, searchQuery, selectedSchemeFilter, selectedStatusFilter]);

  const getSchemeBadgeColor = (scheme: string) => {
    switch (scheme) {
      case 'RIQAS':
        return 'bg-[#1E40AF] text-white';
      case 'CAP':
        return 'bg-[#0284C7] text-white';
      case 'UKNEQAS':
        return 'bg-[#3B82F6] text-white';
      case 'EQAS':
        return 'bg-[#0F172A] text-white';
      default:
        return 'bg-[#64748B] text-white';
    }
  };

  const getStatusBadge = (status: EQAStatus, label: string) => {
    if (status === 'due_tomorrow' || status === 'overdue') {
      return (
        <span className="inline-flex items-center gap-1 px-3 py-1 bg-[#FEE2E2] text-[#DC2626] font-['Public_Sans',sans-serif] text-xs rounded-full font-bold">
          <span className="material-symbols-outlined text-[14px]">warning</span>
          {label}
        </span>
      );
    }
    if (status === 'pending') {
      return (
        <span className="inline-flex items-center gap-1 px-3 py-1 bg-[#F1F5F9] text-[#475569] font-['Public_Sans',sans-serif] text-xs rounded-full font-bold">
          <span className="material-symbols-outlined text-[14px]">schedule</span>
          {label}
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-3 py-1 bg-[#ECFDF5] text-[#059669] font-['Public_Sans',sans-serif] text-xs rounded-full font-bold">
        <span className="material-symbols-outlined text-[14px]">check_circle</span>
        {label}
      </span>
    );
  };

  const hasActiveFilters = selectedSchemeFilter !== 'ALL' || selectedStatusFilter !== 'ALL';

  return (
    <div className="p-3 sm:p-6 md:p-8 lg:p-10 max-w-7xl mx-auto space-y-8 sm:space-y-10 animate-in fade-in duration-200 overflow-x-hidden">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 sm:gap-6 pb-4 border-b border-[#E2E8F0]">
        <div>
          <span className="text-[#0284C7] font-['Noto_Serif',serif] italic text-sm block mb-1">
            Quality Assurance & Proficiency
          </span>
          <h1 className="font-['Noto_Serif',serif] text-2xl sm:text-4xl lg:text-5xl font-extrabold text-[#0F172A] tracking-tight leading-tight">
            External Quality Assessment
          </h1>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          <div className="relative" ref={filterMenuRef}>
            <button
              id="btn-eqa-filter"
              type="button"
              onClick={() => setShowFilterMenu(!showFilterMenu)}
              className={`font-['Public_Sans',sans-serif] text-xs uppercase tracking-wider font-bold py-2 sm:py-2.5 px-4 sm:px-5 rounded-full transition-all duration-200 flex items-center gap-1.5 sm:gap-2 cursor-pointer border ${
                hasActiveFilters
                  ? 'bg-[#1E40AF] text-white border-[#1E40AF] shadow-xs'
                  : 'bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#0F172A] border-[#E2E8F0]'
              }`}
            >
              <span className="material-symbols-outlined text-[16px] sm:text-[18px]">filter_list</span>
              <span>Filter</span>
              {hasActiveFilters && <span className="w-2 h-2 rounded-full bg-amber-400 inline-block"></span>}
            </button>

            {showFilterMenu && (
              <div className="fixed sm:absolute inset-x-4 top-24 sm:inset-x-auto sm:top-auto sm:right-0 sm:mt-2 w-auto sm:w-80 bg-white rounded-3xl shadow-2xl border border-[#CBD5E1] p-5 z-50 space-y-4 max-h-[85vh] overflow-y-auto">
                <div className="flex items-center justify-between pb-2 border-b border-[#E2E8F0]">
                  <span className="text-sm font-bold text-[#0F172A]">Filter Trials</span>
                  <button
                    type="button"
                    onClick={() => setShowFilterMenu(false)}
                    className="text-[#64748B] hover:text-[#0F172A] p-1"
                    aria-label="Close filter"
                  >
                    <span className="material-symbols-outlined text-[18px]">close</span>
                  </button>
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-[#94A3B8] block mb-2">
                    Scheme / Provider
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {['ALL', 'RIQAS', 'CAP', 'UKNEQAS', 'EQAS'].map((sc) => (
                      <button
                        key={sc}
                        type="button"
                        onClick={() => setSelectedSchemeFilter(sc)}
                        className={`text-xs px-3 py-1.5 rounded-full font-bold cursor-pointer transition-colors ${
                          selectedSchemeFilter === sc
                            ? 'bg-[#1E40AF] text-white'
                            : 'bg-[#F1F5F9] text-[#475569] hover:bg-[#E2E8F0]'
                        }`}
                      >
                        {sc}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-[#94A3B8] block mb-2">
                    Status
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      { id: 'ALL', label: 'All Status' },
                      { id: 'URGENT', label: 'Urgent / Due Soon' },
                      { id: 'PENDING', label: 'Pending' },
                      { id: 'SUBMITTED', label: 'Submitted' }
                    ].map((st) => (
                      <button
                        key={st.id}
                        type="button"
                        onClick={() => setSelectedStatusFilter(st.id)}
                        className={`text-xs px-3 py-1.5 rounded-full font-bold cursor-pointer transition-colors ${
                          selectedStatusFilter === st.id
                            ? 'bg-[#1E40AF] text-white'
                            : 'bg-[#F1F5F9] text-[#475569] hover:bg-[#E2E8F0]'
                        }`}
                      >
                        {st.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-[#E2E8F0] flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedSchemeFilter('ALL');
                      setSelectedStatusFilter('ALL');
                    }}
                    className="text-xs text-[#64748B] hover:text-[#0F172A] font-bold"
                  >
                    Reset Filters
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowFilterMenu(false)}
                    className="text-xs bg-[#1E40AF] text-white px-4 py-1.5 rounded-full font-bold"
                  >
                    Done
                  </button>
                </div>
              </div>
            )}
          </div>

          <button
            id="btn-eqa-add-trial-top"
            type="button"
            onClick={onOpenAddTrial}
            className="bg-[#1E40AF] hover:bg-[#1D4ED8] text-white font-['Public_Sans',sans-serif] text-xs uppercase tracking-widest font-bold py-2 sm:py-2.5 px-4 sm:px-6 rounded-full transition-all duration-200 flex items-center gap-1.5 sm:gap-2 shadow-xs active:scale-95 cursor-pointer whitespace-nowrap"
          >
            <span className="material-symbols-outlined text-[16px] sm:text-[18px]">add_circle</span>
            <span>Add Trial</span>
          </button>
        </div>
      </div>

      {/* Quick Filter Strip for Mobile & Desktop */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 overflow-x-auto pb-1.5 scrollbar-none no-scrollbar">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#64748B] shrink-0 mr-1">
            Scheme:
          </span>
          {['ALL', 'RIQAS', 'CAP', 'UKNEQAS', 'EQAS'].map((sc) => {
            const isSelected = selectedSchemeFilter === sc;
            return (
              <button
                key={sc}
                type="button"
                onClick={() => setSelectedSchemeFilter(sc)}
                className={`text-xs px-3.5 py-1.5 rounded-full font-bold whitespace-nowrap transition-colors cursor-pointer shrink-0 ${
                  isSelected
                    ? 'bg-[#0F172A] text-white shadow-xs'
                    : 'bg-[#F1F5F9] text-[#475569] hover:bg-[#E2E8F0]'
                }`}
              >
                {sc}
              </button>
            );
          })}

          <span className="text-[11px] font-bold uppercase tracking-wider text-[#64748B] shrink-0 ml-3 mr-1">
            Status:
          </span>
          {[
            { id: 'ALL', label: 'All' },
            { id: 'URGENT', label: 'Urgent' },
            { id: 'PENDING', label: 'Pending' },
            { id: 'SUBMITTED', label: 'Submitted' }
          ].map((st) => {
            const isSelected = selectedStatusFilter === st.id;
            return (
              <button
                key={st.id}
                type="button"
                onClick={() => setSelectedStatusFilter(st.id)}
                className={`text-xs px-3.5 py-1.5 rounded-full font-bold whitespace-nowrap transition-colors cursor-pointer shrink-0 ${
                  isSelected
                    ? 'bg-[#1E40AF] text-white shadow-xs'
                    : 'bg-[#F1F5F9] text-[#475569] hover:bg-[#E2E8F0]'
                }`}
              >
                {st.label}
              </button>
            );
          })}

          {hasActiveFilters && (
            <button
              type="button"
              onClick={() => {
                setSelectedSchemeFilter('ALL');
                setSelectedStatusFilter('ALL');
              }}
              className="text-xs px-3 py-1.5 rounded-full font-bold text-[#DC2626] bg-[#FEE2E2] hover:bg-[#FCA5A5] transition-colors cursor-pointer shrink-0 ml-2"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Summary Metrics (4 cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Active Trials */}
        <div className="bg-white p-5 sm:p-6 rounded-3xl border border-[#E2E8F0] shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-['Public_Sans',sans-serif] text-xs uppercase tracking-wider text-[#64748B] font-semibold">
              Active Trials
            </h3>
            <span className="material-symbols-outlined text-[#1E40AF] text-[24px]">science</span>
          </div>
          <p className="font-['Noto_Serif',serif] text-3xl sm:text-4xl font-bold text-[#0F172A]">
            {activeCount}
          </p>
        </div>

        {/* Pending Results */}
        <div className="bg-white p-5 sm:p-6 rounded-3xl border border-[#E2E8F0] shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-['Public_Sans',sans-serif] text-xs uppercase tracking-wider text-[#64748B] font-semibold">
              Pending Results
            </h3>
            <span className="material-symbols-outlined text-[#0284C7] text-[24px]">pending_actions</span>
          </div>
          <p className="font-['Noto_Serif',serif] text-3xl sm:text-4xl font-bold text-[#0F172A]">
            {pendingCount}
          </p>
        </div>

        {/* Overdue / Urgent */}
        <div className="bg-[#FEE2E2] p-5 sm:p-6 rounded-3xl flex flex-col justify-between shadow-xs border border-[#DC2626]/20">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-['Public_Sans',sans-serif] text-xs uppercase tracking-wider text-[#991B1B] font-bold">
              Overdue / Urgent
            </h3>
            <span className="material-symbols-outlined text-[#DC2626] text-[24px]">error</span>
          </div>
          <p className="font-['Noto_Serif',serif] text-3xl sm:text-4xl font-bold text-[#DC2626]">
            {overdueCount}
          </p>
        </div>

        {/* Yearly Compliance */}
        <div className="bg-white p-5 sm:p-6 rounded-3xl border border-[#E2E8F0] shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-['Public_Sans',sans-serif] text-xs uppercase tracking-wider text-[#64748B] font-semibold">
              Yearly Compliance
            </h3>
            <span className="material-symbols-outlined text-[#059669] text-[24px]">verified</span>
          </div>
          <div className="flex items-end gap-1.5">
            <p className="font-['Noto_Serif',serif] text-3xl sm:text-4xl font-bold text-[#0F172A]">
              {complianceRate}
            </p>
            <p className="text-sm font-semibold text-[#64748B] mb-1">%</p>
          </div>
        </div>
      </div>

      {/* Current Cycle Header */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="font-['Noto_Serif',serif] text-xl sm:text-2xl font-bold text-[#0F172A] tracking-tight">
              Current Cycle
            </h2>
            <p className="text-xs text-[#64748B] mt-0.5">
              Proficiency testing schedules, test parameters, and submission deadlines.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-[#64748B] bg-[#F8FAFC] px-3.5 py-1.5 rounded-full border border-[#E2E8F0]">
              Showing {filteredTrials.length} of {trials.length} trials
            </span>
          </div>
        </div>

        {/* Bento Grid List View */}
        {filteredTrials.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-3xl border border-[#E2E8F0] p-8">
            <span className="material-symbols-outlined text-4xl text-[#94A3B8] mb-2">biotech</span>
            <p className="font-bold text-lg text-[#0F172A]">No EQA trials matching criteria</p>
            <p className="text-sm text-[#475569] mt-1">Try clearing filters or search query.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6">
            {filteredTrials.map((trial) => {
              const isUrgent = trial.status === 'due_tomorrow' || trial.status === 'overdue';
              const isSubmitted = trial.status === 'submitted';

              return (
                <div
                  key={trial.id}
                  id={`trial-card-${trial.id}`}
                  className={`bg-white rounded-3xl p-5 sm:p-7 border border-[#E2E8F0] relative overflow-hidden flex flex-col justify-between shadow-xs hover:shadow-md transition-all duration-200 ${
                    isSubmitted ? 'opacity-85' : ''
                  }`}
                >
                  {/* Left Side Status Bar */}
                  <div
                    className={`absolute top-0 left-0 w-1.5 h-full ${
                      isUrgent
                        ? 'bg-[#DC2626]'
                        : isSubmitted
                        ? 'bg-[#E2E8F0]'
                        : 'bg-[#1E40AF]'
                    }`}
                  />

                  {/* Top Bar inside Card */}
                  <div>
                    <div className="flex flex-col sm:flex-row justify-between items-start mb-5 sm:mb-6 gap-3">
                      <div className="min-w-0">
                        <span
                          className={`inline-block px-3 py-1 font-['Public_Sans',sans-serif] text-xs rounded-full mb-2 font-bold tracking-widest uppercase ${getSchemeBadgeColor(
                            trial.scheme
                          )}`}
                        >
                          {trial.scheme}
                        </span>
                        <h3 className="font-['Noto_Serif',serif] text-lg sm:text-xl font-bold text-[#0F172A] leading-tight break-words">
                          {trial.title}
                        </h3>
                        <p className="font-['Inter',sans-serif] text-xs sm:text-sm text-[#64748B] mt-1">
                          {trial.cycle} / {trial.trialNumber}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0 self-start">
                        {getStatusBadge(trial.status, trial.statusLabel)}
                        <button
                          type="button"
                          onClick={() => onDeleteTrial(trial.id)}
                          className="text-[#94A3B8] hover:text-[#DC2626] p-1.5 rounded-full hover:bg-[#FEE2E2]/60 transition-colors cursor-pointer"
                          aria-label="Delete trial"
                        >
                          <span className="material-symbols-outlined text-[20px]">delete</span>
                        </button>
                      </div>
                    </div>

                    {/* 2x2 Details Grid */}
                    <div className="grid grid-cols-2 gap-y-3 sm:gap-y-4 gap-x-3 sm:gap-x-4 mb-5 sm:mb-6 bg-[#F8FAFC] p-3.5 sm:p-4 rounded-2xl border border-[#E2E8F0]/70">
                      <div>
                        <p className="font-['Public_Sans',sans-serif] text-[10px] text-[#94A3B8] mb-0.5 uppercase tracking-widest font-bold">
                          Received
                        </p>
                        <p className="text-xs sm:text-sm font-semibold text-[#0F172A]">{trial.receivedDate}</p>
                      </div>

                      <div>
                        <p className="font-['Public_Sans',sans-serif] text-[10px] text-[#94A3B8] mb-0.5 uppercase tracking-widest font-bold">
                          {isSubmitted ? 'Submitted On' : 'Deadline'}
                        </p>
                        <p
                          className={`text-xs sm:text-sm font-semibold ${
                            isUrgent ? 'text-[#DC2626]' : 'text-[#0F172A]'
                          }`}
                        >
                          {isSubmitted ? trial.submittedDate || 'Completed' : trial.deadlineDate}
                        </p>
                      </div>

                      <div>
                        <p className="font-['Public_Sans',sans-serif] text-[10px] text-[#94A3B8] mb-0.5 uppercase tracking-widest font-bold">
                          Instrument
                        </p>
                        <p className="text-xs sm:text-sm font-medium text-[#475569] truncate">{trial.instrument}</p>
                      </div>

                      <div>
                        <p className="font-['Public_Sans',sans-serif] text-[10px] text-[#94A3B8] mb-0.5 uppercase tracking-widest font-bold">
                          Assigned Staff
                        </p>
                        <p className="text-xs sm:text-sm font-medium text-[#475569] truncate">{trial.assignedStaff}</p>
                      </div>
                    </div>
                  </div>

                  {/* Bottom Action Footer */}
                  <div className="pt-4 border-t border-[#E2E8F0] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-[#EFF6FF] flex items-center justify-center text-[#1E40AF] shrink-0">
                        <span className="material-symbols-outlined text-[18px]">science</span>
                      </div>
                      <span className="text-xs sm:text-sm font-medium text-[#475569]">
                        {trial.labSection}
                      </span>
                    </div>

                    {isSubmitted ? (
                      <button
                        type="button"
                        onClick={() => onViewSubmission(trial)}
                        className="text-xs uppercase tracking-wider font-bold text-[#1E40AF] hover:text-[#1D4ED8] hover:underline flex items-center gap-1.5 cursor-pointer py-1 px-2 self-end sm:self-auto"
                      >
                        <span className="material-symbols-outlined text-[18px]">visibility</span>
                        View Submission
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => onOpenUploadResult(trial)}
                        className="w-full sm:w-auto bg-[#1E40AF] hover:bg-[#1D4ED8] text-white font-['Public_Sans',sans-serif] text-xs uppercase tracking-widest font-bold py-2.5 px-5 rounded-full transition-all duration-200 flex items-center justify-center gap-2 shadow-xs active:scale-95 cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[18px]">upload_file</span>
                        Upload Result
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

