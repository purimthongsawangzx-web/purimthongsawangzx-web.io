import React, { useState } from 'react';
import { DirectoryMachine } from '../../types';

interface AddMachineModalProps {
  isOpen: boolean;
  sectionId: string;
  sectionTitle?: string;
  onClose: () => void;
  onSubmit: (sectionId: string, machine: Partial<DirectoryMachine>) => void;
}

export const AddMachineModal: React.FC<AddMachineModalProps> = ({
  isOpen,
  sectionId,
  sectionTitle,
  onClose,
  onSubmit
}) => {
  const [name, setName] = useState('');
  const [extension, setExtension] = useState('');
  const [leadSpecialist, setLeadSpecialist] = useState('');
  const [model, setModel] = useState('');
  const [iconName, setIconName] = useState('science');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !extension.trim()) return;

    onSubmit(sectionId, {
      name: name.trim(),
      extension: extension.trim().startsWith('Ext.') ? extension.trim() : `Ext. ${extension.trim()}`,
      leadSpecialist: leadSpecialist.trim() || 'Laboratory Specialist',
      model: model.trim() || 'Automated Clinical Analyzer',
      iconName
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-[#E2E8F0] overflow-hidden animate-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E2E8F0] bg-[#F8FAFC]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#1E40AF] text-white flex items-center justify-center">
              <span className="material-symbols-outlined text-[18px]">biotech</span>
            </div>
            <div>
              <h2 className="font-['Noto_Serif',serif] font-bold text-lg text-[#0F172A]">
                Add Analyzer Station
              </h2>
              <p className="text-xs text-[#64748B]">Section: {sectionTitle || 'Core Laboratory'}</p>
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
              Analyzer Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Sysmex CS-2500"
              className="w-full px-4 py-2.5 text-sm bg-[#F1F5F9] border border-[#E2E8F0] focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 focus:bg-white rounded-2xl outline-none text-[#0F172A]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#64748B] mb-1">
                Extension # *
              </label>
              <input
                type="text"
                required
                value={extension}
                onChange={(e) => setExtension(e.target.value)}
                placeholder="e.g. 108 or Ext. 108"
                className="w-full px-4 py-2.5 text-sm bg-[#F1F5F9] border border-[#E2E8F0] focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 focus:bg-white rounded-2xl outline-none font-mono text-[#0F172A]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#64748B] mb-1">
                Model / Serial #
              </label>
              <input
                type="text"
                value={model}
                onChange={(e) => setModel(e.target.value)}
                placeholder="e.g. Modular ISE c501"
                className="w-full px-4 py-2.5 text-sm bg-[#F1F5F9] border border-[#E2E8F0] focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 focus:bg-white rounded-2xl outline-none text-[#0F172A]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#64748B] mb-1">
              Lead Specialist / In-Charge Tech
            </label>
            <input
              type="text"
              value={leadSpecialist}
              onChange={(e) => setLeadSpecialist(e.target.value)}
              placeholder="e.g. Dr. Somchai P."
              className="w-full px-4 py-2.5 text-sm bg-[#F1F5F9] border border-[#E2E8F0] focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 focus:bg-white rounded-2xl outline-none text-[#0F172A]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#64748B] mb-1">
              Icon Type
            </label>
            <div className="grid grid-cols-5 gap-2">
              {[
                { id: 'science', label: 'Chemistry' },
                { id: 'bloodtype', label: 'Hematology' },
                { id: 'water_drop', label: 'Fluids' },
                { id: 'coronavirus', label: 'Micro' },
                { id: 'favorite', label: 'Cardiac' }
              ].map((ic) => (
                <button
                  key={ic.id}
                  type="button"
                  onClick={() => setIconName(ic.id)}
                  className={`p-3 rounded-2xl border flex flex-col items-center gap-1 cursor-pointer transition-all ${
                    iconName === ic.id
                      ? 'border-[#1E40AF] bg-[#EFF6FF] text-[#1E40AF] font-bold'
                      : 'border-[#E2E8F0] bg-[#F1F5F9] text-[#64748B] hover:bg-[#E2E8F0]'
                  }`}
                >
                  <span className="material-symbols-outlined text-[20px]">{ic.id}</span>
                  <span className="text-[9px] font-bold">{ic.label}</span>
                </button>
              ))}
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
              Register Station
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
