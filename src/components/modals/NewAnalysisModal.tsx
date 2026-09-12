import React, { useState } from 'react';
import { LabAnalysisSample } from '../../types';

interface NewAnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (sample: Partial<LabAnalysisSample>) => void;
}

export const NewAnalysisModal: React.FC<NewAnalysisModalProps> = ({
  isOpen,
  onClose,
  onSubmit
}) => {
  const [patientName, setPatientName] = useState('');
  const [patientHn, setPatientHn] = useState('');
  const [testPanel, setTestPanel] = useState('CBC + Differential');
  const [specimen, setSpecimen] = useState<'Serum' | 'Plasma' | 'Whole Blood' | 'Urine' | 'CSF' | 'Swab'>('Whole Blood');
  const [priority, setPriority] = useState<'STAT' | 'Urgent' | 'Routine'>('STAT');
  const [instrument, setInstrument] = useState('Sysmex XN-1000');
  const [assignedTech, setAssignedTech] = useState('Dr. Jane Doe');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientName.trim() || !patientHn.trim()) return;

    onSubmit({
      sampleId: `SMP-${Date.now().toString().slice(-6)}`,
      patientName: patientName.trim(),
      patientHn: patientHn.trim().toUpperCase(),
      testPanel,
      specimen,
      priority,
      instrument,
      assignedTech,
      requestedAt: 'Just now',
      status: 'Analyzing',
      tatMinutes: priority === 'STAT' ? 30 : priority === 'Urgent' ? 60 : 120
    });

    setPatientName('');
    setPatientHn('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-[#E2E8F0] overflow-hidden animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E2E8F0] bg-[#F8FAFC]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#1E40AF] text-white flex items-center justify-center">
              <span className="material-symbols-outlined text-[18px]">biotech</span>
            </div>
            <div>
              <h2 className="font-['Noto_Serif',serif] font-bold text-lg text-[#0F172A]">
                New Analysis Request
              </h2>
              <p className="text-xs text-[#64748B]">Register specimen and dispatch to analyzer</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-[#94A3B8] hover:text-[#0F172A] p-1.5 rounded-full hover:bg-[#F1F5F9] transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          {/* Patient Details */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#64748B] mb-1">
                Patient Full Name *
              </label>
              <input
                type="text"
                required
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                placeholder="e.g. Somsak Jaidee"
                className="w-full px-4 py-2.5 text-sm bg-[#F1F5F9] border border-[#E2E8F0] focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 focus:bg-white rounded-2xl outline-none text-[#0F172A]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#64748B] mb-1">
                Hospital Number (HN) *
              </label>
              <input
                type="text"
                required
                value={patientHn}
                onChange={(e) => setPatientHn(e.target.value)}
                placeholder="e.g. HN-982140"
                className="w-full px-4 py-2.5 text-sm bg-[#F1F5F9] border border-[#E2E8F0] focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 focus:bg-white rounded-2xl outline-none uppercase font-mono text-[#0F172A]"
              />
            </div>
          </div>

          {/* Test Panel & Specimen */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#64748B] mb-1">
                Test Panel
              </label>
              <select
                value={testPanel}
                onChange={(e) => setTestPanel(e.target.value)}
                className="w-full px-4 py-2.5 text-sm bg-[#F1F5F9] border border-[#E2E8F0] focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 focus:bg-white rounded-2xl outline-none text-[#0F172A]"
              >
                <option value="CBC + Differential & Reticulocyte">CBC + Diff & Reticulocyte</option>
                <option value="Troponin I STAT & CK-MB">Troponin I STAT & CK-MB</option>
                <option value="Electrolytes + BUN + Creatinine">Electrolytes & Renal Profile</option>
                <option value="Liver Function Test (LFT)">Liver Function Test (LFT)</option>
                <option value="Lipid Profile + HbA1c">Lipid Profile + HbA1c</option>
                <option value="Blood Culture & Sensitivity">Blood Culture & AST</option>
                <option value="Coagulation PT / INR / APTT">Coagulation PT / INR / APTT</option>
                <option value="Urinalysis Automated & Microscopy">Urinalysis & Microscopy</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#64748B] mb-1">
                Specimen Type
              </label>
              <select
                value={specimen}
                onChange={(e) => setSpecimen(e.target.value as any)}
                className="w-full px-4 py-2.5 text-sm bg-[#F1F5F9] border border-[#E2E8F0] focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 focus:bg-white rounded-2xl outline-none text-[#0F172A]"
              >
                <option value="Whole Blood">Whole Blood (EDTA)</option>
                <option value="Serum">Serum (SST Tube)</option>
                <option value="Plasma">Plasma (Citrate / Heparin)</option>
                <option value="Urine">Urine Container</option>
                <option value="CSF">Cerebrospinal Fluid (CSF)</option>
                <option value="Swab">Bacterial Swab</option>
              </select>
            </div>
          </div>

          {/* Priority Selection */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#64748B] mb-1.5">
              Priority
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'STAT', label: '🚨 STAT (<30m)', activeClass: 'bg-[#FEE2E2] text-[#DC2626] border-[#DC2626]' },
                { id: 'Urgent', label: '⚡ Urgent (<1h)', activeClass: 'bg-[#EFF6FF] text-[#1E40AF] border-[#2563EB]' },
                { id: 'Routine', label: '📋 Routine (<2h)', activeClass: 'bg-[#ECFDF5] text-[#059669] border-[#059669]' }
              ].map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setPriority(p.id as any)}
                  className={`py-2 px-2 rounded-2xl text-xs font-bold border transition-all cursor-pointer text-center ${
                    priority === p.id
                      ? `${p.activeClass} ring-2 ring-[#1E40AF]`
                      : 'bg-[#F1F5F9] text-[#64748B] border-transparent hover:bg-[#E2E8F0]'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Analyzer Instrument & Tech */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#64748B] mb-1">
                Target Analyzer
              </label>
              <select
                value={instrument}
                onChange={(e) => setInstrument(e.target.value)}
                className="w-full px-4 py-2.5 text-sm bg-[#F1F5F9] border border-[#E2E8F0] focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 focus:bg-white rounded-2xl outline-none text-[#0F172A]"
              >
                <option value="Sysmex XN-1000">Sysmex XN-1000 (Hematology)</option>
                <option value="Cobas 8000">Cobas 8000 (Chemistry)</option>
                <option value="Stago STAR Max">Stago STAR Max (Coagulation)</option>
                <option value="VITEK 2">VITEK 2 (Microbiology)</option>
                <option value="Architect i2000SR">Architect i2000SR (Immunology)</option>
                <option value="IH-1000">IH-1000 (Blood Bank)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#64748B] mb-1">
                Assigned Tech
              </label>
              <input
                type="text"
                value={assignedTech}
                onChange={(e) => setAssignedTech(e.target.value)}
                className="w-full px-4 py-2.5 text-sm bg-[#F1F5F9] border border-[#E2E8F0] focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 focus:bg-white rounded-2xl outline-none text-[#0F172A]"
              />
            </div>
          </div>

          {/* Buttons */}
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
              className="px-6 py-2.5 bg-[#1E40AF] hover:bg-[#1D4ED8] text-white font-['Public_Sans',sans-serif] font-bold text-xs uppercase tracking-widest rounded-full shadow-xs transition-all active:scale-95 cursor-pointer flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-[18px]">send</span>
              Dispatch Sample
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
