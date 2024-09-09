import { FC } from 'react';

import { CategoryService } from '$ssr/api/category.service';
import { TransactionService } from '$ssr/api/transaction.service';
import { Category } from '$views/settings/categories/category';

interface CategoryContainerProps {
  id: string;
}

export const CategoryContainer: FC<CategoryContainerProps> = async ({ id }) => {
  const allCategories = await CategoryService.getAll();
  const category = await CategoryService.getById(id);

  const transactionsMonthlySummaries =
    await TransactionService.getMonthlySummary({
      parentTransactionCategory: id,
    });

  return (
    <Category
      transactionsMonthlySummaries={transactionsMonthlySummaries}
      category={category}
      categories={allCategories}
      parentTransactionCategoryId={id}
    />
  );
};
