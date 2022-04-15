import { AccountType, ExpenseDto } from '@local/types';
import { useState, useEffect } from 'react';
import { useQuery } from 'react-query';

import {
  groupExpensesByMonth,
  IExpensesPerMonth,
  sortExpensesByDate,
  sortExpenseStacksByMonth,
} from '../../pages/expenses/ExpenseFuctions';
import { getAllExpenses } from '../../services/ExpenseService';
import { useAllAccountsByType } from '../account/useAllAccounts';
import { useAllTransactionCategories } from '../transactionCategories/useAllTransactionCategories';
import { useAllTransactionCategoryMappings } from '../transactionCategoryMapping/useAllTransactionCategoryMappings';

export const useAllExpenses = (): ExpenseDto[] => {
  const expenseQuery = useQuery(['expenses'], getAllExpenses);

  return expenseQuery.data ?? [];
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
  IExpensesPerMonth[],
  React.Dispatch<React.SetStateAction<AccountType[]>>
] => {
  const expenses = useAllExpenses();
  const [allForbiddenAccounts, setTargetTypes] = useAllAccountsByType([]);
  const [groupedExpenses, setGroupedExpenses] = useState<IExpensesPerMonth[]>(
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
        .reduce<IExpensesPerMonth[]>(groupExpensesByMonth, [])
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
