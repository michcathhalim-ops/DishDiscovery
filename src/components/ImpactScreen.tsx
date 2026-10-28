import React, { useState } from 'react';
import { 
  BarChart3, 
  Sparkles, 
  Leaf, 
  DollarSign, 
  Heart, 
  Calendar, 
  ChefHat, 
  CheckCircle2, 
  ArrowUpRight,
  Plus
} from 'lucide-react';
import { Recipe, MealPlanDay } from '../types';
import { INITIAL_MEAL_PLAN } from '../data/initialData';

interface ImpactScreenProps {
  favoriteRecipes: Recipe[];
  onSelectRecipe: (recipe: Recipe) => void;
  rescuedCount: number;
}

export const ImpactScreen: React.FC<ImpactScreenProps> = ({
  favoriteRecipes,
  onSelectRecipe,
  rescuedCount,
}) => {
  const [mealPlan, setMealPlan] = useState(INITIAL_MEAL_PLAN);
  const [activeTab, setActiveTab] = useState<'impact' | 'plan' | 'favorites'>('impact');

  // Dynamic calculations based on rescuedCount
  const baseRescued = 12 + rescuedCount;
  const foodKgSaved = (baseRescued * 0.42).toFixed(1);
  const moneySaved = (baseRescued * 4.25).toFixed(0);
  const co2Avoided = (baseRescued * 1.15).toFixed(1);

  return (
    <div className="space-y-5 pb-28">
      {/* Top Navigation Tabs inside screen */}
      <div className="flex items-center gap-1.5 p-1 bg-[#F5F3EF] rounded-2xl max-w-sm">
        <button
          onClick={() => setActiveTab('impact')}
          className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'impact'
              ? 'bg-white text-[#15422E] shadow-xs'
              : 'text-[#717973] hover:text-[#1B1C1A]'
          }`}
        >
          Conscious Impact
        </button>
        <button
          onClick={() => setActiveTab('plan')}
          className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'plan'
              ? 'bg-white text-[#15422E] shadow-xs'
              : 'text-[#717973] hover:text-[#1B1C1A]'
          }`}
        >
          Weekly Planner
        </button>
        <button
          onClick={() => setActiveTab('favorites')}
          className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'favorites'
              ? 'bg-white text-[#15422E] shadow-xs'
              : 'text-[#717973] hover:text-[#1B1C1A]'
          }`}
        >
          Saved ({favoriteRecipes.length})
        </button>
      </div>

      {activeTab === 'impact' && (
        <div className="space-y-5 animate-in fade-in duration-200">
          {/* Main Hero Banner */}
          <div className="bg-linear-to-r from-[#2E5A44] to-[#15422E] text-white p-6 rounded-3xl shadow-md relative overflow-hidden">
            <div className="relative z-10 space-y-2">
              <span className="bg-[#A0CFB4]/20 border border-[#A0CFB4]/30 text-[#A0CFB4] text-[11px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                Sustainability Footprint
              </span>
              <h2 className="font-editorial text-2xl font-bold tracking-tight">
                Every ingredient rescued is a victory.
              </h2>
              <p className="text-xs text-white/80 max-w-md">
                Household food waste accounts for 8% of global greenhouse emissions. Your mindful cooking helps protect both your wallet and the planet.
              </p>
            </div>
          </div>

          {/* Impact Metrics 4-Box Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-white p-4 rounded-2xl border border-[#EAE8E4] shadow-xs space-y-1">
              <div className="w-8 h-8 rounded-xl bg-[#E7F4EB] text-[#2D7A4F] flex items-center justify-center">
                <Leaf className="w-4 h-4" />
              </div>
              <div className="font-editorial text-2xl font-bold text-[#1B1C1A]">
                {foodKgSaved} kg
              </div>
              <div className="text-[11px] text-[#717973] font-medium">
                Food Diverted from Landfill
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-[#EAE8E4] shadow-xs space-y-1">
              <div className="w-8 h-8 rounded-xl bg-[#FEF3C7] text-[#C36800] flex items-center justify-center">
                <DollarSign className="w-4 h-4" />
              </div>
              <div className="font-editorial text-2xl font-bold text-[#1B1C1A]">
                ${moneySaved}
              </div>
              <div className="text-[11px] text-[#717973] font-medium">
                Grocery Money Saved
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-[#EAE8E4] shadow-xs space-y-1">
              <div className="w-8 h-8 rounded-xl bg-[#FFDBD1] text-[#AB3513] flex items-center justify-center">
                <ChefHat className="w-4 h-4" />
              </div>
              <div className="font-editorial text-2xl font-bold text-[#1B1C1A]">
                {baseRescued}
              </div>
              <div className="text-[11px] text-[#717973] font-medium">
                Ingredients Rescued
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-[#EAE8E4] shadow-xs space-y-1">
              <div className="w-8 h-8 rounded-xl bg-[#E7F4EB] text-[#005E35] flex items-center justify-center">
                <Sparkles className="w-4 h-4" />
              </div>
              <div className="font-editorial text-2xl font-bold text-[#1B1C1A]">
                {co2Avoided} kg
              </div>
              <div className="text-[11px] text-[#717973] font-medium">
                CO2 Emissions Prevented
              </div>
            </div>
          </div>

          {/* Educational Kitchen Habit Tips */}
          <div className="bg-white p-5 rounded-3xl border border-[#EAE8E4] shadow-xs space-y-3">
            <h3 className="font-editorial text-lg font-bold text-[#1B1C1A]">
              Mindful Kitchen Habits
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-[#FBF9F5] rounded-2xl border border-[#EAE8E4] space-y-1">
                <div className="font-bold text-[#15422E] flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#2D7A4F]" />
                  <span>The "First In, First Out" Rule</span>
                </div>
                <p className="text-[#414943] leading-relaxed">
                  Store newly purchased items behind older groceries in your fridge crisper to naturally consume older produce first.
                </p>
              </div>

              <div className="p-3 bg-[#FBF9F5] rounded-2xl border border-[#EAE8E4] space-y-1">
                <div className="font-bold text-[#15422E] flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#2D7A4F]" />
                  <span>Revive Soft Herbs</span>
                </div>
                <p className="text-[#414943] leading-relaxed">
                  Wilted cilantro or basil perks back up in 15 minutes when placed in a small glass of ice water like fresh flowers.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'plan' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-editorial text-xl font-bold text-[#1B1C1A]">
                Weekly Meal Planner
              </h3>
              <p className="text-xs text-[#717973]">
                Schedule recipes that consume ingredients before they reach expiration.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {mealPlan.map((day) => (
              <div key={day.dayName} className="bg-white p-4 rounded-2xl border border-[#EAE8E4] shadow-xs space-y-3">
                <div className="flex items-center justify-between border-b border-[#F5F3EF] pb-2">
                  <span className="font-editorial text-base font-bold text-[#15422E]">
                    {day.dayName}
                  </span>
                  <span className="text-xs font-semibold text-[#717973]">
                    {day.dateStr}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {day.meals.map((meal) => (
                    <div 
                      key={meal.mealType}
                      className={`p-2.5 rounded-xl border text-xs space-y-1 transition-all ${
                        meal.recipe 
                          ? 'bg-[#FBF9F5] border-[#A0CFB4] hover:border-[#2E5A44] cursor-pointer' 
                          : 'bg-[#F5F3EF]/50 border-dashed border-[#C1C9C1]'
                      }`}
                      onClick={() => meal.recipe && onSelectRecipe(meal.recipe)}
                    >
                      <div className="text-[10px] uppercase font-bold text-[#717973]">
                        {meal.mealType}
                      </div>
                      {meal.recipe ? (
                        <div className="font-semibold text-[#1B1C1A] truncate">
                          {meal.recipe.title}
                        </div>
                      ) : (
                        <div className="text-[#717973] flex items-center gap-1 text-[11px] py-1">
                          <Plus className="w-3 h-3" />
                          <span>Assign Recipe</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'favorites' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <h3 className="font-editorial text-xl font-bold text-[#1B1C1A]">
              Saved Cookbook Favorites
            </h3>
            <span className="text-xs text-[#717973]">
              {favoriteRecipes.length} recipes saved
            </span>
          </div>

          {favoriteRecipes.length === 0 ? (
            <div className="py-12 text-center bg-white rounded-3xl border border-[#EAE8E4] p-6 space-y-2">
              <Heart className="w-8 h-8 text-[#E05A36] mx-auto opacity-40" />
              <div className="font-editorial text-base font-bold text-[#1B1C1A]">
                No favorites saved yet
              </div>
              <p className="text-xs text-[#717973]">
                Tap the heart on any recipe card to pin it into your personal conscious cookbook.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {favoriteRecipes.map((recipe) => (
                <div
                  key={recipe.id}
                  onClick={() => onSelectRecipe(recipe)}
                  className="bg-white rounded-2xl border border-[#EAE8E4] p-3 flex gap-3 cursor-pointer hover:shadow-md transition-all group"
                >
                  <img
                    src={recipe.imageUrl}
                    alt={recipe.title}
                    className="w-20 h-20 rounded-xl object-cover shrink-0"
                  />
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="text-[10px] font-bold text-[#AB3513] uppercase">
                        {recipe.cuisine}
                      </div>
                      <h4 className="font-editorial text-sm font-bold text-[#1B1C1A] truncate group-hover:text-[#2E5A44] transition-colors">
                        {recipe.title}
                      </h4>
                      <p className="text-[11px] text-[#717973] line-clamp-1">
                        {recipe.description}
                      </p>
                    </div>
                    <div className="text-[11px] font-semibold text-[#2D7A4F]">
                      {recipe.matchScore}% Match
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
