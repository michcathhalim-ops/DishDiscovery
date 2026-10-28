import React, { useState } from 'react';
import { 
  X, 
  Camera, 
  Sparkles, 
  Check, 
  RefreshCw, 
  Upload, 
  CheckCircle2, 
  Flame, 
  Scan,
  Maximize2
} from 'lucide-react';
import { PantryItem } from '../types';
import { playCameraShutterSound, playPillClickSound } from '../utils/audio';

interface DetectedItem {
  id: string;
  name: string;
  category: PantryItem['category'];
  storageZone: PantryItem['storageZone'];
  confidence: number; // e.g. 96
  estimatedDays: number;
  quantity: number;
  unit: string;
  imageUrl: string;
  boxCoordinates: { top: number; left: number; width: number; height: number };
}

interface ScannerModalProps {
  onClose: () => void;
  onAddDetectedItems: (items: Omit<PantryItem, 'id'>[]) => void;
}

const SAMPLE_DETECTED: DetectedItem[] = [
  {
    id: 'd-1',
    name: 'Fresh Basil Bunch',
    category: 'Produce',
    storageZone: 'crisper',
    confidence: 98,
    estimatedDays: 3,
    quantity: 1,
    unit: 'bunch',
    imageUrl: 'https://images.unsplash.com/photo-1618164436241-4473940d1f5c?auto=format&fit=crop&w=400&q=80',
    boxCoordinates: { top: 20, left: 18, width: 34, height: 32 }
  },
  {
    id: 'd-2',
    name: 'Red Bell Pepper',
    category: 'Produce',
    storageZone: 'crisper',
    confidence: 95,
    estimatedDays: 5,
    quantity: 2,
    unit: 'pcs',
    imageUrl: 'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?auto=format&fit=crop&w=400&q=80',
    boxCoordinates: { top: 38, left: 56, width: 32, height: 36 }
  },
  {
    id: 'd-3',
    name: 'Organic Roma Tomatoes',
    category: 'Produce',
    storageZone: 'counter',
    confidence: 92,
    estimatedDays: 4,
    quantity: 400,
    unit: 'g',
    imageUrl: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=400&q=80',
    boxCoordinates: { top: 62, left: 24, width: 44, height: 30 }
  }
];

