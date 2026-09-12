import React, { useState } from 'react';
import { DailyNote } from '../../types';

interface DailyNotesModalProps {
  isOpen: boolean;
  notes: DailyNote[];
  onClose: () => void;
  onAddNote: (note: Partial<DailyNote>) => void;
  onToggleNote: (id: string) => void;
  onDeleteNote: (id: string) => void;
  onClearCompleted: () => void;
}

export const DailyNotesModal: React.FC<DailyNotesModalProps> = ({
  isOpen,
  notes,
  onClose,
  onAddNote,
  onToggleNote,
  onDeleteNote,
  onClearCompleted
}) => {
  const [newText, setNewText] = useState('');
  const [newCategory, setNewCategory] = useState<DailyNote['category']>('urgent');
  const [newTime, setNewTime] = useState('');
  const [filter, setFilter] = useState<'active' | 'all' | 'completed'>('all');

  if (!isOpen) return null;

  const pendingCount = notes.filter((n) => !n.completed).length;
  const completedCount = notes.filter((n) => n.completed).length;

  const filteredNotes = notes.filter((n) => {
    if (filter === 'active') return !n.completed;
    if (filter === 'completed') return n.completed;
    return true;
  });

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newText.trim()) return;

    onAddNote({
      text: newText.trim(),
      category: newCategory,
      time: newTime.trim() || undefined,
      date: 'Today',
      completed: false
    });

    setNewText('');
    setNewTime('');
  };

  const handleQuickTemplate = (text: string, cat: DailyNote['category'], time?: string) => {
    onAddNote({
      text,
      category: cat,
      time: time || undefined,
      date: 'Today',
      completed: false
    });
  };

  const getCategoryBadge = (category: DailyNote['category']) => {
    switch (category) {
      case 'urgent':
        return {
          label: 'Urgent',
          color: 'bg-red-50 text-red-700 border-red-200 ring-red-100',
          dot: 'bg-red-500'
        };
      case 'maintenance':
        return {
          label: 'QC / Maint.',
          color: 'bg-amber-50 text-amber-700 border-amber-200 ring-amber-100',
          dot: 'bg-amber-500'
        };
      case 'handover':
        return {
          label: 'Handover',
          color: 'bg-blue-50 text-blue-700 border-blue-200 ring-blue-100',
          dot: 'bg-blue-500'
        };
      case 'routine':
      default:
        return {
          label: 'Routine',
          color: 'bg-emerald-50 text-emerald-700 border-emerald-200 ring-emerald-100',
          dot: 'bg-emerald-500'
        };
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl border border-[#E2E8F0] overflow-hidden animate-in zoom-in-95 duration-150 flex flex-col max-h-[85vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E2E8F0] bg-[#F8FAFC]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#1E40AF] text-white flex items-center justify-center shadow-xs">
              <span className="material-symbols-outlined text-[20px]">sticky_note_2</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-['Noto_Serif',serif] font-bold text-lg text-[#0F172A]">
                  Daily Reminders & Short Notes
                </h2>
                {pendingCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-[#EFF6FF] text-[#1E40AF] border border-[#BFDBFE]">
                    {pendingCount} active
                  </span>
                )}
              </div>
              <p className="text-xs text-[#64748B]">Jot down tasks, shift handovers & QC reminders for today</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-[#94A3B8] hover:text-[#0F172A] p-1.5 rounded-full hover:bg-[#F1F5F9] cursor-pointer transition-colors"
            aria-label="Close modal"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          {/* Quick Create Note Input Box */}
          <form onSubmit={handleAddSubmit} className="p-4 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-3 shadow-2xs">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-[#1E40AF] flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px]">edit_note</span>
                <span>Add New Reminder (เพิ่มบันทึกเตือน)</span>
              </label>
              <div className="flex items-center gap-1">
                <span className="text-[11px] text-[#64748B]">Due:</span>
                <input
                  type="time"
                  value={newTime}
                  onChange={(e) => setNewTime(e.target.value)}
                  className="px-2 py-0.5 text-xs bg-white border border-[#CBD5E1] rounded-lg text-[#0F172A] outline-none focus:border-[#1E40AF]"
                  title="Optional time reminder"
                />
              </div>
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                required
                value={newText}
                onChange={(e) => setNewText(e.target.value)}
                placeholder="e.g. Cobas 8000 lamp check at 14:00, Call Dr. Somchai for STAT CBC..."
                className="flex-1 px-3.5 py-2 text-sm bg-white border border-[#CBD5E1] focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 rounded-xl outline-none text-[#0F172A] placeholder:text-[#94A3B8]"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-[#1E40AF] hover:bg-[#1D4ED8] text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-2xs transition-all active:scale-95 cursor-pointer shrink-0 flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-[16px]">add</span>
                <span>Add</span>
              </button>
            </div>

            {/* Category Selector Buttons */}
            <div className="flex items-center gap-2 pt-1 flex-wrap">
              <span className="text-[11px] font-semibold text-[#64748B]">Tag:</span>
              {(
                [
                  { id: 'urgent', label: 'Urgent (ด่วน)', color: 'border-red-300 text-red-700 hover:bg-red-50', active: 'bg-red-600 text-white border-red-600' },
                  { id: 'maintenance', label: 'QC / Maint', color: 'border-amber-300 text-amber-700 hover:bg-amber-50', active: 'bg-amber-600 text-white border-amber-600' },
                  { id: 'handover', label: 'Handover (ส่งเวร)', color: 'border-blue-300 text-blue-700 hover:bg-blue-50', active: 'bg-blue-600 text-white border-blue-600' },
                  { id: 'routine', label: 'Routine (ทั่วไป)', color: 'border-emerald-300 text-emerald-700 hover:bg-emerald-50', active: 'bg-emerald-600 text-white border-emerald-600' }
                ] as const
              ).map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setNewCategory(cat.id)}
                  className={`px-2.5 py-1 rounded-full text-[11px] font-bold border transition-all cursor-pointer ${
                    newCategory === cat.id ? cat.active : `bg-white ${cat.color}`
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Quick Templates shortcuts */}
            <div className="pt-2 border-t border-[#E2E8F0] flex items-center gap-1.5 flex-wrap">
              <span className="text-[10px] text-[#94A3B8] font-bold uppercase">Quick:</span>
              <button
                type="button"
                onClick={() => handleQuickTemplate('Daily QC Run & Calibration Check', 'maintenance', '09:00')}
                className="text-[11px] px-2 py-0.5 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg text-slate-700 transition-colors cursor-pointer"
              >
                + QC Check
              </button>
              <button
                type="button"
                onClick={() => handleQuickTemplate('Shift Handover: Pending STAT Samples', 'handover', '16:00')}
                className="text-[11px] px-2 py-0.5 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg text-slate-700 transition-colors cursor-pointer"
              >
                + Shift Handover
              </button>
              <button
                type="button"
                onClick={() => handleQuickTemplate('Record Reagent Refrigerator Temps (2-8°C)', 'routine', '08:00')}
                className="text-[11px] px-2 py-0.5 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg text-slate-700 transition-colors cursor-pointer"
              >
                + Fridge Temp
              </button>
              <button
                type="button"
                onClick={() => handleQuickTemplate('Follow up with Ward on Lipemic Sample', 'urgent', '12:00')}
                className="text-[11px] px-2 py-0.5 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg text-slate-700 transition-colors cursor-pointer"
              >
                + Ward Call
              </button>
            </div>
          </form>

          {/* Filter Tabs & Header */}
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-1 bg-[#F1F5F9] p-1 rounded-xl border border-[#E2E8F0]">
              <button
                type="button"
                onClick={() => setFilter('all')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  filter === 'all' ? 'bg-white text-[#0F172A] shadow-2xs' : 'text-[#64748B] hover:text-[#0F172A]'
                }`}
              >
                All ({notes.length})
              </button>
              <button
                type="button"
                onClick={() => setFilter('active')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  filter === 'active' ? 'bg-white text-[#0F172A] shadow-2xs' : 'text-[#64748B] hover:text-[#0F172A]'
                }`}
              >
                Active ({pendingCount})
              </button>
              <button
                type="button"
                onClick={() => setFilter('completed')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  filter === 'completed' ? 'bg-white text-[#0F172A] shadow-2xs' : 'text-[#64748B] hover:text-[#0F172A]'
                }`}
              >
                Done ({completedCount})
              </button>
            </div>

            {completedCount > 0 && (
              <button
                type="button"
                onClick={onClearCompleted}
                className="text-xs text-red-600 hover:text-red-700 hover:underline font-bold cursor-pointer"
              >
                Clear completed ({completedCount})
              </button>
            )}
          </div>

          {/* Notes List */}
          <div className="space-y-2.5">
            {filteredNotes.length === 0 ? (
              <div className="py-10 text-center text-[#94A3B8] space-y-1 bg-[#F8FAFC] rounded-2xl border border-dashed border-[#CBD5E1]">
                <span className="material-symbols-outlined text-[32px] text-slate-300">note_stack</span>
                <p className="text-sm font-semibold text-[#64748B]">No reminders in this view</p>
                <p className="text-xs text-[#94A3B8]">Jot down short notes above to keep your shift on track.</p>
              </div>
            ) : (
              filteredNotes.map((note) => {
                const badge = getCategoryBadge(note.category);
                return (
                  <div
                    key={note.id}
                    className={`p-3.5 rounded-2xl border transition-all flex items-start gap-3 group ${
                      note.completed
                        ? 'bg-[#F8FAFC] border-[#E2E8F0] opacity-60'
                        : 'bg-white border-[#E2E8F0] hover:border-[#1E40AF]/40 hover:shadow-2xs'
                    }`}
                  >
                    {/* Checkbox */}
                    <button
                      type="button"
                      onClick={() => onToggleNote(note.id)}
                      className={`mt-0.5 w-5 h-5 rounded-lg border flex items-center justify-center transition-all cursor-pointer shrink-0 ${
                        note.completed
                          ? 'bg-[#059669] border-[#059669] text-white shadow-2xs'
                          : 'border-[#CBD5E1] hover:border-[#1E40AF] bg-white'
                      }`}
                      title={note.completed ? 'Mark as incomplete' : 'Mark as completed'}
                    >
                      {note.completed && (
                        <span className="material-symbols-outlined text-[14px]">check</span>
                      )}
                    </button>

                    {/* Note Content */}
                    <div className="flex-1 min-w-0" onClick={() => onToggleNote(note.id)}>
                      <p
                        className={`text-sm cursor-pointer select-none leading-snug ${
                          note.completed
                            ? 'line-through text-[#94A3B8] font-normal'
                            : 'text-[#0F172A] font-semibold'
                        }`}
                      >
                        {note.text}
                      </p>

                      <div className="flex items-center gap-2 mt-2 flex-wrap">
                        {/* Category Tag */}
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${badge.color}`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${badge.dot}`} />
                          <span>{badge.label}</span>
                        </span>

                        {/* Due Time */}
                        {note.time && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#64748B] bg-[#F1F5F9] px-2 py-0.5 rounded-full">
                            <span className="material-symbols-outlined text-[12px]">schedule</span>
                            <span>{note.time}</span>
                          </span>
                        )}

                        <span className="text-[10px] text-[#94A3B8] ml-auto">
                          {note.date || 'Today'}
                        </span>
                      </div>
                    </div>

                    {/* Delete Note Button */}
                    <button
                      type="button"
                      onClick={() => onDeleteNote(note.id)}
                      className="p-1 text-slate-300 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer shrink-0 opacity-80 group-hover:opacity-100"
                      title="Delete note"
                      aria-label="Delete note"
                    >
                      <span className="material-symbols-outlined text-[16px]">delete</span>
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-[#E2E8F0] bg-[#F8FAFC] flex items-center justify-between">
          <p className="text-xs text-[#64748B]">
            {pendingCount} of {notes.length} reminders remaining today
          </p>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-[#1E40AF] hover:bg-[#1D4ED8] text-white font-['Public_Sans',sans-serif] font-bold text-xs uppercase tracking-wider rounded-full shadow-xs transition-all active:scale-95 cursor-pointer"
          >
            Close Notes
          </button>
        </div>
      </div>
    </div>
  );
};
