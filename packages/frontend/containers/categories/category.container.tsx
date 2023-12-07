import { useState, useEffect } from 'react';

import {
  useTransactionCategoriesRemoveMutation,
  useTransactionCategoriesFindOneQuery,
  useTransactionsFindMonthlySummariesByUserQuery,
  TransactionsFindMonthlySummariesByUserApiArg,
} from '$api/generated/financerApi';
import { DataHandler } from '$blocks/data-handler/data-handler';
import { initialMonthFilterOptions } from '$blocks/monthly-transaction-list/monthly-transaction-list';
import { useFirstTransaction } from '$hooks/transaction/useFirstTransaction';
import { useViewTransitionRouter } from '$hooks/useViewTransitionRouter';
import { Category } from '$pages/settings/categories/category';

interface CategoryContainerProps {
  id: string;
}

type FilterType = TransactionsFindMonthlySummariesByUserApiArg &
  typeof initialMonthFilterOptions;

export const CategoryContainer = ({ id }: CategoryContainerProps) => {
  const { push } = useViewTransitionRouter();

  const [monthFilterOptions, setMonthFilterOptions] = useState<FilterType>(
    initialMonthFilterOptions
  );

  const [deleteTransactionCategory] = useTransactionCategoriesRemoveMutation();
  const transactionCategoryData = useTransactionCategoriesFindOneQuery({ id });
  const { data: category } = transactionCategoryData;

  const { data: transaction } = useFirstTransaction({
    parentTransactionCategory: id,
  });

  const firstAvailableTransaction = new Date(transaction?.date || new Date());

  const handleMonthOptionChange = (direction: 'next' | 'previous') => {
    const { month, year } = monthFilterOptions;
    const monthWithTwoDigits = month?.toString().padStart(2, '0');
    const selectedMonth = new Date(`${year}-${monthWithTwoDigits}-01`);

    selectedMonth.setMonth(
      selectedMonth.getMonth() + (direction === 'next' ? 1 : -1)
    );

    setMonthFilterOptions({
      ...monthFilterOptions,
      month: selectedMonth.getMonth() + 1,
      year: selectedMonth.getFullYear(),
    });
  };

  useEffect(() => {
    if (!id) return;

    setMonthFilterOptions({
      ...initialMonthFilterOptions,
      parentTransactionCategory: id,
    });
  }, [id]);

  const handleDelete = async () => {
    await deleteTransactionCategory({ id });
    push('/profile/transaction-categories');
  };

  const { data: transactionsMonthlySummaries } =
    useTransactionsFindMonthlySummariesByUserQuery({
      parentTransactionCategory: id,
    });

  return (
    <>
      <DataHandler {...transactionCategoryData} />
      {category && (
        <Category
          filterOptions={monthFilterOptions}
          firstAvailableTransaction={firstAvailableTransaction}
          onDelete={handleDelete}
          onMonthOptionChange={handleMonthOptionChange}
          transactionsMonthlySummaries={transactionsMonthlySummaries}
          category={category}
        />
      )}
    </>
  );
};
