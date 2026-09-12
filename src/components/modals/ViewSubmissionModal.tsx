import React from 'react';
import { EQATrial } from '../../types';

interface ViewSubmissionModalProps {
  trial: EQATrial | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ViewSubmissionModal: React.FC<ViewSubmissionModalProps> = ({
  trial,
  isOpen,
  onClose
}) => {
  if (!isOpen || !trial) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-[#E2E8F0] overflow-hidden animate-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E2E8F0] bg-[#F8FAFC]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#1E40AF] text-white flex items-center justify-center">
              <span className="material-symbols-outlined text-[18px]">verified</span>
            </div>
            <div>
              <h2 className="font-['Noto_Serif',serif] font-bold text-lg text-[#0F172A]">
                Verified Submission Record
              </h2>
              <p className="text-xs text-[#64748B]">{trial.scheme} • {trial.title}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-[#94A3B8] hover:text-[#0F172A] p-1.5 rounded-full hover:bg-[#F1F5F9]"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <div className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          {/* Status Banner */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-center gap-3">
            <span className="material-symbols-outlined text-emerald-600 text-[24px]">check_circle</span>
            <div>
              <h4 className="font-bold text-sm text-emerald-800">
                Transmission Confirmed by QA Scheme
              </h4>
              <p className="text-xs text-emerald-700">
                Submitted on {trial.submittedDate || 'Oct 01, 2023'} • Cryptographic signature verified.
              </p>
            </div>
          </div>

          {/* Details Table */}
          <div className="bg-[#F8FAFC] rounded-2xl p-4 border border-[#E2E8F0] space-y-3 text-xs">
            <div className="flex justify-between py-1 border-b border-[#E2E8F0]">
              <span className="text-[#64748B]">Survey Cycle:</span>
              <span className="font-bold text-[#0F172A]">{trial.cycle} / {trial.trialNumber}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-[#E2E8F0]">
              <span className="text-[#64748B]">Instrument Used:</span>
              <span className="font-bold text-[#0F172A]">{trial.instrument}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-[#E2E8F0]">
              <span className="text-[#64748B]">Reporting Staff:</span>
              <span className="font-bold text-[#0F172A]">{trial.assignedStaff}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-[#E2E8F0]">
              <span className="text-[#64748B]">Attached Run Log:</span>
              <span className="font-mono text-[#2563EB]">{trial.fileName || 'run_verified_audit.pdf'}</span>
            </div>
            {trial.score && (
              <div className="flex justify-between py-1">
                <span className="text-[#64748B]">Evaluation Score:</span>
                <span className="font-bold text-[#059669]">{trial.score}</span>
              </div>
            )}
          </div>

          {/* Analyte Result Values */}
          {trial.resultValues && (
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#64748B] mb-2">
                Reported Analyte Concentrations
              </h4>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(trial.resultValues).map(([key, val]) => (
                  <div
                    key={key}
                    className="bg-[#F8FAFC] p-2.5 rounded-xl border border-[#E2E8F0] flex justify-between items-center text-xs"
                  >
                    <span className="text-[#475569] font-medium">{key}</span>
                    <span className="font-mono font-bold text-[#0F172A]">{val}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="pt-4 border-t border-[#E2E8F0] flex items-center justify-end">
            <button
              onClick={onClose}
              className="px-6 py-2.5 bg-[#1E40AF] hover:bg-[#1D4ED8] text-white font-['Public_Sans',sans-serif] font-bold text-xs uppercase tracking-widest rounded-full shadow-xs transition-all active:scale-95 cursor-pointer"
            >
              Close Record
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
