import React, { useState } from 'react';
import { 
  Sparkles, 
  Bell, 
  Smartphone, 
  Monitor, 
  AlertCircle, 
  ChefHat, 
  X, 
  ArrowRight,
  Leaf
} from 'lucide-react';
import { PantryItem } from '../types';

interface HeaderProps {
  urgentCount: number;
  soonCount: number;
  urgentItems: PantryItem[];
  isMobileFrame: boolean;
  onToggleMobileFrame: () => void;
  onOpenAddModal: () => void;
  onNavigateToRecipes: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  urgentCount,
  soonCount,
  urgentItems,
  isMobileFrame,
  onToggleMobileFrame,
  onOpenAddModal,
  onNavigateToRecipes,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-[#FBF9F5]/90 backdrop-blur-md border-b border-[#EAE8E4] px-4 py-3 sm:px-6">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-3">
        {/* Brand identity */}
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-[#2E5A44] flex items-center justify-center text-white shadow-sm ring-2 ring-[#2E5A44]/20">
            <Leaf className="w-5 h-5 text-[#A0CFB4]" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-editorial text-xl font-bold tracking-tight text-[#15422E]">
                DishDiscover
              </span>
              <span className="hidden sm:inline-flex items-center gap-0.5 text-[10px] font-semibold uppercase tracking-wider bg-[#E7F4EB] text-[#2D7A4F] px-1.5 py-0.5 rounded-full">
                Zero Waste
              </span>
            </div>
            <p className="text-xs text-[#414943] hidden sm:block">
              Conscious cooking & mindful kitchen pantry
            </p>
          </div>
        </div>

        {/* Right side actions */}
        <div className="flex items-center gap-2">
          {/* Mobile frame toggle for desktop */}
          <button
            onClick={onToggleMobileFrame}
            title={isMobileFrame ? "Switch to Wide Desktop View" : "Switch to Mobile Device View"}
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border border-[#C1C9C1] hover:border-[#2E5A44] text-[#414943] hover:text-[#15422E] bg-white transition-all shadow-xs"
          >
            {isMobileFrame ? (
              <>
                <Monitor className="w-3.5 h-3.5 text-[#2E5A44]" />
                <span>Expanded Grid</span>
              </>
            ) : (
              <>
                <Smartphone className="w-3.5 h-3.5 text-[#2E5A44]" />
                <span>Mobile Frame</span>
              </>
            )}
          </button>

          {/* Expiration Alert Bell with Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative w-10 h-10 rounded-full border border-[#EAE8E4] bg-white hover:bg-[#F5F3EF] flex items-center justify-center text-[#414943] transition-colors shadow-xs cursor-pointer"
              aria-label="Urgent expiration notifications"
            >
              <Bell className="w-4 h-4 text-[#1B1C1A]" />
              {urgentCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-[#E05A36] text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1 animate-pulse shadow-xs">
                  {urgentCount}
                </span>
              )}
            </button>

            {/* Notifications Popover */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-[#EAE8E4] p-4 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="flex items-center justify-between pb-3 border-b border-[#F5F3EF]">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-[#E05A36]" />
                    <span className="font-editorial text-sm font-bold text-[#1B1C1A]">
                      Expiring Soon ({urgentCount + soonCount})
                    </span>
                  </div>
                  <button 
                    onClick={() => setShowNotifications(false)}
                    className="text-[#717973] hover:text-[#1B1C1A] p-1 rounded-lg"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="py-2 divide-y divide-[#F5F3EF] max-h-64 overflow-y-auto">
                  {urgentItems.length === 0 ? (
                    <div className="py-6 text-center text-xs text-[#717973]">
                      🎉 Great job! No ingredients are in immediate danger of spoiling.
                    </div>
                  ) : (
                    urgentItems.map((item) => (
                      <div key={item.id} className="py-2.5 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2.5">
                          <img 
                            src={item.imageUrl} 
                            alt={item.name} 
                            className="w-9 h-9 rounded-lg object-cover ring-1 ring-black/5" 
                          />
                          <div>
                            <div className="text-xs font-semibold text-[#1B1C1A]">
                              {item.name}
                            </div>
                            <div className="text-[11px] text-[#717973]">
                              {item.quantity} {item.unit} • {item.storageZone}
                            </div>
                          </div>
                        </div>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          item.daysRemaining <= 1 
                            ? 'bg-[#FEE2E2] text-[#BA1A1A]' 
                            : 'bg-[#FEF3C7] text-[#C36800]'
                        }`}>
                          {item.daysRemaining <= 1 ? 'Expiring in 24h' : `${item.daysRemaining} days left`}
                        </span>
                      </div>
                    ))
                  )}
                </div>

                {urgentItems.length > 0 && (
                  <div className="pt-3 border-t border-[#F5F3EF]">
                    <button
                      onClick={() => {
                        setShowNotifications(false);
                        onNavigateToRecipes();
                      }}
                      className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-[#E05A36] hover:bg-[#AB3513] text-white text-xs font-semibold transition-colors shadow-xs"
                    >
                      <ChefHat className="w-3.5 h-3.5" />
                      <span>Cook with these now</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Quick Action: Add Item */}
          <button
            onClick={onOpenAddModal}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#2E5A44] hover:bg-[#15422E] text-white text-xs font-semibold transition-all shadow-sm active:scale-95"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#A0CFB4]" />
            <span>+ Add Item</span>
          </button>
        </div>
      </div>
    </header>
  );
};
