import { useState, useEffect } from 'react';
import { useQuery } from 'react-query';

import {
  groupIncomesByMonth,
  IIncomesPerMonth,
  sortIncomesByDate,
  sortIncomeStacksByMonth,
} from '../../pages/income/IncomeFuctions';
import { getAllIncomes } from '../../services/IncomeService';
import { useAllTransactionCategories } from '../transactionCategories/useAllTransactionCategories';
import { useAllTransactionCategoryMappings } from '../transactionCategoryMapping/useAllTransactionCategoryMappings';

export const useAllIncomes = (): IIncome[] | null => {
  const incomesQuery = useQuery('incomes', getAllIncomes, {
    staleTime: 300000,
  });

  return incomesQuery.data || null;
};

export const useCurrentMonthIncomesTotalAmount = (): number => {
  const incomes = useAllIncomes();
  const [totalAmount, setTotalAmount] = useState(NaN);

  useEffect(() => {
    if (incomes === null) return;

    const total = incomes.reduce((currentTotal, { amount, date }) => {
      const currentMonth = new Date().getMonth() + 1;
      const month = new Date(date).getMonth() + 1;
      const currentYear = new Date().getFullYear();

      if (
        currentMonth === month &&
        currentYear === new Date(date).getFullYear()
      ) {
        return currentTotal + amount;
      }

      return currentTotal;
    }, 0);

    setTotalAmount(total);
  }, [incomes]);

  return totalAmount;
};

export const useAllIncomesGroupByMonth = () => {
  const incomes = useAllIncomes();
  const [groupedIncomes, setGroupedIncomes] = useState<IIncomesPerMonth[]>([]);
  const transactionCategoryMappings = useAllTransactionCategoryMappings();
  const transactionCategories = useAllTransactionCategories();

  useEffect(() => {
    if (incomes === null) return;

    setGroupedIncomes(
      incomes
        .map(({ _id, ...rest }) => {
          const categoryMappings = transactionCategoryMappings
            ?.filter(({ transaction_id }) => transaction_id === _id)
            .map(
              ({ category_id }) =>
                transactionCategories.find(
                  ({ _id: categoryId }) => category_id === categoryId
                )?.name
            )
            .filter(
              (categoryName) => typeof categoryName !== 'undefined'
              // @todo: Fix this type.
            ) as string[];

          return { _id, ...rest, categoryMappings };
        })
        .reduce<IIncomesPerMonth[]>(groupIncomesByMonth, [])
        .sort(sortIncomeStacksByMonth)
        .map(sortIncomesByDate)
    );
  }, [incomes, transactionCategories, transactionCategoryMappings]);

  return groupedIncomes;
};
