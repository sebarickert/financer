import { Formatter } from '$utils/parseArrayFromFormData';

export interface CategoriesFormOnlyCategory {
  categoryId: string;
  categoryLabel: string;
}

export const isCategoriesFormOnlyCategory = (
  category: unknown,
): category is CategoriesFormOnlyCategory =>
  typeof category === 'object' && category !== null && 'categoryId' in category;

export interface CategoriesFormFullFields extends CategoriesFormOnlyCategory {
  description?: string;
  amount: number;
}

export const isCategoriesFormFullFields = (
  category: unknown,
): category is CategoriesFormFullFields =>
  typeof category === 'object' &&
  category !== null &&
  'categoryId' in category &&
  'amount' in category;

export const parseCategoriesFormFullFields: Formatter<CategoriesFormFullFields> =
  {
    amount: (value) => parseFloat(value as string),
  };
