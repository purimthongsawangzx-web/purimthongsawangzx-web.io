import React, { useState, useEffect, useMemo } from 'react';
import { StockItem, StockLot } from '../../types';

interface ChangeLotModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: StockItem | null;
  onSaveLot: (
    itemId: string,
    lotData: {
      lotNumber: string;
      expiryDate?: string;
      receivedDate?: string;
      quantity?: number;
      notes?: string;
    }
  ) => void;
  onDeleteLot: (itemId: string, specificLotNumber?: string) => void;
  onSwitchActiveLot?: (itemId: string, targetLotNumber: string) => void;
}

export const ChangeLotModal: React.FC<ChangeLotModalProps> = ({
  isOpen,
  onClose,
  item,
  onSaveLot,
  onDeleteLot,
  onSwitchActiveLot
}) => {
  const [lotNumber, setLotNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [receivedDate, setReceivedDate] = useState('');
  const [lotQuantity, setLotQuantity] = useState<number | ''>('');
  const [changeReason, setChangeReason] = useState<string>('New Batch Delivery');
  const [customNotes, setCustomNotes] = useState('');
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const [lotToDelete, setLotToDelete] = useState<string | null>(null);

  // Sync state whenever selected item changes
  useEffect(() => {
    if (item) {
      setLotNumber(item.lotNumber || '');
      setExpiryDate(item.expiryDate || '');
      setReceivedDate(new Date().toISOString().split('T')[0]);
      setLotQuantity(item.quantity);
      setChangeReason('New Batch Delivery');
      setCustomNotes('');
      setIsConfirmingDelete(false);
      setLotToDelete(null);
    }
  }, [item, isOpen]);

  // Expiration calculation helper
  const expiryStatus = useMemo(() => {
    if (!item?.expiryDate) return null;
    const exp = new Date(item.expiryDate);
    const now = new Date();
    // Normalize to date only
    exp.setHours(0, 0, 0, 0);
    now.setHours(0, 0, 0, 0);
    const diffMs = exp.getTime() - now.getTime();
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return {
        label: `Expired ${Math.abs(diffDays)} days ago`,
        color: 'bg-red-100 text-red-700 border-red-200',
        isWarning: true
      };
    }
    if (diffDays <= 30) {
      return {
        label: `Expiring soon (${diffDays} days left)`,
        color: 'bg-amber-100 text-amber-800 border-amber-200',
        isWarning: true
      };
    }
    return {
      label: `Valid for ${diffDays} days`,
      color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      isWarning: false
    };
  }, [item?.expiryDate]);

  if (!isOpen || !item) return null;

  const quickReasons = [
    'New Batch Delivery',
    'Old Lot Depleted',
    'QC Crossover Passed',
    'Typo Correction',
    'Manufacturer Recall'
  ];

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!lotNumber.trim()) return;

    onSaveLot(item.id, {
      lotNumber: lotNumber.trim().toUpperCase(),
      expiryDate: expiryDate || undefined,
      receivedDate: receivedDate || undefined,
      quantity: typeof lotQuantity === 'number' ? lotQuantity : undefined,
      notes: `${changeReason}${customNotes.trim() ? `: ${customNotes.trim()}` : ''}`
    });

    onClose();
  };

  const handleConfirmDelete = () => {
    onDeleteLot(item.id, lotToDelete || item.lotNumber);
    setIsConfirmingDelete(false);
    setLotToDelete(null);
    onClose();
  };

  // Compile full lots list including item.lots and current lotNumber
  const allLots: StockLot[] = (() => {
    const list: StockLot[] = item.lots ? [...item.lots] : [];
    if (item.lotNumber && !list.some((l) => l.lotNumber === item.lotNumber)) {
      list.unshift({
        id: `lot-primary-${item.id}`,
        lotNumber: item.lotNumber,
        expiryDate: item.expiryDate,
        status: 'active'
      });
    }
    return list;
  })();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150 font-['Public_Sans',sans-serif]">
      <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl border border-[#E2E8F0] overflow-hidden animate-in zoom-in-95 duration-150 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E2E8F0] bg-[#F8FAFC]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-[#1E40AF] text-white flex items-center justify-center shadow-xs">
              <span className="material-symbols-outlined text-[20px]">qr_code_2</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-['Noto_Serif',serif] font-bold text-lg text-[#0F172A]">
                  Manage Batch & Lot
                </h2>
                <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase bg-blue-50 text-blue-700 border border-blue-200">
                  {item.categoryLabel}
                </span>
              </div>
              <p className="text-xs text-[#64748B]">
                {item.name} • <span className="font-mono text-[#1E40AF] font-bold">{item.code}</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-[#94A3B8] hover:text-[#0F172A] p-2 rounded-full hover:bg-[#F1F5F9] transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          {/* Current Active Lot Banner */}
          <div className="bg-[#F8FAFC] border border-[#CBD5E1] rounded-2xl p-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-[#64748B] flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  Currently Active In-Use Lot
                </div>
                <div className="mt-1 flex items-baseline gap-2 flex-wrap">
                  {item.lotNumber ? (
                    <>
                      <code className="text-base sm:text-lg font-mono font-bold text-[#0F172A] bg-white px-2.5 py-0.5 rounded-lg border border-[#E2E8F0]">
                        {item.lotNumber}
                      </code>
                      {item.expiryDate && (
                        <span className="text-xs text-[#475569]">
                          Exp: <strong className="text-[#0F172A]">{item.expiryDate}</strong>
                        </span>
                      )}
                      {expiryStatus && (
                        <span
                          className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${expiryStatus.color}`}
                        >
                          {expiryStatus.label}
                        </span>
                      )}
                    </>
                  ) : (
                    <span className="text-sm italic text-[#94A3B8]">
                      No active lot currently assigned to this inventory item.
                    </span>
                  )}
                </div>
              </div>

              {/* Action: Delete Current Lot */}
              {item.lotNumber && (
                <button
                  type="button"
                  onClick={() => {
                    setLotToDelete(item.lotNumber || null);
                    setIsConfirmingDelete(true);
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-red-200 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold transition-colors cursor-pointer self-start sm:self-auto shrink-0 shadow-2xs"
                  title="Delete or clear this lot"
                >
                  <span className="material-symbols-outlined text-[16px]">delete</span>
                  <span>Delete Lot</span>
                </button>
              )}
            </div>

            <div className="mt-3 pt-2.5 border-t border-slate-200/80 flex items-center justify-between text-xs text-[#64748B]">
              <span>
                Current On-Hand Stock:{' '}
                <strong className="text-[#0F172A] font-['Noto_Serif',serif] text-sm">
                  {item.quantity} {item.unit}
                </strong>
              </span>
              <span>
                Location: <strong className="text-[#0F172A]">{item.location || 'Central Storage'}</strong>
              </span>
            </div>
          </div>

          {/* Inline Delete Confirmation Card */}
          {isConfirmingDelete && (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-4 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[20px]">warning</span>
                </div>
                <div className="flex-1">
                  <h4 className="text-xs font-bold text-red-900 uppercase tracking-wider">
                    Confirm Lot Removal
                  </h4>
                  <p className="text-xs text-red-700 mt-1 leading-relaxed">
                    Are you sure you want to delete{' '}
                    <strong>{lotToDelete ? `Lot ${lotToDelete}` : 'the active lot'}</strong> from{' '}
                    <strong>{item.name}</strong>?
                    <br />
                    <span className="text-[11px] text-red-600/90 italic">
                      Note: Your current inventory count ({item.quantity} {item.unit}) will remain safe in stock.
                    </span>
                  </p>
                  <div className="mt-3 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleConfirmDelete}
                      className="px-4 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center gap-1"
                    >
                      <span className="material-symbols-outlined text-[15px]">check</span>
                      Yes, Delete Lot
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsConfirmingDelete(false);
                        setLotToDelete(null);
                      }}
                      className="px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-xl text-xs font-bold transition-all cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Form: Change / Set Lot */}
          <form id="change-lot-form" onSubmit={handleFormSubmit} className="space-y-4">
            <div className="border-b border-[#E2E8F0] pb-2">
              <h3 className="font-['Noto_Serif',serif] font-bold text-sm text-[#0F172A] flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px] text-[#1E40AF]">
                  published_with_changes
                </span>
                Change Lot Number & Expiry (เปลี่ยน Lot)
              </h3>
              <p className="text-xs text-[#64748B]">
                Enter the new batch lot details for this diagnostic assay or consumable item.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#64748B] mb-1">
                  New / Updated Lot Number *
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8] text-[18px]">
                    tag
                  </span>
                  <input
                    type="text"
                    required
                    value={lotNumber}
                    onChange={(e) => setLotNumber(e.target.value)}
                    placeholder="e.g. LOT-2027-04A"
                    className="w-full pl-9 pr-3 py-2.5 text-xs bg-[#F8FAFC] border border-[#CBD5E1] rounded-2xl focus:outline-none focus:border-[#1E40AF] focus:bg-white font-mono uppercase font-bold text-[#0F172A]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#64748B] mb-1">
                  Expiration Date
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8] text-[18px]">
                    calendar_month
                  </span>
                  <input
                    type="date"
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 text-xs bg-[#F8FAFC] border border-[#CBD5E1] rounded-2xl focus:outline-none focus:border-[#1E40AF] focus:bg-white text-[#0F172A]"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#64748B] mb-1">
                  Received / Release Date
                </label>
                <input
                  type="date"
                  value={receivedDate}
                  onChange={(e) => setReceivedDate(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-[#F8FAFC] border border-[#CBD5E1] rounded-2xl focus:outline-none focus:border-[#1E40AF] focus:bg-white text-[#0F172A]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#64748B] mb-1">
                  Lot Batch Units (Optional)
                </label>
                <input
                  type="number"
                  min="0"
                  value={lotQuantity}
                  onChange={(e) =>
                    setLotQuantity(e.target.value === '' ? '' : Number(e.target.value))
                  }
                  placeholder={`Default: ${item.quantity}`}
                  className="w-full px-3 py-2 text-xs bg-[#F8FAFC] border border-[#CBD5E1] rounded-2xl focus:outline-none focus:border-[#1E40AF] focus:bg-white font-bold text-[#0F172A]"
                />
              </div>
            </div>

            {/* Quick Reasons Chips */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#64748B] mb-1.5">
                Reason for Change
              </label>
              <div className="flex flex-wrap gap-1.5">
                {quickReasons.map((reason) => (
                  <button
                    key={reason}
                    type="button"
                    onClick={() => setChangeReason(reason)}
                    className={`px-3 py-1 rounded-full text-[11px] font-bold transition-all cursor-pointer ${
                      changeReason === reason
                        ? 'bg-[#1E40AF] text-white shadow-2xs'
                        : 'bg-[#F1F5F9] text-[#475569] hover:bg-[#E2E8F0]'
                    }`}
                  >
                    {reason}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#64748B] mb-1">
                Additional Notes / Calibration QC Verification
              </label>
              <input
                type="text"
                value={customNotes}
                onChange={(e) => setCustomNotes(e.target.value)}
                placeholder="e.g. Cross-checked with previous lot parallel run, SD within 2.0"
                className="w-full px-3 py-2 text-xs bg-[#F8FAFC] border border-[#CBD5E1] rounded-2xl focus:outline-none focus:border-[#1E40AF] focus:bg-white text-[#0F172A]"
              />
            </div>
          </form>

          {/* Multiple Lots Table (if more than 1 lot recorded) */}
          {allLots.length > 1 && (
            <div className="pt-3 border-t border-[#E2E8F0]">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-xs font-bold text-[#0F172A] uppercase tracking-wider">
                  Associated Batches ({allLots.length})
                </h4>
                <span className="text-[11px] text-[#64748B]">Click lot to switch active batch</span>
              </div>
              <div className="divide-y divide-[#E2E8F0] border border-[#E2E8F0] rounded-2xl overflow-hidden text-xs">
                {allLots.map((lot, idx) => {
                  const isActive = lot.lotNumber === item.lotNumber;
                  return (
                    <div
                      key={lot.id || idx}
                      className={`p-3 flex items-center justify-between transition-colors ${
                        isActive ? 'bg-blue-50/50' : 'bg-white hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span
                          className={`w-2 h-2 rounded-full ${
                            isActive ? 'bg-blue-600' : 'bg-slate-300'
                          }`}
                        />
                        <div>
                          <p className="font-mono font-bold text-[#0F172A] flex items-center gap-1.5">
                            {lot.lotNumber}
                            {isActive && (
                              <span className="text-[10px] uppercase font-bold text-blue-700 bg-blue-100 px-1.5 py-0.2 rounded">
                                In Use
                              </span>
                            )}
                          </p>
                          <p className="text-[11px] text-[#64748B]">
                            Exp: {lot.expiryDate || 'N/A'}{' '}
                            {lot.quantity !== undefined ? `• ${lot.quantity} ${item.unit}` : ''}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5">
                        {!isActive && onSwitchActiveLot && (
                          <button
                            type="button"
                            onClick={() => onSwitchActiveLot(item.id, lot.lotNumber)}
                            className="px-2.5 py-1 text-[11px] font-bold text-[#1E40AF] hover:bg-blue-100 rounded-lg transition-colors cursor-pointer"
                          >
                            Set In-Use
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => {
                            setLotToDelete(lot.lotNumber);
                            setIsConfirmingDelete(true);
                          }}
                          className="p-1 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                          title="Delete lot"
                        >
                          <span className="material-symbols-outlined text-[16px]">delete</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-[#E2E8F0] bg-[#F8FAFC] flex items-center justify-between gap-3">
          {item.lotNumber ? (
            <button
              type="button"
              onClick={() => {
                setLotToDelete(item.lotNumber || null);
                setIsConfirmingDelete(true);
              }}
              className="text-xs font-bold text-red-600 hover:text-red-700 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">delete</span>
              Delete Lot
            </button>
          ) : (
            <div />
          )}

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs uppercase tracking-widest font-bold text-[#64748B] hover:text-[#0F172A] rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="change-lot-form"
              className="px-6 py-2 bg-[#1E40AF] hover:bg-[#1D4ED8] text-white font-bold text-xs uppercase tracking-widest rounded-full shadow-xs transition-all active:scale-95 cursor-pointer flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[18px]">check</span>
              Save Lot
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
