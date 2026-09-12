import React, { useState, useMemo } from 'react';
import { StockItem, StockCategory, StockStatus } from '../../types';
import { ChangeLotModal } from '../modals/ChangeLotModal';

interface StockViewProps {
  items: StockItem[];
  searchQuery: string;
  onUpdateQuantity: (id: string, delta: number) => void;
  onOpenAddItem: () => void;
  onDeleteItem: (id: string) => void;
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

type SortOption = 'urgency' | 'qty_asc' | 'qty_desc' | 'name_asc' | 'name_desc' | 'min_desc';
type StatusFilter = 'all' | 'critical' | 'low' | 'normal' | 'needs_restock';
type ViewMode = 'grid' | 'table';

export const StockView: React.FC<StockViewProps> = ({
  items,
  searchQuery,
  onUpdateQuantity,
  onOpenAddItem,
  onDeleteItem,
  onSaveLot,
  onDeleteLot,
  onSwitchActiveLot
}) => {
  // Filter States
  const [selectedCategory, setSelectedCategory] = useState<StockCategory>('all');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [selectedLocation, setSelectedLocation] = useState<string>('all');
  const [selectedSupplier, setSelectedSupplier] = useState<string>('all');
  const [sortBy, setSortBy] = useState<SortOption>('urgency');
  const [localSearch, setLocalSearch] = useState<string>('');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState<boolean>(false);
  const [itemToDelete, setItemToDelete] = useState<StockItem | null>(null);

  // Lot Management Modals
  const [lotModalItem, setLotModalItem] = useState<StockItem | null>(null);
  const [directLotDeleteConfirm, setDirectLotDeleteConfirm] = useState<{
    item: StockItem;
    lotNumber?: string;
  } | null>(null);

  // Pagination / Load More
  const [visibleLimit, setVisibleLimit] = useState<number>(12);
  const [restockSuccessItem, setRestockSuccessItem] = useState<string | null>(null);

  const categories: { id: StockCategory; label: string; icon: string }[] = [
    { id: 'all', label: 'All Categories', icon: 'apps' },
    { id: 'blood_tubes', label: 'Blood Tubes', icon: 'bloodtype' },
    { id: 'containers', label: 'Containers', icon: 'inventory_2' },
    { id: 'reagents', label: 'Reagents', icon: 'biotech' },
    { id: 'consumables', label: 'Consumables', icon: 'sanitizer' }
  ];

  // Derive unique locations and suppliers from actual items
  const uniqueLocations = useMemo(() => {
    const locs = new Set<string>();
    items.forEach((item) => {
      if (item.location && item.location.trim()) {
        locs.add(item.location.trim());
      }
    });
    return Array.from(locs).sort();
  }, [items]);

  const uniqueSuppliers = useMemo(() => {
    const supps = new Set<string>();
    items.forEach((item) => {
      if (item.supplier && item.supplier.trim()) {
        supps.add(item.supplier.trim());
      }
    });
    return Array.from(supps).sort();
  }, [items]);

  // Overall Inventory Stats
  const stats = useMemo(() => {
    let criticalCount = 0;
    let lowCount = 0;
    let normalCount = 0;
    let totalUnits = 0;

    items.forEach((item) => {
      totalUnits += item.quantity;
      if (item.quantity <= item.minQuantity * 0.3) {
        criticalCount++;
      } else if (item.quantity <= item.minQuantity) {
        lowCount++;
      } else {
        normalCount++;
      }
    });

    return {
      total: items.length,
      critical: criticalCount,
      low: lowCount,
      normal: normalCount,
      needsRestock: criticalCount + lowCount,
      totalUnits
    };
  }, [items]);

  // Effective Search Term (combines global search + in-view search)
  const effectiveSearch = useMemo(() => {
    return (localSearch || searchQuery || '').trim().toLowerCase();
  }, [localSearch, searchQuery]);

  // Filtered and Sorted Items
  const filteredItems = useMemo(() => {
    return items
      .filter((item) => {
        // Category Filter
        if (selectedCategory !== 'all' && item.category !== selectedCategory) {
          return false;
        }

        // Status Filter
        const isCritical = item.quantity <= item.minQuantity * 0.3;
        const isLow = item.quantity <= item.minQuantity && !isCritical;
        const isNormal = item.quantity > item.minQuantity;

        if (statusFilter === 'critical' && !isCritical) return false;
        if (statusFilter === 'low' && !isLow) return false;
        if (statusFilter === 'normal' && !isNormal) return false;
        if (statusFilter === 'needs_restock' && !(isCritical || isLow)) return false;

        // Location Filter
        if (selectedLocation !== 'all' && item.location !== selectedLocation) {
          return false;
        }

        // Supplier Filter
        if (selectedSupplier !== 'all' && item.supplier !== selectedSupplier) {
          return false;
        }

        // Search Query
        if (effectiveSearch) {
          const matchName = item.name.toLowerCase().includes(effectiveSearch);
          const matchCode = item.code.toLowerCase().includes(effectiveSearch);
          const matchCat = item.categoryLabel.toLowerCase().includes(effectiveSearch);
          const matchLoc = item.location?.toLowerCase().includes(effectiveSearch);
          const matchLot = item.lotNumber?.toLowerCase().includes(effectiveSearch);
          const matchSupp = item.supplier?.toLowerCase().includes(effectiveSearch);

          if (!matchName && !matchCode && !matchCat && !matchLoc && !matchLot && !matchSupp) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'urgency') {
          // Sort by critical ratio: quantity / minQuantity
          const ratioA = a.minQuantity > 0 ? a.quantity / a.minQuantity : 1;
          const ratioB = b.minQuantity > 0 ? b.quantity / b.minQuantity : 1;
          if (ratioA !== ratioB) {
            return ratioA - ratioB; // Lowest ratio first
          }
          return a.name.localeCompare(b.name);
        }
        if (sortBy === 'qty_asc') {
          return a.quantity - b.quantity;
        }
        if (sortBy === 'qty_desc') {
          return b.quantity - a.quantity;
        }
        if (sortBy === 'name_asc') {
          return a.name.localeCompare(b.name);
        }
        if (sortBy === 'name_desc') {
          return b.name.localeCompare(a.name);
        }
        if (sortBy === 'min_desc') {
          return b.minQuantity - a.minQuantity;
        }
        return 0;
      });
  }, [
    items,
    selectedCategory,
    statusFilter,
    selectedLocation,
    selectedSupplier,
    effectiveSearch,
    sortBy
  ]);

  const displayedItems = filteredItems.slice(0, visibleLimit);
  const hasMore = visibleLimit < filteredItems.length;

  const hasActiveFilters =
    selectedCategory !== 'all' ||
    statusFilter !== 'all' ||
    selectedLocation !== 'all' ||
    selectedSupplier !== 'all' ||
    Boolean(localSearch);

  const handleResetFilters = () => {
    setSelectedCategory('all');
    setStatusFilter('all');
    setSelectedLocation('all');
    setSelectedSupplier('all');
    setLocalSearch('');
    setSortBy('urgency');
    setVisibleLimit(12);
  };

  const getStatusBadge = (item: StockItem) => {
    if (item.quantity <= item.minQuantity * 0.3) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#FEE2E2] text-[#DC2626] border border-[#FCA5A5]/40">
          <span className="material-symbols-outlined text-[13px]">warning</span>
          Critical
        </span>
      );
    }
    if (item.quantity <= item.minQuantity) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#FEF3C7] text-[#D97706] border border-[#FCD34D]/40">
          <span className="material-symbols-outlined text-[13px]">info</span>
          Low Stock
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#ECFDF5] text-[#059669] border border-[#6EE7B7]/40">
        <span className="material-symbols-outlined text-[13px]">check_circle</span>
        Normal
      </span>
    );
  };

  const handleRestockOrder = (itemName: string) => {
    setRestockSuccessItem(itemName);
    setTimeout(() => setRestockSuccessItem(null), 3500);
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 lg:p-10 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-200 font-['Public_Sans',sans-serif]">
      {/* Toast Notification */}
      {restockSuccessItem && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0F172A] text-white px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 border border-slate-700 animate-in slide-in-from-bottom-4">
          <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[20px]">local_shipping</span>
          </div>
          <div>
            <p className="text-xs font-bold text-white">Requisition Draft Created</p>
            <p className="text-[11px] text-slate-300">Purchase order drafted for: {restockSuccessItem}</p>
          </div>
        </div>
      )}

      {/* View Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[#0284C7] font-['Noto_Serif',serif] italic text-sm block mb-1">
            Inventory & Reagents
          </span>
          <h1 className="font-['Noto_Serif',serif] text-3xl sm:text-4xl font-bold text-[#0F172A] tracking-tight">
            Stock Management
          </h1>
          <p className="text-sm text-[#475569] mt-1">
            Real-time consumables, blood collection tubes, and diagnostic reagent inventory control.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          <button
            id="btn-add-new-item"
            onClick={onOpenAddItem}
            className="px-5 py-2.5 rounded-full bg-[#1E40AF] hover:bg-[#1D4ED8] text-white font-bold text-xs uppercase tracking-widest flex items-center gap-2 shadow-xs transition-all active:scale-95 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">add_circle</span>
            Add New Item
          </button>
        </div>
      </div>

      {/* KPI Quick Filter Cards (Clickable to Filter by Stock Status) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        {/* Total Items */}
        <button
          type="button"
          onClick={() => {
            setStatusFilter('all');
            setVisibleLimit(12);
          }}
          className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
            statusFilter === 'all'
              ? 'bg-[#1E40AF] text-white border-[#1E40AF] shadow-md shadow-blue-500/20'
              : 'bg-white text-[#0F172A] border-[#E2E8F0] hover:border-[#1E40AF]/40 hover:bg-[#F8FAFC]'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span
              className={`text-xs font-bold uppercase tracking-wider ${
                statusFilter === 'all' ? 'text-blue-200' : 'text-[#64748B]'
              }`}
            >
              All Items
            </span>
            <span
              className={`material-symbols-outlined text-lg ${
                statusFilter === 'all' ? 'text-blue-200' : 'text-[#1E40AF]'
              }`}
            >
              inventory_2
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-['Noto_Serif',serif] text-2xl sm:text-3xl font-bold">
              {stats.total}
            </span>
            <span
              className={`text-[11px] font-medium ${
                statusFilter === 'all' ? 'text-blue-200' : 'text-[#64748B]'
              }`}
            >
              skus
            </span>
          </div>
        </button>

        {/* Critical Stock */}
        <button
          type="button"
          onClick={() => {
            setStatusFilter(statusFilter === 'critical' ? 'all' : 'critical');
            setVisibleLimit(12);
          }}
          className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
            statusFilter === 'critical'
              ? 'bg-[#DC2626] text-white border-[#DC2626] shadow-md shadow-red-500/20'
              : 'bg-white text-[#0F172A] border-[#E2E8F0] hover:border-[#DC2626]/40 hover:bg-[#FEF2F2]'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span
              className={`text-xs font-bold uppercase tracking-wider ${
                statusFilter === 'critical' ? 'text-red-200' : 'text-[#DC2626]'
              }`}
            >
              Critical Stock
            </span>
            <span
              className={`material-symbols-outlined text-lg ${
                statusFilter === 'critical' ? 'text-red-200' : 'text-[#DC2626]'
              }`}
            >
              warning
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span
              className={`font-['Noto_Serif',serif] text-2xl sm:text-3xl font-bold ${
                statusFilter === 'critical' ? 'text-white' : 'text-[#DC2626]'
              }`}
            >
              {stats.critical}
            </span>
            <span
              className={`text-[11px] font-medium ${
                statusFilter === 'critical' ? 'text-red-200' : 'text-[#DC2626]'
              }`}
            >
              ≤ 30% min
            </span>
          </div>
        </button>

        {/* Low Stock */}
        <button
          type="button"
          onClick={() => {
            setStatusFilter(statusFilter === 'low' ? 'all' : 'low');
            setVisibleLimit(12);
          }}
          className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
            statusFilter === 'low'
              ? 'bg-[#D97706] text-white border-[#D97706] shadow-md shadow-amber-500/20'
              : 'bg-white text-[#0F172A] border-[#E2E8F0] hover:border-[#D97706]/40 hover:bg-[#FFFBEB]'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span
              className={`text-xs font-bold uppercase tracking-wider ${
                statusFilter === 'low' ? 'text-amber-200' : 'text-[#D97706]'
              }`}
            >
              Low Stock
            </span>
            <span
              className={`material-symbols-outlined text-lg ${
                statusFilter === 'low' ? 'text-amber-200' : 'text-[#D97706]'
              }`}
            >
              info
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span
              className={`font-['Noto_Serif',serif] text-2xl sm:text-3xl font-bold ${
                statusFilter === 'low' ? 'text-white' : 'text-[#D97706]'
              }`}
            >
              {stats.low}
            </span>
            <span
              className={`text-[11px] font-medium ${
                statusFilter === 'low' ? 'text-amber-200' : 'text-[#D97706]'
              }`}
            >
              ≤ min qty
            </span>
          </div>
        </button>

        {/* Normal / Adequate */}
        <button
          type="button"
          onClick={() => {
            setStatusFilter(statusFilter === 'normal' ? 'all' : 'normal');
            setVisibleLimit(12);
          }}
          className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
            statusFilter === 'normal'
              ? 'bg-[#059669] text-white border-[#059669] shadow-md shadow-emerald-500/20'
              : 'bg-white text-[#0F172A] border-[#E2E8F0] hover:border-[#059669]/40 hover:bg-[#ECFDF5]'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span
              className={`text-xs font-bold uppercase tracking-wider ${
                statusFilter === 'normal' ? 'text-emerald-200' : 'text-[#059669]'
              }`}
            >
              Adequate Stock
            </span>
            <span
              className={`material-symbols-outlined text-lg ${
                statusFilter === 'normal' ? 'text-emerald-200' : 'text-[#059669]'
              }`}
            >
              check_circle
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span
              className={`font-['Noto_Serif',serif] text-2xl sm:text-3xl font-bold ${
                statusFilter === 'normal' ? 'text-white' : 'text-[#059669]'
              }`}
            >
              {stats.normal}
            </span>
            <span
              className={`text-[11px] font-medium ${
                statusFilter === 'normal' ? 'text-emerald-200' : 'text-[#059669]'
              }`}
            >
              in stock
            </span>
          </div>
        </button>
      </div>

      {/* Main Filter & Category Bar */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-[#E2E8F0] shadow-xs space-y-4">
        {/* Top Filter Controls: Category Tabs + Search + Advanced Toggle + View Switcher */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3.5">
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0 scrollbar-none">
            {categories.map((cat) => {
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => {
                    setSelectedCategory(cat.id);
                    setVisibleLimit(12);
                  }}
                  className={`px-3.5 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                    isActive
                      ? 'bg-[#1E40AF] text-white shadow-xs'
                      : 'text-[#475569] hover:text-[#0F172A] bg-[#F1F5F9] hover:bg-[#E2E8F0]'
                  }`}
                >
                  <span className="material-symbols-outlined text-[16px]">{cat.icon}</span>
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>

          {/* Quick Search + View Switcher */}
          <div className="flex items-center gap-2">
            <div className="relative flex-1 sm:w-64">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8] text-[18px]">
                search
              </span>
              <input
                type="text"
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                placeholder="Filter by name, code, lot..."
                className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-full py-1.5 pl-9 pr-8 text-xs text-[#0F172A] placeholder-[#94A3B8] focus:outline-none focus:border-[#1E40AF] focus:bg-white transition-all"
              />
              {localSearch && (
                <button
                  onClick={() => setLocalSearch('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#0F172A] text-xs cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">cancel</span>
                </button>
              )}
            </div>

            {/* Filter Drawer Toggle Button */}
            <button
              type="button"
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className={`p-2 rounded-full border text-xs font-bold flex items-center gap-1.5 px-3.5 transition-all cursor-pointer ${
                showAdvancedFilters || hasActiveFilters
                  ? 'bg-[#EFF6FF] border-[#2563EB] text-[#1E40AF]'
                  : 'bg-[#F8FAFC] border-[#CBD5E1] text-[#475569] hover:text-[#0F172A]'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">tune</span>
              <span className="hidden sm:inline">Filters</span>
              {hasActiveFilters && (
                <span className="w-2 h-2 rounded-full bg-[#2563EB]" />
              )}
            </button>

            {/* View Mode Toggle */}
            <div className="flex items-center bg-[#F1F5F9] p-0.5 rounded-full border border-[#E2E8F0]">
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-full transition-all cursor-pointer ${
                  viewMode === 'grid'
                    ? 'bg-white text-[#1E40AF] shadow-2xs'
                    : 'text-[#64748B] hover:text-[#0F172A]'
                }`}
                title="Grid View"
              >
                <span className="material-symbols-outlined text-[18px]">grid_view</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded-full transition-all cursor-pointer ${
                  viewMode === 'table'
                    ? 'bg-white text-[#1E40AF] shadow-2xs'
                    : 'text-[#64748B] hover:text-[#0F172A]'
                }`}
                title="Table View"
              >
                <span className="material-symbols-outlined text-[18px]">table_rows</span>
              </button>
            </div>
          </div>
        </div>

        {/* Expandable Advanced Filter Panel */}
        {showAdvancedFilters && (
          <div className="pt-3 border-t border-[#E2E8F0] grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 animate-in fade-in duration-150">
            {/* Status Filter Dropdown */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#64748B] mb-1">
                Stock Status
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
                className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl px-3 py-1.5 text-xs text-[#0F172A] focus:outline-none focus:border-[#1E40AF] cursor-pointer"
              >
                <option value="all">All Statuses ({stats.total})</option>
                <option value="critical">🚨 Critical Only ({stats.critical})</option>
                <option value="low">⚠️ Low Stock ({stats.low})</option>
                <option value="needs_restock">📦 Needs Restock ({stats.needsRestock})</option>
                <option value="normal">✅ Normal / In Stock ({stats.normal})</option>
              </select>
            </div>

            {/* Storage Location Filter */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#64748B] mb-1">
                Storage Location
              </label>
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl px-3 py-1.5 text-xs text-[#0F172A] focus:outline-none focus:border-[#1E40AF] cursor-pointer"
              >
                <option value="all">All Locations</option>
                {uniqueLocations.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
            </div>

            {/* Supplier / Manufacturer Filter */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#64748B] mb-1">
                Supplier / Vendor
              </label>
              <select
                value={selectedSupplier}
                onChange={(e) => setSelectedSupplier(e.target.value)}
                className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl px-3 py-1.5 text-xs text-[#0F172A] focus:outline-none focus:border-[#1E40AF] cursor-pointer"
              >
                <option value="all">All Suppliers</option>
                {uniqueSuppliers.map((supp) => (
                  <option key={supp} value={supp}>
                    {supp}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort Order */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#64748B] mb-1">
                Sort Inventory By
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl px-3 py-1.5 text-xs text-[#0F172A] focus:outline-none focus:border-[#1E40AF] cursor-pointer"
              >
                <option value="urgency">⚠️ Restock Urgency (Critical First)</option>
                <option value="qty_asc">Quantity: Low → High</option>
                <option value="qty_desc">Quantity: High → Low</option>
                <option value="name_asc">Name: A → Z</option>
                <option value="name_desc">Name: Z → A</option>
                <option value="min_desc">Min Level: High → Low</option>
              </select>
            </div>
          </div>
        )}

        {/* Active Filter Chips & Counter Bar */}
        <div className="flex items-center justify-between gap-3 flex-wrap pt-2 border-t border-[#F1F5F9] text-xs">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-[#64748B]">Active Filters:</span>

            {selectedCategory !== 'all' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#EFF6FF] text-[#1E40AF] border border-[#BFDBFE] font-bold">
                Category: {categories.find((c) => c.id === selectedCategory)?.label}
                <button
                  type="button"
                  onClick={() => setSelectedCategory('all')}
                  className="hover:text-red-600 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[14px]">close</span>
                </button>
              </span>
            )}

            {statusFilter !== 'all' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#FEF3C7] text-[#92400E] border border-[#FDE68A] font-bold">
                Status:{' '}
                {statusFilter === 'critical'
                  ? 'Critical'
                  : statusFilter === 'low'
                  ? 'Low Stock'
                  : statusFilter === 'needs_restock'
                  ? 'Needs Restock'
                  : 'Normal'}
                <button
                  type="button"
                  onClick={() => setStatusFilter('all')}
                  className="hover:text-red-600 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[14px]">close</span>
                </button>
              </span>
            )}

            {selectedLocation !== 'all' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#F1F5F9] text-[#334155] border border-[#CBD5E1] font-bold">
                Location: {selectedLocation}
                <button
                  type="button"
                  onClick={() => setSelectedLocation('all')}
                  className="hover:text-red-600 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[14px]">close</span>
                </button>
              </span>
            )}

            {selectedSupplier !== 'all' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#F1F5F9] text-[#334155] border border-[#CBD5E1] font-bold">
                Supplier: {selectedSupplier}
                <button
                  type="button"
                  onClick={() => setSelectedSupplier('all')}
                  className="hover:text-red-600 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[14px]">close</span>
                </button>
              </span>
            )}

            {localSearch && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#F1F5F9] text-[#334155] border border-[#CBD5E1] font-bold">
                Query: "{localSearch}"
                <button
                  type="button"
                  onClick={() => setLocalSearch('')}
                  className="hover:text-red-600 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[14px]">close</span>
                </button>
              </span>
            )}

            {!hasActiveFilters && (
              <span className="text-[#94A3B8] italic">No active filters (showing all)</span>
            )}

            {hasActiveFilters && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="text-[#DC2626] hover:text-[#991B1B] font-bold hover:underline ml-1 cursor-pointer flex items-center gap-0.5"
              >
                <span className="material-symbols-outlined text-[14px]">restart_alt</span>
                Clear All
              </button>
            )}
          </div>

          <div className="font-semibold text-[#64748B] shrink-0">
            Showing <span className="text-[#0F172A] font-bold">{displayedItems.length}</span> of{' '}
            <span className="text-[#0F172A] font-bold">{filteredItems.length}</span> items
          </div>
        </div>
      </div>

      {/* Stock Cards Grid or Table View */}
      {displayedItems.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-[#E2E8F0] p-8 shadow-xs">
          <div className="w-16 h-16 rounded-full bg-[#F1F5F9] text-[#94A3B8] flex items-center justify-center mx-auto mb-3">
            <span className="material-symbols-outlined text-3xl">filter_alt_off</span>
          </div>
          <h3 className="font-['Noto_Serif',serif] text-xl font-bold text-[#0F172A]">
            No inventory matches current filters
          </h3>
          <p className="text-sm text-[#475569] mt-1 max-w-md mx-auto">
            {hasActiveFilters
              ? 'Try resetting the filters or modifying your search keyword to view more items.'
              : 'There are currently no items in this inventory catalog.'}
          </p>
          <div className="mt-5 flex items-center justify-center gap-3">
            {hasActiveFilters && (
              <button
                onClick={handleResetFilters}
                className="px-5 py-2.5 bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#0F172A] rounded-full text-xs font-bold uppercase tracking-wider cursor-pointer"
              >
                Reset All Filters
              </button>
            )}
            <button
              onClick={onOpenAddItem}
              className="px-5 py-2.5 bg-[#1E40AF] text-white rounded-full text-xs font-bold uppercase tracking-wider hover:bg-[#1D4ED8] cursor-pointer"
            >
              + Add New Item
            </button>
          </div>
        </div>
      ) : viewMode === 'grid' ? (
        /* GRID VIEW */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedItems.map((item) => {
            const isCritical = item.quantity <= item.minQuantity * 0.3;
            const isLow = item.quantity <= item.minQuantity && !isCritical;
            const percentage = Math.min(100, Math.round((item.quantity / (item.minQuantity || 1)) * 100));

            return (
              <div
                key={item.id}
                id={`stock-card-${item.id}`}
                className={`bg-white rounded-3xl p-6 border transition-all duration-200 hover:shadow-md flex flex-col justify-between relative overflow-hidden ${
                  isCritical
                    ? 'border-[#DC2626]/30 shadow-xs'
                    : isLow
                    ? 'border-[#D97706]/30 shadow-xs'
                    : 'border-[#E2E8F0]'
                }`}
              >
                {/* Top Corner Visual Accent */}
                {isCritical && (
                  <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-[#FEE2E2] to-transparent pointer-events-none rounded-tr-3xl" />
                )}
                {isLow && (
                  <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-[#FEF3C7] to-transparent pointer-events-none rounded-tr-3xl" />
                )}
                {!isCritical && !isLow && (
                  <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-[#EFF6FF] to-transparent pointer-events-none rounded-tr-3xl" />
                )}

                <div>
                  {/* Card Header */}
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="font-['Noto_Serif',serif] text-xl font-bold text-[#0F172A] leading-tight">
                      {item.name}
                    </h3>
                    <div className="shrink-0">{getStatusBadge(item)}</div>
                  </div>

                  {/* Subtitle / Category / Code */}
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-xs font-semibold text-[#0284C7] tracking-widest uppercase">
                      {item.categoryLabel} • {item.code}
                    </p>
                  </div>

                  {/* Quantity & Min Indicator */}
                  <div className="flex items-baseline justify-between mb-2">
                    <div className="flex items-baseline gap-2">
                      <span className="font-['Noto_Serif',serif] text-4xl sm:text-5xl font-bold text-[#0F172A]">
                        {item.quantity}
                      </span>
                      <span className="text-sm font-medium text-[#64748B]">{item.unit}</span>
                    </div>

                    <div className="bg-[#F8FAFC] px-3.5 py-1 rounded-full border border-[#E2E8F0] text-xs font-semibold text-[#64748B]">
                      Min: <span className="text-[#0F172A] font-bold">{item.minQuantity}</span>
                    </div>
                  </div>

                  {/* Stock Level Progress Bar */}
                  <div className="mb-4">
                    <div className="w-full bg-[#E2E8F0] h-1.5 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${
                          isCritical ? 'bg-[#DC2626]' : isLow ? 'bg-[#D97706]' : 'bg-[#059669]'
                        }`}
                        style={{ width: `${Math.min(100, Math.max(5, percentage))}%` }}
                      />
                    </div>
                    <div className="flex justify-between items-center text-[10px] text-[#64748B] mt-1">
                      <span>{percentage}% of min threshold</span>
                      {item.expiryDate && <span>Exp: {item.expiryDate}</span>}
                    </div>
                  </div>

                  {/* Metadata Row: Location, Vendor, Lot & Batch */}
                  <div className="text-[11px] text-[#64748B] mb-4 space-y-2 border-t border-[#E2E8F0]/70 pt-2.5">
                    <div className="flex items-center justify-between gap-2">
                      {item.location ? (
                        <div className="flex items-center gap-1.5 truncate">
                          <span className="material-symbols-outlined text-[14px] text-[#94A3B8]">
                            location_on
                          </span>
                          <span className="truncate">
                            Loc: <strong className="text-[#0F172A]">{item.location}</strong>
                          </span>
                        </div>
                      ) : (
                        <span />
                      )}
                      {item.supplier && (
                        <div className="flex items-center gap-1.5 shrink-0 text-[10px] text-[#64748B]">
                          <span className="material-symbols-outlined text-[13px] text-[#94A3B8]">
                            storefront
                          </span>
                          <span>{item.supplier}</span>
                        </div>
                      )}
                    </div>

                    {/* Interactive Lot Batch Bar */}
                    {item.lotNumber ? (
                      <div className="bg-[#F8FAFC] border border-[#CBD5E1] rounded-2xl p-2.5 space-y-1.5">
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-1.5 min-w-0">
                            <span className="material-symbols-outlined text-[15px] text-[#1E40AF] shrink-0">
                              qr_code_2
                            </span>
                            <div className="truncate">
                              <span className="text-[10px] font-bold uppercase text-[#64748B] mr-1">
                                Lot
                              </span>
                              <code className="text-[#0F172A] font-mono font-bold text-xs bg-white px-1.5 py-0.5 rounded border border-[#E2E8F0]">
                                {item.lotNumber}
                              </code>
                            </div>
                          </div>

                          {/* Lot Actions: Change and Delete */}
                          <div className="flex items-center gap-1 shrink-0">
                            <button
                              type="button"
                              onClick={() => setLotModalItem(item)}
                              className="px-2 py-0.5 rounded-lg text-[10px] font-bold text-[#1E40AF] bg-blue-50 hover:bg-blue-100 border border-blue-200 transition-colors flex items-center gap-1 cursor-pointer"
                              title="Change / Update Lot"
                            >
                              <span className="material-symbols-outlined text-[13px]">
                                published_with_changes
                              </span>
                              <span>Change</span>
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                setDirectLotDeleteConfirm({ item, lotNumber: item.lotNumber })
                              }
                              className="p-1 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                              title="Delete Lot"
                            >
                              <span className="material-symbols-outlined text-[15px]">delete</span>
                            </button>
                          </div>
                        </div>

                        {item.expiryDate && (
                          <div className="flex items-center justify-between text-[10px] text-[#64748B] pt-1 border-t border-slate-200/60">
                            <span className="flex items-center gap-1">
                              <span className="material-symbols-outlined text-[12px] text-slate-400">
                                event
                              </span>
                              Exp: <strong className="text-slate-700">{item.expiryDate}</strong>
                            </span>
                            {item.lots && item.lots.length > 1 && (
                              <span className="px-1.5 py-0.2 rounded text-[9px] font-bold uppercase bg-slate-200 text-slate-700">
                                {item.lots.length} Batches
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="flex items-center justify-between text-[11px] bg-slate-50 border border-dashed border-slate-300 rounded-2xl px-3 py-2">
                        <span className="text-slate-400 italic text-xs flex items-center gap-1">
                          <span className="material-symbols-outlined text-[14px]">tag</span>
                          No lot assigned
                        </span>
                        <button
                          type="button"
                          onClick={() => setLotModalItem(item)}
                          className="px-2.5 py-1 rounded-xl text-[10px] font-bold uppercase tracking-wider text-[#1E40AF] hover:bg-blue-50 border border-blue-200 transition-colors cursor-pointer flex items-center gap-1"
                        >
                          <span className="material-symbols-outlined text-[13px]">add</span>
                          Set Lot
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Controls */}
                <div className="pt-2 border-t border-[#F1F5F9]">
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => onUpdateQuantity(item.id, -1)}
                      className="py-2.5 px-4 rounded-full bg-[#F1F5F9] hover:bg-[#E2E8F0] active:bg-[#CBD5E1] text-[#0F172A] font-bold text-lg flex items-center justify-center transition-all cursor-pointer shadow-2xs active:scale-95"
                      aria-label="Decrease quantity"
                    >
                      <span className="material-symbols-outlined text-[20px]">remove</span>
                    </button>
                    <button
                      onClick={() => onUpdateQuantity(item.id, 1)}
                      className="py-2.5 px-4 rounded-full bg-[#DBEAFE] hover:bg-[#BFDBFE] active:bg-[#1E40AF] active:text-white text-[#1E40AF] font-bold text-lg flex items-center justify-center transition-all cursor-pointer shadow-2xs active:scale-95"
                      aria-label="Increase quantity"
                    >
                      <span className="material-symbols-outlined text-[20px]">add</span>
                    </button>
                  </div>

                  <div className="flex items-center justify-between mt-3">
                    {(isCritical || isLow) ? (
                      <button
                        onClick={() => handleRestockOrder(item.name)}
                        className="py-1 text-xs text-[#0284C7] hover:text-[#0369A1] font-bold hover:underline flex items-center gap-1.5 cursor-pointer uppercase tracking-wider"
                      >
                        <span className="material-symbols-outlined text-[14px]">local_shipping</span>
                        Restock
                      </button>
                    ) : (
                      <span className="text-[11px] text-[#94A3B8] font-medium">Stock Sufficient</span>
                    )}

                    <button
                      type="button"
                      onClick={() => setItemToDelete(item)}
                      className="text-xs text-[#94A3B8] hover:text-[#DC2626] p-1 rounded-md transition-colors cursor-pointer"
                      title="Delete item"
                    >
                      <span className="material-symbols-outlined text-[16px]">delete</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* TABLE / MATRIX VIEW */
        <div className="bg-white rounded-3xl border border-[#E2E8F0] shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[#64748B] uppercase font-bold tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">Item & Code</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-center">In Stock / Min</th>
                  <th className="py-3.5 px-4">Location</th>
                  <th className="py-3.5 px-4">Lot & Expiry</th>
                  <th className="py-3.5 px-4">Supplier</th>
                  <th className="py-3.5 px-4 text-right">Adjust Stock</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0]">
                {displayedItems.map((item) => {
                  const isCritical = item.quantity <= item.minQuantity * 0.3;
                  const isLow = item.quantity <= item.minQuantity && !isCritical;

                  return (
                    <tr
                      key={item.id}
                      className={`hover:bg-[#F8FAFC] transition-colors ${
                        isCritical ? 'bg-red-50/30' : isLow ? 'bg-amber-50/20' : ''
                      }`}
                    >
                      <td className="py-3 px-4">
                        <p className="font-bold text-[#0F172A] text-sm">{item.name}</p>
                        <p className="text-[11px] font-mono text-[#64748B]">{item.code}</p>
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2.5 py-1 rounded-full bg-[#F1F5F9] text-[#475569] font-semibold text-[10px] uppercase">
                          {item.categoryLabel}
                        </span>
                      </td>
                      <td className="py-3 px-4">{getStatusBadge(item)}</td>
                      <td className="py-3 px-4 text-center">
                        <div className="inline-flex items-baseline gap-1">
                          <span
                            className={`font-['Noto_Serif',serif] font-bold text-base ${
                              isCritical
                                ? 'text-[#DC2626]'
                                : isLow
                                ? 'text-[#D97706]'
                                : 'text-[#0F172A]'
                            }`}
                          >
                            {item.quantity}
                          </span>
                          <span className="text-[#94A3B8] font-normal text-[11px]">
                            / {item.minQuantity} {item.unit}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-[#475569] font-medium">
                        {item.location || '—'}
                      </td>
                      <td className="py-3 px-4 text-[#64748B] text-[11px]">
                        {item.lotNumber ? (
                          <div className="space-y-1">
                            <div className="flex items-center gap-1.5">
                              <code className="font-mono font-bold text-[#0F172A] bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200 text-[11px]">
                                {item.lotNumber}
                              </code>
                              <div className="inline-flex items-center gap-0.5">
                                <button
                                  type="button"
                                  onClick={() => setLotModalItem(item)}
                                  className="p-1 text-[#1E40AF] hover:bg-blue-100 rounded transition-colors cursor-pointer"
                                  title="Change / Update Lot"
                                >
                                  <span className="material-symbols-outlined text-[14px]">
                                    published_with_changes
                                  </span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() =>
                                    setDirectLotDeleteConfirm({ item, lotNumber: item.lotNumber })
                                  }
                                  className="p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors cursor-pointer"
                                  title="Delete Lot"
                                >
                                  <span className="material-symbols-outlined text-[14px]">
                                    delete
                                  </span>
                                </button>
                              </div>
                            </div>
                            {item.expiryDate && (
                              <div className="text-[10px] text-[#64748B] flex items-center gap-1">
                                <span className="material-symbols-outlined text-[12px] text-slate-400">
                                  event
                                </span>
                                <span>Exp: <strong className="text-slate-700">{item.expiryDate}</strong></span>
                              </div>
                            )}
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setLotModalItem(item)}
                            className="text-[11px] font-bold text-[#1E40AF] hover:underline flex items-center gap-1 cursor-pointer"
                          >
                            <span className="material-symbols-outlined text-[13px]">add_circle</span>
                            Assign Lot
                          </button>
                        )}
                      </td>
                      <td className="py-3 px-4 text-[#475569]">{item.supplier || '—'}</td>
                      <td className="py-3 px-4 text-right">
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            onClick={() => onUpdateQuantity(item.id, -1)}
                            className="w-7 h-7 rounded-full bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#0F172A] flex items-center justify-center font-bold cursor-pointer"
                            title="Decrease by 1"
                          >
                            -
                          </button>
                          <button
                            onClick={() => onUpdateQuantity(item.id, 1)}
                            className="w-7 h-7 rounded-full bg-[#DBEAFE] hover:bg-[#BFDBFE] text-[#1E40AF] flex items-center justify-center font-bold cursor-pointer"
                            title="Increase by 1"
                          >
                            +
                          </button>
                          <button
                            onClick={() => setItemToDelete(item)}
                            className="w-7 h-7 rounded-full hover:bg-red-50 text-[#94A3B8] hover:text-[#DC2626] flex items-center justify-center cursor-pointer ml-1"
                            title="Delete Item"
                          >
                            <span className="material-symbols-outlined text-[15px]">delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Load More Inventory */}
      {hasMore && (
        <div className="pt-4 text-center">
          <button
            id="btn-load-more-inventory"
            onClick={() => setVisibleLimit((prev) => prev + 12)}
            className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-bold text-[#1E40AF] hover:text-[#1D4ED8] hover:underline cursor-pointer py-2 px-6 rounded-full border border-[#1E40AF]/30 hover:bg-[#EFF6FF] transition-colors"
          >
            <span>Load More ({filteredItems.length - displayedItems.length} remaining)</span>
            <span className="material-symbols-outlined text-[18px]">expand_more</span>
          </button>
        </div>
      )}

      {/* Delete Item Confirmation Modal */}
      {itemToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white w-full max-w-sm rounded-3xl shadow-2xl border border-[#E2E8F0] p-6 space-y-4 animate-in zoom-in-95 duration-150">
            <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mx-auto">
              <span className="material-symbols-outlined text-2xl">delete</span>
            </div>
            <div className="text-center">
              <h3 className="font-['Noto_Serif',serif] font-bold text-lg text-[#0F172A]">
                Delete Stock Item?
              </h3>
              <p className="text-xs text-[#64748B] mt-1">
                Are you sure you want to remove <strong>{itemToDelete.name}</strong> ({itemToDelete.code}) from your private inventory dataset?
              </p>
            </div>
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setItemToDelete(null)}
                className="flex-1 py-2.5 rounded-full border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  onDeleteItem(itemToDelete.id);
                  setItemToDelete(null);
                }}
                className="flex-1 py-2.5 rounded-full bg-red-600 text-white text-xs font-bold hover:bg-red-700 cursor-pointer shadow-xs"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Change / Manage Lot Modal */}
      <ChangeLotModal
        isOpen={Boolean(lotModalItem)}
        onClose={() => setLotModalItem(null)}
        item={lotModalItem}
        onSaveLot={onSaveLot}
        onDeleteLot={onDeleteLot}
        onSwitchActiveLot={onSwitchActiveLot}
      />

      {/* Direct Delete Lot Confirmation Modal */}
      {directLotDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white w-full max-w-sm rounded-3xl shadow-2xl border border-[#E2E8F0] p-6 space-y-4 animate-in zoom-in-95 duration-150 font-['Public_Sans',sans-serif]">
            <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mx-auto">
              <span className="material-symbols-outlined text-2xl">delete_sweep</span>
            </div>
            <div className="text-center">
              <h3 className="font-['Noto_Serif',serif] font-bold text-lg text-[#0F172A]">
                Delete Lot Batch?
              </h3>
              <p className="text-xs text-[#64748B] mt-1 leading-relaxed">
                Are you sure you want to delete Lot{' '}
                <strong className="font-mono text-red-600">
                  {directLotDeleteConfirm.lotNumber || directLotDeleteConfirm.item.lotNumber}
                </strong>{' '}
                from <strong>{directLotDeleteConfirm.item.name}</strong>?
                <br />
                <span className="text-[11px] text-slate-500 mt-1 block">
                  The on-hand inventory count ({directLotDeleteConfirm.item.quantity}{' '}
                  {directLotDeleteConfirm.item.unit}) will remain in stock.
                </span>
              </p>
            </div>
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDirectLotDeleteConfirm(null)}
                className="flex-1 py-2.5 rounded-full border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  onDeleteLot(
                    directLotDeleteConfirm.item.id,
                    directLotDeleteConfirm.lotNumber
                  );
                  setDirectLotDeleteConfirm(null);
                }}
                className="flex-1 py-2.5 rounded-full bg-red-600 text-white text-xs font-bold hover:bg-red-700 cursor-pointer shadow-xs"
              >
                Delete Lot
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
