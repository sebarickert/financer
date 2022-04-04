import { IAccount, IIncome } from '@local/types';
import React, { useState, useEffect } from 'react';
import { useQuery } from 'react-query';

import {
  groupIncomesByMonth,
  IIncomesPerMonth,
  sortIncomesByDate,
  sortIncomeStacksByMonth,
} from '../../pages/income/IncomeFuctions';
import { getAllIncomes } from '../../services/IncomeService';
import { useAllAccountsByType } from '../account/useAllAccounts';
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

export const useAllIncomesGroupByMonth = (
  initialForbiddenAccountTypes: IAccount['type'][] = []
): [
  IIncomesPerMonth[],
  React.Dispatch<React.SetStateAction<IAccount['type'][]>>
] => {
  const incomes = useAllIncomes();
  const [{ data: allForbiddenAccounts }, setTargetTypes] = useAllAccountsByType(
    []
  );
  const [groupedIncomes, setGroupedIncomes] = useState<IIncomesPerMonth[]>([]);
  const transactionCategoryMappings = useAllTransactionCategoryMappings();
  const transactionCategories = useAllTransactionCategories();
  const [forbiddenAccountTypes, setForbiddenAccountTypes] = useState<
    IAccount['type'][]
  >(initialForbiddenAccountTypes);

  useEffect(() => {
    if (incomes === null) return;

    const forbiddenAccountIds = allForbiddenAccounts?.map(({ _id }) => _id);

    setGroupedIncomes(
      incomes
        .filter(({ _id }) => !forbiddenAccountIds?.includes(_id))
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
  }, [
    allForbiddenAccounts,
    incomes,
    transactionCategories,
    transactionCategoryMappings,
  ]);

  useEffect(() => {
    setTargetTypes(forbiddenAccountTypes);
  }, [forbiddenAccountTypes, setTargetTypes]);

  return [groupedIncomes, setForbiddenAccountTypes];
};
