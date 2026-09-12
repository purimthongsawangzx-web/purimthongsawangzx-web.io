import React, { useState } from 'react';

interface UploadRosterImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyRoster: (date: string, staffName: string) => void;
}

export const UploadRosterImageModal: React.FC<UploadRosterImageModalProps> = ({
  isOpen,
  onClose,
  onApplyRoster
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [detectedShifts, setDetectedShifts] = useState<{ date: string; staffName: string; shiftType: string }[] | null>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setDetectedShifts(null);
    }
  };

  const handleRunOCR = () => {
    setIsProcessing(true);
    // Simulate OCR schedule recognition
    setTimeout(() => {
      setIsProcessing(false);
      setDetectedShifts([
        { date: '2023-10-02', staffName: 'Dr. Jane Doe', shiftType: 'Morning Shift' },
        { date: '2023-10-03', staffName: 'Mark Lewis', shiftType: 'Night Shift' },
        { date: '2023-10-04', staffName: 'Alice Smith', shiftType: 'Morning Shift' },
        { date: '2023-10-05', staffName: 'David Kim', shiftType: 'Day Shift' },
        { date: '2023-10-06', staffName: 'Somchai P.', shiftType: 'On Call' }
      ]);
    }, 1200);
  };

  const handleApplyAll = () => {
    if (detectedShifts) {
      detectedShifts.forEach((s) => {
        onApplyRoster(s.date, s.staffName);
      });
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-[#E2E8F0] overflow-hidden animate-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E2E8F0] bg-[#F8FAFC]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#1E40AF] text-white flex items-center justify-center">
              <span className="material-symbols-outlined text-[18px]">photo_camera</span>
            </div>
            <div>
              <h2 className="font-['Noto_Serif',serif] font-bold text-lg text-[#0F172A]">
                Scan Duty Timetable Photo
              </h2>
              <p className="text-xs text-[#64748B]">Upload printed paper schedule or photo</p>
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
          {!previewUrl ? (
            <label className="border-2 border-dashed border-[#CBD5E1] hover:border-[#2563EB] bg-[#F8FAFC] rounded-3xl p-8 flex flex-col items-center justify-center cursor-pointer transition-colors text-center hover:bg-[#EFF6FF]/40">
              <div className="w-14 h-14 rounded-full bg-[#EFF6FF] text-[#1E40AF] flex items-center justify-center mb-3">
                <span className="material-symbols-outlined text-3xl">add_a_photo</span>
              </div>
              <p className="font-bold text-sm text-[#0F172A]">Take or upload photo of physical roster sheet</p>
              <p className="text-xs text-[#64748B] mt-1 max-w-xs">
                Supports printed lab whiteboard photos, Excel printouts, and scanned PDFs.
              </p>
              <input
                type="file"
                accept="image/*,.pdf"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          ) : (
            <div className="space-y-4">
              <div className="relative rounded-2xl overflow-hidden border border-[#E2E8F0] max-h-48 flex items-center justify-center bg-black/5">
                <img
                  src={previewUrl}
                  alt="Roster scan"
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => {
                    setPreviewUrl(null);
                    setSelectedFile(null);
                    setDetectedShifts(null);
                  }}
                  className="absolute top-2 right-2 bg-black/60 text-white p-1 rounded-full text-xs hover:bg-black"
                >
                  <span className="material-symbols-outlined text-[16px]">close</span>
                </button>
              </div>

              {!detectedShifts && (
                <button
                  onClick={handleRunOCR}
                  disabled={isProcessing}
                  className="w-full py-3 bg-[#1E40AF] hover:bg-[#1D4ED8] text-white font-['Public_Sans',sans-serif] font-bold text-xs uppercase tracking-widest rounded-full shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isProcessing ? (
                    <>
                      <span className="material-symbols-outlined text-[18px] animate-spin">
                        progress_activity
                      </span>
                      Extracting Staff & Shifts...
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-[18px]">document_scanner</span>
                      Extract Shifts & Staff Names
                    </>
                  )}
                </button>
              )}
            </div>
          )}

          {/* Detected Shifts Preview */}
          {detectedShifts && (
            <div className="space-y-3 animate-in fade-in">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-xs uppercase tracking-wider text-[#64748B]">
                  Detected 5 Shift Assignments
                </h4>
                <span className="text-xs text-[#059669] font-bold">100% Match</span>
              </div>

              <div className="divide-y divide-[#E2E8F0] bg-[#F8FAFC] rounded-2xl border border-[#E2E8F0] p-3 max-h-40 overflow-y-auto text-xs">
                {detectedShifts.map((s, idx) => (
                  <div key={idx} className="py-1.5 flex justify-between items-center">
                    <span className="font-bold text-[#0F172A]">{s.date}</span>
                    <span className="text-[#475569]">{s.staffName}</span>
                    <span className="text-[10px] bg-white px-2 py-0.5 rounded-full border border-[#E2E8F0] text-[#1E40AF] font-medium">
                      {s.shiftType}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="pt-4 border-t border-[#E2E8F0] flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-xs uppercase tracking-widest font-bold text-[#64748B] hover:text-[#0F172A]"
            >
              Cancel
            </button>
            {detectedShifts && (
              <button
                type="button"
                onClick={handleApplyAll}
                className="px-6 py-2.5 bg-[#1E40AF] hover:bg-[#1D4ED8] text-white font-['Public_Sans',sans-serif] font-bold text-xs uppercase tracking-widest rounded-full shadow-xs transition-all active:scale-95 cursor-pointer flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-[16px]">sync</span>
                Sync with Monthly Roster
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
