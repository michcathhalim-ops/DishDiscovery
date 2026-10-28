import React, { useState } from 'react';
import { 
  X, 
  Clock, 
  Users, 
  Flame, 
  ChefHat, 
  Check, 
  AlertCircle, 
  Sparkles,
  Share2,
  Bookmark
} from 'lucide-react';
import { Recipe } from '../types';

interface RecipeDetailModalProps {
  recipe: Recipe | null;
  onClose: () => void;
  onStartCooking: (recipe: Recipe, servings: number) => void;
  onToggleFavorite: (recipeId: string) => void;
}

export const RecipeDetailModal: React.FC<RecipeDetailModalProps> = ({
  recipe,
  onClose,
  onStartCooking,
  onToggleFavorite,
}) => {
  const [servings, setServings] = useState<number>(recipe?.servings || 2);
  const [checkedIngredients, setCheckedIngredients] = useState<Record<string, boolean>>({});

  if (!recipe) return null;

  const multiplier = servings / recipe.servings;

  const toggleCheck = (name: string) => {
    setCheckedIngredients(prev => ({
      ...prev,
      [name]: !prev[name]
    }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-2xl max-h-[92vh] rounded-3xl overflow-hidden shadow-2xl flex flex-col border border-[#EAE8E4]">
        
        {/* Modal Header Image */}
        <div className="relative aspect-16/9 sm:aspect-21/9 shrink-0 bg-[#F5F3EF]">
          <img
            src={recipe.imageUrl}
            alt={recipe.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/30" />

          {/* Close & Favorite buttons */}
          <div className="absolute top-3.5 right-3.5 flex items-center gap-2">
            <button
              onClick={() => onToggleFavorite(recipe.id)}
              className="w-9 h-9 rounded-full bg-white/80 backdrop-blur-md text-[#E05A36] flex items-center justify-center hover:bg-white transition-all shadow-sm cursor-pointer"
            >
              <Bookmark className={`w-4 h-4 ${recipe.isFavorite ? 'fill-[#E05A36]' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/80 transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Title on image */}
          <div className="absolute bottom-4 left-4 right-4 text-white space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#A0CFB4]">
              {recipe.cuisine} • {recipe.subtitle}
            </span>
            <h2 className="font-editorial text-2xl sm:text-3xl font-bold tracking-tight">
              {recipe.title}
            </h2>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="p-5 overflow-y-auto space-y-6 flex-1">
          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-4 gap-2 bg-[#FBF9F5] p-3 rounded-2xl border border-[#EAE8E4] text-center">
            <div>
              <div className="text-[10px] uppercase font-semibold text-[#717973]">Prep</div>
              <div className="text-xs sm:text-sm font-bold text-[#1B1C1A]">{recipe.prepTimeMinutes}m</div>
            </div>
            <div>
              <div className="text-[10px] uppercase font-semibold text-[#717973]">Cook</div>
              <div className="text-xs sm:text-sm font-bold text-[#1B1C1A]">{recipe.cookTimeMinutes}m</div>
            </div>
            <div>
              <div className="text-[10px] uppercase font-semibold text-[#717973]">Calories</div>
              <div className="text-xs sm:text-sm font-bold text-[#1B1C1A]">{recipe.calories}</div>
            </div>
            <div>
              <div className="text-[10px] uppercase font-semibold text-[#717973]">Match</div>
              <div className="text-xs sm:text-sm font-bold text-[#2D7A4F]">{recipe.matchScore}%</div>
            </div>
          </div>

          {/* Description */}
          <p className="text-xs sm:text-sm text-[#414943] leading-relaxed">
            {recipe.description}
          </p>

          {/* Servings Adjuster */}
          <div className="flex items-center justify-between p-3.5 bg-[#F5F3EF] rounded-2xl">
            <div>
              <div className="text-xs font-bold text-[#1B1C1A] flex items-center gap-1.5">
                <Users className="w-4 h-4 text-[#2E5A44]" />
                <span>Adjust Portions</span>
              </div>
              <div className="text-[11px] text-[#717973]">
                Ingredient measurements scale automatically
              </div>
            </div>

            <div className="flex items-center gap-2 bg-white px-2.5 py-1 rounded-xl border border-[#EAE8E4]">
              <button
                onClick={() => setServings(Math.max(1, servings - 1))}
                className="w-6 h-6 flex items-center justify-center font-bold text-sm text-[#717973] hover:text-[#1B1C1A] cursor-pointer"
              >
                -
              </button>
              <span className="text-xs font-bold text-[#1B1C1A] min-w-[50px] text-center">
                {servings} {servings === 1 ? 'person' : 'people'}
              </span>
              <button
                onClick={() => setServings(servings + 1)}
                className="w-6 h-6 flex items-center justify-center font-bold text-sm text-[#717973] hover:text-[#1B1C1A] cursor-pointer"
              >
                +
              </button>
            </div>
          </div>

          {/* Ingredients Checklist */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-editorial text-lg font-bold text-[#1B1C1A]">
                Ingredients Needed ({recipe.ingredients.length})
              </h3>
              <span className="text-xs text-[#2D7A4F] font-semibold">
                Tap items to check off
              </span>
            </div>

            <div className="divide-y divide-[#F5F3EF] border border-[#EAE8E4] rounded-2xl overflow-hidden bg-white">
              {recipe.ingredients.map((ing, idx) => {
                const scaledAmount = Math.round(ing.amount * multiplier * 10) / 10;
                const isChecked = !!checkedIngredients[ing.name];

                return (
                  <div
                    key={idx}
                    onClick={() => toggleCheck(ing.name)}
                    className="p-3 flex items-center justify-between gap-3 hover:bg-[#FBF9F5] transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${
                        isChecked 
                          ? 'bg-[#2E5A44] border-[#2E5A44] text-white' 
                          : 'border-[#C1C9C1] bg-white'
                      }`}>
                        {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>

                      <div className={isChecked ? 'line-through text-gray-400' : 'text-[#1B1C1A]'}>
                        <span className="text-xs font-bold text-[#1B1C1A] mr-1.5">
                          {scaledAmount} {ing.unit}
                        </span>
                        <span className="text-xs font-medium">
                          {ing.name}
                        </span>
                      </div>
                    </div>

                    {/* Status Pill */}
                    {ing.isExpiringSoon ? (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#FEF3C7] text-[#C36800] shrink-0">
                        Expiring Soon
                      </span>
                    ) : ing.isPantryMatch ? (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#E7F4EB] text-[#2D7A4F] shrink-0">
                        In Pantry
                      </span>
                    ) : (
                      <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 shrink-0">
                        Pantry Staple
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Steps Overview */}
          <div className="space-y-3">
            <h3 className="font-editorial text-lg font-bold text-[#1B1C1A]">
              Culinary Steps ({recipe.steps.length})
            </h3>

            <div className="space-y-2.5">
              {recipe.steps.map((step) => (
                <div key={step.stepNumber} className="p-3 bg-[#FBF9F5] rounded-xl border border-[#EAE8E4] space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-[#2E5A44]">
                      Step {step.stepNumber}: {step.title}
                    </span>
                    {step.timerMinutes && (
                      <span className="text-[11px] font-semibold text-[#717973] flex items-center gap-1">
                        <Clock className="w-3 h-3 text-[#E05A36]" />
                        <span>~{step.timerMinutes} min</span>
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[#414943] leading-relaxed">
                    {step.instruction}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="p-4 bg-white border-t border-[#EAE8E4] flex items-center gap-3">
          <button
            onClick={onClose}
            className="py-3 px-4 rounded-2xl border border-[#C1C9C1] text-xs font-semibold text-[#414943] hover:bg-[#F5F3EF] transition-all cursor-pointer"
          >
            Back
          </button>

          <button
            onClick={() => onStartCooking(recipe, servings)}
            className="flex-1 py-3 px-4 rounded-2xl bg-[#E05A36] hover:bg-[#AB3513] text-white text-xs sm:text-sm font-bold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-98"
          >
            <ChefHat className="w-4 h-4" />
            <span>Start Active Step-by-Step Cooking</span>
          </button>
        </div>

      </div>
    </div>
  );
};
