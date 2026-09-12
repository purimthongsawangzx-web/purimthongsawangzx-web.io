import React, { useState, useEffect } from 'react';
import { OutlabTest, OutlabCategory, OutlabTransportTemp, ReferralLab } from '../../types';

interface AddOutlabTestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (test: OutlabTest) => void;
  editingTest?: OutlabTest | null;
  referralLabs: ReferralLab[];
}

export const AddOutlabTestModal: React.FC<AddOutlabTestModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  editingTest,
  referralLabs
}) => {
  const [testCode, setTestCode] = useState('');
  const [testName, setTestName] = useState('');
  const [testNameThai, setTestNameThai] = useState('');
  const [aliases, setAliases] = useState('');
  const [category, setCategory] = useState<OutlabCategory>('Molecular & Genetics');
  const [destinationLab, setDestinationLab] = useState('N Health');
  const [customLab, setCustomLab] = useState('');
  const [specimenType, setSpecimenType] = useState('Serum (Clot Blood)');
  const [tubeType, setTubeType] = useState('Clot Activator / SST (Gold/Red)');
  const [tubeColorHex, setTubeColorHex] = useState('#DC2626');
  const [minVolume, setMinVolume] = useState('3.0 mL');
  const [transportTemperature, setTransportTemperature] = useState<OutlabTransportTemp>('Refrigerated (2-8°C)');
  const [tatWorkingDays, setTatWorkingDays] = useState('3 - 5 working days');
  const [testingSchedule, setTestingSchedule] = useState('Daily (Mon - Sat)');
  const [courierCutoff, setCourierCutoff] = useState('11:00 AM & 15:00 PM');
  const [instructions, setInstructions] = useState('');
  const [clinicalSignificance, setClinicalSignificance] = useState('');
  const [costTHB, setCostTHB] = useState<number | ''>('');
  const [priceTHB, setPriceTHB] = useState<number | ''>('');
  const [methodology, setMethodology] = useState('');

  useEffect(() => {
    if (editingTest) {
      setTestCode(editingTest.testCode);
      setTestName(editingTest.testName);
      setTestNameThai(editingTest.testNameThai || '');
      setAliases(editingTest.aliases?.join(', ') || '');
      setCategory(editingTest.category);
      setDestinationLab(editingTest.destinationLab);
      setSpecimenType(editingTest.specimenType);
      setTubeType(editingTest.tubeType);
      setTubeColorHex(editingTest.tubeColorHex || '#DC2626');
      setMinVolume(editingTest.minVolume);
      setTransportTemperature(editingTest.transportTemperature);
      setTatWorkingDays(editingTest.tatWorkingDays);
      setTestingSchedule(editingTest.testingSchedule);
      setCourierCutoff(editingTest.courierCutoff);
      setInstructions(editingTest.instructions);
      setClinicalSignificance(editingTest.clinicalSignificance || '');
      setCostTHB(editingTest.costTHB ?? '');
      setPriceTHB(editingTest.priceTHB ?? '');
      setMethodology(editingTest.methodology || '');
    } else {
      // Default clean state
      setTestCode(`OUT-${Date.now().toString().slice(-4)}`);
      setTestName('');
      setTestNameThai('');
      setAliases('');
      setCategory('Molecular & Genetics');
      setDestinationLab(referralLabs[0]?.shortName || 'N Health');
      setCustomLab('');
      setSpecimenType('Serum (Clot Blood)');
      setTubeType('Clot Activator / SST (Gold/Red)');
      setTubeColorHex('#DC2626');
      setMinVolume('3.0 mL');
      setTransportTemperature('Refrigerated (2-8°C)');
      setTatWorkingDays('3 - 5 working days');
      setTestingSchedule('Daily (Mon - Fri)');
      setCourierCutoff('11:00 AM');
      setInstructions('Centrifuge within 1 hour, separate serum into sterile vial and keep refrigerated (2-8°C).');
      setClinicalSignificance('');
      setCostTHB('');
      setPriceTHB('');
      setMethodology('');
    }
  }, [editingTest, isOpen, referralLabs]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!testName.trim()) return;

    const finalLab = destinationLab === 'OTHER' ? (customLab.trim() || 'External Referral') : destinationLab;

    const testItem: OutlabTest = {
      id: editingTest ? editingTest.id : `out-test-${Date.now()}`,
      testCode: testCode.trim() || `OUT-${Date.now().toString().slice(-4)}`,
      testName: testName.trim(),
      testNameThai: testNameThai.trim() || undefined,
      aliases: aliases
        .split(',')
        .map((a) => a.trim())
        .filter(Boolean),
      category,
      destinationLab: finalLab,
      specimenType: specimenType.trim(),
      tubeType: tubeType.trim(),
      tubeColorHex,
      minVolume: minVolume.trim() || '3.0 mL',
      transportTemperature,
      tatWorkingDays: tatWorkingDays.trim() || '3 - 5 days',
      testingSchedule: testingSchedule.trim() || 'Daily',
      courierCutoff: courierCutoff.trim() || '11:00 AM',
      instructions: instructions.trim(),
      clinicalSignificance: clinicalSignificance.trim() || undefined,
      costTHB: typeof costTHB === 'number' ? costTHB : undefined,
      priceTHB: typeof priceTHB === 'number' ? priceTHB : undefined,
      methodology: methodology.trim() || undefined
    };

    onSubmit(testItem);
    onClose();
  };

  const handleTubePreset = (preset: string) => {
    setTubeType(preset);
    if (preset.includes('Purple') || preset.includes('EDTA')) {
      setTubeColorHex('#9333EA');
      setSpecimenType('Whole Blood (EDTA)');
    } else if (preset.includes('Red') || preset.includes('SST') || preset.includes('Gold')) {
      setTubeColorHex('#DC2626');
      setSpecimenType('Serum (Clot Blood)');
    } else if (preset.includes('Blue') || preset.includes('Citrate')) {
      setTubeColorHex('#0284C7');
      setSpecimenType('Plasma (Sodium Citrate 3.2% / Double-spun PPP)');
      setTransportTemperature('Frozen (-20°C)');
    } else if (preset.includes('Green') || preset.includes('Heparin')) {
      setTubeColorHex('#16A34A');
      setSpecimenType('Whole Blood (Sodium Heparin)');
    } else if (preset.includes('Royal Blue')) {
      setTubeColorHex('#1D4ED8');
      setSpecimenType('Whole Blood (Trace Element EDTA)');
    } else if (preset.includes('Urine') || preset.includes('Sterile')) {
      setTubeColorHex('#F59E0B');
      setSpecimenType('Urine / Sterile Body Fluid');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150 font-['Public_Sans',sans-serif]">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-[#E2E8F0] overflow-hidden max-h-[92vh] flex flex-col animate-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E2E8F0] bg-[#F8FAFC]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-[#1E40AF] text-white flex items-center justify-center shadow-xs">
              <span className="material-symbols-outlined text-[20px]">local_shipping</span>
            </div>
            <div>
              <h2 className="font-['Noto_Serif',serif] font-bold text-lg text-[#0F172A]">
                {editingTest ? 'Edit Outlab Test Protocol' : 'Add Outlab Test (บันทึกรายการตรวจแล็บภายนอก)'}
              </h2>
              <p className="text-xs text-[#64748B]">
                Specify where this test is sent, specimen container, transport temperature, and TAT
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

        {/* Modal Body Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 flex-1 text-xs">
          {/* Row 1: Code & Name */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-bold text-[#475569] uppercase tracking-wider text-[11px] mb-1">
                LIS / Test Code *
              </label>
              <input
                type="text"
                required
                value={testCode}
                onChange={(e) => setTestCode(e.target.value)}
                placeholder="e.g. OUT-TB-001"
                className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl px-3 py-2 text-[#0F172A] focus:outline-none focus:border-[#1E40AF] focus:bg-white"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block font-bold text-[#475569] uppercase tracking-wider text-[11px] mb-1">
                Test Name (English) *
              </label>
              <input
                type="text"
                required
                value={testName}
                onChange={(e) => setTestName(e.target.value)}
                placeholder="e.g. QuantiFERON-TB Gold Plus / JAK2 V617F Mutation"
                className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl px-3 py-2 text-[#0F172A] focus:outline-none focus:border-[#1E40AF] focus:bg-white"
              />
            </div>
          </div>

          {/* Row 2: Thai Name & Aliases */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-[#475569] uppercase tracking-wider text-[11px] mb-1">
                Thai Name (ชื่อการตรวจภาษาไทย)
              </label>
              <input
                type="text"
                value={testNameThai}
                onChange={(e) => setTestNameThai(e.target.value)}
                placeholder="e.g. ตรวจคัดกรองวัณโรคแฝง"
                className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl px-3 py-2 text-[#0F172A] focus:outline-none focus:border-[#1E40AF] focus:bg-white"
              />
            </div>
            <div>
              <label className="block font-bold text-[#475569] uppercase tracking-wider text-[11px] mb-1">
                Search Aliases / Keywords (comma separated)
              </label>
              <input
                type="text"
                value={aliases}
                onChange={(e) => setAliases(e.target.value)}
                placeholder="e.g. QFT, IGRA, TB Gold"
                className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl px-3 py-2 text-[#0F172A] focus:outline-none focus:border-[#1E40AF] focus:bg-white"
              />
            </div>
          </div>

          {/* Row 3: Destination Lab & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 bg-blue-50/50 rounded-2xl border border-blue-100">
            <div>
              <label className="block font-bold text-[#1E40AF] uppercase tracking-wider text-[11px] mb-1">
                Destination Out-Lab (ส่งตรวจที่ไหน) *
              </label>
              <select
                value={destinationLab}
                onChange={(e) => setDestinationLab(e.target.value)}
                className="w-full bg-white border border-[#CBD5E1] rounded-xl px-3 py-2 text-[#0F172A] font-bold focus:outline-none focus:border-[#1E40AF] cursor-pointer"
              >
                {referralLabs.map((lab) => (
                  <option key={lab.id} value={lab.shortName}>
                    {lab.shortName} — {lab.name.split('(')[0]}
                  </option>
                ))}
                <option value="N Health">N Health (National Healthcare Systems)</option>
                <option value="BRIA Lab">BRIA (Bangkok RIA Lab)</option>
                <option value="Siriraj Lab">Siriraj Central Lab (รพ.ศิริราช)</option>
                <option value="Chulalongkorn Lab">Chulalongkorn Lab (รพ.จุฬาฯ)</option>
                <option value="Ramathibodi Lab">Ramathibodi Lab (รพ.รามาธิบดี)</option>
                <option value="DMSC กรมวิทย์">DMSC (กรมวิทยาศาสตร์การแพทย์)</option>
                <option value="OTHER">+ Other External Laboratory...</option>
              </select>

              {destinationLab === 'OTHER' && (
                <input
                  type="text"
                  required
                  value={customLab}
                  onChange={(e) => setCustomLab(e.target.value)}
                  placeholder="Enter name of external referral lab"
                  className="w-full mt-2 bg-white border border-[#CBD5E1] rounded-xl px-3 py-1.5 text-xs text-[#0F172A]"
                />
              )}
            </div>

            <div>
              <label className="block font-bold text-[#1E40AF] uppercase tracking-wider text-[11px] mb-1">
                Category / Section *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as OutlabCategory)}
                className="w-full bg-white border border-[#CBD5E1] rounded-xl px-3 py-2 text-[#0F172A] focus:outline-none focus:border-[#1E40AF] cursor-pointer"
              >
                <option value="Molecular & Genetics">Molecular & Genetics</option>
                <option value="Immunology & Autoimmune">Immunology & Autoimmune</option>
                <option value="Special Chemistry & Hormones">Special Chemistry & Hormones</option>
                <option value="Special Hematology & Coagulation">Special Hematology & Coagulation</option>
                <option value="Infectious & Virology">Infectious & Virology</option>
                <option value="Toxicology & Heavy Metals">Toxicology & Heavy Metals</option>
                <option value="Pathology & Cytogenetics">Pathology & Cytogenetics</option>
              </select>
            </div>
          </div>

          {/* Row 4: Specimen Tube & Temperature (Crucial for MT) */}
          <div className="p-3.5 bg-amber-50/60 rounded-2xl border border-amber-200/80 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-[#92400E] uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px]">thermostat</span>
                Specimen Tube & Cold Chain Requirements (สิ่งส่งตรวจ & อุณหภูมิ)
              </span>
              <div className="flex items-center gap-1 text-[10px] text-[#92400E]">
                <span>Quick Tube Presets:</span>
                <button
                  type="button"
                  onClick={() => handleTubePreset('K2-EDTA (Lavender / Purple)')}
                  className="px-1.5 py-0.5 rounded-sm bg-purple-100 text-purple-700 font-bold hover:bg-purple-200"
                >
                  EDTA
                </button>
                <button
                  type="button"
                  onClick={() => handleTubePreset('Clot Activator / SST (Gold/Red)')}
                  className="px-1.5 py-0.5 rounded-sm bg-red-100 text-red-700 font-bold hover:bg-red-200"
                >
                  SST/Clot
                </button>
                <button
                  type="button"
                  onClick={() => handleTubePreset('Sodium Citrate 3.2% (Light Blue)')}
                  className="px-1.5 py-0.5 rounded-sm bg-blue-100 text-blue-700 font-bold hover:bg-blue-200"
                >
                  Citrate
                </button>
                <button
                  type="button"
                  onClick={() => handleTubePreset('Sodium Heparin (Green)')}
                  className="px-1.5 py-0.5 rounded-sm bg-green-100 text-green-700 font-bold hover:bg-green-200"
                >
                  Heparin
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block font-semibold text-[#475569] text-[11px] mb-1">
                  Collection Tube *
                </label>
                <input
                  type="text"
                  required
                  value={tubeType}
                  onChange={(e) => setTubeType(e.target.value)}
                  placeholder="e.g. K2-EDTA (Lavender)"
                  className="w-full bg-white border border-[#CBD5E1] rounded-xl px-3 py-1.5 text-xs text-[#0F172A]"
                />
              </div>
              <div>
                <label className="block font-semibold text-[#475569] text-[11px] mb-1">
                  Specimen Type *
                </label>
                <input
                  type="text"
                  required
                  value={specimenType}
                  onChange={(e) => setSpecimenType(e.target.value)}
                  placeholder="e.g. Whole Blood, Serum, Plasma"
                  className="w-full bg-white border border-[#CBD5E1] rounded-xl px-3 py-1.5 text-xs text-[#0F172A]"
                />
              </div>
              <div>
                <label className="block font-semibold text-[#475569] text-[11px] mb-1">
                  Transport Temperature *
                </label>
                <select
                  value={transportTemperature}
                  onChange={(e) => setTransportTemperature(e.target.value as OutlabTransportTemp)}
                  className="w-full bg-white border border-[#CBD5E1] rounded-xl px-3 py-1.5 text-xs text-[#0F172A] font-bold cursor-pointer"
                >
                  <option value="Refrigerated (2-8°C)">🧊 Refrigerated (2-8°C / Ice Gel)</option>
                  <option value="Frozen (-20°C)">❄️ Frozen (-20°C / Dry Ice)</option>
                  <option value="Ambient (20-25°C)">🌡️ Ambient (20-25°C / Room Temp)</option>
                  <option value="Dry Ice (-70°C)">🧊 Dry Ice (-70°C)</option>
                  <option value="Protect from Light">☀️ Protect from Light</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block font-semibold text-[#475569] text-[11px] mb-1">
                  Minimum Volume (ปริมาตรขั้นต่ำ)
                </label>
                <input
                  type="text"
                  value={minVolume}
                  onChange={(e) => setMinVolume(e.target.value)}
                  placeholder="e.g. 3.0 mL whole blood (yield ≥ 1.0 mL serum)"
                  className="w-full bg-white border border-[#CBD5E1] rounded-xl px-3 py-1.5 text-xs text-[#0F172A]"
                />
              </div>
              <div>
                <label className="block font-semibold text-[#475569] text-[11px] mb-1">
                  Tube Accent Color Pill
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={tubeColorHex}
                    onChange={(e) => setTubeColorHex(e.target.value)}
                    className="w-8 h-8 rounded-lg cursor-pointer border border-slate-300"
                  />
                  <span className="text-[11px] text-slate-500 font-mono">{tubeColorHex}</span>
                  <div
                    className="px-2 py-0.5 rounded-full text-[10px] text-white font-bold"
                    style={{ backgroundColor: tubeColorHex }}
                  >
                    Color Preview
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Row 5: TAT & Schedules */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-bold text-[#475569] uppercase tracking-wider text-[11px] mb-1">
                Turnaround Time (TAT) *
              </label>
              <input
                type="text"
                required
                value={tatWorkingDays}
                onChange={(e) => setTatWorkingDays(e.target.value)}
                placeholder="e.g. 3 - 5 working days"
                className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl px-3 py-2 text-[#0F172A]"
              />
            </div>
            <div>
              <label className="block font-bold text-[#475569] uppercase tracking-wider text-[11px] mb-1">
                Testing Run Schedule
              </label>
              <input
                type="text"
                value={testingSchedule}
                onChange={(e) => setTestingSchedule(e.target.value)}
                placeholder="e.g. Daily, Runs every Tuesday"
                className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl px-3 py-2 text-[#0F172A]"
              />
            </div>
            <div>
              <label className="block font-bold text-[#475569] uppercase tracking-wider text-[11px] mb-1">
                Courier Cutoff Time
              </label>
              <input
                type="text"
                value={courierCutoff}
                onChange={(e) => setCourierCutoff(e.target.value)}
                placeholder="e.g. 11:00 AM & 15:00 PM"
                className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl px-3 py-2 text-[#0F172A]"
              />
            </div>
          </div>

          {/* Row 6: Centrifugation & Special Instructions */}
          <div>
            <label className="block font-bold text-[#475569] uppercase tracking-wider text-[11px] mb-1">
              Specimen Preparation & Centrifugation Instructions (คำแนะนำการเตรียมตัวอย่าง) *
            </label>
            <textarea
              rows={2}
              required
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder="e.g. Allow blood to clot 30 min. Centrifuge at 3,000 RPM for 10 min. Transfer serum to sterile vial, freeze at -20°C immediately. Avoid hemolysis."
              className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl p-3 text-xs text-[#0F172A] focus:outline-none focus:border-[#1E40AF]"
            />
          </div>

          {/* Row 7: Clinical Significance & Costs */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-1">
              <label className="block font-bold text-[#475569] uppercase tracking-wider text-[11px] mb-1">
                Testing Methodology
              </label>
              <input
                type="text"
                value={methodology}
                onChange={(e) => setMethodology(e.target.value)}
                placeholder="e.g. Real-time PCR / ELISA / ICP-MS"
                className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl px-3 py-2 text-[#0F172A]"
              />
            </div>
            <div>
              <label className="block font-bold text-[#475569] uppercase tracking-wider text-[11px] mb-1">
                Lab Cost (฿ ทุน)
              </label>
              <input
                type="number"
                value={costTHB}
                onChange={(e) => setCostTHB(e.target.value ? Number(e.target.value) : '')}
                placeholder="e.g. 1800"
                className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl px-3 py-2 text-[#0F172A]"
              />
            </div>
            <div>
              <label className="block font-bold text-[#475569] uppercase tracking-wider text-[11px] mb-1">
                Hospital Price (฿ ราคาขาย)
              </label>
              <input
                type="number"
                value={priceTHB}
                onChange={(e) => setPriceTHB(e.target.value ? Number(e.target.value) : '')}
                placeholder="e.g. 2600"
                className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl px-3 py-2 text-[#0F172A]"
              />
            </div>
          </div>
        </form>

        {/* Modal Footer */}
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
            className="px-6 py-2.5 rounded-full bg-[#1E40AF] hover:bg-[#1D4ED8] text-white text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shadow-xs active:scale-95"
          >
            {editingTest ? 'Update Protocol' : 'Save Outlab Test'}
          </button>
        </div>
      </div>
    </div>
  );
};
