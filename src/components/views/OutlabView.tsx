import React, { useState, useMemo } from 'react';
import {
  OutlabTest,
  OutlabSendoutOrder,
  ReferralLab,
  OutlabCategory,
  OutlabTransportTemp
} from '../../types';

interface OutlabViewProps {
  tests: OutlabTest[];
  orders: OutlabSendoutOrder[];
  referralLabs: ReferralLab[];
  searchQuery: string;
  onOpenAddTest: () => void;
  onOpenNewOrder: (preselectedTest?: OutlabTest) => void;
  onViewTestDetail: (test: OutlabTest) => void;
  onEditTest: (test: OutlabTest) => void;
  onDeleteTest: (testId: string) => void;
  onUpdateOrderStatus: (orderId: string, status: OutlabSendoutOrder['status'], resultSummary?: string) => void;
  onDeleteOrder: (orderId: string) => void;
}

export const OutlabView: React.FC<OutlabViewProps> = ({
  tests,
  orders,
  referralLabs,
  searchQuery,
  onOpenAddTest,
  onOpenNewOrder,
  onViewTestDetail,
  onEditTest,
  onDeleteTest,
  onUpdateOrderStatus,
  onDeleteOrder
}) => {
  // Sub-navigation tabs inside Outlab view
  const [activeSubTab, setActiveSubTab] = useState<'catalog' | 'tracking' | 'labs' | 'guide'>('catalog');

  // Filter states
  const [localSearch, setLocalSearch] = useState('');
  const [selectedLabFilter, setSelectedLabFilter] = useState<string>('all');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');
  const [selectedTempFilter, setSelectedTempFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');

  // Order tracking filter
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('all');
  const [orderSearch, setOrderSearch] = useState('');

  // Result note modal state inside tracking
  const [editingResultOrder, setEditingResultOrder] = useState<OutlabSendoutOrder | null>(null);
  const [resultSummaryInput, setResultSummaryInput] = useState('');

  // Combine parent header search and local search
  const effectiveSearch = (localSearch || searchQuery).trim().toLowerCase();

  // Filtered Outlab Tests
  const filteredTests = useMemo(() => {
    return tests.filter((t) => {
      // Search matching: name, code, Thai name, aliases, destination lab, specimen, tube
      if (effectiveSearch) {
        const matchesName = t.testName.toLowerCase().includes(effectiveSearch);
        const matchesCode = t.testCode.toLowerCase().includes(effectiveSearch);
        const matchesThai = t.testNameThai?.toLowerCase().includes(effectiveSearch) || false;
        const matchesLab = t.destinationLab.toLowerCase().includes(effectiveSearch);
        const matchesSpecimen = t.specimenType.toLowerCase().includes(effectiveSearch);
        const matchesTube = t.tubeType.toLowerCase().includes(effectiveSearch);
        const matchesAliases = t.aliases?.some((a) => a.toLowerCase().includes(effectiveSearch)) || false;

        if (!matchesName && !matchesCode && !matchesThai && !matchesLab && !matchesSpecimen && !matchesTube && !matchesAliases) {
          return false;
        }
      }

      // Lab filter
      if (selectedLabFilter !== 'all') {
        if (t.destinationLab.toLowerCase() !== selectedLabFilter.toLowerCase()) {
          return false;
        }
      }

      // Category filter
      if (selectedCategoryFilter !== 'all') {
        if (t.category !== selectedCategoryFilter) {
          return false;
        }
      }

      // Temperature filter
      if (selectedTempFilter !== 'all') {
        if (!t.transportTemperature.includes(selectedTempFilter)) {
          return false;
        }
      }

      return true;
    });
  }, [tests, effectiveSearch, selectedLabFilter, selectedCategoryFilter, selectedTempFilter]);

  // Filtered Orders
  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      if (orderStatusFilter !== 'all' && o.status !== orderStatusFilter) {
        return false;
      }
      if (orderSearch.trim()) {
        const term = orderSearch.trim().toLowerCase();
        const matchesHn = o.patientHn.toLowerCase().includes(term);
        const matchesName = o.patientName.toLowerCase().includes(term);
        const matchesTest = o.testName.toLowerCase().includes(term);
        const matchesTracking = o.courierTrackingNo?.toLowerCase().includes(term) || false;
        const matchesLab = o.destinationLab.toLowerCase().includes(term);
        if (!matchesHn && !matchesName && !matchesTest && !matchesTracking && !matchesLab) {
          return false;
        }
      }
      return true;
    });
  }, [orders, orderStatusFilter, orderSearch]);

  // Unique list of destination labs for filter pills
  const availableLabs = useMemo(() => {
    const set = new Set<string>();
    tests.forEach((t) => set.add(t.destinationLab));
    return Array.from(set);
  }, [tests]);

  // Metrics
  const metrics = useMemo(() => {
    const totalTests = tests.length;
    const totalLabs = new Set(tests.map((t) => t.destinationLab)).size;
    const inTransitCount = orders.filter((o) => o.status === 'In Transit' || o.status === 'Pending Pickup' || o.status === 'Processing at Outlab').length;
    const completedCount = orders.filter((o) => o.status === 'Result Received').length;
    return { totalTests, totalLabs, inTransitCount, completedCount };
  }, [tests, orders]);

  const handleSaveResultSummary = () => {
    if (!editingResultOrder) return;
    onUpdateOrderStatus(editingResultOrder.id, 'Result Received', resultSummaryInput.trim());
    setEditingResultOrder(null);
    setResultSummaryInput('');
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 animate-in fade-in duration-200 font-['Public_Sans',sans-serif]">
      {/* Top Hero Banner / Module Header */}
      <div className="bg-gradient-to-r from-[#1E3A8A] via-[#1E40AF] to-[#0284C7] rounded-3xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
        {/* Subtle decorative background circle */}
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-white/5 rounded-full pointer-events-none" />
        <div className="absolute right-28 top-0 w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-[11px] font-bold tracking-widest uppercase text-sky-200">
                Specialized Send-Out Directory
              </span>
              <span className="text-xs text-blue-200">• ศูนย์ข้อมูลส่งตรวจแล็บภายนอก</span>
            </div>
            <h1 className="font-['Noto_Serif',serif] text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Outlab Referral & Send-Out Management
            </h1>
            <p className="text-xs sm:text-sm text-blue-100/90 leading-relaxed">
              Database for clinical tests not performed in-hospital. Search where tests are sent, container requirements, cold-chain transport guidelines, and track dispatched patient specimens.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={() => onOpenNewOrder()}
              className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-white text-[#1E40AF] font-bold text-xs hover:bg-blue-50 transition-all shadow-md active:scale-95 cursor-pointer uppercase tracking-wider"
            >
              <span className="material-symbols-outlined text-[18px]">outbound</span>
              <span>New Send-Out Order</span>
            </button>
            <button
              onClick={onOpenAddTest}
              className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-white/20 hover:bg-white/30 text-white font-bold text-xs backdrop-blur-md transition-all border border-white/30 active:scale-95 cursor-pointer uppercase tracking-wider"
            >
              <span className="material-symbols-outlined text-[18px]">add_circle</span>
              <span>Add Outlab Test</span>
            </button>
          </div>
        </div>

        {/* Quick KPI Counters */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-6 pt-6 border-t border-white/15">
          <div className="bg-white/10 backdrop-blur-xs rounded-2xl p-3.5 border border-white/10">
            <span className="text-[10px] uppercase tracking-wider text-blue-200 font-bold block">
              Outlab Test Catalog
            </span>
            <span className="text-xl sm:text-2xl font-bold text-white font-['Noto_Serif',serif]">
              {metrics.totalTests}
            </span>
            <span className="text-[11px] text-blue-200 block mt-0.5">Specialized assays</span>
          </div>

          <div className="bg-white/10 backdrop-blur-xs rounded-2xl p-3.5 border border-white/10">
            <span className="text-[10px] uppercase tracking-wider text-blue-200 font-bold block">
              Referral Destinations
            </span>
            <span className="text-xl sm:text-2xl font-bold text-white font-['Noto_Serif',serif]">
              {metrics.totalLabs}
            </span>
            <span className="text-[11px] text-blue-200 block mt-0.5">Partner reference labs</span>
          </div>

          <div className="bg-white/10 backdrop-blur-xs rounded-2xl p-3.5 border border-white/10">
            <span className="text-[10px] uppercase tracking-wider text-amber-200 font-bold block">
              Active In Transit / Processing
            </span>
            <span className="text-xl sm:text-2xl font-bold text-amber-300 font-['Noto_Serif',serif]">
              {metrics.inTransitCount}
            </span>
            <span className="text-[11px] text-amber-100 block mt-0.5">Specimens dispatched</span>
          </div>

          <div className="bg-white/10 backdrop-blur-xs rounded-2xl p-3.5 border border-white/10">
            <span className="text-[10px] uppercase tracking-wider text-emerald-200 font-bold block">
              Results Received
            </span>
            <span className="text-xl sm:text-2xl font-bold text-emerald-300 font-['Noto_Serif',serif]">
              {metrics.completedCount}
            </span>
            <span className="text-[11px] text-emerald-100 block mt-0.5">Completed reports</span>
          </div>
        </div>
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#E2E8F0] pb-2">
        <div className="flex items-center gap-2 overflow-x-auto py-1">
          <button
            onClick={() => setActiveSubTab('catalog')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeSubTab === 'catalog'
                ? 'bg-[#1E40AF] text-white shadow-xs'
                : 'text-[#475569] hover:bg-[#EFF6FF] hover:text-[#1E40AF]'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">search</span>
            <span>Test Directory & Protocols (ค้นหาจุดส่งตรวจ)</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] bg-white/20 text-white font-bold">
              {filteredTests.length}
            </span>
          </button>

          <button
            onClick={() => setActiveSubTab('tracking')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeSubTab === 'tracking'
                ? 'bg-[#1E40AF] text-white shadow-xs'
                : 'text-[#475569] hover:bg-[#EFF6FF] hover:text-[#1E40AF]'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">local_shipping</span>
            <span>Send-Out Tracking Log (ติดตามสิ่งส่งตรวจ)</span>
            {metrics.inTransitCount > 0 && (
              <span className="px-2 py-0.5 rounded-full text-[10px] bg-amber-400 text-amber-950 font-bold">
                {metrics.inTransitCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveSubTab('labs')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeSubTab === 'labs'
                ? 'bg-[#1E40AF] text-white shadow-xs'
                : 'text-[#475569] hover:bg-[#EFF6FF] hover:text-[#1E40AF]'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">domain</span>
            <span>Referral Labs & Couriers (รายชื่อแล็บ & เบอร์ติดต่อ)</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] bg-slate-200 text-slate-700 font-bold">
              {referralLabs.length}
            </span>
          </button>

          <button
            onClick={() => setActiveSubTab('guide')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeSubTab === 'guide'
                ? 'bg-[#1E40AF] text-white shadow-xs'
                : 'text-[#475569] hover:bg-[#EFF6FF] hover:text-[#1E40AF]'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">menu_book</span>
            <span>Cold-Chain Guide (คู่มือการเตรียมตัวอย่าง)</span>
          </button>
        </div>

        {activeSubTab === 'catalog' && (
          <div className="flex items-center gap-1 bg-[#F1F5F9] p-1 rounded-xl">
            <button
              onClick={() => setViewMode('cards')}
              className={`p-1.5 rounded-lg text-xs font-bold flex items-center transition-colors cursor-pointer ${
                viewMode === 'cards' ? 'bg-white text-[#1E40AF] shadow-xs' : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Card Grid View"
            >
              <span className="material-symbols-outlined text-[18px]">grid_view</span>
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg text-xs font-bold flex items-center transition-colors cursor-pointer ${
                viewMode === 'table' ? 'bg-white text-[#1E40AF] shadow-xs' : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Table View"
            >
              <span className="material-symbols-outlined text-[18px]">view_list</span>
            </button>
          </div>
        )}
      </div>

      {/* ========================================================= */}
      {/* TAB 1: TEST DIRECTORY & SEARCH PROTOCOLS                 */}
      {/* ========================================================= */}
      {activeSubTab === 'catalog' && (
        <div className="space-y-6">
          {/* Main Search Bar with prominent Destination highlight */}
          <div className="bg-white p-5 rounded-3xl border border-[#E2E8F0] shadow-xs space-y-4">
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-slate-400">
                <span className="material-symbols-outlined text-[24px]">search</span>
              </span>
              <input
                type="text"
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                placeholder="Search test name, Thai name, alias (e.g. QFT, JAK2, Light chain), destination lab (e.g. Siriraj, N Health), tube color, specimen..."
                className="w-full pl-12 pr-12 py-3.5 bg-[#F8FAFC] border border-[#CBD5E1] rounded-2xl text-sm text-[#0F172A] placeholder-slate-400 focus:outline-none focus:border-[#1E40AF] focus:bg-white focus:ring-3 focus:ring-blue-100 transition-all font-medium"
              />
              {localSearch && (
                <button
                  onClick={() => setLocalSearch('')}
                  className="absolute inset-y-0 right-0 flex items-center pr-4 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[20px]">close</span>
                </button>
              )}
            </div>

            {/* Filter Pills */}
            <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mr-1">
                Filter by Destination:
              </span>
              <button
                onClick={() => setSelectedLabFilter('all')}
                className={`px-3 py-1.5 rounded-full font-semibold transition-all cursor-pointer ${
                  selectedLabFilter === 'all'
                    ? 'bg-[#1E40AF] text-white shadow-xs'
                    : 'bg-[#F1F5F9] text-slate-600 hover:bg-slate-200'
                }`}
              >
                All Referral Labs
              </button>
              {availableLabs.map((lab) => (
                <button
                  key={lab}
                  onClick={() => setSelectedLabFilter(selectedLabFilter === lab ? 'all' : lab)}
                  className={`px-3 py-1.5 rounded-full font-semibold transition-all cursor-pointer ${
                    selectedLabFilter === lab
                      ? 'bg-[#0284C7] text-white shadow-xs'
                      : 'bg-[#F1F5F9] text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {lab}
                </button>
              ))}
            </div>

            {/* Secondary Filter Row: Category & Temperature */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100 text-xs text-slate-600">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Transport Temp:
                </span>
                <button
                  onClick={() => setSelectedTempFilter('all')}
                  className={`px-2.5 py-1 rounded-xl text-[11px] font-medium transition-colors cursor-pointer ${
                    selectedTempFilter === 'all' ? 'bg-slate-800 text-white' : 'bg-slate-100 hover:bg-slate-200'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setSelectedTempFilter(selectedTempFilter === 'Frozen' ? 'all' : 'Frozen')}
                  className={`px-2.5 py-1 rounded-xl text-[11px] font-medium transition-colors cursor-pointer flex items-center gap-1 ${
                    selectedTempFilter === 'Frozen' ? 'bg-sky-600 text-white' : 'bg-sky-50 text-sky-800 hover:bg-sky-100'
                  }`}
                >
                  <span>❄️ Frozen (-20°C)</span>
                </button>
                <button
                  onClick={() => setSelectedTempFilter(selectedTempFilter === 'Refrigerated' ? 'all' : 'Refrigerated')}
                  className={`px-2.5 py-1 rounded-xl text-[11px] font-medium transition-colors cursor-pointer flex items-center gap-1 ${
                    selectedTempFilter === 'Refrigerated' ? 'bg-blue-600 text-white' : 'bg-blue-50 text-blue-800 hover:bg-blue-100'
                  }`}
                >
                  <span>🧊 Cold (2-8°C)</span>
                </button>
                <button
                  onClick={() => setSelectedTempFilter(selectedTempFilter === 'Ambient' ? 'all' : 'Ambient')}
                  className={`px-2.5 py-1 rounded-xl text-[11px] font-medium transition-colors cursor-pointer flex items-center gap-1 ${
                    selectedTempFilter === 'Ambient' ? 'bg-emerald-600 text-white' : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                  }`}
                >
                  <span>🌡️ Ambient (20-25°C)</span>
                </button>
              </div>

              {/* Category Dropdown */}
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Category:
                </span>
                <select
                  value={selectedCategoryFilter}
                  onChange={(e) => setSelectedCategoryFilter(e.target.value)}
                  className="bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl px-3 py-1 text-xs text-[#0F172A] focus:outline-none focus:border-[#1E40AF] cursor-pointer font-medium"
                >
                  <option value="all">All Categories</option>
                  <option value="Molecular & Genetics">Molecular & Genetics</option>
                  <option value="Immunology & Autoimmune">Immunology & Autoimmune</option>
                  <option value="Special Chemistry & Hormones">Special Chemistry & Hormones</option>
                  <option value="Special Hematology & Coagulation">Special Hematology & Coagulation</option>
                  <option value="Infectious & Virology">Infectious & Virology</option>
                  <option value="Toxicology & Heavy Metals">Toxicology & Heavy Metals</option>
                  <option value="Pathology & Cytogenetics">Pathology & Cytogenetics</option>
                </select>

                {(selectedLabFilter !== 'all' || selectedCategoryFilter !== 'all' || selectedTempFilter !== 'all' || effectiveSearch) && (
                  <button
                    onClick={() => {
                      setSelectedLabFilter('all');
                      setSelectedCategoryFilter('all');
                      setSelectedTempFilter('all');
                      setLocalSearch('');
                    }}
                    className="text-red-600 hover:text-red-700 text-xs font-semibold underline cursor-pointer ml-2"
                  >
                    Reset Filters
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Results Counter */}
          <div className="flex items-center justify-between text-xs text-slate-500 px-1">
            <span>
              Showing <strong className="text-slate-800 font-bold">{filteredTests.length}</strong> outlab tests
              {selectedLabFilter !== 'all' && ` sent to ${selectedLabFilter}`}
            </span>
            <span className="text-[11px]">
              Click test card to view complete ward instructions & courier details
            </span>
          </div>

          {/* No results */}
          {filteredTests.length === 0 && (
            <div className="bg-white rounded-3xl border border-dashed border-[#CBD5E1] p-12 text-center space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-blue-50 text-[#1E40AF] flex items-center justify-center mx-auto">
                <span className="material-symbols-outlined text-[32px]">search_off</span>
              </div>
              <h3 className="font-['Noto_Serif',serif] text-lg font-bold text-slate-800">
                No matching Outlab test found
              </h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                We couldn't find any test matching "{effectiveSearch}". You can add this test to the outlab directory now.
              </p>
              <button
                onClick={onOpenAddTest}
                className="mt-2 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#1E40AF] text-white text-xs font-bold uppercase tracking-wider hover:bg-blue-800 transition-colors shadow-xs cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">add_circle</span>
                <span>Add "{effectiveSearch}" to Directory</span>
              </button>
            </div>
          )}

          {/* Card Grid View */}
          {viewMode === 'cards' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredTests.map((test) => {
                const isFrozen = test.transportTemperature.includes('Frozen') || test.transportTemperature.includes('Dry Ice');
                const isCold = test.transportTemperature.includes('Refrigerated') || test.transportTemperature.includes('2-8');

                return (
                  <div
                    key={test.id}
                    className="bg-white rounded-3xl border border-[#E2E8F0] p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group relative hover:border-blue-300"
                  >
                    {/* Card Top: Code & Destination Lab Pill */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                          {test.testCode}
                        </span>

                        {/* Destination Referral Lab Badge (Prominent!) */}
                        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-[#1E40AF] font-bold text-[11px] shadow-2xs">
                          <span className="material-symbols-outlined text-[14px]">local_shipping</span>
                          <span>{test.destinationLab}</span>
                        </div>
                      </div>

                      {/* Test Title & Thai Title */}
                      <div>
                        <h3
                          onClick={() => onViewTestDetail(test)}
                          className="font-['Noto_Serif',serif] font-bold text-base text-[#0F172A] group-hover:text-[#1E40AF] transition-colors cursor-pointer line-clamp-2 leading-snug"
                        >
                          {test.testName}
                        </h3>
                        {test.testNameThai && (
                          <p className="text-xs text-[#64748B] mt-0.5 line-clamp-1 font-medium">
                            {test.testNameThai}
                          </p>
                        )}
                      </div>

                      {/* Aliases chips if present */}
                      {test.aliases && test.aliases.length > 0 && (
                        <div className="flex flex-wrap items-center gap-1">
                          {test.aliases.slice(0, 3).map((alias, idx) => (
                            <span
                              key={idx}
                              className="text-[9px] px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-600 font-semibold"
                            >
                              {alias}
                            </span>
                          ))}
                          {test.aliases.length > 3 && (
                            <span className="text-[9px] text-slate-400">+{test.aliases.length - 3}</span>
                          )}
                        </div>
                      )}

                      {/* Tube & Container Indicator */}
                      <div className="p-3 bg-[#F8FAFC] rounded-2xl border border-[#E2E8F0] space-y-2 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                            Required Tube
                          </span>
                          <span className="text-[10px] font-bold text-slate-600">
                            Vol: {test.minVolume}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span
                            className="w-3.5 h-3.5 rounded-full shrink-0 shadow-2xs"
                            style={{ backgroundColor: test.tubeColorHex || '#DC2626' }}
                          />
                          <span className="font-bold text-[#0F172A] text-xs truncate">
                            {test.tubeType}
                          </span>
                        </div>
                      </div>

                      {/* Transport Cold Chain Badge */}
                      <div className="flex items-center justify-between text-xs">
                        <div
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-xl font-bold text-[11px] ${
                            isFrozen
                              ? 'bg-sky-50 text-sky-700 border border-sky-200'
                              : isCold
                              ? 'bg-blue-50 text-blue-700 border border-blue-200'
                              : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          }`}
                        >
                          <span className="material-symbols-outlined text-[14px]">
                            {isFrozen ? 'ac_unit' : isCold ? 'thermostat' : 'routine'}
                          </span>
                          <span>{test.transportTemperature}</span>
                        </div>

                        <span className="text-[11px] text-slate-500 font-semibold">
                          TAT: <strong className="text-slate-700">{test.tatWorkingDays}</strong>
                        </span>
                      </div>

                      {/* Instructions snippet */}
                      <p className="text-[11px] text-slate-600 line-clamp-2 bg-amber-50/50 p-2 rounded-xl border border-amber-100/60 leading-relaxed">
                        <strong className="text-amber-900 font-semibold">Handling: </strong>
                        {test.instructions}
                      </p>
                    </div>

                    {/* Card Actions */}
                    <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => onViewTestDetail(test)}
                          className="px-3 py-1.5 rounded-xl text-xs font-semibold text-[#1E40AF] hover:bg-blue-50 transition-colors cursor-pointer flex items-center gap-1"
                        >
                          <span className="material-symbols-outlined text-[14px]">info</span>
                          <span>Details</span>
                        </button>
                        <button
                          onClick={() => onEditTest(test)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                          title="Edit Test Protocol"
                        >
                          <span className="material-symbols-outlined text-[16px]">edit</span>
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Delete outlab test "${test.testName}" from catalog?`)) {
                              onDeleteTest(test.id);
                            }
                          }}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                          title="Delete test"
                        >
                          <span className="material-symbols-outlined text-[16px]">delete</span>
                        </button>
                      </div>

                      {/* Primary Action: Send Out This Test */}
                      <button
                        onClick={() => onOpenNewOrder(test)}
                        className="flex items-center gap-1 px-3.5 py-1.5 rounded-full bg-[#1E40AF] hover:bg-[#1D4ED8] text-white text-xs font-bold transition-all shadow-2xs active:scale-95 cursor-pointer uppercase tracking-wider"
                      >
                        <span className="material-symbols-outlined text-[14px]">outbound</span>
                        <span>Send Out</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Table View */}
          {viewMode === 'table' && (
            <div className="bg-white rounded-3xl border border-[#E2E8F0] shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="py-3 px-4">Code</th>
                      <th className="py-3 px-4">Test Name / Aliases</th>
                      <th className="py-3 px-4">Send To (Destination Lab)</th>
                      <th className="py-3 px-4">Specimen & Tube</th>
                      <th className="py-3 px-4">Transport Temp</th>
                      <th className="py-3 px-4">TAT & Schedule</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredTests.map((test) => (
                      <tr key={test.id} className="hover:bg-blue-50/40 transition-colors group">
                        <td className="py-3 px-4 font-mono font-bold text-slate-600">
                          {test.testCode}
                        </td>
                        <td className="py-3 px-4 max-w-xs">
                          <button
                            onClick={() => onViewTestDetail(test)}
                            className="font-bold text-[#0F172A] hover:text-[#1E40AF] text-left block transition-colors cursor-pointer"
                          >
                            {test.testName}
                          </button>
                          {test.testNameThai && (
                            <span className="text-[11px] text-slate-500 block">
                              {test.testNameThai}
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-100 text-[#1E40AF] font-bold text-[11px]">
                            <span className="material-symbols-outlined text-[12px]">local_shipping</span>
                            {test.destinationLab}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <span
                              className="w-2.5 h-2.5 rounded-full shrink-0"
                              style={{ backgroundColor: test.tubeColorHex || '#DC2626' }}
                            />
                            <span className="font-semibold text-slate-800">{test.tubeType}</span>
                          </div>
                          <span className="text-[10px] text-slate-400 block mt-0.5">
                            Min: {test.minVolume}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-[11px] font-semibold text-slate-700">
                            {test.transportTemperature}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="font-bold text-slate-800">{test.tatWorkingDays}</span>
                          <span className="text-[10px] text-slate-400 block">{test.testingSchedule}</span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => onViewTestDetail(test)}
                              className="px-2.5 py-1 rounded-lg text-slate-600 hover:bg-slate-100 font-medium transition-colors cursor-pointer"
                            >
                              Detail
                            </button>
                            <button
                              onClick={() => onOpenNewOrder(test)}
                              className="px-3 py-1 rounded-full bg-[#1E40AF] hover:bg-blue-800 text-white font-bold transition-all shadow-2xs cursor-pointer text-[11px]"
                            >
                              Send Out
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 2: SEND-OUT TRACKING LOG                              */}
      {/* ========================================================= */}
      {activeSubTab === 'tracking' && (
        <div className="space-y-4">
          {/* Filter and search bar for orders */}
          <div className="bg-white p-4 rounded-3xl border border-[#E2E8F0] shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-80">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
                <span className="material-symbols-outlined text-[20px]">search</span>
              </span>
              <input
                type="text"
                value={orderSearch}
                onChange={(e) => setOrderSearch(e.target.value)}
                placeholder="Search patient HN, Name, Tracking No..."
                className="w-full pl-10 pr-3 py-2 bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl text-xs text-[#0F172A] focus:outline-none focus:border-[#1E40AF]"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Status:
              </span>
              {(['all', 'Pending Pickup', 'In Transit', 'Processing at Outlab', 'Result Received'] as const).map((st) => (
                <button
                  key={st}
                  onClick={() => setOrderStatusFilter(st)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                    orderStatusFilter === st
                      ? 'bg-[#1E40AF] text-white shadow-xs'
                      : 'bg-[#F1F5F9] text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {st === 'all' ? 'All Orders' : st}
                </button>
              ))}
            </div>
          </div>

          {/* Orders Table */}
          <div className="bg-white rounded-3xl border border-[#E2E8F0] shadow-xs overflow-hidden">
            {filteredOrders.length === 0 ? (
              <div className="p-12 text-center space-y-2">
                <span className="material-symbols-outlined text-[36px] text-slate-400">
                  inbox
                </span>
                <h3 className="font-bold text-sm text-slate-700">No send-out orders found</h3>
                <p className="text-xs text-slate-500">
                  No patient samples currently match the selected tracking filter.
                </p>
                <button
                  onClick={() => onOpenNewOrder()}
                  className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#1E40AF] text-white text-xs font-bold uppercase tracking-wider"
                >
                  <span className="material-symbols-outlined text-[16px]">add</span>
                  <span>Log Send-Out Order</span>
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="py-3 px-4">Order / Tracking</th>
                      <th className="py-3 px-4">Patient (HN / Name)</th>
                      <th className="py-3 px-4">Test & Referral Lab</th>
                      <th className="py-3 px-4">Specimen & Temp</th>
                      <th className="py-3 px-4">Dispatched Time</th>
                      <th className="py-3 px-4">Current Status</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredOrders.map((order) => {
                      const isCompleted = order.status === 'Result Received';
                      const isPending = order.status === 'Pending Pickup';
                      const isTransit = order.status === 'In Transit';

                      return (
                        <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                          {/* Order / Tracking */}
                          <td className="py-3.5 px-4">
                            <span className="font-mono font-bold text-slate-800 block">
                              {order.orderNumber}
                            </span>
                            {order.courierTrackingNo ? (
                              <span className="text-[11px] text-blue-600 font-mono flex items-center gap-1">
                                <span className="material-symbols-outlined text-[12px]">local_shipping</span>
                                {order.courierTrackingNo}
                              </span>
                            ) : (
                              <span className="text-[10px] text-slate-400">No tracking #</span>
                            )}
                          </td>

                          {/* Patient */}
                          <td className="py-3.5 px-4">
                            <span className="font-mono font-bold text-[#1E40AF] text-xs">
                              {order.patientHn}
                            </span>
                            <span className="font-medium text-slate-800 block">
                              {order.patientName}
                            </span>
                            {order.urgency !== 'Routine' && (
                              <span
                                className={`text-[10px] font-bold uppercase px-1.5 py-0.2 rounded-sm ${
                                  order.urgency === 'STAT'
                                    ? 'bg-red-100 text-red-700'
                                    : 'bg-amber-100 text-amber-700'
                                }`}
                              >
                                {order.urgency}
                              </span>
                            )}
                          </td>

                          {/* Test & Lab */}
                          <td className="py-3.5 px-4 max-w-xs">
                            <span className="font-bold text-[#0F172A] block leading-snug">
                              {order.testName}
                            </span>
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-50 text-[#1E40AF] font-bold text-[10px] mt-1">
                              <span className="material-symbols-outlined text-[12px]">domain</span>
                              {order.destinationLab}
                            </span>
                          </td>

                          {/* Specimen & Temp */}
                          <td className="py-3.5 px-4">
                            <span className="font-semibold text-slate-700 block">
                              {order.specimenType}
                            </span>
                            <span className="text-[11px] text-slate-500">
                              {order.transportTemp}
                            </span>
                          </td>

                          {/* Dispatched */}
                          <td className="py-3.5 px-4">
                            <span className="text-slate-800 font-medium block">
                              {order.sentDateTime || order.collectionDateTime}
                            </span>
                            <span className="text-[10px] text-slate-400">
                              By {order.recordedBy}
                            </span>
                          </td>

                          {/* Status */}
                          <td className="py-3.5 px-4">
                            <div className="space-y-1">
                              <span
                                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                                  isCompleted
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : isPending
                                    ? 'bg-amber-100 text-amber-800'
                                    : isTransit
                                    ? 'bg-blue-100 text-blue-800'
                                    : 'bg-purple-100 text-purple-800'
                                }`}
                              >
                                <span className="material-symbols-outlined text-[14px]">
                                  {isCompleted
                                    ? 'check_circle'
                                    : isPending
                                    ? 'pending'
                                    : isTransit
                                    ? 'local_shipping'
                                    : 'biotech'}
                                </span>
                                {order.status}
                              </span>

                              {order.resultSummary && (
                                <p className="text-[11px] text-emerald-800 bg-emerald-50/80 p-1.5 rounded-lg border border-emerald-200">
                                  <strong>Result: </strong>
                                  {order.resultSummary}
                                </p>
                              )}
                            </div>
                          </td>

                          {/* Actions */}
                          <td className="py-3.5 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              {/* Quick status cycle button */}
                              {!isCompleted && (
                                <button
                                  onClick={() => {
                                    setEditingResultOrder(order);
                                    setResultSummaryInput(order.resultSummary || '');
                                  }}
                                  className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] transition-colors shadow-2xs cursor-pointer flex items-center gap-1"
                                >
                                  <span className="material-symbols-outlined text-[14px]">task_alt</span>
                                  <span>Log Result</span>
                                </button>
                              )}

                              {isCompleted && (
                                <button
                                  onClick={() => {
                                    setEditingResultOrder(order);
                                    setResultSummaryInput(order.resultSummary || '');
                                  }}
                                  className="px-2 py-1 rounded-lg text-slate-600 hover:bg-slate-100 text-[11px] font-medium"
                                >
                                  Edit Note
                                </button>
                              )}

                              <button
                                onClick={() => {
                                  if (confirm(`Remove send-out order ${order.orderNumber}?`)) {
                                    onDeleteOrder(order.id);
                                  }
                                }}
                                className="p-1 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                                title="Delete order"
                              >
                                <span className="material-symbols-outlined text-[16px]">delete</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 3: REFERRAL LABS DIRECTORY & HOTLINES                 */}
      {/* ========================================================= */}
      {activeSubTab === 'labs' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-['Noto_Serif',serif] text-lg font-bold text-[#0F172A]">
                Affiliated Reference Laboratories Directory
              </h2>
              <p className="text-xs text-slate-500">
                Direct contacts for courier dispatch, lab inquiries, and emergency specimen transport
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {referralLabs.map((lab) => {
              // Count tests sent to this lab
              const labTestsCount = tests.filter(
                (t) => t.destinationLab.toLowerCase() === lab.shortName.toLowerCase() || t.destinationLab.includes(lab.shortName)
              ).length;

              return (
                <div
                  key={lab.id}
                  className="bg-white rounded-3xl border border-[#E2E8F0] p-6 shadow-xs hover:shadow-md transition-all space-y-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-[#EFF6FF] text-[#1E40AF] flex items-center justify-center font-bold text-lg border border-blue-100">
                        <span className="material-symbols-outlined text-[24px]">domain</span>
                      </div>
                      <div>
                        <h3 className="font-['Noto_Serif',serif] font-bold text-base text-[#0F172A]">
                          {lab.name}
                        </h3>
                        <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-[#1E40AF] font-bold text-[10px]">
                          Short name: {lab.shortName}
                        </span>
                      </div>
                    </div>

                    <span className="text-xs font-bold px-3 py-1 rounded-full bg-slate-100 text-slate-700">
                      {labTestsCount} Tests Sent Here
                    </span>
                  </div>

                  <div className="p-3.5 bg-[#F8FAFC] rounded-2xl border border-[#E2E8F0] space-y-2 text-xs">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                        Address & Location
                      </span>
                      <p className="text-slate-700 font-medium leading-relaxed">{lab.address}</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-slate-200">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                          Customer Hotline
                        </span>
                        <a
                          href={`tel:${lab.hotline}`}
                          className="font-bold text-[#1E40AF] hover:underline flex items-center gap-1"
                        >
                          <span className="material-symbols-outlined text-[14px]">call</span>
                          {lab.hotline}
                        </a>
                      </div>

                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                          Courier Line / Dispatch
                        </span>
                        <span className="font-bold text-emerald-800 flex items-center gap-1">
                          <span className="material-symbols-outlined text-[14px]">local_shipping</span>
                          {lab.courierDispatch}
                        </span>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-600">
                      <span>
                        <strong className="font-bold">Regular Pickup: </strong>
                        {lab.regularPickupTimes}
                      </span>
                      {lab.emergencyCourier && (
                        <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-700 font-bold text-[10px]">
                          24h STAT Courier
                        </span>
                      )}
                    </div>
                  </div>

                  {lab.notes && (
                    <p className="text-xs text-slate-600 italic bg-blue-50/40 p-2.5 rounded-xl border border-blue-100">
                      "{lab.notes}"
                    </p>
                  )}

                  {/* Filter by this lab button */}
                  <div className="pt-2 flex items-center justify-between">
                    <button
                      onClick={() => {
                        setSelectedLabFilter(lab.shortName);
                        setActiveSubTab('catalog');
                      }}
                      className="text-xs font-bold text-[#1E40AF] hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <span>View all {labTestsCount} tests sent to {lab.shortName}</span>
                      <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                    </button>

                    {lab.website && (
                      <a
                        href={lab.website}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs text-slate-400 hover:text-slate-600 flex items-center gap-1"
                      >
                        <span>Website</span>
                        <span className="material-symbols-outlined text-[12px]">open_in_new</span>
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 4: SPECIMEN TRANSPORT & COLD CHAIN GUIDE              */}
      {/* ========================================================= */}
      {activeSubTab === 'guide' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-[#E2E8F0] p-6 shadow-xs space-y-4">
            <h2 className="font-['Noto_Serif',serif] text-xl font-bold text-[#0F172A] flex items-center gap-2">
              <span className="material-symbols-outlined text-[24px] text-blue-600">thermostat</span>
              Outlab Specimen Handling & Pre-Analytical Protocol Guide
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              Standard operating procedure (SOP) for preparing and packaging laboratory specimens sent to external reference facilities. Strict adherence prevents specimen rejection and erroneous analytical results.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              {/* Frozen Protocol */}
              <div className="p-5 bg-sky-50/70 rounded-2xl border border-sky-200 space-y-2.5">
                <div className="flex items-center gap-2 text-sky-900 font-bold text-sm">
                  <span className="material-symbols-outlined text-[22px] text-sky-600">ac_unit</span>
                  <span>1. Frozen Samples (-20°C / Dry Ice)</span>
                </div>
                <ul className="text-xs text-sky-950 space-y-1.5 list-disc pl-4 leading-relaxed font-medium">
                  <li>Centrifuge within 30-60 minutes of collection.</li>
                  <li>Pipette serum/plasma into sterile plastic cryovials (NEVER freeze in glass tubes).</li>
                  <li>Freeze immediately at -20°C or -70°C prior to transport.</li>
                  <li>Pack in Styrofoam box with sufficient dry ice (at least 3-5 kg per 24 hours of transit).</li>
                  <li>Examples: Free Light Chains, vWF, 17-OHP, Hepatitis Delta RNA.</li>
                </ul>
              </div>

              {/* Refrigerated Protocol */}
              <div className="p-5 bg-blue-50/70 rounded-2xl border border-blue-200 space-y-2.5">
                <div className="flex items-center gap-2 text-blue-900 font-bold text-sm">
                  <span className="material-symbols-outlined text-[22px] text-blue-600">thermostat</span>
                  <span>2. Refrigerated Samples (2°C - 8°C)</span>
                </div>
                <ul className="text-xs text-blue-950 space-y-1.5 list-disc pl-4 leading-relaxed font-medium">
                  <li>Store in designated specimen refrigerator at 2°C - 8°C.</li>
                  <li>Transport in cooler container with frozen gel packs (place insulating barrier between gel pack and tube to avoid freezing hemolysis).</li>
                  <li>Keep upright in secure tube rack.</li>
                  <li>Examples: Anti-PLA2R, Anti-AQP4, Heavy Metals Blood Screen, CSF paired with serum.</li>
                </ul>
              </div>

              {/* Ambient Protocol */}
              <div className="p-5 bg-emerald-50/70 rounded-2xl border border-emerald-200 space-y-2.5">
                <div className="flex items-center gap-2 text-emerald-900 font-bold text-sm">
                  <span className="material-symbols-outlined text-[22px] text-emerald-600">routine</span>
                  <span>3. Ambient Room Temp (20°C - 25°C)</span>
                </div>
                <ul className="text-xs text-emerald-950 space-y-1.5 list-disc pl-4 leading-relaxed font-medium">
                  <li>DO NOT REFRIGERATE OR FREEZE living cell samples!</li>
                  <li>Maintain at controlled room temperature (20°C - 25°C).</li>
                  <li>Genetic DNA tests (EDTA whole blood) remain stable at ambient temperature for up to 7 days.</li>
                  <li>Karyotype/Cytogenetics must reach culture lab within 24 hours.</li>
                  <li>Examples: JAK2 V617F, HLA-B*1502/5801, Chromosome Karyotyping, QFT-TB before incubation.</li>
                </ul>
              </div>
            </div>

            {/* Rejection Criteria Callout */}
            <div className="p-4 bg-red-50 rounded-2xl border border-red-200 space-y-1.5">
              <h4 className="font-bold text-xs text-red-900 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[18px] text-red-600">cancel</span>
                Common Rejection Criteria for Send-Out Specimens
              </h4>
              <p className="text-xs text-red-800 leading-relaxed">
                Specimens will be rejected by referral labs if: (1) Tube unlabelled or mismatch with LIS requisition, (2) Grossly hemolyzed or lipemic, (3) Frozen sample thawed upon arrival at referral desk, (4) Inappropriate anticoagulant (e.g. EDTA used for coagulation), (5) Insufficient volume (QNS).
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Result Note / Completion Modal Dialog */}
      {editingResultOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-[#E2E8F0] p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-['Noto_Serif',serif] font-bold text-base text-[#0F172A]">
                Record Received Result
              </h3>
              <button
                onClick={() => setEditingResultOrder(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <div className="space-y-1 text-xs">
              <p>
                <strong>Patient:</strong> {editingResultOrder.patientName} ({editingResultOrder.patientHn})
              </p>
              <p>
                <strong>Test:</strong> {editingResultOrder.testName}
              </p>
              <p>
                <strong>Destination:</strong> {editingResultOrder.destinationLab}
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Result Summary / Interpretation Note
              </label>
              <textarea
                rows={3}
                value={resultSummaryInput}
                onChange={(e) => setResultSummaryInput(e.target.value)}
                placeholder="e.g. Negative for JAK2 V617F mutation / QFT: Negative (<0.35 IU/mL) / Free Kappa 14.2 mg/L, Lambda 12.1 mg/L, Ratio 1.17 (Normal)"
                className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl p-3 text-xs text-[#0F172A] focus:outline-none focus:border-[#1E40AF]"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setEditingResultOrder(null)}
                className="px-4 py-2 rounded-full border border-slate-300 text-xs font-bold text-slate-700"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveResultSummary}
                className="px-5 py-2 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold uppercase tracking-wider"
              >
                Save & Mark as Received
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
