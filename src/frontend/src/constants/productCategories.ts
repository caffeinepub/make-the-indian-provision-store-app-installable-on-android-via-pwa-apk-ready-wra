import { ProductCategory } from '../backend';

export interface CategoryDisplay {
  label: string;
  value: ProductCategory;
  icon: string;
  description?: string;
}

// Canonical list of product categories matching backend enum
export const PRODUCT_CATEGORIES: CategoryDisplay[] = [
  {
    label: 'Fruits',
    value: ProductCategory.fruits,
    icon: '🍎',
    description: 'Fresh fruits'
  },
  {
    label: 'Vegetables',
    value: ProductCategory.vegetables,
    icon: '🥬',
    description: 'Fresh vegetables'
  },
  {
    label: 'Spices',
    value: ProductCategory.spices,
    icon: '🌶️',
    description: 'Spices and seasonings'
  },
  {
    label: 'Groceries',
    value: ProductCategory.groceries,
    icon: '🌾',
    description: 'Essential groceries'
  },
  {
    label: 'Snacks',
    value: ProductCategory.snacks,
    icon: '🍪',
    description: 'Snacks and treats'
  },
  {
    label: 'Beverages',
    value: ProductCategory.beverages,
    icon: '☕',
    description: 'Drinks and beverages'
  },
  {
    label: 'Household/Toiletries',
    value: ProductCategory.householdToiletries,
    icon: '🧴',
    description: 'Household and personal care'
  }
];

// Helper to get category display info by value
export function getCategoryDisplay(category: ProductCategory): CategoryDisplay | undefined {
  return PRODUCT_CATEGORIES.find(cat => cat.value === category);
}

// Helper to get category label
export function getCategoryLabel(category: ProductCategory): string {
  return getCategoryDisplay(category)?.label || 'Unknown';
}
