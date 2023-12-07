import { useMemo } from 'react';

import { useAllTransactionCategoriesWithCategoryTree } from '$hooks/transactionCategories/useAllTransactionCategories';
import {
  CategoriesListRowItemProps,
  CategoriesListRowProps,
  CategoryListing,
} from '$pages/settings/categories/category-listing';

const generateCategoryGroupChild = (
  childName: CategoriesListRowItemProps['label'],
  childId: CategoriesListRowItemProps['id'],
  tree: CategoriesListRowItemProps['tree'],
  showTree = true
) => ({
  id: childId,
  label: childName,
  tree: showTree ? tree : '',
  link: `/profile/transaction-categories/${childId}`,
});

export const CategoryListingContainer = () => {
  const { data: categories } = useAllTransactionCategoriesWithCategoryTree();

  const categoryRows = useMemo<CategoriesListRowProps[]>(() => {
    if (!categories) return [];

    const allParentIds = categories.map(
      ({ parent_category_id }) => parent_category_id
    );

    const categoriesWithChildren = categories
      .filter(
        ({ _id, parent_category_id }) =>
          allParentIds.includes(_id) || !!parent_category_id
      )
      .reduce((prev, { name, _id, parent_category_id, categoryTree }) => {
        if (!parent_category_id) {
          prev.push({
            ...generateCategoryGroupChild(name, _id, categoryTree, false),
            items: [],
          });
        } else {
          prev[prev.length - 1].items.push(
            generateCategoryGroupChild(name, _id, categoryTree)
          );
        }

        return prev;
      }, [] as CategoriesListRowProps[]);

    const generalCategoryGroup = {
      label: 'General',
      items: categories
        .filter(
          ({ _id, parent_category_id }) =>
            !allParentIds.includes(_id) && !parent_category_id
        )
        .map(({ _id, name, categoryTree }) =>
          generateCategoryGroupChild(name, _id, categoryTree, false)
        ),
    };

    return [generalCategoryGroup, ...categoriesWithChildren];
  }, [categories]);

  return <CategoryListing categories={categoryRows} />;
};
