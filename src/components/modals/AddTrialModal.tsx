import React, { useState } from 'react';
import { EQATrial, EQAScheme } from '../../types';

interface AddTrialModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (trial: Partial<EQATrial>) => void;
}

export const AddTrialModal: React.FC<AddTrialModalProps> = ({
  isOpen,
  onClose,
  onSubmit
}) => {
  const [scheme, setScheme] = useState<EQAScheme>('RIQAS');
  const [title, setTitle] = useState('');
  const [cycle, setCycle] = useState('Cycle 2023-C');
  const [trialNumber, setTrialNumber] = useState('Trial 01');
  const [receivedDate, setReceivedDate] = useState('Today');
  const [deadlineDate, setDeadlineDate] = useState('');
  const [instrument, setInstrument] = useState('Cobas 8000');
  const [assignedStaff, setAssignedStaff] = useState('Dr. Sarah Chen');
  const [labSection, setLabSection] = useState('Core Lab');
  const [parametersText, setParametersText] = useState('Glucose, BUN, Creatinine, Electrolytes');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const params = parametersText
      .split(',')
      .map((p) => p.trim())
      .filter(Boolean);

    onSubmit({
      scheme,
      title: title.trim(),
      cycle: cycle.trim(),
      trialNumber: trialNumber.trim(),
      receivedDate: receivedDate.trim(),
      deadlineDate: deadlineDate.trim() || 'Nov 30, 2023',
      instrument: instrument.trim(),
      assignedStaff: assignedStaff.trim(),
      labSection: labSection.trim(),
      parameters: params
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-[#E2E8F0] overflow-hidden animate-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E2E8F0] bg-[#F8FAFC]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#1E40AF] text-white flex items-center justify-center">
              <span className="material-symbols-outlined text-[18px]">science</span>
            </div>
            <div>
              <h2 className="font-['Noto_Serif',serif] font-bold text-lg text-[#0F172A]">
                Register New EQA Trial
              </h2>
              <p className="text-xs text-[#64748B]">Proficiency assessment survey</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-[#94A3B8] hover:text-[#0F172A] p-1.5 rounded-full hover:bg-[#F1F5F9]"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#64748B] mb-1">
                Proficiency Scheme *
              </label>
              <select
                value={scheme}
                onChange={(e) => setScheme(e.target.value as EQAScheme)}
                className="w-full px-4 py-2.5 text-sm bg-[#F1F5F9] border border-[#E2E8F0] focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 focus:bg-white rounded-2xl outline-none text-[#0F172A]"
              >
                <option value="RIQAS">RIQAS (Randox)</option>
                <option value="CAP">CAP Survey</option>
                <option value="UKNEQAS">UK NEQAS</option>
                <option value="EQAS">Bio-Rad EQAS</option>
                <option value="RCPA">RCPA Quality</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#64748B] mb-1">
                Lab Section
              </label>
              <select
                value={labSection}
                onChange={(e) => setLabSection(e.target.value)}
                className="w-full px-4 py-2.5 text-sm bg-[#F1F5F9] border border-[#E2E8F0] focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 focus:bg-white rounded-2xl outline-none text-[#0F172A]"
              >
                <option value="Core Lab">Core Lab (Chemistry)</option>
                <option value="Hematology Lab">Hematology Lab</option>
                <option value="Hemostasis Lab">Hemostasis Lab</option>
                <option value="Immunology">Immunology</option>
                <option value="Microbiology Lab">Microbiology Lab</option>
                <option value="Blood Bank">Blood Bank / Immunohematology</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#64748B] mb-1">
              Survey / Program Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Immunoassay Hormones & Cardiac"
              className="w-full px-4 py-2.5 text-sm bg-[#F1F5F9] border border-[#E2E8F0] focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 focus:bg-white rounded-2xl outline-none text-[#0F172A]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#64748B] mb-1">
                Cycle Identifier
              </label>
              <input
                type="text"
                value={cycle}
                onChange={(e) => setCycle(e.target.value)}
                placeholder="Cycle 2023-C"
                className="w-full px-4 py-2.5 text-sm bg-[#F1F5F9] border border-[#E2E8F0] focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 focus:bg-white rounded-2xl outline-none text-[#0F172A]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#64748B] mb-1">
                Trial / Sample #
              </label>
              <input
                type="text"
                value={trialNumber}
                onChange={(e) => setTrialNumber(e.target.value)}
                placeholder="Trial 01"
                className="w-full px-4 py-2.5 text-sm bg-[#F1F5F9] border border-[#E2E8F0] focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 focus:bg-white rounded-2xl outline-none text-[#0F172A]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#64748B] mb-1">
                Assigned Instrument
              </label>
              <input
                type="text"
                value={instrument}
                onChange={(e) => setInstrument(e.target.value)}
                placeholder="e.g. Cobas 8000"
                className="w-full px-4 py-2.5 text-sm bg-[#F1F5F9] border border-[#E2E8F0] focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 focus:bg-white rounded-2xl outline-none text-[#0F172A]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#64748B] mb-1">
                Assigned Technologist
              </label>
              <input
                type="text"
                value={assignedStaff}
                onChange={(e) => setAssignedStaff(e.target.value)}
                placeholder="e.g. Dr. Sarah Chen"
                className="w-full px-4 py-2.5 text-sm bg-[#F1F5F9] border border-[#E2E8F0] focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 focus:bg-white rounded-2xl outline-none text-[#0F172A]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#64748B] mb-1">
              Submission Deadline
            </label>
            <input
              type="text"
              value={deadlineDate}
              onChange={(e) => setDeadlineDate(e.target.value)}
              placeholder="e.g. Nov 25, 2023"
              className="w-full px-4 py-2.5 text-sm bg-[#F1F5F9] border border-[#E2E8F0] focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 focus:bg-white rounded-2xl outline-none text-[#0F172A]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#64748B] mb-1">
              Parameters / Analytes (comma separated)
            </label>
            <input
              type="text"
              value={parametersText}
              onChange={(e) => setParametersText(e.target.value)}
              placeholder="WBC, RBC, HGB, PLT"
              className="w-full px-4 py-2.5 text-sm bg-[#F1F5F9] border border-[#E2E8F0] focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 focus:bg-white rounded-2xl outline-none text-[#0F172A]"
            />
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
              Register Trial
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
