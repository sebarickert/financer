import { SchemaTransactionCategoryDto } from '@/api/ssr-financer-api';

export interface ITransactionCategoryWithCategoryTree
  extends SchemaTransactionCategoryDto {
  categoryTree: string;
}

export const parseParentCategoryPath = (
  allCategories: readonly SchemaTransactionCategoryDto[],
  categoryId: string,
): string => {
  const targetCategory = allCategories.find(({ id }) => id === categoryId);

  if (!targetCategory?.parentCategoryId) {
    return `${targetCategory?.name}`;
  }
  const parentPath = parseParentCategoryPath(
    allCategories,
    targetCategory.parentCategoryId,
  );
  return `${parentPath} > ${targetCategory.name}`;
};

export const getAllChildCategoryIds = (
  parentId: string,
  transactionCategories: SchemaTransactionCategoryDto[],
  depth = 0,
): string[] => {
  if (depth > 10) {
    return [];
  }

  const ids = transactionCategories
    .filter((category) => category.parentCategoryId === parentId)
    .map<string>((category) => category.id);

  const childIds = ids
    .map((id) => getAllChildCategoryIds(id, transactionCategories, depth + 1))
    .flat(1);

  return [...ids, ...childIds];
};
