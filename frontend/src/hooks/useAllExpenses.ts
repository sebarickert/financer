import { useState, useEffect } from 'react';

import {
  groupExpensesByMonth,
  IExpensesPerMonth,
  sortExpensesByDate,
  sortExpenseStacksByMonth,
} from '../pages/expenses/ExpenseFuctions';
import { getAllUserTransactionCategoryMappings } from '../pages/expenses/Expenses';
import { getAllExpenses } from '../pages/expenses/ExpenseService';
import { getAllTransactionCategories } from '../pages/profile/TransactionCategories/TransactionCategoriesService';

export const useAllExpenses = (): IExpense[] | null => {
  const [expenses, setExpenses] = useState<IExpense[] | null>(null);

  useEffect(() => {
    const fetchExpenses = async () => {
      setExpenses(await getAllExpenses());
    };

    fetchExpenses();
  }, []);

  return expenses;
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
  const [transactionCategoryMappings, setTransactionCategoryMappings] =
    useState<ITransactionCategoryMapping[]>([]);
  const [transactionCategories, setTransactionCategories] = useState<
    ITransactionCategory[]
  >([]);

  useEffect(() => {
    const fetchAllTransactionCategories = async () => {
      setTransactionCategories(await getAllTransactionCategories());
    };
    const fetchAllUserTransactionCategoryMappings = async () => {
      setTransactionCategoryMappings(
        await getAllUserTransactionCategoryMappings()
      );
    };

    fetchAllTransactionCategories();
    fetchAllUserTransactionCategoryMappings();
  }, []);

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
