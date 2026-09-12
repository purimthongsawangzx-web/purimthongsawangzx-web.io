import React, { useState } from 'react';
import { OutlabTest, ReferralLab } from '../../types';

interface OutlabDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  test: OutlabTest | null;
  referralLabs: ReferralLab[];
  onOpenSendout: (test: OutlabTest) => void;
  onEditTest: (test: OutlabTest) => void;
}

export const OutlabDetailModal: React.FC<OutlabDetailModalProps> = ({
  isOpen,
  onClose,
  test,
  referralLabs,
  onOpenSendout,
  onEditTest
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !test) return null;

  const refLab = referralLabs.find(
    (l) => l.shortName.toLowerCase() === test.destinationLab.toLowerCase() || l.name.includes(test.destinationLab)
  );

  const handleCopyPrepGuide = () => {
    const guideText = `[OUTLAB SPECIMEN REQUISITION GUIDE]
Test: ${test.testName} (${test.testCode})
Thai: ${test.testNameThai || '-'}
Destination: ${test.destinationLab}
Required Tube: ${test.tubeType}
Specimen Type: ${test.specimenType}
Min Volume: ${test.minVolume}
Transport Temp: ${test.transportTemperature}
TAT: ${test.tatWorkingDays}
Run Schedule: ${test.testingSchedule}
Courier Cutoff: ${test.courierCutoff}

PREPARATION & HANDLING:
${test.instructions}

Clinical Indication: ${test.clinicalSignificance || 'Specialized send-out test'}
Lab Cost: ${test.costTHB ? `฿${test.costTHB.toLocaleString()}` : '-'} | Hospital Price: ${test.priceTHB ? `฿${test.priceTHB.toLocaleString()}` : '-'}`;

    navigator.clipboard.writeText(guideText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getTempIcon = (temp: string) => {
    if (temp.includes('Frozen') || temp.includes('-20') || temp.includes('Dry Ice')) {
      return { icon: 'ac_unit', color: 'text-sky-600 bg-sky-50 border-sky-200', label: 'Frozen (-20°C / Dry Ice Required)' };
    }
    if (temp.includes('Refrigerated') || temp.includes('2-8')) {
      return { icon: 'thermostat', color: 'text-blue-600 bg-blue-50 border-blue-200', label: 'Refrigerated (2-8°C with Ice Gel)' };
    }
    return { icon: 'routine', color: 'text-emerald-600 bg-emerald-50 border-emerald-200', label: 'Ambient Room Temp (20-25°C)' };
  };

  const tempStyle = getTempIcon(test.transportTemperature);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150 font-['Public_Sans',sans-serif]">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-[#E2E8F0] overflow-hidden max-h-[92vh] flex flex-col animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-start justify-between px-6 py-5 border-b border-[#E2E8F0] bg-[#F8FAFC]">
          <div className="flex items-start gap-3.5">
            <div
              className="w-11 h-11 rounded-2xl flex items-center justify-center shadow-xs shrink-0 text-white"
              style={{ backgroundColor: test.tubeColorHex || '#1E40AF' }}
            >
              <span className="material-symbols-outlined text-[24px]">science</span>
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-md bg-slate-200 text-slate-700">
                  {test.testCode}
                </span>
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-blue-600 text-white shadow-xs">
                  Sent to: {test.destinationLab}
                </span>
                <span className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                  {test.category}
                </span>
              </div>
              <h2 className="font-['Noto_Serif',serif] font-bold text-xl text-[#0F172A] leading-snug">
                {test.testName}
              </h2>
              {test.testNameThai && (
                <p className="text-sm font-medium text-[#475569] mt-0.5">
                  {test.testNameThai}
                </p>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-[#94A3B8] hover:text-[#0F172A] p-2 rounded-full hover:bg-[#F1F5F9] transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1 text-xs">
          {/* Quick Highlight Box */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Specimen Tube */}
            <div className="p-3.5 bg-[#F8FAFC] rounded-2xl border border-[#E2E8F0]">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Collection Container
              </span>
              <div className="flex items-center gap-2">
                <span
                  className="w-3.5 h-3.5 rounded-full shrink-0"
                  style={{ backgroundColor: test.tubeColorHex || '#DC2626' }}
                />
                <span className="font-bold text-[#0F172A] text-xs leading-snug">
                  {test.tubeType}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">Min Vol: {test.minVolume}</p>
            </div>

            {/* Transport Temp */}
            <div className={`p-3.5 rounded-2xl border ${tempStyle.color}`}>
              <span className="text-[10px] font-bold uppercase tracking-wider block mb-1 opacity-80">
                Transport Temp
              </span>
              <div className="flex items-center gap-1.5 font-bold text-xs">
                <span className="material-symbols-outlined text-[18px]">{tempStyle.icon}</span>
                <span>{test.transportTemperature}</span>
              </div>
              <p className="text-[10px] mt-1 opacity-90">{tempStyle.label}</p>
            </div>

            {/* Turnaround Time */}
            <div className="p-3.5 bg-[#F8FAFC] rounded-2xl border border-[#E2E8F0]">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                TAT & Run Schedule
              </span>
              <span className="font-bold text-[#0F172A] text-xs block">
                {test.tatWorkingDays}
              </span>
              <p className="text-[11px] text-slate-500 mt-1">Runs: {test.testingSchedule}</p>
            </div>
          </div>

          {/* Centrifugation & Pre-analytical Protocol (Most Important for MT!) */}
          <div className="p-4 bg-amber-50/80 rounded-2xl border border-amber-200">
            <div className="flex items-center gap-2 mb-2 text-[#92400E]">
              <span className="material-symbols-outlined text-[20px]">warning</span>
              <h3 className="font-bold text-xs uppercase tracking-wider">
                Pre-Analytical Preparation & Handling Instructions (สำคัญมากสำหรับห้องปฏิบัติการ)
              </h3>
            </div>
            <p className="text-xs text-[#78350F] leading-relaxed whitespace-pre-line font-medium">
              {test.instructions}
            </p>
            <div className="mt-3 pt-2.5 border-t border-amber-200/60 flex flex-wrap items-center justify-between gap-2 text-[11px] text-[#92400E]">
              <span>
                <strong className="font-bold">Courier Cut-off: </strong>
                {test.courierCutoff}
              </span>
              {test.methodology && (
                <span>
                  <strong className="font-bold">Methodology: </strong>
                  {test.methodology}
                </span>
              )}
            </div>
          </div>

          {/* Clinical Significance */}
          {test.clinicalSignificance && (
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
              <h3 className="font-bold text-xs text-[#1E293B] uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px] text-blue-600">clinical_notes</span>
                Clinical Significance & Indication
              </h3>
              <p className="text-xs text-[#475569] leading-relaxed">
                {test.clinicalSignificance}
              </p>
            </div>
          )}

          {/* Destination Referral Lab Details */}
          <div className="p-4 bg-blue-50/60 rounded-2xl border border-blue-200/80 space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-xs text-[#1E40AF] uppercase tracking-wider flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[18px]">domain</span>
                Destination Lab: {refLab ? refLab.name : test.destinationLab}
              </h3>
              {refLab?.emergencyCourier && (
                <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-700 font-bold text-[10px]">
                  24h Courier Available
                </span>
              )}
            </div>

            {refLab ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px] text-slate-700 pt-1">
                <div>
                  <span className="text-slate-400 block text-[10px]">Lab Address:</span>
                  <span>{refLab.address}</span>
                </div>
                <div className="space-y-1">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Hotline / Customer Service:</span>
                    <span className="font-bold text-[#1E40AF]">{refLab.hotline}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Courier Dispatch Contact:</span>
                    <span className="font-bold text-slate-800">{refLab.courierDispatch}</span>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-[11px] text-slate-600">
                Primary contact: {test.contactPhone || 'Contact central hospital dispatch'}
              </p>
            )}
          </div>

          {/* Pricing & Billing */}
          <div className="flex items-center justify-between p-3.5 bg-emerald-50/60 rounded-2xl border border-emerald-200 text-xs">
            <div className="flex items-center gap-2 text-emerald-900 font-medium">
              <span className="material-symbols-outlined text-[18px] text-emerald-700">payments</span>
              <span>Financial & Billing Structure</span>
            </div>
            <div className="flex items-center gap-4 text-xs font-bold">
              {test.costTHB !== undefined && (
                <span className="text-slate-600">
                  Lab Cost: <span className="text-emerald-800">฿{test.costTHB.toLocaleString()}</span>
                </span>
              )}
              {test.priceTHB !== undefined && (
                <span className="text-slate-800">
                  Hospital Price: <span className="text-emerald-900 font-extrabold text-sm">฿{test.priceTHB.toLocaleString()}</span>
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-4 border-t border-[#E2E8F0] bg-[#F8FAFC]">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopyPrepGuide}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-white hover:border-slate-400 transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">
                {copied ? 'check' : 'content_copy'}
              </span>
              <span>{copied ? 'Copied Protocol!' : 'Copy Prep Guide for Wards'}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                onClose();
                onEditTest(test);
              }}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-200 transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">edit</span>
              <span>Edit</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-full border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              Close
            </button>
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenSendout(test);
              }}
              className="flex items-center gap-1.5 px-5 py-2 rounded-full bg-[#1E40AF] hover:bg-[#1D4ED8] text-white text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shadow-xs active:scale-95"
            >
              <span className="material-symbols-outlined text-[16px]">outbound</span>
              <span>Send Out This Test (ส่งตรวจเคสนี้)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
