import { useState, useEffect } from 'react';
import { useQuery } from 'react-query';

import {
  groupExpensesByMonth,
  IExpensesPerMonth,
  sortExpensesByDate,
  sortExpenseStacksByMonth,
} from '../pages/expenses/ExpenseFuctions';
import { getAllExpenses } from '../pages/expenses/ExpenseService';

import { useAllTransactionCategories } from './useAllTransactionCategories';
import { useAllTransactionCategoryMappings } from './useAllTransactionCategoryMappings';

export const useAllExpenses = (): IExpense[] | null => {
  const expenseQuery = useQuery('expenses', getAllExpenses, {
    staleTime: 300000,
  });

  return expenseQuery.data || null;
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

export const useAllExpensesGroupByMonth = () => {
  const expenses = useAllExpenses();
  const [groupedExpenses, setGroupedExpenses] = useState<IExpensesPerMonth[]>(
    []
  );
  const transactionCategoryMappings = useAllTransactionCategoryMappings();
  const transactionCategories = useAllTransactionCategories();

  useEffect(() => {
    if (expenses === null) return;

    setGroupedExpenses(
      expenses
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
  }, [expenses, transactionCategories, transactionCategoryMappings]);

  return groupedExpenses;
};
