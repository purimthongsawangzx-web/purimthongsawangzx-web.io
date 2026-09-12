import React, { useState, useEffect } from 'react';
import { OutlabSendoutOrder, OutlabTest, UserAccount } from '../../types';

interface NewSendoutOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (order: OutlabSendoutOrder) => void;
  outlabTests: OutlabTest[];
  initialSelectedTest?: OutlabTest | null;
  currentUser?: UserAccount | null;
}

export const NewSendoutOrderModal: React.FC<NewSendoutOrderModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  outlabTests,
  initialSelectedTest,
  currentUser
}) => {
  const [patientHn, setPatientHn] = useState('');
  const [patientName, setPatientName] = useState('');
  const [selectedTestId, setSelectedTestId] = useState('');
  const [urgency, setUrgency] = useState<'Routine' | 'Urgent' | 'STAT'>('Routine');
  const [collectionDateTime, setCollectionDateTime] = useState('');
  const [courierCompany, setCourierCompany] = useState('N Health Express');
  const [courierTrackingNo, setCourierTrackingNo] = useState('');
  const [notes, setNotes] = useState('');
  const [status, setStatus] = useState<OutlabSendoutOrder['status']>('In Transit');

  useEffect(() => {
    if (isOpen) {
      const now = new Date();
      const formatted = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(
        now.getDate()
      ).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(
        now.getMinutes()
      ).padStart(2, '0')}`;
      setCollectionDateTime(formatted);

      if (initialSelectedTest) {
        setSelectedTestId(initialSelectedTest.id);
        setCourierCompany(`${initialSelectedTest.destinationLab} Courier / Logistics`);
      } else if (outlabTests.length > 0) {
        setSelectedTestId(outlabTests[0].id);
        setCourierCompany(`${outlabTests[0].destinationLab} Courier / Logistics`);
      }
      setPatientHn('');
      setPatientName('');
      setCourierTrackingNo(`TRK-${Date.now().toString().slice(-6)}`);
      setNotes('');
      setUrgency('Routine');
      setStatus('In Transit');
    }
  }, [isOpen, initialSelectedTest, outlabTests]);

  const selectedTest = outlabTests.find((t) => t.id === selectedTestId);

  // When selected test changes, sync default courier
  const handleSelectTest = (testId: string) => {
    setSelectedTestId(testId);
    const test = outlabTests.find((t) => t.id === testId);
    if (test) {
      setCourierCompany(`${test.destinationLab} Courier / Logistics`);
    }
  };

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientHn.trim() || !patientName.trim() || !selectedTest) return;

    // Calculate expected result date roughly from tatWorkingDays
    const tatDays = parseInt(selectedTest.tatWorkingDays) || 5;
    const expDate = new Date();
    expDate.setDate(expDate.getDate() + tatDays);
    const expectedStr = expDate.toISOString().split('T')[0];

    const newOrder: OutlabSendoutOrder = {
      id: `out-ord-${Date.now()}`,
      orderNumber: `OUT-2026-${Date.now().toString().slice(-4)}`,
      patientHn: patientHn.trim().toUpperCase(),
      patientName: patientName.trim(),
      testId: selectedTest.id,
      testName: selectedTest.testName,
      destinationLab: selectedTest.destinationLab,
      specimenType: selectedTest.specimenType,
      tubeType: selectedTest.tubeType,
      transportTemp: selectedTest.transportTemperature,
      collectionDateTime,
      sentDateTime: status !== 'Pending Pickup' ? collectionDateTime : undefined,
      courierTrackingNo: courierTrackingNo.trim() || undefined,
      courierCompany: courierCompany.trim() || undefined,
      status,
      urgency,
      recordedBy: currentUser?.fullName || 'Medical Technologist',
      notes: notes.trim() || undefined,
      expectedResultDate: expectedStr
    };

    onSubmit(newOrder);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150 font-['Public_Sans',sans-serif]">
      <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl border border-[#E2E8F0] overflow-hidden max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E2E8F0] bg-[#F8FAFC]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-[#0284C7] text-white flex items-center justify-center shadow-xs">
              <span className="material-symbols-outlined text-[20px]">outbound</span>
            </div>
            <div>
              <h2 className="font-['Noto_Serif',serif] font-bold text-lg text-[#0F172A]">
                Log Send-Out Specimen (บันทึกส่งตรวจภายนอก)
              </h2>
              <p className="text-xs text-[#64748B]">
                Record patient sample dispatched to external referral laboratory
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-[#94A3B8] hover:text-[#0F172A] p-1.5 rounded-full hover:bg-[#F1F5F9] transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 flex-1 text-xs">
          {/* Test Selector */}
          <div>
            <label className="block font-bold text-[#1E40AF] uppercase tracking-wider text-[11px] mb-1">
              Select Outlab Test *
            </label>
            <select
              value={selectedTestId}
              onChange={(e) => handleSelectTest(e.target.value)}
              className="w-full bg-[#EFF6FF] border border-[#BFDBFE] rounded-xl px-3.5 py-2.5 text-[#0F172A] font-bold focus:outline-none focus:border-[#1E40AF] cursor-pointer text-xs"
            >
              {outlabTests.map((t) => (
                <option key={t.id} value={t.id}>
                  [{t.destinationLab}] {t.testName} ({t.testCode})
                </option>
              ))}
            </select>
          </div>

          {/* Test Preview Banner */}
          {selectedTest && (
            <div className="p-3 bg-[#F8FAFC] rounded-2xl border border-[#E2E8F0] space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#0F172A] text-xs">
                  {selectedTest.testNameThai || selectedTest.testName}
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-[#1E40AF] font-bold text-[10px]">
                  Send to: {selectedTest.destinationLab}
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px] text-[#475569]">
                <div>
                  <span className="text-slate-400">Tube: </span>
                  <span className="font-semibold">{selectedTest.tubeType}</span>
                </div>
                <div>
                  <span className="text-slate-400">Temp: </span>
                  <span className="font-semibold text-amber-700">{selectedTest.transportTemperature}</span>
                </div>
                <div>
                  <span className="text-slate-400">TAT: </span>
                  <span className="font-semibold">{selectedTest.tatWorkingDays}</span>
                </div>
              </div>
              <p className="text-[10px] text-amber-800 bg-amber-50 p-2 rounded-lg border border-amber-200">
                <span className="font-bold">⚠️ Instructions: </span>
                {selectedTest.instructions}
              </p>
            </div>
          )}

          {/* Patient Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-[#475569] uppercase tracking-wider text-[11px] mb-1">
                Patient Hospital Number (HN) *
              </label>
              <input
                type="text"
                required
                value={patientHn}
                onChange={(e) => setPatientHn(e.target.value)}
                placeholder="e.g. HN-489102"
                className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl px-3 py-2 text-[#0F172A] font-mono focus:outline-none focus:border-[#1E40AF]"
              />
            </div>
            <div>
              <label className="block font-bold text-[#475569] uppercase tracking-wider text-[11px] mb-1">
                Patient Full Name *
              </label>
              <input
                type="text"
                required
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                placeholder="e.g. Somsak Chareonrat"
                className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl px-3 py-2 text-[#0F172A] focus:outline-none focus:border-[#1E40AF]"
              />
            </div>
          </div>

          {/* Urgency & Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-[#475569] uppercase tracking-wider text-[11px] mb-1">
                Clinical Urgency
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {(['Routine', 'Urgent', 'STAT'] as const).map((urg) => (
                  <button
                    key={urg}
                    type="button"
                    onClick={() => setUrgency(urg)}
                    className={`py-1.5 rounded-xl font-bold text-center transition-all cursor-pointer ${
                      urgency === urg
                        ? urg === 'STAT'
                          ? 'bg-red-600 text-white shadow-xs'
                          : urg === 'Urgent'
                          ? 'bg-amber-500 text-white shadow-xs'
                          : 'bg-blue-600 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {urg}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block font-bold text-[#475569] uppercase tracking-wider text-[11px] mb-1">
                Initial Dispatch Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as OutlabSendoutOrder['status'])}
                className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl px-3 py-2 text-[#0F172A] font-bold cursor-pointer"
              >
                <option value="In Transit">🚚 In Transit (กำลังขนส่ง)</option>
                <option value="Pending Pickup">📦 Pending Pickup (รอรอบรถรับ)</option>
                <option value="Processing at Outlab">🔬 Processing at Outlab (กำลังตรวจ)</option>
              </select>
            </div>
          </div>

          {/* Logistics & Tracking */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-[#475569] uppercase tracking-wider text-[11px] mb-1">
                Courier / Messenger Service
              </label>
              <input
                type="text"
                value={courierCompany}
                onChange={(e) => setCourierCompany(e.target.value)}
                placeholder="e.g. N Health Express / Hospital Messenger"
                className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl px-3 py-2 text-[#0F172A]"
              />
            </div>
            <div>
              <label className="block font-bold text-[#475569] uppercase tracking-wider text-[11px] mb-1">
                Courier Tracking / Waybill No.
              </label>
              <input
                type="text"
                value={courierTrackingNo}
                onChange={(e) => setCourierTrackingNo(e.target.value)}
                placeholder="e.g. TRK-882914"
                className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl px-3 py-2 text-[#0F172A] font-mono"
              />
            </div>
          </div>

          {/* Collection Date & Time */}
          <div>
            <label className="block font-bold text-[#475569] uppercase tracking-wider text-[11px] mb-1">
              Specimen Collection Date & Time
            </label>
            <input
              type="text"
              value={collectionDateTime}
              onChange={(e) => setCollectionDateTime(e.target.value)}
              placeholder="YYYY-MM-DD HH:mm"
              className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl px-3 py-2 text-[#0F172A]"
            />
          </div>

          {/* Notes / Clinical Info */}
          <div>
            <label className="block font-bold text-[#475569] uppercase tracking-wider text-[11px] mb-1">
              Clinical Indication / Special Notes
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Diagnosis, Ward/OPD ordering department, specific handling notes..."
              className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl p-3 text-xs text-[#0F172A] focus:outline-none focus:border-[#1E40AF]"
            />
          </div>
        </form>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-[#E2E8F0] bg-[#F8FAFC]">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-full border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="px-6 py-2.5 rounded-full bg-[#0284C7] hover:bg-[#0369A1] text-white text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shadow-xs active:scale-95"
          >
            Confirm & Log Send-Out
          </button>
        </div>
      </div>
    </div>
  );
};
