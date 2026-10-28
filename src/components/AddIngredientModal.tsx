import React, { useState } from 'react';
import { X, Sparkles, Plus, Calendar, Tag, MapPin } from 'lucide-react';
import { PantryItem, StorageZone } from '../types';

interface AddIngredientModalProps {
  onClose: () => void;
  onAddItem: (item: Omit<PantryItem, 'id'>) => void;
}

export const AddIngredientModal: React.FC<AddIngredientModalProps> = ({
  onClose,
  onAddItem,
}) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState<PantryItem['category']>('Produce');
  const [quantity, setQuantity] = useState<number>(1);
  const [unit, setUnit] = useState<string>('pcs');
  const [storageZone, setStorageZone] = useState<StorageZone>('crisper');
  const [daysRemaining, setDaysRemaining] = useState<number>(3);
  const [notes, setNotes] = useState('');

  const categoryPresets: PantryItem['category'][] = [
    'Produce',
    'Dairy & Eggs',
    'Proteins',
    'Bakery',
    'Grains & Pasta',
    'Condiments & Spices',
    'Canned & Jarred'
  ];

  const quickShelfLives = [
    { label: 'Today (1d)', days: 1 },
    { label: 'Soon (3d)', days: 3 },
    { label: '1 Week (7d)', days: 7 },
    { label: '2 Weeks (14d)', days: 14 },
    { label: '1 Month (30d)', days: 30 },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    // Pick an appropriate default image based on category
    let defaultImg = 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=400&q=80';
    if (category === 'Dairy & Eggs') defaultImg = 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?auto=format&fit=crop&w=400&q=80';
    if (category === 'Proteins') defaultImg = 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?auto=format&fit=crop&w=400&q=80';
    if (category === 'Bakery') defaultImg = 'https://images.unsplash.com/photo-1589367920969-ab8e050bbb04?auto=format&fit=crop&w=400&q=80';
    if (category === 'Grains & Pasta') defaultImg = 'https://images.unsplash.com/photo-1621996346565-e3d5d6281223?auto=format&fit=crop&w=400&q=80';
    if (category === 'Condiments & Spices') defaultImg = 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=400&q=80';

    onAddItem({
      name: name.trim(),
      category,
      quantity: Number(quantity) || 1,
      unit,
      storageZone,
      daysRemaining: Number(daysRemaining) || 3,
      expiryDate: new Date(Date.now() + (Number(daysRemaining) || 3) * 86400000).toISOString(),
      imageUrl: defaultImg,
      notes: notes.trim() || undefined,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white max-w-md w-full rounded-3xl overflow-hidden shadow-2xl border border-[#EAE8E4]">
        {/* Header */}
        <div className="p-4 bg-[#FBF9F5] border-b border-[#EAE8E4] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#2E5A44] text-white flex items-center justify-center">
              <Plus className="w-4 h-4 text-[#A0CFB4]" />
            </div>
            <div>
              <h3 className="font-editorial text-base font-bold text-[#1B1C1A]">
                Add Ingredient to Pantry
              </h3>
              <p className="text-[11px] text-[#717973]">
                Track shelf life and prevent food spoilage
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-[#EAE8E4] text-[#717973] flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {/* Ingredient Name */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-[#1B1C1A]">
              Ingredient Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Baby Spinach, Ripe Avocados, Greek Feta"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-[#FBF9F5] border border-[#EAE8E4] focus:border-[#2E5A44] rounded-xl px-3.5 py-2.5 text-xs text-[#1B1C1A] outline-hidden shadow-2xs"
            />
          </div>

          {/* Category */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#1B1C1A]">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as PantryItem['category'])}
              className="w-full bg-[#FBF9F5] border border-[#EAE8E4] focus:border-[#2E5A44] rounded-xl px-3 py-2 text-xs text-[#1B1C1A] outline-hidden cursor-pointer"
            >
              {categoryPresets.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Quantity and Unit */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-bold text-[#1B1C1A]">Quantity</label>
              <input
                type="number"
                min="0.1"
                step="0.5"
                value={quantity}
                onChange={(e) => setQuantity(parseFloat(e.target.value) || 1)}
                className="w-full bg-[#FBF9F5] border border-[#EAE8E4] focus:border-[#2E5A44] rounded-xl px-3 py-2 text-xs text-[#1B1C1A] outline-hidden"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-[#1B1C1A]">Unit</label>
              <input
                type="text"
                placeholder="e.g. g, pcs, bunch, cans, ml"
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                className="w-full bg-[#FBF9F5] border border-[#EAE8E4] focus:border-[#2E5A44] rounded-xl px-3 py-2 text-xs text-[#1B1C1A] outline-hidden"
              />
            </div>
          </div>

          {/* Storage Zone */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#1B1C1A]">
              Storage Zone
            </label>
            <div className="grid grid-cols-5 gap-1.5 text-center text-[11px]">
              {(['crisper', 'fridge', 'pantry', 'counter', 'freezer'] as StorageZone[]).map((zone) => (
                <button
                  key={zone}
                  type="button"
                  onClick={() => setStorageZone(zone)}
                  className={`py-1.5 px-1 rounded-xl capitalize font-semibold transition-all cursor-pointer ${
                    storageZone === zone
                      ? 'bg-[#2E5A44] text-white shadow-xs'
                      : 'bg-[#F5F3EF] text-[#414943] hover:bg-[#EAE8E4]'
                  }`}
                >
                  {zone}
                </button>
              ))}
            </div>
          </div>

          {/* Expiration Preset Chips */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#1B1C1A] flex items-center justify-between">
              <span>Expected Freshness</span>
              <span className="text-[11px] text-[#2E5A44]">
                {daysRemaining} day{daysRemaining > 1 ? 's' : ''} left
              </span>
            </label>
            <div className="flex flex-wrap gap-1.5">
              {quickShelfLives.map((preset) => (
                <button
                  key={preset.days}
                  type="button"
                  onClick={() => setDaysRemaining(preset.days)}
                  className={`text-[11px] px-2.5 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                    daysRemaining === preset.days
                      ? 'bg-[#E05A36] text-white shadow-xs'
                      : 'bg-[#F5F3EF] text-[#414943] hover:bg-[#EAE8E4]'
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-[#1B1C1A]">
              Storage Notes (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Keep in crisper drawer with paper towel"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-[#FBF9F5] border border-[#EAE8E4] focus:border-[#2E5A44] rounded-xl px-3 py-2 text-xs text-[#1B1C1A] outline-hidden"
            />
          </div>

          {/* Submit */}
          <div className="pt-2 flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="py-2.5 px-4 rounded-xl border border-[#C1C9C1] text-xs font-semibold text-[#414943] hover:bg-[#F5F3EF] cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 px-4 rounded-xl bg-[#2E5A44] hover:bg-[#15422E] text-white text-xs font-bold transition-all shadow-md cursor-pointer"
            >
              Save Ingredient
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
