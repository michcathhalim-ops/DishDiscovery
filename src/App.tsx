import React, { useState, useEffect, useMemo } from 'react';
import { Header } from './components/Header';
import { BottomNav, NavTab } from './components/BottomNav';
import { PantryScreen } from './components/PantryScreen';
import { RecipesScreen } from './components/RecipesScreen';
import { ImpactScreen } from './components/ImpactScreen';
import { RecipeDetailModal } from './components/RecipeDetailModal';
import { ActiveCookingMode } from './components/ActiveCookingMode';
import { ScannerModal } from './components/ScannerModal';
import { AddIngredientModal } from './components/AddIngredientModal';
import { INITIAL_PANTRY, INITIAL_RECIPES } from './data/initialData';
import { PantryItem, Recipe } from './types';

export default function App() {
  // Load pantry from localStorage or use initial rich data
  const [pantryItems, setPantryItems] = useState<PantryItem[]>(() => {
    try {
      const saved = localStorage.getItem('dishdiscover_pantry');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return INITIAL_PANTRY;
  });

  // Recipes state
  const [recipes, setRecipes] = useState<Recipe[]>(() => {
    try {
      const saved = localStorage.getItem('dishdiscover_recipes');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return INITIAL_RECIPES;
  });

  // Rescued count
  const [rescuedCount, setRescuedCount] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('dishdiscover_rescued');
      if (saved) return Number(saved);
    } catch {
      // fallback
    }
    return 14;
  });

  // Navigation and Modals state
  const [currentTab, setCurrentTab] = useState<NavTab>('pantry');
  const [selectedPantryItemIds, setSelectedPantryItemIds] = useState<string[]>([]);
  const [activeRecipeDetail, setActiveRecipeDetail] = useState<Recipe | null>(null);
  const [cookingRecipe, setCookingRecipe] = useState<{ recipe: Recipe; servings: number } | null>(null);
  const [isScannerOpen, setIsScannerOpen] = useState<boolean>(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [isMobileFrame, setIsMobileFrame] = useState<boolean>(true);

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem('dishdiscover_pantry', JSON.stringify(pantryItems));
    } catch {
      // ignore
    }
  }, [pantryItems]);

  useEffect(() => {
    try {
      localStorage.setItem('dishdiscover_recipes', JSON.stringify(recipes));
    } catch {
      // ignore
    }
  }, [recipes]);

  useEffect(() => {
    try {
      localStorage.setItem('dishdiscover_rescued', String(rescuedCount));
    } catch {
      // ignore
    }
  }, [rescuedCount]);

  // Derived counts
  const urgentItems = useMemo(() => {
    return pantryItems.filter(i => i.daysRemaining <= 1);
  }, [pantryItems]);

  const soonItems = useMemo(() => {
    return pantryItems.filter(i => i.daysRemaining > 1 && i.daysRemaining <= 3);
  }, [pantryItems]);

  const favoriteRecipes = useMemo(() => {
    return recipes.filter(r => r.isFavorite);
  }, [recipes]);

  // Handlers
  const handleToggleSelectItemForRecipe = (id: string) => {
    setSelectedPantryItemIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleUpdateQuantity = (id: string, delta: number) => {
    setPantryItems(prev => {
      return prev.map(item => {
        if (item.id === id) {
          const newQty = Math.max(0, Math.round((item.quantity + delta) * 10) / 10);
          return { ...item, quantity: newQty };
        }
        return item;
      }).filter(item => item.quantity > 0);
    });
  };

  const handleRemoveItem = (id: string) => {
    setPantryItems(prev => prev.filter(i => i.id !== id));
    setSelectedPantryItemIds(prev => prev.filter(i => i !== id));
  };

  const handleAddItem = (newItem: Omit<PantryItem, 'id'>) => {
    const item: PantryItem = {
      ...newItem,
      id: `p-${Date.now()}`
    };
    setPantryItems(prev => [item, ...prev]);
  };

  const handleAddBatchDetected = (detectedList: Omit<PantryItem, 'id'>[]) => {
    const items: PantryItem[] = detectedList.map((d, index) => ({
      ...d,
      id: `p-scan-${Date.now()}-${index}`
    }));
    setPantryItems(prev => [...items, ...prev]);
  };

  const handleToggleFavorite = (recipeId: string) => {
    setRecipes(prev => prev.map(r => 
      r.id === recipeId ? { ...r, isFavorite: !r.isFavorite } : r
    ));
    if (activeRecipeDetail?.id === recipeId) {
      setActiveRecipeDetail(prev => prev ? { ...prev, isFavorite: !prev.isFavorite } : null);
    }
  };

  const handleStartCooking = (recipe: Recipe, servings = 2) => {
    setActiveRecipeDetail(null);
    setCookingRecipe({ recipe, servings });
  };

  const handleCompleteDish = (rescuedIngredientNames: string[]) => {
    // Increment rescued metric
    setRescuedCount(prev => prev + Math.max(1, rescuedIngredientNames.length));

    // Deduct quantities of used ingredients
    setPantryItems(prev => {
      return prev.map(item => {
        if (rescuedIngredientNames.some(name => name.toLowerCase() === item.name.toLowerCase())) {
          const newQty = Math.max(0, item.quantity - 1);
          return { ...item, quantity: newQty };
        }
        return item;
      }).filter(item => item.quantity > 0);
    });

    setCookingRecipe(null);
    setCurrentTab('impact');
  };

  return (
    <div className="min-h-screen bg-[#F5F1E9] text-[#1B1C1A] selection:bg-[#2E5A44]/20 selection:text-[#15422E] flex flex-col items-center justify-start">
      {/* Container wrapper: mobile frame mode or expanded desktop mode */}
      <div className={`w-full transition-all duration-300 min-h-screen flex flex-col ${
        isMobileFrame 
          ? 'max-w-md my-0 sm:my-6 sm:rounded-[40px] sm:shadow-2xl sm:border-[8px] sm:border-[#2D3A37] sm:ring-1 sm:ring-black/10 overflow-hidden bg-[#FBF9F5]' 
          : 'max-w-6xl mx-auto bg-[#FBF9F5]'
      }`}>
        {/* Mobile Phone Simulated Dynamic Island / Speaker Notch (visible only in mobile frame mode on desktop) */}
        {isMobileFrame && (
          <div className="hidden sm:flex items-center justify-between px-6 pt-2 pb-1 bg-[#2D3A37] text-white text-[11px] font-semibold select-none">
            <span>9:41</span>
            <div className="w-20 h-4 bg-black rounded-full" />
            <div className="flex items-center gap-1.5">
              <span>5G</span>
              <div className="w-5 h-2.5 border border-white rounded-xs p-0.5">
                <div className="h-full bg-white rounded-2xs w-3/4" />
              </div>
            </div>
          </div>
        )}

        {/* Global App Header */}
        <Header
          urgentCount={urgentItems.length}
          soonCount={soonItems.length}
          urgentItems={urgentItems}
          isMobileFrame={isMobileFrame}
          onToggleMobileFrame={() => setIsMobileFrame(!isMobileFrame)}
          onOpenAddModal={() => setIsAddModalOpen(true)}
          onNavigateToRecipes={() => setCurrentTab('recipes')}
        />

        {/* Main Content Area */}
        <main className="flex-1 p-4 sm:p-5">
          {currentTab === 'pantry' && (
            <PantryScreen
              items={pantryItems}
              selectedItemIdsForRecipe={selectedPantryItemIds}
              onToggleSelectItemForRecipe={handleToggleSelectItemForRecipe}
              onUpdateQuantity={handleUpdateQuantity}
              onRemoveItem={handleRemoveItem}
              onOpenAddModal={() => setIsAddModalOpen(true)}
              onGenerateFromSelection={() => setCurrentTab('recipes')}
            />
          )}

          {currentTab === 'recipes' && (
            <RecipesScreen
              recipes={recipes}
              pantryItems={pantryItems}
              selectedPantryItemIds={selectedPantryItemIds}
              onSelectRecipe={(recipe) => setActiveRecipeDetail(recipe)}
              onStartCooking={(recipe) => handleStartCooking(recipe, recipe.servings)}
              onToggleFavorite={handleToggleFavorite}
              onClearPantrySelection={() => setSelectedPantryItemIds([])}
            />
          )}

          {currentTab === 'impact' && (
            <ImpactScreen
              favoriteRecipes={favoriteRecipes}
              onSelectRecipe={(recipe) => setActiveRecipeDetail(recipe)}
              rescuedCount={rescuedCount}
            />
          )}
        </main>

        {/* Bottom Floating Navigation Dock */}
        <BottomNav
          currentTab={currentTab}
          onTabChange={(tab) => setCurrentTab(tab)}
          onOpenScanner={() => setIsScannerOpen(true)}
          pantryCount={pantryItems.length}
          urgentCount={urgentItems.length}
        />
      </div>

      {/* Recipe Detail Modal */}
      {activeRecipeDetail && (
        <RecipeDetailModal
          recipe={activeRecipeDetail}
          onClose={() => setActiveRecipeDetail(null)}
          onStartCooking={(recipe, servings) => handleStartCooking(recipe, servings)}
          onToggleFavorite={handleToggleFavorite}
        />
      )}

      {/* Full Screen Active Cooking Mode */}
      {cookingRecipe && (
        <ActiveCookingMode
          recipe={cookingRecipe.recipe}
          servings={cookingRecipe.servings}
          onExit={() => setCookingRecipe(null)}
          onCompleteDish={handleCompleteDish}
        />
      )}

      {/* AI Smart Camera Scanner Modal */}
      {isScannerOpen && (
        <ScannerModal
          onClose={() => setIsScannerOpen(false)}
          onAddDetectedItems={handleAddBatchDetected}
        />
      )}

      {/* Add / Edit Ingredient Modal */}
      {isAddModalOpen && (
        <AddIngredientModal
          onClose={() => setIsAddModalOpen(false)}
          onAddItem={handleAddItem}
        />
      )}
    </div>
  );
}
