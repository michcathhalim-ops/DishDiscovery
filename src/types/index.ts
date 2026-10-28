export type StorageZone = 'fridge' | 'crisper' | 'pantry' | 'freezer' | 'counter';

export type ExpirationTier = 'urgent' | 'soon' | 'fresh';

export interface PantryItem {
  id: string;
  name: string;
  category: 'Produce' | 'Dairy & Eggs' | 'Proteins' | 'Bakery' | 'Grains & Pasta' | 'Condiments & Spices' | 'Canned & Jarred';
  quantity: number;
  unit: string;
  storageZone: StorageZone;
  daysRemaining: number;
  expiryDate: string; // ISO date string
  imageUrl: string;
  notes?: string;
  isUsedUp?: boolean;
}

export interface RecipeIngredient {
  name: string;
  amount: number;
  unit: string;
  isPantryMatch?: boolean;
  isExpiringSoon?: boolean;
}

export interface CookingStep {
  stepNumber: number;
  title: string;
  instruction: string;
  timerMinutes?: number;
  tip?: string;
}

export interface Recipe {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  prepTimeMinutes: number;
  cookTimeMinutes: number;
  servings: number;
  difficulty: 'Easy' | 'Moderate' | 'Advanced';
  calories: number;
  cuisine: string;
  dietaryTags: string[];
  imageUrl: string;
  ingredients: RecipeIngredient[];
  steps: CookingStep[];
  matchScore: number; // percentage, e.g. 94
  matchingIngredientsCount: number;
  missingIngredientsCount: number;
  expiringIngredientsUsed: string[];
  isFavorite?: boolean;
}

export interface MealPlanDay {
  dayName: string; // e.g. 'Monday'
  dateStr: string;
  meals: {
    mealType: 'Breakfast' | 'Lunch' | 'Dinner';
    recipe?: Recipe;
  }[];
}
