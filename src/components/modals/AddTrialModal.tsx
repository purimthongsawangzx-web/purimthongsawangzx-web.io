import React, { useState } from 'react';
import { EQATrial, EQAScheme, EQASchemeDefinition } from '../../types';
import { getAllSchemes, getSchemeInfo, SCHEME_PALETTE_OPTIONS } from '../../data/standardSchemes';

interface AddTrialModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (trial: Partial<EQATrial>) => void;
  customSchemes?: EQASchemeDefinition[];
  deletedSchemeCodes?: string[];
  onOpenManageSchemes?: () => void;
  onAddCustomScheme?: (scheme: EQASchemeDefinition) => void;
}

export const AddTrialModal: React.FC<AddTrialModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  customSchemes = [],
  deletedSchemeCodes = [],
  onOpenManageSchemes,
  onAddCustomScheme
}) => {
  const allSchemes = getAllSchemes(customSchemes, deletedSchemeCodes);
  const defaultSchemeCode = (allSchemes.length > 0 ? allSchemes[0].code : 'RIQAS') as EQAScheme;

  const [scheme, setScheme] = useState<EQAScheme>(defaultSchemeCode);
  const [title, setTitle] = useState('');
  const [cycle, setCycle] = useState('Cycle 2026-T1');
  const [trialNumber, setTrialNumber] = useState('Trial 01');
  const [receivedDate, setReceivedDate] = useState('Today');
  const [deadlineDate, setDeadlineDate] = useState('');
  const [instrument, setInstrument] = useState('Cobas 8000');
  const [assignedStaff, setAssignedStaff] = useState('Dr. Jane Doe, MT');
  const [labSection, setLabSection] = useState('Core Lab');
  const [parametersText, setParametersText] = useState('Glucose, BUN, Creatinine, Electrolytes');

  // Quick inline custom scheme creation
  const [showQuickAddScheme, setShowQuickAddScheme] = useState(false);
  const [newSchemeCode, setNewSchemeCode] = useState('');
  const [newSchemeName, setNewSchemeName] = useState('');
  const [newSchemeProvider, setNewSchemeProvider] = useState('');
  const [newSchemeCountry, setNewSchemeCountry] = useState('Thailand');
  const [newSchemeColor, setNewSchemeColor] = useState(SCHEME_PALETTE_OPTIONS[3]); // emerald

  if (!isOpen) return null;

  const selectedSchemeInfo = getSchemeInfo(scheme, customSchemes);

  const handleQuickCreateScheme = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCode = newSchemeCode.trim().toUpperCase().replace(/\s+/g, '_');
    if (!cleanCode || !newSchemeName.trim()) return;

    const newDef: EQASchemeDefinition = {
      id: `custom-scheme-${Date.now()}`,
      code: cleanCode,
      shortName: cleanCode,
      fullName: newSchemeName.trim(),
      provider: newSchemeProvider.trim() || 'Laboratory Quality Assurance',
      country: newSchemeCountry.trim() || 'Thailand',
      category: 'Custom',
      badgeBg: newSchemeColor.bg,
      badgeText: newSchemeColor.text,
      isCustom: true
    };

    if (onAddCustomScheme) {
      onAddCustomScheme(newDef);
    }

    setScheme(cleanCode as EQAScheme);
    setShowQuickAddScheme(false);
    setNewSchemeCode('');
    setNewSchemeName('');
    setNewSchemeProvider('');
  };

  const handleSchemeChange = (newCode: string) => {
    setScheme(newCode as EQAScheme);
    const info = getSchemeInfo(newCode, customSchemes);
    // Intelligent presets based on scheme
    if (newCode === 'DMSC_BLQS') {
      if (!title) setTitle('EQAC Clinical Chemistry (กรมวิทย์ฯ)');
      setLabSection('Core Lab');
      setInstrument('Cobas 8000 c702');
      setCycle('Cycle 2026-T2');
    } else if (newCode === 'EQAM_MAHIDOL') {
      if (!title) setTitle('EQAM Clinical Microscopy & Parasitology (ม.มหิดล)');
      setLabSection('Microscopy Lab');
      setInstrument('Olympus BX53');
      setParametersText('Protozoa Identification, Helminth Ova, Occult Blood');
      setCycle('Cycle 2026-1');
    } else if (newCode === 'UKNEQAS') {
      if (!title) setTitle('UK NEQAS Blood Coagulation & Hemostasis');
      setLabSection('Hemostasis Lab');
      setInstrument('ACL Top 550');
      setParametersText('PT/INR, APTT, Fibrinogen');
    } else if (newCode === 'EQAS') {
      if (!title) setTitle('EQAS Immunoassay Monthly Program');
      setLabSection('Immunology');
      setParametersText('TSH, Free T4, Ferritin, Troponin I');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const params = parametersText
      .split(',')
      .map((p) => p.trim())
      .filter(Boolean);

    onSubmit({
      scheme,
      title: title.trim(),
      cycle: cycle.trim(),
      trialNumber: trialNumber.trim(),
      receivedDate: receivedDate.trim(),
      deadlineDate: deadlineDate.trim() || 'Nov 30, 2026',
      instrument: instrument.trim(),
      assignedStaff: assignedStaff.trim(),
      labSection: labSection.trim(),
      parameters: params
    });

    onClose();
  };

  // Group schemes by category
  const customList = allSchemes.filter((s) => s.isCustom);
  const nationalList = allSchemes.filter((s) => s.category === 'National / Regional');
  const globalList = allSchemes.filter((s) => s.category === 'Global / International');
  const specialtyList = allSchemes.filter((s) => s.category === 'Specialty');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl border border-[#CBD5E1] overflow-hidden animate-in zoom-in-95 duration-150 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E2E8F0] bg-[#F8FAFC] shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-[#1E40AF] text-white flex items-center justify-center shadow-xs">
              <span className="material-symbols-outlined text-[20px]">science</span>
            </div>
            <div>
              <h2 className="font-['Noto_Serif',serif] font-bold text-lg text-[#0F172A]">
                Register New EQA Trial
              </h2>
              <p className="text-xs text-[#64748B]">Proficiency assessment survey & round tracking</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-[#94A3B8] hover:text-[#0F172A] p-1.5 rounded-full hover:bg-[#F1F5F9] transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Quick Add Custom Scheme Panel (Inline) */}
        {showQuickAddScheme && (
          <div className="bg-amber-50/80 border-b border-amber-200 p-4 animate-in slide-in-from-top duration-150 shrink-0">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px]">add_circle</span>
                Quick-Register Custom EQA Scheme
              </span>
              <button
                type="button"
                onClick={() => setShowQuickAddScheme(false)}
                className="text-amber-700 hover:text-amber-900 text-xs font-bold"
              >
                Cancel
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-2">
              <div>
                <input
                  type="text"
                  required
                  placeholder="Code (e.g. TH_NEQAS)"
                  value={newSchemeCode}
                  onChange={(e) => setNewSchemeCode(e.target.value.toUpperCase())}
                  className="w-full px-2.5 py-1.5 text-xs bg-white border border-amber-300 rounded-xl outline-none font-mono font-bold"
                />
              </div>
              <div className="sm:col-span-2">
                <input
                  type="text"
                  required
                  placeholder="Full Scheme Name"
                  value={newSchemeName}
                  onChange={(e) => setNewSchemeName(e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs bg-white border border-amber-300 rounded-xl outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-2">
              <input
                type="text"
                placeholder="Provider (e.g. MOPH / Regional Lab)"
                value={newSchemeProvider}
                onChange={(e) => setNewSchemeProvider(e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs bg-white border border-amber-300 rounded-xl outline-none"
              />
              <input
                type="text"
                placeholder="Country (e.g. Thailand)"
                value={newSchemeCountry}
                onChange={(e) => setNewSchemeCountry(e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs bg-white border border-amber-300 rounded-xl outline-none"
              />
            </div>

            <div className="flex items-center justify-between gap-2 pt-1">
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-bold text-amber-800">Badge:</span>
                {SCHEME_PALETTE_OPTIONS.slice(0, 5).map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setNewSchemeColor(p)}
                    className={`w-5 h-5 rounded-full ${p.bg} ${
                      newSchemeColor.id === p.id ? 'ring-2 ring-offset-1 ring-amber-800' : 'opacity-70'
                    }`}
                  />
                ))}
              </div>

              <button
                type="button"
                onClick={handleQuickCreateScheme}
                disabled={!newSchemeCode.trim() || !newSchemeName.trim()}
                className="px-3.5 py-1 bg-[#1E40AF] text-white rounded-full text-xs font-bold disabled:opacity-50 cursor-pointer shadow-xs"
              >
                Save & Select Scheme
              </button>
            </div>
          </div>
        )}

        {/* Main Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1">
          {/* Scheme Selection */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#64748B]">
                Proficiency Scheme / Provider *
              </label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowQuickAddScheme(!showQuickAddScheme)}
                  className="text-xs font-bold text-[#1E40AF] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[14px]">add</span>
                  <span>+ Quick Custom Scheme</span>
                </button>
                {onOpenManageSchemes && (
                  <>
                    <span className="text-slate-300">•</span>
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onOpenManageSchemes();
                      }}
                      className="text-xs font-bold text-[#64748B] hover:text-[#0F172A] hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[14px]">settings</span>
                      <span>Manage All</span>
                    </button>
                  </>
                )}
              </div>
            </div>

            <select
              value={scheme}
              onChange={(e) => handleSchemeChange(e.target.value)}
              className="w-full px-4 py-2.5 text-sm bg-[#F1F5F9] border border-[#CBD5E1] focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 focus:bg-white rounded-2xl outline-none text-[#0F172A] font-medium"
            >
              {customList.length > 0 && (
                <optgroup label="⭐ Registered Custom Lab Schemes">
                  {customList.map((s) => (
                    <option key={s.id} value={s.code}>
                      {s.shortName} — {s.fullName} ({s.country})
                    </option>
                  ))}
                </optgroup>
              )}

              <optgroup label="🇹🇭 Thai National & Regional Programs">
                {nationalList.map((s) => (
                  <option key={s.id} value={s.code}>
                    {s.shortName} — {s.fullName}
                  </option>
                ))}
              </optgroup>

              <optgroup label="🌐 Global & International Accredited Schemes">
                {globalList.map((s) => (
                  <option key={s.id} value={s.code}>
                    {s.shortName} — {s.fullName} ({s.country})
                  </option>
                ))}
              </optgroup>

              <optgroup label="🔬 Specialty Subspecialty Schemes">
                {specialtyList.map((s) => (
                  <option key={s.id} value={s.code}>
                    {s.shortName} — {s.fullName} ({s.country})
                  </option>
                ))}
              </optgroup>
            </select>

            {/* Scheme Details Banner */}
            {selectedSchemeInfo && (
              <div className="mt-2.5 p-3 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${selectedSchemeInfo.badgeBg} ${selectedSchemeInfo.badgeText} shrink-0`}>
                    {selectedSchemeInfo.shortName}
                  </span>
                  <div className="truncate">
                    <p className="text-xs font-bold text-[#0F172A] truncate">
                      {selectedSchemeInfo.fullName}
                    </p>
                    <p className="text-[11px] text-[#64748B] truncate">
                      {selectedSchemeInfo.provider} • {selectedSchemeInfo.country}
                      {selectedSchemeInfo.accreditation ? ` • ${selectedSchemeInfo.accreditation}` : ''}
                    </p>
                  </div>
                </div>

                {selectedSchemeInfo.portalUrl && (
                  <a
                    href={selectedSchemeInfo.portalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] font-bold text-[#1E40AF] hover:underline flex items-center gap-1 shrink-0 bg-blue-50 px-2 py-1 rounded-lg border border-blue-100"
                  >
                    <span>Portal</span>
                    <span className="material-symbols-outlined text-[13px]">open_in_new</span>
                  </a>
                )}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#64748B] mb-1">
                Survey / Program Title *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Immunoassay Hormones & Cardiac"
                className="w-full px-4 py-2.5 text-sm bg-[#F1F5F9] border border-[#CBD5E1] focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 focus:bg-white rounded-2xl outline-none text-[#0F172A]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#64748B] mb-1">
                Lab Section
              </label>
              <select
                value={labSection}
                onChange={(e) => setLabSection(e.target.value)}
                className="w-full px-4 py-2.5 text-sm bg-[#F1F5F9] border border-[#CBD5E1] focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 focus:bg-white rounded-2xl outline-none text-[#0F172A]"
              >
                <option value="Core Lab">Core Lab (Clinical Chemistry)</option>
                <option value="Hematology Lab">Hematology Lab</option>
                <option value="Hemostasis Lab">Hemostasis & Coagulation</option>
                <option value="Immunology">Immunology & Serology</option>
                <option value="Microbiology Lab">Microbiology Lab</option>
                <option value="Microscopy Lab">Clinical Microscopy & Parasitology</option>
                <option value="Blood Bank">Blood Bank / Immunohematology</option>
                <option value="Molecular Lab">Molecular Pathology & PCR</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#64748B] mb-1">
                Cycle Identifier
              </label>
              <input
                type="text"
                value={cycle}
                onChange={(e) => setCycle(e.target.value)}
                placeholder="Cycle 2026-T1"
                className="w-full px-4 py-2.5 text-sm bg-[#F1F5F9] border border-[#CBD5E1] focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 focus:bg-white rounded-2xl outline-none text-[#0F172A]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#64748B] mb-1">
                Trial / Sample #
              </label>
              <input
                type="text"
                value={trialNumber}
                onChange={(e) => setTrialNumber(e.target.value)}
                placeholder="Trial 01"
                className="w-full px-4 py-2.5 text-sm bg-[#F1F5F9] border border-[#CBD5E1] focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 focus:bg-white rounded-2xl outline-none text-[#0F172A]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#64748B] mb-1">
                Assigned Instrument
              </label>
              <input
                type="text"
                value={instrument}
                onChange={(e) => setInstrument(e.target.value)}
                placeholder="e.g. Cobas 8000"
                className="w-full px-4 py-2.5 text-sm bg-[#F1F5F9] border border-[#CBD5E1] focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 focus:bg-white rounded-2xl outline-none text-[#0F172A]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#64748B] mb-1">
                Assigned Technologist
              </label>
              <input
                type="text"
                value={assignedStaff}
                onChange={(e) => setAssignedStaff(e.target.value)}
                placeholder="e.g. Dr. Jane Doe, MT"
                className="w-full px-4 py-2.5 text-sm bg-[#F1F5F9] border border-[#CBD5E1] focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 focus:bg-white rounded-2xl outline-none text-[#0F172A]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#64748B] mb-1">
                Received Date
              </label>
              <input
                type="text"
                value={receivedDate}
                onChange={(e) => setReceivedDate(e.target.value)}
                placeholder="Aug 20, 2026"
                className="w-full px-4 py-2.5 text-sm bg-[#F1F5F9] border border-[#CBD5E1] focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 focus:bg-white rounded-2xl outline-none text-[#0F172A]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#64748B] mb-1">
                Submission Deadline
              </label>
              <input
                type="text"
                value={deadlineDate}
                onChange={(e) => setDeadlineDate(e.target.value)}
                placeholder="e.g. Sep 15, 2026"
                className="w-full px-4 py-2.5 text-sm bg-[#F1F5F9] border border-[#CBD5E1] focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 focus:bg-white rounded-2xl outline-none text-[#0F172A]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#64748B] mb-1">
              Parameters / Analytes (comma separated)
            </label>
            <input
              type="text"
              value={parametersText}
              onChange={(e) => setParametersText(e.target.value)}
              placeholder="Glucose, BUN, Creatinine, Electrolytes"
              className="w-full px-4 py-2.5 text-sm bg-[#F1F5F9] border border-[#CBD5E1] focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 focus:bg-white rounded-2xl outline-none text-[#0F172A]"
            />
          </div>

          <div className="pt-4 border-t border-[#E2E8F0] flex items-center justify-end gap-3 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-xs uppercase tracking-widest font-bold text-[#64748B] hover:text-[#0F172A] cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-[#1E40AF] hover:bg-[#1D4ED8] text-white font-['Public_Sans',sans-serif] font-bold text-xs uppercase tracking-widest rounded-full shadow-xs transition-all active:scale-95 cursor-pointer flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[16px]">check</span>
              <span>Register Trial</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
