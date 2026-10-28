import React, { useState, useMemo } from 'react';
import { 
  Sparkles, 
  Clock, 
  Flame, 
  ChefHat, 
  Heart, 
  ArrowRight, 
  Filter, 
  CheckCircle, 
  AlertTriangle,
  RotateCw,
  Search
} from 'lucide-react';
import { Recipe, PantryItem } from '../types';
import { playPillClickSound } from '../utils/audio';

interface RecipesScreenProps {
  recipes: Recipe[];
  pantryItems: PantryItem[];
  selectedPantryItemIds: string[];
  onSelectRecipe: (recipe: Recipe) => void;
  onStartCooking: (recipe: Recipe) => void;
  onToggleFavorite: (recipeId: string) => void;
  onClearPantrySelection: () => void;
}

export const RecipesScreen: React.FC<RecipesScreenProps> = ({
  recipes,
  pantryItems,
  selectedPantryItemIds,
  onSelectRecipe,
  onStartCooking,
  onToggleFavorite,
  onClearPantrySelection,
}) => {
  const [activeTag, setActiveTag] = useState<string>('All');
  const [maxTime, setMaxTime] = useState<number>(60);
  const [customPrompt, setCustomPrompt] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  const selectedItems = useMemo(() => {
    return pantryItems.filter(i => selectedPantryItemIds.includes(i.id));
  }, [pantryItems, selectedPantryItemIds]);

  const filterTags = ['All', 'Zero-Waste Champion', 'Quick Prep', 'Vegetarian', 'High-Protein', 'Gluten-Free'];

  // Filter recipes
  const filteredRecipes = useMemo(() => {
    return recipes.filter(r => {
      // Time filter
      if (r.prepTimeMinutes + r.cookTimeMinutes > maxTime) return false;
      // Tag filter
      if (activeTag !== 'All' && !r.dietaryTags.includes(activeTag)) return false;
      // Custom prompt
      if (customPrompt.trim()) {
        const query = customPrompt.toLowerCase();
        const matchesTitle = r.title.toLowerCase().includes(query);
        const matchesDesc = r.description.toLowerCase().includes(query);
        const matchesIng = r.ingredients.some(i => i.name.toLowerCase().includes(query));
        if (!matchesTitle && !matchesDesc && !matchesIng) return false;
      }
      return true;
    }).sort((a, b) => b.matchScore - a.matchScore);
  }, [recipes, activeTag, maxTime, customPrompt]);

  const handleSimulateAIGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customPrompt.trim()) return;
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
    }, 600);
  };

  return (
    <div className="space-y-5 pb-28">
      {/* Hero Engine Card */}
      <section className="bg-linear-to-br from-[#15422E] via-[#2E5A44] to-[#15422E] rounded-3xl p-5 text-white shadow-md relative overflow-hidden">
        <div className="relative z-10 space-y-3">
          <div className="flex items-center justify-between">
            <span className="bg-[#FD6F49] text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1 shadow-xs">
              <Sparkles className="w-3 h-3" />
              AI Zero-Waste Match
            </span>
            <span className="text-xs text-white/70">
              Personalized to your fridge
            </span>
          </div>

          <h2 className="font-editorial text-2xl font-bold tracking-tight text-[#FBF9F5]">
            Turn today's pantry into tonight's feast.
          </h2>

          <p className="text-xs text-white/80 max-w-md">
            Our culinary algorithm prioritizes ingredients closest to expiry, maximizing shelf-life and nutritional value.
          </p>

          {/* If user picked custom items from pantry */}
          {selectedItems.length > 0 && (
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/20 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-[#A0CFB4]">
                  Matching specifically with {selectedItems.length} picked items:
                </span>
                <button
                  onClick={onClearPantrySelection}
                  className="text-white/60 hover:text-white underline text-[11px]"
                >
                  Clear filter
                </button>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {selectedItems.map(item => (
                  <span
                    key={item.id}
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white text-[#15422E] text-[11px] font-semibold"
                  >
                    <span>{item.name}</span>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* AI Recipe Prompt Bar */}
          <form onSubmit={handleSimulateAIGenerate} className="pt-1 flex gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Ask AI: e.g. 'Crispy chicken with garlic spinach' or 'Quick 15 min dinner'..."
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                className="w-full bg-white/90 focus:bg-white text-xs text-[#1B1C1A] placeholder:text-gray-500 rounded-xl pl-9 pr-3 py-2.5 outline-hidden ring-2 ring-transparent focus:ring-[#FD6F49] transition-all shadow-inner"
              />
            </div>
            <button
              type="submit"
              disabled={isGenerating}
              className="px-4 py-2.5 rounded-xl bg-[#E05A36] hover:bg-[#AB3513] text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 shrink-0 disabled:opacity-50 cursor-pointer"
            >
              {isGenerating ? (
                <RotateCw className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Sparkles className="w-3.5 h-3.5" />
              )}
              <span>Match</span>
            </button>
          </form>
        </div>
      </section>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar text-xs">
        {filterTags.map((tag) => (
          <button
            key={tag}
            onClick={() => {
              playPillClickSound();
              setActiveTag(tag);
            }}
            className={`px-3.5 py-1.5 rounded-full font-semibold transition-all shrink-0 cursor-pointer ${
              activeTag === tag
                ? 'bg-[#15422E] text-white shadow-xs'
                : 'bg-white text-[#414943] border border-[#EAE8E4] hover:bg-[#F5F3EF]'
            }`}
          >
            {tag}
          </button>
        ))}
      </div>

      {/* Recipes Stream Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredRecipes.length === 0 ? (
          <div className="col-span-full py-16 text-center bg-white rounded-3xl border border-[#EAE8E4] p-8 space-y-3">
            <ChefHat className="w-12 h-12 text-[#717973] mx-auto opacity-40" />
            <h3 className="font-editorial text-lg font-bold text-[#1B1C1A]">
              No recipes matched this criteria
            </h3>
            <p className="text-xs text-[#717973]">
              Try choosing "All" or widening your ingredient filters.
            </p>
            <button
              onClick={() => {
                setActiveTag('All');
                setCustomPrompt('');
              }}
              className="px-4 py-2 rounded-xl bg-[#2E5A44] text-white text-xs font-semibold hover:bg-[#15422E]"
            >
              Show All Recipes
            </button>
          </div>
        ) : (
          filteredRecipes.map((recipe) => {
            const totalMinutes = recipe.prepTimeMinutes + recipe.cookTimeMinutes;
            const hasUrgentSave = recipe.expiringIngredientsUsed.length > 0;

            return (
              <div
                key={recipe.id}
                className="group bg-white rounded-3xl border border-[#EAE8E4] overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between"
              >
                {/* Image & Match Overlay */}
                <div className="relative aspect-16/10 overflow-hidden bg-[#F5F3EF]">
                  <img
                    src={recipe.imageUrl}
                    alt={recipe.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />

                  {/* Top Badges */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
                    {/* Match Score Badge */}
                    <div className="bg-[#15422E]/90 backdrop-blur-md text-white px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-xs border border-white/20">
                      <div className="w-2 h-2 rounded-full bg-[#4E9F6E] animate-pulse" />
                      <span>{recipe.matchScore}% Pantry Match</span>
                    </div>

                    {/* Favorite Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleFavorite(recipe.id);
                      }}
                      className="w-8 h-8 rounded-full bg-white/90 backdrop-blur-xs text-[#E05A36] flex items-center justify-center hover:bg-white transition-all shadow-xs active:scale-90"
                      aria-label="Save to favorites"
                    >
                      <Heart 
                        className={`w-4 h-4 ${recipe.isFavorite ? 'fill-[#E05A36]' : ''}`} 
                      />
                    </button>
                  </div>

                  {/* Bottom Image Metadata */}
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs">
                    <span className="font-semibold px-2 py-0.5 rounded-md bg-black/40 backdrop-blur-xs">
                      {recipe.cuisine} • {recipe.calories} kcal
                    </span>
                    <div className="flex items-center gap-1 font-semibold px-2 py-0.5 rounded-md bg-black/40 backdrop-blur-xs">
                      <Clock className="w-3.5 h-3.5 text-[#A0CFB4]" />
                      <span>{totalMinutes} mins</span>
                    </div>
                  </div>
                </div>

                {/* Content body */}
                <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div>
                      <div className="text-[11px] font-bold text-[#AB3513] uppercase tracking-wider">
                        {recipe.subtitle}
                      </div>
                      <h3 className="font-editorial text-lg font-bold text-[#1B1C1A] leading-snug group-hover:text-[#2E5A44] transition-colors">
                        {recipe.title}
                      </h3>
                    </div>

                    <p className="text-xs text-[#414943] line-clamp-2 leading-relaxed">
                      {recipe.description}
                    </p>

                    {/* Expiring Ingredients Rescued Callout */}
                    {hasUrgentSave && (
                      <div className="bg-[#E7F4EB] border border-[#BDEED0] rounded-xl px-2.5 py-1.5 flex items-center gap-2">
                        <CheckCircle className="w-3.5 h-3.5 text-[#2D7A4F] shrink-0" />
                        <span className="text-[11px] font-semibold text-[#15422E] truncate">
                          Rescues: {recipe.expiringIngredientsUsed.join(', ')}
                        </span>
                      </div>
                    )}

                    {/* Ingredient tags */}
                    <div className="flex flex-wrap gap-1 pt-1">
                      {recipe.dietaryTags.map(tag => (
                        <span
                          key={tag}
                          className="text-[10px] font-medium bg-[#F5F3EF] text-[#414943] px-2 py-0.5 rounded-md"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="pt-3 border-t border-[#F5F3EF] flex items-center gap-2">
                    <button
                      onClick={() => onSelectRecipe(recipe)}
                      className="flex-1 py-2 px-3 rounded-xl border border-[#C1C9C1] hover:border-[#2E5A44] bg-white text-[#1B1C1A] text-xs font-bold transition-all text-center hover:bg-[#F5F3EF] cursor-pointer"
                    >
                      View Recipe & Prep
                    </button>

                    <button
                      onClick={() => onStartCooking(recipe)}
                      className="flex-1 py-2 px-3 rounded-xl bg-[#E05A36] hover:bg-[#AB3513] text-white text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <ChefHat className="w-3.5 h-3.5" />
                      <span>Start Cooking</span>
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
