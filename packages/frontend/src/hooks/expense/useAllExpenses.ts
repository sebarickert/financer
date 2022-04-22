import { AccountType, ExpenseDto, PaginationDto } from '@local/types';
import { useState, useEffect } from 'react';
import { useQuery } from 'react-query';

import {
  groupExpensesByMonth,
  ExpensesPerMonth,
  sortExpensesByDate,
  sortExpenseStacksByMonth,
} from '../../pages/expenses/ExpenseFuctions';
import { getAllExpenses } from '../../services/ExpenseService';
import { TransactionFilterOptions } from '../../services/TransactionService';
import { useAllAccountsByType } from '../account/useAllAccounts';
import { useUserTransactionListChunkSize } from '../profile/user-preference/useUserTransactionListChunkSize';
import { useAllTransactionCategories } from '../transactionCategories/useAllTransactionCategories';
import { useAllTransactionCategoryMappings } from '../transactionCategoryMapping/useAllTransactionCategoryMappings';
import { PagerOptions, usePager } from '../usePager';

type UseAllExpensesPagedReturn = {
  data: PaginationDto<ExpenseDto<string>[]>;
  pagerOptions: PagerOptions;
};

export const useAllExpenses = (): ExpenseDto[] => {
  const { data, error } = useQuery(['expenses'], () => getAllExpenses());

  if (error || !data) {
    throw new Error(`Missing data. Error: ${JSON.stringify(error ?? data)}`);
  }

  return data.data;
};

export const useAllExpensesPaged = (
  intialPage = 1,
  requestParams: Omit<TransactionFilterOptions, 'page'> = {}
): UseAllExpensesPagedReturn => {
  const [chunkAmount] = useUserTransactionListChunkSize();
  const { page, getLoadPageFunctions } = usePager(intialPage);

  const { data, error } = useQuery(['expenses', page, requestParams], () =>
    getAllExpenses({ limit: chunkAmount, ...requestParams, page })
  );

  if (!data || error) {
    throw new Error(`Missing data. Error: ${JSON.stringify(error ?? data)}`);
  }

  return {
    data: data,
    pagerOptions: getLoadPageFunctions(data),
  };
};

export const useCurrentMonthExpensesTotalAmount = (): number => {
  const expenses = useAllExpenses();
  const [totalAmount, setTotalAmount] = useState(NaN);

  useEffect(() => {
    if (expenses === null) return;

    const total = expenses.reduce((currentTotal, { amount, date }) => {
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
  }, [expenses]);

  return totalAmount;
};

export const useAllExpensesGroupByMonth = (
  initialForbiddenAccountTypes: AccountType[] = []
): [
  ExpensesPerMonth[],
  React.Dispatch<React.SetStateAction<AccountType[]>>
] => {
  const expenses = useAllExpenses();
  const [allForbiddenAccounts, setTargetTypes] = useAllAccountsByType([]);
  const [groupedExpenses, setGroupedExpenses] = useState<ExpensesPerMonth[]>(
    []
  );
  const transactionCategoryMappings = useAllTransactionCategoryMappings();
  const transactionCategories = useAllTransactionCategories();
  const [forbiddenAccountTypes, setForbiddenAccountTypes] = useState<
    AccountType[]
  >(initialForbiddenAccountTypes);

  useEffect(() => {
    const forbiddenAccountIds = allForbiddenAccounts?.map(({ _id }) => _id);

    setGroupedExpenses(
      expenses
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
        .reduce<ExpensesPerMonth[]>(groupExpensesByMonth, [])
        .sort(sortExpenseStacksByMonth)
        .map(sortExpensesByDate)
    );
  }, [
    allForbiddenAccounts,
    expenses,
    transactionCategories,
    transactionCategoryMappings,
  ]);

  useEffect(() => {
    setTargetTypes(forbiddenAccountTypes);
  }, [forbiddenAccountTypes, setTargetTypes]);

  return [groupedExpenses, setForbiddenAccountTypes];
};