export const ScannerModal: React.FC<ScannerModalProps> = ({
  onClose,
  onAddDetectedItems,
}) => {
  const [isScanning, setIsScanning] = useState<boolean>(true);
  const [selectedIds, setSelectedIds] = useState<string[]>(['d-1', 'd-2', 'd-3']);
  const [scanStep, setScanStep] = useState<'viewfinder' | 'results'>('viewfinder');

  const handleCapture = () => {
    playCameraShutterSound();
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      setScanStep('results');
    }, 800);
  };

  const toggleSelect = (id: string) => {
    playPillClickSound();
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleConfirmAdd = () => {
    const itemsToAdd = SAMPLE_DETECTED.filter(item => selectedIds.includes(item.id)).map(item => ({
      name: item.name,
      category: item.category,
      storageZone: item.storageZone,
      quantity: item.quantity,
      unit: item.unit,
      daysRemaining: item.estimatedDays,
      expiryDate: new Date(Date.now() + item.estimatedDays * 86400000).toISOString(),
      imageUrl: item.imageUrl,
      notes: `AI Scanned with ${item.confidence}% confidence`,
    }));

    onAddDetectedItems(itemsToAdd);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-200">
      <div className="bg-[#1B1C1A] text-white w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl border border-white/10 flex flex-col max-h-[92vh]">
        
        {/* Top Viewfinder Bar */}
        <div className="p-4 flex items-center justify-between border-b border-white/10">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-[#4E9F6E] animate-ping" />
            <span className="font-editorial text-sm font-bold tracking-wide">
              Smart Kitchen Camera
            </span>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4 text-white" />
          </button>
        </div>

        {/* Viewfinder Canvas Simulation */}
        <div className="relative aspect-4/3 w-full bg-[#111] overflow-hidden flex items-center justify-center select-none">
          {/* Simulated countertop produce background */}
          <img
            src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1000&q=80"
            alt="Pantry produce scene"
            className="w-full h-full object-cover opacity-85"
          />

          {/* Viewfinder Reticle / Corner Brackets */}
          <div className="absolute inset-6 pointer-events-none border border-white/20 rounded-2xl">
            <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-[#A0CFB4] rounded-tl-xl" />
            <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-[#A0CFB4] rounded-tr-xl" />
            <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-[#A0CFB4] rounded-bl-xl" />
            <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-[#A0CFB4] rounded-br-xl" />
          </div>

          {/* Scanning Line Animation */}
          {isScanning && (
            <div className="absolute inset-x-0 h-1 bg-linear-to-r from-transparent via-[#4E9F6E] to-transparent animate-bounce opacity-80" />
          )}

          {/* AI Bounding Boxes overlay */}
          {SAMPLE_DETECTED.map((item) => (
            <div
              key={item.id}
              style={{
                top: `${item.boxCoordinates.top}%`,
                left: `${item.boxCoordinates.left}%`,
                width: `${item.boxCoordinates.width}%`,
                height: `${item.boxCoordinates.height}%`,
              }}
              className="absolute border-2 border-[#4E9F6E] bg-[#4E9F6E]/15 rounded-xl pointer-events-none transition-all duration-300 animate-pulse"
            >
              <div className="absolute -top-6 left-0 bg-[#15422E] text-white text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1 shadow-sm border border-[#4E9F6E]">
                <Sparkles className="w-2.5 h-2.5 text-[#A0CFB4]" />
                <span>{item.name} ({item.confidence}%)</span>
              </div>
            </div>
          ))}

          {/* Overlay Guide Pill */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-md px-3.5 py-1 rounded-full text-[11px] font-medium text-white/90 border border-white/10 pointer-events-none flex items-center gap-1.5">
            <Scan className="w-3.5 h-3.5 text-[#A0CFB4]" />
            <span>Point camera at groceries or fridge shelf</span>
          </div>
        </div>

        {/* Detected Items Confirmation Panel */}
        <div className="p-4 space-y-3 flex-1 overflow-y-auto bg-[#1E201E]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#4E9F6E]" />
              <span>Detected ({SAMPLE_DETECTED.length} Ingredients)</span>
            </span>
            <span className="text-[11px] text-[#A0CFB4]">
              {selectedIds.length} selected to add
            </span>
          </div>

          <div className="space-y-2">
            {SAMPLE_DETECTED.map((item) => {
              const isSelected = selectedIds.includes(item.id);
              return (
                <div
                  key={item.id}
                  onClick={() => toggleSelect(item.id)}
                  className={`p-2.5 rounded-xl border flex items-center justify-between gap-3 cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-[#2E5A44]/30 border-[#4E9F6E]'
                      : 'bg-white/5 border-white/10 opacity-60'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-10 h-10 rounded-lg object-cover ring-1 ring-white/10"
                    />
                    <div>
                      <div className="text-xs font-bold text-white flex items-center gap-1.5">
                        <span>{item.name}</span>
                        <span className="text-[10px] text-[#A0CFB4] font-semibold">
                          {item.confidence}%
                        </span>
                      </div>
                      <div className="text-[11px] text-white/70">
                        {item.quantity} {item.unit} • Est. shelf life ~{item.estimatedDays} days
                      </div>
                    </div>
                  </div>

                  <div className={`w-5 h-5 rounded-md flex items-center justify-center border ${
                    isSelected ? 'bg-[#4E9F6E] border-[#4E9F6E] text-white' : 'border-white/30'
                  }`}>
                    {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Shutter / Action Bar */}
        <div className="p-4 bg-[#141514] border-t border-white/10 flex items-center justify-between gap-3">
          <button
            onClick={handleCapture}
            className="flex items-center gap-1.5 text-xs text-white/80 hover:text-white px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Re-Scan Scene</span>
          </button>

          <button
            onClick={handleConfirmAdd}
            disabled={selectedIds.length === 0}
            className="flex-1 py-3 px-4 rounded-2xl bg-[#E05A36] hover:bg-[#AB3513] text-white text-xs sm:text-sm font-bold transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-40 cursor-pointer active:scale-98"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Add {selectedIds.length} to Pantry</span>
          </button>
        </div>

      </div>
    </div>
  );
};
