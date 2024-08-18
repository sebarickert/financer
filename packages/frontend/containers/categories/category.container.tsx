'use client';

import {
  useTransactionCategoriesFindOneQuery,
  useTransactionsFindMonthlySummariesByUserQuery,
  useTransactionCategoriesFindAllByUserQuery,
} from '$api/generated/financerApi';
import { DataHandler } from '$blocks/data-handler/data-handler';
import { Category } from '$views/settings/categories/category';

interface CategoryContainerProps {
  id: string;
}

export const CategoryContainer = ({ id }: CategoryContainerProps) => {
  const categoryAllData = useTransactionCategoriesFindAllByUserQuery({});
  const transactionCategoryData = useTransactionCategoriesFindOneQuery({ id });
  const { data: category } = transactionCategoryData;

  const { data: transactionsMonthlySummaries } =
    useTransactionsFindMonthlySummariesByUserQuery({
      parentTransactionCategory: id,
    });

  return (
    <>
      <DataHandler {...transactionCategoryData} />
      {category && (
        <Category
          transactionsMonthlySummaries={transactionsMonthlySummaries}
          category={category}
          categories={categoryAllData.data ?? []}
          parentTransactionCategoryId={id}
        />
      )}
    </>
  );
};
