import React, { useState, useEffect } from 'react';
import { EQATrial } from '../../types';

interface UploadResultModalProps {
  trial: EQATrial | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmitResults: (
    trialId: string,
    resultValues: Record<string, string>,
    fileName?: string
  ) => void;
}

export const UploadResultModal: React.FC<UploadResultModalProps> = ({
  trial,
  isOpen,
  onClose,
  onSubmitResults
}) => {
  const [values, setValues] = useState<Record<string, string>>({});
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (trial) {
      const initial: Record<string, string> = {};
      trial.parameters?.forEach((param) => {
        initial[param] = trial.resultValues?.[param] || '';
      });
      setValues(initial);
      setUploadedFile(null);
    }
  }, [trial]);

  if (!isOpen || !trial) return null;

  const handleInputChange = (param: string, val: string) => {
    setValues((prev) => ({ ...prev, [param]: val }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadedFile(e.target.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      onSubmitResults(
        trial.id,
        values,
        uploadedFile ? uploadedFile.name : 'verified_instrument_run.pdf'
      );
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl border border-[#E2E8F0] overflow-hidden animate-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E2E8F0] bg-[#F8FAFC]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#1E40AF] text-white flex items-center justify-center">
              <span className="material-symbols-outlined text-[18px]">upload_file</span>
            </div>
            <div>
              <h2 className="font-['Noto_Serif',serif] font-bold text-lg text-[#0F172A]">
                Upload EQA Results
              </h2>
              <p className="text-xs text-[#64748B]">
                {trial.scheme} • {trial.title} ({trial.trialNumber})
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-[#94A3B8] hover:text-[#0F172A] p-1.5 rounded-full hover:bg-[#F1F5F9]"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          {/* Metadata Card */}
          <div className="bg-[#F8FAFC] p-4 rounded-2xl border border-[#E2E8F0] grid grid-cols-2 gap-3 text-xs">
            <div>
              <span className="text-[#64748B] uppercase tracking-wider block font-bold text-[10px]">
                Instrument
              </span>
              <span className="font-semibold text-[#0F172A]">{trial.instrument}</span>
            </div>
            <div>
              <span className="text-[#64748B] uppercase tracking-wider block font-bold text-[10px]">
                Due Date
              </span>
              <span className="font-semibold text-rose-600">{trial.deadlineDate}</span>
            </div>
          </div>

          {/* Parameter Values Input */}
          <div className="space-y-3">
            <label className="block text-xs font-bold uppercase tracking-wider text-[#64748B]">
              Enter Analyte Test Values
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {(trial.parameters || ['Glucose', 'Cholesterol', 'Triglycerides']).map((param) => (
                <div key={param} className="space-y-1">
                  <label className="text-xs font-medium text-[#475569]">{param}</label>
                  <input
                    type="text"
                    required
                    value={values[param] || ''}
                    onChange={(e) => handleInputChange(param, e.target.value)}
                    placeholder="e.g. 104 mg/dL"
                    className="w-full px-4 py-2 text-sm bg-[#F1F5F9] border border-[#E2E8F0] focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 focus:bg-white rounded-2xl outline-none font-mono text-[#0F172A]"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Raw PDF / Printout Upload */}
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-[#64748B]">
              Attach Instrument Raw Printout / PDF (Optional)
            </label>
            <label className="border-2 border-dashed border-[#CBD5E1] hover:border-[#2563EB] bg-[#F8FAFC] rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer transition-colors hover:bg-[#EFF6FF]/40">
              <span className="material-symbols-outlined text-3xl text-[#2563EB] mb-1">
                cloud_upload
              </span>
              <span className="text-xs font-bold text-[#0F172A]">
                {uploadedFile ? uploadedFile.name : 'Click to select verified run PDF'}
              </span>
              <span className="text-[10px] text-[#64748B] mt-0.5">
                {uploadedFile
                  ? `${(uploadedFile.size / 1024).toFixed(1)} KB`
                  : 'PDF, PNG, JPG up to 15MB'}
              </span>
              <input
                type="file"
                accept=".pdf,.png,.jpg,.jpeg"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
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
              disabled={isSubmitting}
              className="px-6 py-2.5 bg-[#1E40AF] hover:bg-[#1D4ED8] text-white font-['Public_Sans',sans-serif] font-bold text-xs uppercase tracking-widest rounded-full shadow-xs transition-all active:scale-95 cursor-pointer disabled:opacity-50 flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <span className="material-symbols-outlined text-[16px] animate-spin">
                    progress_activity
                  </span>
                  Encrypting & Submitting...
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[16px]">send</span>
                  Submit EQA Results
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
