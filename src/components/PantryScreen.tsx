import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  Plus, 
  Flame, 
  Clock, 
  CheckCircle2, 
  Trash2, 
  SlidersHorizontal,
  ChefHat,
  Sparkles,
  Info
} from 'lucide-react';
import { PantryItem, StorageZone } from '../types';
import { playPillClickSound } from '../utils/audio';

interface PantryScreenProps {
  items: PantryItem[];
  selectedItemIdsForRecipe: string[];
  onToggleSelectItemForRecipe: (id: string) => void;
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemoveItem: (id: string) => void;
  onOpenAddModal: () => void;
  onGenerateFromSelection: () => void;
}

type ExpirationFilter = 'all' | 'urgent' | 'soon' | 'fresh';

export const PantryScreen: React.FC<PantryScreenProps> = ({
  items,
  selectedItemIdsForRecipe,
  onToggleSelectItemForRecipe,
  onUpdateQuantity,
  onRemoveItem,
  onOpenAddModal,
  onGenerateFromSelection,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [expiryFilter, setExpiryFilter] = useState<ExpirationFilter>('all');
  const [zoneFilter, setZoneFilter] = useState<StorageZone | 'all'>('all');

  const urgentCount = useMemo(() => items.filter(i => i.daysRemaining <= 1).length, [items]);
  const soonCount = useMemo(() => items.filter(i => i.daysRemaining > 1 && i.daysRemaining <= 3).length, [items]);
  const freshCount = useMemo(() => items.filter(i => i.daysRemaining > 3).length, [items]);

  const filteredItems = useMemo(() => {
    return items.filter(item => {
      // Search
      if (searchQuery.trim() && !item.name.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }
      // Expiration
      if (expiryFilter === 'urgent' && item.daysRemaining > 1) return false;
      if (expiryFilter === 'soon' && (item.daysRemaining <= 1 || item.daysRemaining > 3)) return false;
      if (expiryFilter === 'fresh' && item.daysRemaining <= 3) return false;
      // Zone
      if (zoneFilter !== 'all' && item.storageZone !== zoneFilter) return false;
      return true;
    });
  }, [items, searchQuery, expiryFilter, zoneFilter]);

  const zones: { id: StorageZone | 'all'; label: string }[] = [
    { id: 'all', label: 'All Zones' },
    { id: 'crisper', label: 'Crisper' },
    { id: 'fridge', label: 'Fridge' },
    { id: 'pantry', label: 'Pantry' },
    { id: 'counter', label: 'Counter' },
    { id: 'freezer', label: 'Freezer' },
  ];

  return (
    <div className="space-y-5 pb-28">
      {/* Top Welcome & Urgency Banner */}
      <section className="bg-linear-to-r from-[#2E5A44] to-[#15422E] rounded-3xl p-5 text-white shadow-md relative overflow-hidden">
        <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none translate-x-4 translate-y-4">
          <ChefHat className="w-48 h-48" />
        </div>

        <div className="relative z-10 space-y-3">
          <div className="flex items-center gap-2">
            <span className="bg-[#A0CFB4]/20 border border-[#A0CFB4]/30 text-[#A0CFB4] text-[11px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              Conscious Pantry
            </span>
            <span className="text-xs text-white/70">
              {items.length} items logged
            </span>
          </div>

          <h2 className="font-editorial text-2xl font-bold tracking-tight text-[#FBF9F5]">
            Keep freshness high, waste at zero.
          </h2>

          {urgentCount > 0 ? (
            <div className="bg-[#FD6F49]/20 border border-[#FD6F49]/40 rounded-2xl p-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-[#E05A36] flex items-center justify-center shrink-0">
                  <Flame className="w-4 h-4 text-white" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white">
                    {urgentCount} ingredient{urgentCount > 1 ? 's' : ''} expiring today or tomorrow!
                  </div>
                  <div className="text-[11px] text-white/80">
                    Rescue them now before they spoil.
                  </div>
                </div>
              </div>

              <button
                onClick={onGenerateFromSelection}
                className="w-full sm:w-auto px-3.5 py-1.5 rounded-xl bg-white text-[#AB3513] hover:bg-[#F5F3EF] text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-1.5 shrink-0"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#E05A36]" />
                <span>Find Rescue Recipes</span>
              </button>
            </div>
          ) : (
            <div className="text-xs text-white/80 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#A0CFB4]" />
              <span>All fresh! You have saved $32 in groceries this week.</span>
            </div>
          )}
        </div>
      </section>

      {/* Search and Filters Bar */}
      <div className="space-y-3">
        {/* Search input */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#717973]" />
          <input
            type="text"
            placeholder="Search produce, dairy, grains..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-[#EAE8E4] focus:border-[#2E5A44] focus:ring-2 focus:ring-[#2E5A44]/15 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-[#1B1C1A] placeholder:text-[#717973] outline-hidden transition-all shadow-xs"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#717973] hover:text-[#1B1C1A]"
            >
              Clear
            </button>
          )}
        </div>

        {/* Urgency Tier Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar text-xs">
          <button
            onClick={() => {
              playPillClickSound();
              setExpiryFilter('all');
            }}
            className={`px-3 py-1.5 rounded-full font-semibold transition-all shrink-0 cursor-pointer ${
              expiryFilter === 'all'
                ? 'bg-[#15422E] text-white shadow-xs'
                : 'bg-white text-[#414943] border border-[#EAE8E4] hover:bg-[#F5F3EF]'
            }`}
          >
            All Items ({items.length})
          </button>

          <button
            onClick={() => {
              playPillClickSound();
              setExpiryFilter('urgent');
            }}
            className={`px-3 py-1.5 rounded-full font-semibold transition-all shrink-0 flex items-center gap-1.5 cursor-pointer ${
              expiryFilter === 'urgent'
                ? 'bg-[#BA1A1A] text-white shadow-xs'
                : 'bg-[#FEE2E2] text-[#BA1A1A] border border-[#FFDAD6] hover:brightness-95'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-[#BA1A1A] inline-block" />
            <span>Expiring &lt;48h ({urgentCount})</span>
          </button>

          <button
            onClick={() => {
              playPillClickSound();
              setExpiryFilter('soon');
            }}
            className={`px-3 py-1.5 rounded-full font-semibold transition-all shrink-0 flex items-center gap-1.5 cursor-pointer ${
              expiryFilter === 'soon'
                ? 'bg-[#C36800] text-white shadow-xs'
                : 'bg-[#FEF3C7] text-[#C36800] border border-[#FDE68A] hover:brightness-95'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-[#C36800] inline-block" />
            <span>Soon 2-3d ({soonCount})</span>
          </button>

          <button
            onClick={() => {
              playPillClickSound();
              setExpiryFilter('fresh');
            }}
            className={`px-3 py-1.5 rounded-full font-semibold transition-all shrink-0 flex items-center gap-1.5 cursor-pointer ${
              expiryFilter === 'fresh'
                ? 'bg-[#2D7A4F] text-white shadow-xs'
                : 'bg-[#E7F4EB] text-[#2D7A4F] border border-[#BDEED0] hover:brightness-95'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-[#2D7A4F] inline-block" />
            <span>Fresh 5d+ ({freshCount})</span>
          </button>
        </div>

        {/* Storage Zone Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px]">
          {zones.map((zone) => (
            <button
              key={zone.id}
              onClick={() => {
                playPillClickSound();
                setZoneFilter(zone.id);
              }}
              className={`px-2.5 py-1 rounded-lg transition-all shrink-0 cursor-pointer ${
                zoneFilter === zone.id
                  ? 'bg-[#2E5A44]/10 text-[#15422E] font-bold border border-[#2E5A44]/20'
                  : 'text-[#717973] hover:text-[#1B1C1A] hover:bg-white'
              }`}
            >
              {zone.label}
            </button>
          ))}
        </div>
      </div>

      {/* Floating Selected for Recipe Bar */}
      {selectedItemIdsForRecipe.length > 0 && (
        <div className="sticky top-16 z-30 bg-[#15422E] text-white p-3 rounded-2xl shadow-lg border border-[#2E5A44] flex items-center justify-between gap-3 animate-in fade-in slide-in-from-top-1">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-[#E05A36] text-white flex items-center justify-center text-xs font-bold">
              {selectedItemIdsForRecipe.length}
            </div>
            <span className="text-xs font-medium">
              items picked for custom recipe match
            </span>
          </div>
          <button
            onClick={onGenerateFromSelection}
            className="px-3 py-1.5 rounded-xl bg-[#E05A36] hover:bg-[#AB3513] text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Match Recipes</span>
          </button>
        </div>
      )}

      {/* Ingredient Items Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {filteredItems.length === 0 ? (
          <div className="col-span-full py-16 text-center bg-white rounded-3xl border border-[#EAE8E4] p-8 space-y-3">
            <div className="w-12 h-12 rounded-full bg-[#F5F3EF] flex items-center justify-center mx-auto text-[#717973]">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="font-editorial text-lg font-bold text-[#1B1C1A]">
              No items match this filter
            </h3>
            <p className="text-xs text-[#717973] max-w-sm mx-auto">
              Try clearing your search query or selecting a different expiration tier.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setExpiryFilter('all');
                setZoneFilter('all');
              }}
              className="px-4 py-2 rounded-xl bg-[#2E5A44] text-white text-xs font-semibold hover:bg-[#15422E] transition-all"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          filteredItems.map((item) => {
            const isSelected = selectedItemIdsForRecipe.includes(item.id);
            const isUrgent = item.daysRemaining <= 1;
            const isSoon = item.daysRemaining > 1 && item.daysRemaining <= 3;

            return (
              <div
                key={item.id}
                className={`group bg-white rounded-2xl border transition-all duration-200 overflow-hidden shadow-xs hover:shadow-md flex flex-col justify-between ${
                  isSelected 
                    ? 'border-[#2E5A44] ring-2 ring-[#2E5A44]/20 bg-[#FBF9F5]' 
                    : isUrgent 
                      ? 'border-[#FD6F49]/40 hover:border-[#E05A36]' 
                      : 'border-[#EAE8E4] hover:border-[#C1C9C1]'
                }`}
              >
                {/* Card Top Details */}
                <div className="p-3.5 space-y-3">
                  <div className="flex items-start gap-3">
                    {/* Item Image with Selection checkbox */}
                    <div className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0 bg-[#F5F3EF] border border-[#EAE8E4]">
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <button
                        onClick={() => onToggleSelectItemForRecipe(item.id)}
                        title={isSelected ? "Remove from recipe match" : "Include in recipe match"}
                        className={`absolute top-1 left-1 w-5 h-5 rounded-md flex items-center justify-center transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#2E5A44] text-white'
                            : 'bg-white/80 backdrop-blur-xs text-transparent hover:text-gray-400 border border-gray-300'
                        }`}
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Meta & Expiration Badge */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-1.5">
                        <h4 className="text-sm font-bold text-[#1B1C1A] truncate">
                          {item.name}
                        </h4>
                      </div>

                      <div className="text-[11px] text-[#717973] capitalize mt-0.5">
                        {item.category} • <span className="font-medium text-[#414943]">{item.storageZone}</span>
                      </div>

                      {/* Expiration Chip */}
                      <div className="mt-2">
                        {isUrgent ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#FEE2E2] text-[#BA1A1A] border border-[#FFDAD6]">
                            <Clock className="w-3 h-3" />
                            <span>Expires Today / 24h</span>
                          </span>
                        ) : isSoon ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#FEF3C7] text-[#C36800] border border-[#FDE68A]">
                            <Clock className="w-3 h-3" />
                            <span>{item.daysRemaining} days left</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#E7F4EB] text-[#2D7A4F] border border-[#BDEED0]">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>{item.daysRemaining} days left</span>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Notes / Culinary Storage Tip */}
                  {item.notes && (
                    <div className="text-[11px] text-[#414943] bg-[#F5F3EF] px-2.5 py-1.5 rounded-lg flex items-start gap-1.5">
                      <Info className="w-3.5 h-3.5 text-[#2E5A44] shrink-0 mt-0.5" />
                      <span className="line-clamp-2">{item.notes}</span>
                    </div>
                  )}
                </div>

                {/* Card Bottom Quantity Controls & Actions */}
                <div className="px-3.5 py-2.5 bg-[#FAF9F6] border-t border-[#EAE8E4] flex items-center justify-between gap-2">
                  {/* Quantity Stepper */}
                  <div className="flex items-center gap-2 bg-white px-2 py-1 rounded-xl border border-[#EAE8E4] shadow-2xs">
                    <button
                      onClick={() => onUpdateQuantity(item.id, -1)}
                      className="w-5 h-5 flex items-center justify-center text-[#717973] hover:text-[#BA1A1A] font-bold text-xs rounded hover:bg-gray-100 transition-colors"
                      title="Decrease quantity"
                    >
                      -
                    </button>
                    <span className="text-xs font-bold text-[#1B1C1A] min-w-[36px] text-center">
                      {item.quantity} {item.unit}
                    </span>
                    <button
                      onClick={() => onUpdateQuantity(item.id, 1)}
                      className="w-5 h-5 flex items-center justify-center text-[#717973] hover:text-[#2E5A44] font-bold text-xs rounded hover:bg-gray-100 transition-colors"
                      title="Increase quantity"
                    >
                      +
                    </button>
                  </div>

                  {/* Right actions */}
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => onToggleSelectItemForRecipe(item.id)}
                      className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#2E5A44] text-white'
                          : 'bg-white text-[#2E5A44] border border-[#2E5A44]/30 hover:bg-[#E7F4EB]'
                      }`}
                    >
                      {isSelected ? 'Selected' : 'Pick to Cook'}
                    </button>

                    <button
                      onClick={() => onRemoveItem(item.id)}
                      className="p-1.5 text-[#717973] hover:text-[#BA1A1A] hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete item"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
