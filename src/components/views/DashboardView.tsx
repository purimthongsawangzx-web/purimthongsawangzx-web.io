import React from 'react';
import {
  LabAnalysisSample,
  StockItem,
  EQATrial,
  StaffMember,
  NavigationTab,
  DailyNote,
  EQASchemeDefinition
} from '../../types';
import { getSchemeInfo } from '../../data/standardSchemes';

interface DashboardViewProps {
  samples: LabAnalysisSample[];
  stockItems: StockItem[];
  trials: EQATrial[];
  staffList: StaffMember[];
  onSelectTab: (tab: NavigationTab) => void;
  onOpenNewAnalysis: () => void;
  onOpenUploadResult: (trial: EQATrial) => void;
  dailyNotes?: DailyNote[];
  onOpenDailyNotes?: () => void;
  onToggleDailyNote?: (id: string) => void;
  customSchemes?: EQASchemeDefinition[];
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  samples,
  stockItems,
  trials,
  staffList,
  onSelectTab,
  onOpenNewAnalysis,
  onOpenUploadResult,
  dailyNotes = [],
  onOpenDailyNotes,
  onToggleDailyNote,
  customSchemes = []
}) => {
  const criticalStock = stockItems.filter(
    (item) => item.quantity <= item.minQuantity * 0.3
  );

  const urgentTrials = trials.filter(
    (t) => t.status === 'due_tomorrow' || t.status === 'overdue'
  );

  const onDutyStaff = staffList.filter((s) => s.dutyStatus === 'ON DUTY');

  return (
    <div className="p-4 sm:p-6 md:p-8 lg:p-10 max-w-7xl mx-auto space-y-10 animate-in fade-in duration-200">
      {/* Welcome Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#E2E8F0]">
        <div>
          <span className="text-[#0284C7] font-['Noto_Serif',serif] italic text-sm block mb-1">
            Clinical Diagnostic Center
          </span>
          <h1 className="font-['Noto_Serif',serif] text-3xl sm:text-4xl font-bold text-[#0F172A] tracking-tight">
            Laboratory Operations
          </h1>
          <p className="text-sm text-[#475569] mt-1">
            Real-time STAT turnaround time monitoring, analyzer throughput, and urgent proficiency testing.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            id="btn-quick-new-sample"
            onClick={onOpenNewAnalysis}
            className="px-6 py-2.5 rounded-full bg-[#1E40AF] hover:bg-[#1D4ED8] text-white font-['Public_Sans',sans-serif] font-bold text-xs uppercase tracking-widest flex items-center gap-2 shadow-xs transition-all active:scale-95 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">add_circle</span>
            Dispatch STAT Test
          </button>
        </div>
      </div>

      {/* KPI Overview Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* STAT Workload */}
        <div className="bg-white p-6 rounded-3xl border border-[#E2E8F0] shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <span className="font-['Public_Sans',sans-serif] text-xs uppercase tracking-wider text-[#64748B] font-semibold">
              Live STAT Queue
            </span>
            <span className="material-symbols-outlined text-[#DC2626] text-[24px]">emergency</span>
          </div>
          <div className="flex items-baseline justify-between">
            <p className="font-['Noto_Serif',serif] text-4xl font-bold text-[#0F172A]">
              {samples.length}
            </p>
            <span className="text-xs font-semibold text-[#1E40AF] bg-[#EFF6FF] px-2.5 py-0.5 rounded-full">
              Avg TAT: 24m
            </span>
          </div>
        </div>

        {/* On Duty Staff */}
        <div className="bg-white p-6 rounded-3xl border border-[#E2E8F0] shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <span className="font-['Public_Sans',sans-serif] text-xs uppercase tracking-wider text-[#64748B] font-semibold">
              Personnel On Duty
            </span>
            <span className="material-symbols-outlined text-[#0284C7] text-[24px]">badge</span>
          </div>
          <div className="flex items-baseline justify-between">
            <p className="font-['Noto_Serif',serif] text-4xl font-bold text-[#0F172A]">
              {onDutyStaff.length}
            </p>
            <span className="text-xs font-semibold text-[#64748B]">
              of {staffList.length} staff
            </span>
          </div>
        </div>

        {/* Critical Reagents */}
        <div
          onClick={() => onSelectTab('stock')}
          className="bg-white p-6 rounded-3xl border border-[#E2E8F0] shadow-xs flex flex-col justify-between hover:shadow-md transition-all cursor-pointer hover:border-[#DC2626]/50"
        >
          <div className="flex items-center justify-between mb-4">
            <span className="font-['Public_Sans',sans-serif] text-xs uppercase tracking-wider text-[#64748B] font-semibold">
              Critical Reagents
            </span>
            <span className="material-symbols-outlined text-[#DC2626] text-[24px]">warning</span>
          </div>
          <div className="flex items-baseline justify-between">
            <p className="font-['Noto_Serif',serif] text-4xl font-bold text-[#DC2626]">
              {criticalStock.length}
            </p>
            <span className="text-xs font-bold text-[#DC2626] underline">
              View Inventory →
            </span>
          </div>
        </div>

        {/* Urgent QA Trials */}
        <div
          onClick={() => onSelectTab('eqa')}
          className="bg-white p-6 rounded-3xl border border-[#E2E8F0] shadow-xs flex flex-col justify-between hover:shadow-md transition-all cursor-pointer hover:border-[#0284C7]/50"
        >
          <div className="flex items-center justify-between mb-4">
            <span className="font-['Public_Sans',sans-serif] text-xs uppercase tracking-wider text-[#64748B] font-semibold">
              Urgent EQA
            </span>
            <span className="material-symbols-outlined text-[#0284C7] text-[24px]">science</span>
          </div>
          <div className="flex items-baseline justify-between">
            <p className="font-['Noto_Serif',serif] text-4xl font-bold text-[#0284C7]">
              {urgentTrials.length}
            </p>
            <span className="text-xs font-bold text-[#0284C7] underline">
              Due Soon →
            </span>
          </div>
        </div>
      </div>

      {/* Main Sections (2 Columns) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: STAT Sample Queue (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#E2E8F0] shadow-xs space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
              <div>
                <h3 className="font-['Noto_Serif',serif] text-xl font-bold text-[#0F172A]">
                  Active Sample Queue (STAT & Urgent)
                </h3>
                <p className="text-xs text-[#64748B]">Live clinical specimen pipeline</p>
              </div>

              <button
                onClick={onOpenNewAnalysis}
                className="text-xs font-bold text-[#1E40AF] hover:underline"
              >
                + Register Specimen
              </button>
            </div>

            {/* Specimen Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="font-['Public_Sans',sans-serif] text-[10px] text-[#94A3B8] uppercase tracking-wider border-b border-[#E2E8F0]">
                    <th className="pb-3 font-bold">Sample / HN</th>
                    <th className="pb-3 font-bold">Patient</th>
                    <th className="pb-3 font-bold">Panel</th>
                    <th className="pb-3 font-bold">Analyzer</th>
                    <th className="pb-3 font-bold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E2E8F0]/70">
                  {samples.slice(0, 5).map((s) => (
                    <tr key={s.id} className="hover:bg-[#F8FAFC] transition-colors">
                      <td className="py-3.5 pr-3">
                        <p className="font-mono font-bold text-xs text-[#0F172A]">{s.sampleId}</p>
                        <p className="text-[10px] text-[#94A3B8]">{s.patientHn}</p>
                      </td>
                      <td className="py-3.5 pr-3">
                        <p className="font-medium text-[#0F172A]">{s.patientName}</p>
                        <span className="text-[10px] font-bold text-[#DC2626]">{s.priority}</span>
                      </td>
                      <td className="py-3.5 pr-3">
                        <p className="text-xs font-medium text-[#0F172A]">{s.testPanel}</p>
                        <p className="text-[10px] text-[#64748B]">{s.specimen}</p>
                      </td>
                      <td className="py-3.5 pr-3 text-xs text-[#475569]">{s.instrument}</td>
                      <td className="py-3.5">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#EFF6FF] text-[#1E40AF]">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB] animate-pulse" />
                          {s.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column: Urgent Action Center (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Daily Reminders & Short Notes Card */}
          <div className="bg-white rounded-3xl p-6 border border-[#E2E8F0] shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#E2E8F0]">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[20px] text-[#1E40AF]">sticky_note_2</span>
                <h3 className="font-['Noto_Serif',serif] text-lg font-bold text-[#0F172A]">
                  Daily Reminders
                </h3>
              </div>
              <button
                type="button"
                onClick={onOpenDailyNotes}
                className="text-xs text-[#1E40AF] font-bold hover:underline cursor-pointer flex items-center gap-1"
              >
                <span>Manage</span>
                <span className="material-symbols-outlined text-[14px]">open_in_new</span>
              </button>
            </div>

            <div className="space-y-2">
              {dailyNotes.length === 0 ? (
                <p className="text-xs text-[#64748B] py-3 text-center">
                  No reminders set for today.
                </p>
              ) : (
                dailyNotes.slice(0, 4).map((note) => (
                  <div
                    key={note.id}
                    className={`p-2.5 rounded-xl border flex items-start gap-2.5 transition-colors cursor-pointer ${
                      note.completed
                        ? 'bg-[#F8FAFC] border-[#E2E8F0] opacity-60'
                        : 'bg-[#F8FAFC] hover:bg-[#EFF6FF] border-[#E2E8F0]'
                    }`}
                    onClick={() => onToggleDailyNote?.(note.id)}
                  >
                    <div
                      className={`mt-0.5 w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-colors ${
                        note.completed ? 'bg-[#059669] border-[#059669] text-white' : 'border-[#CBD5E1] bg-white'
                      }`}
                    >
                      {note.completed && (
                        <span className="material-symbols-outlined text-[12px]">check</span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p
                        className={`text-xs select-none line-clamp-2 ${
                          note.completed
                            ? 'line-through text-[#94A3B8]'
                            : 'text-[#0F172A] font-medium'
                        }`}
                      >
                        {note.text}
                      </p>
                      {note.time && (
                        <span className="text-[10px] text-[#64748B] font-semibold flex items-center gap-0.5 mt-0.5">
                          <span className="material-symbols-outlined text-[10px]">schedule</span>
                          {note.time}
                        </span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>

            <button
              type="button"
              onClick={onOpenDailyNotes}
              className="w-full py-2 bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#1E40AF] text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[15px]">add</span>
              <span>+ Add Short Note / Reminder</span>
            </button>
          </div>

          {/* Urgent EQA Trials Card */}
          <div className="bg-[#F8FAFC] rounded-3xl p-6 border border-[#E2E8F0] shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#E2E8F0]">
              <h3 className="font-['Noto_Serif',serif] text-lg font-bold text-[#0F172A]">
                Urgent Quality Runs
              </h3>
              <span className="text-xs font-bold text-[#0284C7]">{urgentTrials.length} pending</span>
            </div>

            {urgentTrials.length === 0 ? (
              <p className="text-xs text-[#64748B] py-4 text-center">
                All EQA proficiency trials are on schedule.
              </p>
            ) : (
              <div className="space-y-3">
                {urgentTrials.map((t) => {
                  const schemeInfo = getSchemeInfo(t.scheme, customSchemes);
                  return (
                    <div
                      key={t.id}
                      className="p-3.5 rounded-2xl bg-white border border-[#E2E8F0] space-y-2"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${schemeInfo.badgeBg} ${schemeInfo.badgeText}`}>
                            {schemeInfo.shortName}
                          </span>
                          <h4 className="font-bold text-xs text-[#0F172A] mt-1.5">{t.title}</h4>
                        </div>
                        <span className="text-[10px] font-bold text-[#DC2626]">Due Tomorrow</span>
                      </div>

                      <div className="flex items-center justify-between pt-1">
                        <span className="text-[11px] text-[#64748B]">{t.instrument}</span>
                        <button
                          onClick={() => onOpenUploadResult(t)}
                          className="text-xs font-bold text-[#1E40AF] hover:underline"
                        >
                          Upload →
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Quick Critical Stock Box */}
          <div className="bg-white rounded-3xl p-6 border border-[#E2E8F0] shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#E2E8F0]">
              <h3 className="font-['Noto_Serif',serif] text-lg font-bold text-[#0F172A]">
                Reagent Stock Watch
              </h3>
              <button
                onClick={() => onSelectTab('stock')}
                className="text-xs text-[#1E40AF] font-bold hover:underline"
              >
                All Stock
              </button>
            </div>

            <div className="space-y-2.5">
              {criticalStock.map((item) => (
                <div
                  key={item.id}
                  className="p-3 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-between"
                >
                  <div>
                    <p className="font-bold text-xs text-[#0F172A]">{item.name}</p>
                    <p className="text-[10px] text-[#94A3B8]">{item.code} • Min {item.minQuantity}</p>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-sm text-[#DC2626]">
                      {item.quantity} {item.unit}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
