import { TransactionCategoryDto } from '$api/generated/financerApi';

export interface ITransactionCategoryWithCategoryTree
  extends TransactionCategoryDto {
  categoryTree: string;
}

export const parseParentCategoryPath = (
  allCategories: TransactionCategoryDto[],
  categoryId: string
): string => {
  const targetCategory = allCategories.find(({ _id }) => _id === categoryId);

  if (!targetCategory?.parent_category_id) {
    return `${targetCategory?.name}`;
  }
  const parentPath = parseParentCategoryPath(
    allCategories,
    targetCategory.parent_category_id
  );
  return `${parentPath} > ${targetCategory?.name}`;
};

export const getAllChildCategoryIds = (
  parentId: string,
  transactionCategories: TransactionCategoryDto[],
  depth = 0
): string[] => {
  if (depth > 10) {
    return [];
  }

  const ids = transactionCategories
    .filter((category) => category.parent_category_id === parentId)
    .map<string>((category) => category._id);

  const childIds = ids
    .map((id) => getAllChildCategoryIds(id, transactionCategories, depth + 1))
    .flat(1);

  return [...ids, ...childIds];
};
