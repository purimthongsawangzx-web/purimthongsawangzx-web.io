import React, { useState } from 'react';
import { StockItem } from '../../types';

interface AddItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (item: Partial<StockItem>) => void;
}

export const AddItemModal: React.FC<AddItemModalProps> = ({
  isOpen,
  onClose,
  onSubmit
}) => {
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [category, setCategory] = useState<'blood_tubes' | 'containers' | 'reagents' | 'consumables'>('blood_tubes');
  const [quantity, setQuantity] = useState<number>(50);
  const [minQuantity, setMinQuantity] = useState<number>(30);
  const [unit, setUnit] = useState('units');
  const [location, setLocation] = useState('');
  const [supplier, setSupplier] = useState('');
  const [lotNumber, setLotNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !code.trim()) return;

    const categoryLabels: Record<string, string> = {
      blood_tubes: 'BLOOD TUBES',
      containers: 'CONTAINERS',
      reagents: 'REAGENTS',
      consumables: 'CONSUMABLES'
    };

    const status =
      quantity <= minQuantity * 0.3
        ? 'critical'
        : quantity <= minQuantity
        ? 'low'
        : 'normal';

    const trimmedLot = lotNumber.trim();
    const lots = trimmedLot
      ? [
          {
            id: `lot-${Date.now()}`,
            lotNumber: trimmedLot,
            expiryDate: expiryDate || undefined,
            receivedDate: new Date().toISOString().split('T')[0],
            quantity: quantity,
            status: 'active' as const
          }
        ]
      : [];

    onSubmit({
      name: name.trim(),
      code: code.trim().toUpperCase(),
      category,
      categoryLabel: categoryLabels[category] || 'CONSUMABLES',
      quantity,
      minQuantity,
      unit,
      status,
      location: location.trim() || 'Central Storage',
      supplier: supplier.trim() || 'General Medical Supply',
      lotNumber: trimmedLot || undefined,
      expiryDate: expiryDate || undefined,
      lots
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-[#E2E8F0] overflow-hidden animate-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E2E8F0] bg-[#F8FAFC]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#1E40AF] text-white flex items-center justify-center">
              <span className="material-symbols-outlined text-[18px]">inventory_2</span>
            </div>
            <div>
              <h2 className="font-['Noto_Serif',serif] font-bold text-lg text-[#0F172A]">
                Add New Inventory Item
              </h2>
              <p className="text-xs text-[#64748B]">Reagent, tube, container, or consumable</p>
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
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#64748B] mb-1">
              Item Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Sodium Fluoride Tube 2ml"
              className="w-full px-4 py-2.5 text-sm bg-[#F1F5F9] border border-[#E2E8F0] focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 focus:bg-white rounded-2xl outline-none text-[#0F172A]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#64748B] mb-1">
                Product Code *
              </label>
              <input
                type="text"
                required
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="e.g. #BT-502"
                className="w-full px-4 py-2.5 text-sm bg-[#F1F5F9] border border-[#E2E8F0] focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 focus:bg-white rounded-2xl outline-none uppercase font-mono text-[#0F172A]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#64748B] mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full px-4 py-2.5 text-sm bg-[#F1F5F9] border border-[#E2E8F0] focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 focus:bg-white rounded-2xl outline-none text-[#0F172A]"
              >
                <option value="blood_tubes">Blood Tubes</option>
                <option value="containers">Containers</option>
                <option value="reagents">Reagents</option>
                <option value="consumables">Consumables</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#64748B] mb-1">
                Current Qty *
              </label>
              <input
                type="number"
                min="0"
                required
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="w-full px-4 py-2.5 text-sm bg-[#F1F5F9] border border-[#E2E8F0] focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 focus:bg-white rounded-2xl outline-none font-bold text-[#0F172A]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#64748B] mb-1">
                Min Stock *
              </label>
              <input
                type="number"
                min="1"
                required
                value={minQuantity}
                onChange={(e) => setMinQuantity(Number(e.target.value))}
                className="w-full px-4 py-2.5 text-sm bg-[#F1F5F9] border border-[#E2E8F0] focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 focus:bg-white rounded-2xl outline-none font-bold text-[#0F172A]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#64748B] mb-1">
                Unit
              </label>
              <input
                type="text"
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                placeholder="units, kits"
                className="w-full px-4 py-2.5 text-sm bg-[#F1F5F9] border border-[#E2E8F0] focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 focus:bg-white rounded-2xl outline-none text-[#0F172A]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#64748B] mb-1">
                Storage Location
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Rack C-02"
                className="w-full px-4 py-2.5 text-sm bg-[#F1F5F9] border border-[#E2E8F0] focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 focus:bg-white rounded-2xl outline-none text-[#0F172A]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#64748B] mb-1">
                Supplier / Brand
              </label>
              <input
                type="text"
                value={supplier}
                onChange={(e) => setSupplier(e.target.value)}
                placeholder="e.g. BD Vacutainer"
                className="w-full px-4 py-2.5 text-sm bg-[#F1F5F9] border border-[#E2E8F0] focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 focus:bg-white rounded-2xl outline-none text-[#0F172A]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#64748B] mb-1">
                Batch / Lot Number (Optional)
              </label>
              <input
                type="text"
                value={lotNumber}
                onChange={(e) => setLotNumber(e.target.value)}
                placeholder="e.g. LOT-2026-99"
                className="w-full px-4 py-2.5 text-sm bg-[#F1F5F9] border border-[#E2E8F0] focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 focus:bg-white rounded-2xl outline-none font-mono uppercase text-[#0F172A]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#64748B] mb-1">
                Expiration Date (Optional)
              </label>
              <input
                type="date"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                className="w-full px-4 py-2.5 text-sm bg-[#F1F5F9] border border-[#E2E8F0] focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 focus:bg-white rounded-2xl outline-none text-[#0F172A]"
              />
            </div>
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
              Save Stock Item
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
