import React, { useState } from 'react';

interface SupportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SupportModal: React.FC<SupportModalProps> = ({ isOpen, onClose }) => {
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketCategory, setTicketCategory] = useState('Instrument Breakdown / Error Code');
  const [ticketMessage, setTicketMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketSubject.trim()) return;
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-[#E2E8F0] overflow-hidden animate-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E2E8F0] bg-[#F8FAFC]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#1E40AF] text-white flex items-center justify-center">
              <span className="material-symbols-outlined text-[18px]">help</span>
            </div>
            <div>
              <h2 className="font-['Noto_Serif',serif] font-bold text-lg text-[#0F172A]">
                Lab Operations Help & Dispatch
              </h2>
              <p className="text-xs text-[#64748B]">Emergency bio-medical engineering & IT support</p>
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
          {/* Emergency Hotlines Box */}
          <div className="bg-red-50 border border-red-200 rounded-2xl p-4 space-y-2">
            <div className="flex items-center gap-2 text-red-700 font-bold text-xs uppercase tracking-wider">
              <span className="material-symbols-outlined text-[18px]">emergency</span>
              Immediate STAT Emergency Lines
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-white p-3 rounded-xl border border-red-100 shadow-xs">
                <p className="text-[#64748B] text-[10px]">On-Duty Chief Pathologist</p>
                <p className="font-bold text-[#0F172A] mt-0.5">Ext. 100 / (555) 019-2831</p>
              </div>
              <div className="bg-white p-3 rounded-xl border border-red-100 shadow-xs">
                <p className="text-[#64748B] text-[10px]">BioMed Engineering STAT</p>
                <p className="font-bold text-[#0F172A] mt-0.5">Ext. 999 / (800) 228-1990</p>
              </div>
            </div>
          </div>

          {submitted ? (
            <div className="py-8 text-center space-y-2">
              <span className="material-symbols-outlined text-4xl text-[#2563EB]">
                check_circle
              </span>
              <h4 className="font-['Noto_Serif',serif] text-lg font-bold text-[#0F172A]">
                Service Request Dispatched!
              </h4>
              <p className="text-xs text-[#64748B]">
                Ticket #ENG-{Date.now().toString().slice(-4)} has been assigned to the on-call field engineer.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#64748B] mb-1">
                  Issue Category
                </label>
                <select
                  value={ticketCategory}
                  onChange={(e) => setTicketCategory(e.target.value)}
                  className="w-full px-4 py-2.5 text-sm bg-[#F1F5F9] border border-[#E2E8F0] focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 focus:bg-white rounded-2xl outline-none text-[#0F172A]"
                >
                  <option value="Instrument Breakdown / Error Code">Instrument Breakdown / Error Code</option>
                  <option value="QC / Calibration Failure">QC / Calibration Out of Control</option>
                  <option value="Reagent Shortage Requisition">STAT Reagent Emergency Delivery</option>
                  <option value="LIS / Network Interruption">LIS / Network Interruption</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#64748B] mb-1">
                  Subject / Summary *
                </label>
                <input
                  type="text"
                  required
                  value={ticketSubject}
                  onChange={(e) => setTicketSubject(e.target.value)}
                  placeholder="e.g. Cobas 8000 Photometer Error Code E-402"
                  className="w-full px-4 py-2.5 text-sm bg-[#F1F5F9] border border-[#E2E8F0] focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 focus:bg-white rounded-2xl outline-none text-[#0F172A]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#64748B] mb-1">
                  Description & Error Log
                </label>
                <textarea
                  rows={3}
                  value={ticketMessage}
                  onChange={(e) => setTicketMessage(e.target.value)}
                  placeholder="Describe analyzer symptoms, alarm sounds, lot numbers affected..."
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
                  className="px-6 py-2.5 bg-[#1E40AF] hover:bg-[#1D4ED8] text-white font-['Public_Sans',sans-serif] font-bold text-xs uppercase tracking-widest rounded-full shadow-xs transition-all active:scale-95 cursor-pointer flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-[18px]">send</span>
                  Dispatch Request
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
