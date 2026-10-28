import React from 'react';
import { Refrigerator, Sparkles, Camera, BarChart3, BookOpen } from 'lucide-react';
import { playPillClickSound } from '../utils/audio';

export type NavTab = 'pantry' | 'recipes' | 'impact';

interface BottomNavProps {
  currentTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  onOpenScanner: () => void;
  pantryCount: number;
  urgentCount: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentTab,
  onTabChange,
  onOpenScanner,
  pantryCount,
  urgentCount,
}) => {
  const handleSelectTab = (tab: NavTab) => {
    playPillClickSound();
    onTabChange(tab);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 px-4 pb-3 pointer-events-none">
      <div className="max-w-md mx-auto pointer-events-auto">
        <nav 
          aria-label="Bottom Navigation"
          className="bg-white/95 backdrop-blur-lg border border-[#EAE8E4] rounded-3xl p-1.5 shadow-[0_8px_30px_rgb(27,28,26,0.12)] flex items-center justify-around gap-1"
        >
          {/* Pantry Tab */}
          <button
            onClick={() => handleSelectTab('pantry')}
            className={`flex-1 flex flex-col items-center justify-center py-2 px-1 rounded-2xl transition-all duration-200 cursor-pointer ${
              currentTab === 'pantry'
                ? 'bg-[#E7F4EB] text-[#15422E] font-bold'
                : 'text-[#717973] hover:text-[#1B1C1A] hover:bg-[#F5F3EF]'
            }`}
          >
            <div className="relative">
              <Refrigerator className="w-5 h-5" />
              {urgentCount > 0 && (
                <span className="absolute -top-1 -right-1.5 w-2.5 h-2.5 bg-[#E05A36] rounded-full ring-2 ring-white" />
              )}
            </div>
            <span className="text-[11px] mt-1 font-medium tracking-tight">
              Pantry ({pantryCount})
            </span>
          </button>

          {/* Recipes / AI Match Tab */}
          <button
            onClick={() => handleSelectTab('recipes')}
            className={`flex-1 flex flex-col items-center justify-center py-2 px-1 rounded-2xl transition-all duration-200 cursor-pointer ${
              currentTab === 'recipes'
                ? 'bg-[#E7F4EB] text-[#15422E] font-bold'
                : 'text-[#717973] hover:text-[#1B1C1A] hover:bg-[#F5F3EF]'
            }`}
          >
            <Sparkles className="w-5 h-5" />
            <span className="text-[11px] mt-1 font-medium tracking-tight">
              AI Discover
            </span>
          </button>

          {/* Central AI Camera Scanner Trigger */}
          <div className="relative -top-3 px-1">
            <button
              onClick={() => {
                playPillClickSound();
                onOpenScanner();
              }}
              className="w-13 h-13 rounded-full bg-linear-to-br from-[#E05A36] to-[#AB3513] text-white flex items-center justify-center shadow-[0_6px_20px_rgba(224,90,54,0.38)] hover:scale-105 active:scale-95 transition-all ring-4 ring-white cursor-pointer"
              aria-label="Scan Ingredients with AI Camera"
            >
              <Camera className="w-6 h-6 stroke-[2.2]" />
            </button>
          </div>

          {/* Impact & Planner Tab */}
          <button
            onClick={() => handleSelectTab('impact')}
            className={`flex-1 flex flex-col items-center justify-center py-2 px-1 rounded-2xl transition-all duration-200 cursor-pointer ${
              currentTab === 'impact'
                ? 'bg-[#E7F4EB] text-[#15422E] font-bold'
                : 'text-[#717973] hover:text-[#1B1C1A] hover:bg-[#F5F3EF]'
            }`}
          >
            <BarChart3 className="w-5 h-5" />
            <span className="text-[11px] mt-1 font-medium tracking-tight">
              Impact & Plan
            </span>
          </button>
        </nav>
      </div>
    </div>
  );
};
