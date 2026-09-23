import React, { useState } from 'react';
import { EQASchemeDefinition, EQATrial } from '../../types';
import { STANDARD_EQA_SCHEMES, SCHEME_PALETTE_OPTIONS, getAllSchemes } from '../../data/standardSchemes';

interface ManageSchemesModalProps {
  isOpen: boolean;
  onClose: () => void;
  customSchemes: EQASchemeDefinition[];
  deletedSchemeCodes?: string[];
  onAddCustomScheme: (scheme: EQASchemeDefinition) => void;
  onUpdateCustomScheme: (scheme: EQASchemeDefinition) => void;
  onDeleteCustomScheme: (schemeId: string) => void;
  onDeleteScheme?: (scheme: EQASchemeDefinition) => void;
  onRestoreDefaultSchemes?: () => void;
  trials?: EQATrial[];
  onSelectSchemeForTrial?: (schemeCode: string) => void;
}

export const ManageSchemesModal: React.FC<ManageSchemesModalProps> = ({
  isOpen,
  onClose,
  customSchemes,
  deletedSchemeCodes = [],
  onAddCustomScheme,
  onUpdateCustomScheme,
  onDeleteCustomScheme,
  onDeleteScheme,
  onRestoreDefaultSchemes,
  trials = [],
  onSelectSchemeForTrial
}) => {
  const [activeTab, setActiveTab] = useState<'directory' | 'add'>('directory');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [schemeToDelete, setSchemeToDelete] = useState<EQASchemeDefinition | null>(null);

  // Form states for creating / editing
  const [editingSchemeId, setEditingSchemeId] = useState<string | null>(null);
  const [code, setCode] = useState('');
  const [shortName, setShortName] = useState('');
  const [fullName, setFullName] = useState('');
  const [provider, setProvider] = useState('');
  const [country, setCountry] = useState('Thailand');
  const [category, setCategory] = useState<'Global / International' | 'National / Regional' | 'Specialty' | 'Custom'>('National / Regional');
  const [description, setDescription] = useState('');
  const [portalUrl, setPortalUrl] = useState('');
  const [accreditation, setAccreditation] = useState('ISO/IEC 17043 Accredited');
  const [selectedPalette, setSelectedPalette] = useState(SCHEME_PALETTE_OPTIONS[3]); // default emerald

  if (!isOpen) return null;

  const allSchemes = getAllSchemes(customSchemes, deletedSchemeCodes);

  const filteredSchemes = allSchemes.filter((sc) => {
    const matchesSearch =
      sc.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sc.shortName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sc.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sc.provider.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sc.country.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      categoryFilter === 'ALL' ||
      (categoryFilter === 'CUSTOM' && sc.isCustom) ||
      sc.category === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  const resetForm = () => {
    setEditingSchemeId(null);
    setCode('');
    setShortName('');
    setFullName('');
    setProvider('');
    setCountry('Thailand');
    setCategory('National / Regional');
    setDescription('');
    setPortalUrl('');
    setAccreditation('ISO/IEC 17043 Accredited');
    setSelectedPalette(SCHEME_PALETTE_OPTIONS[3]);
  };

  const startEdit = (sc: EQASchemeDefinition) => {
    setEditingSchemeId(sc.id);
    setCode(sc.code);
    setShortName(sc.shortName);
    setFullName(sc.fullName);
    setProvider(sc.provider);
    setCountry(sc.country);
    setCategory(sc.category || 'Custom');
    setDescription(sc.description || '');
    setPortalUrl(sc.portalUrl || '');
    setAccreditation(sc.accreditation || '');
    const foundPalette = SCHEME_PALETTE_OPTIONS.find((p) => p.bg === sc.badgeBg) || SCHEME_PALETTE_OPTIONS[0];
    setSelectedPalette(foundPalette);
    setActiveTab('add');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCode = code.trim().toUpperCase().replace(/\s+/g, '_');
    if (!cleanCode || !fullName.trim()) return;

    const schemeData: EQASchemeDefinition = {
      id: editingSchemeId || `custom-scheme-${Date.now()}`,
      code: cleanCode,
      shortName: shortName.trim() || cleanCode,
      fullName: fullName.trim(),
      provider: provider.trim() || 'Internal Lab QA',
      country: country.trim() || 'Thailand',
      category: category || 'Custom',
      description: description.trim() || undefined,
      portalUrl: portalUrl.trim() || undefined,
      accreditation: accreditation.trim() || undefined,
      badgeBg: selectedPalette.bg,
      badgeText: selectedPalette.text,
      isCustom: true
    };

    if (editingSchemeId) {
      onUpdateCustomScheme(schemeData);
    } else {
      onAddCustomScheme(schemeData);
    }

    resetForm();
    setActiveTab('directory');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl border border-[#CBD5E1] overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#E2E8F0] bg-[#F8FAFC] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#1E40AF] text-white flex items-center justify-center shadow-xs">
              <span className="material-symbols-outlined text-[22px]">verified</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-['Noto_Serif',serif] font-bold text-lg sm:text-xl text-[#0F172A]">
                  Proficiency Testing Schemes
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#EFF6FF] text-[#1E40AF] border border-[#BFDBFE]">
                  {allSchemes.length} Schemes Available
                </span>
              </div>
              <p className="text-xs text-[#64748B]">
                External Quality Assessment (EQA) providers, ISO/IEC 17043 portals, and custom hospital programs
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-[#94A3B8] hover:text-[#0F172A] p-1.5 rounded-full hover:bg-[#F1F5F9] transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <span className="material-symbols-outlined text-[22px]">close</span>
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="px-6 pt-3 pb-2 border-b border-[#E2E8F0] flex items-center justify-between bg-white shrink-0">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setActiveTab('directory');
                resetForm();
              }}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'directory'
                  ? 'bg-[#0F172A] text-white shadow-xs'
                  : 'bg-[#F1F5F9] text-[#64748B] hover:bg-[#E2E8F0] hover:text-[#0F172A]'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">list_alt</span>
              <span>All Schemes ({allSchemes.length})</span>
            </button>

            <button
              type="button"
              onClick={() => {
                resetForm();
                setActiveTab('add');
              }}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'add'
                  ? 'bg-[#1E40AF] text-white shadow-xs'
                  : 'bg-[#F1F5F9] text-[#64748B] hover:bg-[#E2E8F0] hover:text-[#0F172A]'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">add_circle</span>
              <span>{editingSchemeId ? 'Edit Scheme' : 'Register Custom Scheme'}</span>
            </button>
          </div>

          {customSchemes.length > 0 && (
            <span className="text-xs text-[#059669] font-semibold bg-[#ECFDF5] px-3 py-1 rounded-full border border-[#A7F3D0]">
              {customSchemes.length} Custom Added
            </span>
          )}
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-[#FDFCFB]">
          {activeTab === 'directory' ? (
            <div className="space-y-4">
              {/* Search & Category Filter */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <div className="relative flex-1">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8] text-[18px]">
                    search
                  </span>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search schemes, providers, country, or code..."
                    className="w-full pl-9 pr-4 py-2 bg-white border border-[#CBD5E1] rounded-2xl text-xs sm:text-sm text-[#0F172A] placeholder-[#94A3B8] focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 outline-none"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#0F172A] text-xs"
                    >
                      Clear
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar shrink-0">
                  {[
                    { id: 'ALL', label: 'All Schemes' },
                    { id: 'Global / International', label: 'Global' },
                    { id: 'National / Regional', label: 'National' },
                    { id: 'Specialty', label: 'Specialty' },
                    { id: 'CUSTOM', label: 'Custom' }
                  ].map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setCategoryFilter(cat.id)}
                      className={`text-[11px] font-bold px-3 py-1.5 rounded-full whitespace-nowrap transition-colors cursor-pointer ${
                        categoryFilter === cat.id
                          ? 'bg-[#1E40AF] text-white'
                          : 'bg-[#F1F5F9] text-[#64748B] hover:bg-[#E2E8F0]'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Restore Standard Schemes Banner if any deleted */}
              {deletedSchemeCodes.length > 0 && (
                <div className="flex items-center justify-between p-3 px-4 bg-amber-50/80 border border-amber-200 rounded-2xl text-xs animate-in fade-in">
                  <div className="flex items-center gap-2 text-amber-900">
                    <span className="material-symbols-outlined text-amber-600 text-[18px]">visibility_off</span>
                    <span>
                      <strong>{deletedSchemeCodes.length}</strong> scheme{deletedSchemeCodes.length > 1 ? 's' : ''} removed / hidden from active catalog
                    </span>
                  </div>
                  {onRestoreDefaultSchemes && (
                    <button
                      type="button"
                      onClick={onRestoreDefaultSchemes}
                      className="px-3 py-1.5 bg-white hover:bg-amber-100 text-amber-900 font-bold rounded-full border border-amber-300 shadow-2xs transition-colors flex items-center gap-1.5 cursor-pointer text-[11px]"
                    >
                      <span className="material-symbols-outlined text-[14px]">undo</span>
                      <span>Restore Default Schemes</span>
                    </button>
                  )}
                </div>
              )}

              {/* Grid of Schemes */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                {filteredSchemes.map((sc) => (
                  <div
                    key={sc.id}
                    className={`bg-white rounded-2xl p-4 sm:p-5 border transition-all duration-200 flex flex-col justify-between ${
                      sc.isCustom
                        ? 'border-emerald-300 shadow-xs ring-1 ring-emerald-200'
                        : 'border-[#E2E8F0] hover:border-[#CBD5E1] hover:shadow-xs'
                    }`}
                  >
                    <div>
                      {/* Top Badges */}
                      <div className="flex items-start justify-between gap-2 mb-2.5">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-black tracking-wider ${sc.badgeBg} ${sc.badgeText}`}>
                            {sc.shortName}
                          </span>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-[#64748B] bg-[#F1F5F9] px-2 py-0.5 rounded-full">
                            {sc.country}
                          </span>
                          {sc.isCustom && (
                            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                              Custom Lab Scheme
                            </span>
                          )}
                        </div>

                        {/* Action buttons (Edit for custom, Delete for all) */}
                        <div className="flex items-center gap-1 shrink-0">
                          {sc.isCustom && (
                            <button
                              type="button"
                              onClick={() => startEdit(sc)}
                              className="text-[#64748B] hover:text-[#1E40AF] p-1.5 rounded-lg hover:bg-[#F1F5F9] cursor-pointer transition-colors"
                              title="Edit Scheme"
                            >
                              <span className="material-symbols-outlined text-[16px]">edit</span>
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => setSchemeToDelete(sc)}
                            className="text-[#94A3B8] hover:text-[#DC2626] p-1.5 rounded-lg hover:bg-red-50 cursor-pointer transition-colors"
                            title={sc.isCustom ? 'Delete custom scheme' : 'Delete / remove scheme from active catalog'}
                            aria-label={`Delete ${sc.shortName}`}
                          >
                            <span className="material-symbols-outlined text-[16px]">delete</span>
                          </button>
                        </div>
                      </div>

                      {/* Title & Provider */}
                      <h3 className="font-bold text-sm text-[#0F172A] leading-snug mb-1">
                        {sc.fullName}
                      </h3>
                      <p className="text-xs text-[#64748B] flex items-center gap-1 mb-2">
                        <span className="material-symbols-outlined text-[14px] text-[#94A3B8]">apartment</span>
                        <span>{sc.provider}</span>
                      </p>

                      {/* Description */}
                      {sc.description && (
                        <p className="text-xs text-[#475569] leading-relaxed mb-3 line-clamp-2">
                          {sc.description}
                        </p>
                      )}

                      {/* Accreditation */}
                      {sc.accreditation && (
                        <div className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#0369A1] bg-[#F0F9FF] px-2.5 py-0.5 rounded-md mb-3 border border-[#BAE6FD]">
                          <span className="material-symbols-outlined text-[13px]">award_star</span>
                          <span>{sc.accreditation}</span>
                        </div>
                      )}
                    </div>

                    {/* Bottom Actions */}
                    <div className="flex items-center justify-between pt-3 border-t border-[#F1F5F9] mt-2 gap-2">
                      {sc.portalUrl ? (
                        <a
                          href={sc.portalUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs font-bold text-[#1E40AF] hover:text-[#1D4ED8] hover:underline"
                        >
                          <span className="material-symbols-outlined text-[14px]">open_in_new</span>
                          <span>Submission Portal</span>
                        </a>
                      ) : (
                        <span className="text-[11px] text-[#94A3B8] italic">Direct lab submission</span>
                      )}

                      {onSelectSchemeForTrial && (
                        <button
                          type="button"
                          onClick={() => {
                            onSelectSchemeForTrial(sc.code);
                            onClose();
                          }}
                          className="text-xs font-bold px-3 py-1.5 rounded-full bg-[#F1F5F9] hover:bg-[#1E40AF] hover:text-white text-[#0F172A] transition-colors cursor-pointer flex items-center gap-1"
                        >
                          <span className="material-symbols-outlined text-[14px]">add</span>
                          <span>New Trial</span>
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {filteredSchemes.length === 0 && (
                <div className="text-center py-12 bg-white rounded-3xl border border-dashed border-[#CBD5E1] p-8">
                  <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
                    <span className="material-symbols-outlined text-[24px]">search_off</span>
                  </div>
                  <h4 className="font-bold text-sm text-[#0F172A] mb-1">No schemes matching your filter</h4>
                  <p className="text-xs text-[#64748B] mb-4">
                    Try another keyword or register a new custom proficiency testing program.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      resetForm();
                      setActiveTab('add');
                    }}
                    className="px-4 py-2 bg-[#1E40AF] text-white rounded-full text-xs font-bold cursor-pointer inline-flex items-center gap-1.5"
                  >
                    <span className="material-symbols-outlined text-[16px]">add</span>
                    <span>Register Custom Scheme</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* Add / Edit Form */
            <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-4 bg-white p-6 rounded-3xl border border-[#E2E8F0] shadow-xs">
              <div className="border-b border-[#E2E8F0] pb-3 mb-2 flex items-center justify-between">
                <div>
                  <h3 className="font-['Noto_Serif',serif] font-bold text-base text-[#0F172A]">
                    {editingSchemeId ? 'Edit Custom EQA Scheme' : 'Register New EQA Scheme / Provider'}
                  </h3>
                  <p className="text-xs text-[#64748B]">
                    Add any national, regional, hospital network, or private proficiency testing scheme
                  </p>
                </div>
                {editingSchemeId && (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="text-xs text-[#DC2626] font-bold hover:underline"
                  >
                    Cancel Editing
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#64748B] mb-1">
                    Scheme Code / Acronym *
                  </label>
                  <input
                    type="text"
                    required
                    value={code}
                    onChange={(e) => {
                      setCode(e.target.value.toUpperCase());
                      if (!shortName) setShortName(e.target.value.toUpperCase());
                    }}
                    placeholder="e.g., TH_NEQAS or MOPH_EQA"
                    className="w-full px-3.5 py-2 text-sm bg-[#F8FAFC] border border-[#CBD5E1] focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 focus:bg-white rounded-2xl outline-none font-mono font-bold"
                  />
                  <p className="text-[11px] text-[#94A3B8] mt-1">Short identifier used on trial cards and filters</p>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#64748B] mb-1">
                    Display Short Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={shortName}
                    onChange={(e) => setShortName(e.target.value)}
                    placeholder="e.g., MOPH EQA or Thai NEQAS"
                    className="w-full px-3.5 py-2 text-sm bg-[#F8FAFC] border border-[#CBD5E1] focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 focus:bg-white rounded-2xl outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#64748B] mb-1">
                  Full Scheme / Program Name *
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g., Thai National External Quality Assessment Scheme in Clinical Chemistry"
                  className="w-full px-3.5 py-2 text-sm bg-[#F8FAFC] border border-[#CBD5E1] focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 focus:bg-white rounded-2xl outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#64748B] mb-1">
                    Provider Organization *
                  </label>
                  <input
                    type="text"
                    required
                    value={provider}
                    onChange={(e) => setProvider(e.target.value)}
                    placeholder="e.g., Department of Medical Sciences, MOPH"
                    className="w-full px-3.5 py-2 text-sm bg-[#F8FAFC] border border-[#CBD5E1] focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 focus:bg-white rounded-2xl outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#64748B] mb-1">
                    Country / Jurisdiction
                  </label>
                  <input
                    type="text"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    placeholder="e.g., Thailand or International"
                    className="w-full px-3.5 py-2 text-sm bg-[#F8FAFC] border border-[#CBD5E1] focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 focus:bg-white rounded-2xl outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#64748B] mb-1">
                    Category Scope
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full px-3.5 py-2 text-sm bg-[#F8FAFC] border border-[#CBD5E1] focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 focus:bg-white rounded-2xl outline-none"
                  >
                    <option value="National / Regional">National / Regional EQA</option>
                    <option value="Global / International">Global / International</option>
                    <option value="Specialty">Specialty / Subspecialty</option>
                    <option value="Custom">Hospital Network / Internal</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#64748B] mb-1">
                    Accreditation / Quality Standard
                  </label>
                  <input
                    type="text"
                    value={accreditation}
                    onChange={(e) => setAccreditation(e.target.value)}
                    placeholder="e.g., ISO/IEC 17043 or National Standard"
                    className="w-full px-3.5 py-2 text-sm bg-[#F8FAFC] border border-[#CBD5E1] focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 focus:bg-white rounded-2xl outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#64748B] mb-1">
                  Submission Portal URL (Optional)
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8] text-[18px]">
                    link
                  </span>
                  <input
                    type="url"
                    value={portalUrl}
                    onChange={(e) => setPortalUrl(e.target.value)}
                    placeholder="https://eqas-portal.example.com"
                    className="w-full pl-9 pr-3.5 py-2 text-sm bg-[#F8FAFC] border border-[#CBD5E1] focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 focus:bg-white rounded-2xl outline-none font-mono text-xs"
                  />
                </div>
              </div>

              {/* Theme Color Picker */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#64748B] mb-2">
                  Badge Theme Color
                </label>
                <div className="flex flex-wrap gap-2">
                  {SCHEME_PALETTE_OPTIONS.map((pal) => (
                    <button
                      key={pal.id}
                      type="button"
                      onClick={() => setSelectedPalette(pal)}
                      className={`px-3 py-1.5 rounded-full text-xs font-bold cursor-pointer transition-all flex items-center gap-1.5 ${pal.bg} ${pal.text} ${
                        selectedPalette.id === pal.id ? 'ring-2 ring-offset-2 ring-[#0F172A] scale-105' : 'opacity-85 hover:opacity-100'
                      }`}
                    >
                      {selectedPalette.id === pal.id && (
                        <span className="material-symbols-outlined text-[13px]">check</span>
                      )}
                      <span>{pal.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#64748B] mb-1">
                  Description & Testing Scope (Optional)
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g., Monthly survey for hematology CBC parameters, white blood cell differentials, and reticulocyte counts..."
                  className="w-full px-3.5 py-2 text-sm bg-[#F8FAFC] border border-[#CBD5E1] focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 focus:bg-white rounded-2xl outline-none resize-none"
                />
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#E2E8F0]">
                <button
                  type="button"
                  onClick={() => {
                    resetForm();
                    setActiveTab('directory');
                  }}
                  className="px-5 py-2 text-xs font-bold text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9] rounded-full transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#1E40AF] hover:bg-[#1D4ED8] text-white rounded-full text-xs font-bold shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-[16px]">save</span>
                  <span>{editingSchemeId ? 'Save Changes' : 'Register Scheme'}</span>
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Delete Scheme Confirmation Dialog */}
        {schemeToDelete && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
            <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl border border-red-200 animate-in zoom-in-95 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center shadow-xs">
                <span className="material-symbols-outlined text-[26px]">delete_forever</span>
              </div>
              <div>
                <h3 className="font-['Noto_Serif',serif] font-bold text-lg text-[#0F172A]">
                  Delete Scheme from Catalog?
                </h3>
                <div className="flex items-center gap-2.5 mt-2.5 p-3 bg-[#F8FAFC] rounded-2xl border border-[#E2E8F0]">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-black tracking-wider shrink-0 ${schemeToDelete.badgeBg} ${schemeToDelete.badgeText}`}>
                    {schemeToDelete.shortName}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-xs text-[#0F172A] truncate">{schemeToDelete.fullName}</p>
                    <p className="text-[11px] text-[#64748B]">{schemeToDelete.provider} • {schemeToDelete.country}</p>
                  </div>
                </div>
              </div>

              {/* Active Trials Warning */}
              {(() => {
                const linkedCount = trials.filter(
                  (t) =>
                    t.scheme.toUpperCase() === schemeToDelete.code.toUpperCase() ||
                    t.scheme.toUpperCase() === schemeToDelete.shortName.toUpperCase()
                ).length;
                if (linkedCount > 0) {
                  return (
                    <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-2 text-xs text-amber-900">
                      <span className="material-symbols-outlined text-amber-600 text-[18px] shrink-0 mt-0.5">warning</span>
                      <div>
                        <strong className="block font-bold">Associated Active Trials ({linkedCount})</strong>
                        <span>Existing lab records tagged with this scheme will remain preserved with their current survey code.</span>
                      </div>
                    </div>
                  );
                }
                return null;
              })()}

              <p className="text-xs text-[#64748B] leading-relaxed">
                {schemeToDelete.isCustom
                  ? 'This custom proficiency scheme will be permanently removed from your laboratory system.'
                  : 'This standard scheme will be removed from your active catalog and survey creation options. You can restore it anytime with "Restore Default Schemes".'}
              </p>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[#E2E8F0]">
                <button
                  type="button"
                  onClick={() => setSchemeToDelete(null)}
                  className="px-4 py-2 rounded-full border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (onDeleteScheme) {
                      onDeleteScheme(schemeToDelete);
                    } else {
                      onDeleteCustomScheme(schemeToDelete.id);
                    }
                    setSchemeToDelete(null);
                  }}
                  className="px-5 py-2 rounded-full bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-xs cursor-pointer flex items-center gap-1.5 transition-colors"
                >
                  <span className="material-symbols-outlined text-[16px]">delete</span>
                  <span>Yes, Delete Scheme</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
