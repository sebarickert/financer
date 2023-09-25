import { useCallback } from 'react';

import {
  useExpensesFindOneQuery,
  useAccountsFindOneByIdQuery,
  useExpensesRemoveMutation,
} from '$api/generated/financerApi';
import { DataHandler } from '$blocks/data-handler/data-handler';
import { useAllTransactionCategoriesWithCategoryTree } from '$hooks/transactionCategories/useAllTransactionCategories';
import { useViewTransitionRouter } from '$hooks/useViewTransitionRouter';
import { Expense } from '$pages/expenses/expense';

interface ExpenseContainerProps {
  id: string;
}

export const ExpenseContainer = ({ id }: ExpenseContainerProps) => {
  const { push } = useViewTransitionRouter();
  const expenseData = useExpensesFindOneQuery({ id });
  const { data: expense } = expenseData;

  const accountData = useAccountsFindOneByIdQuery(
    { id: expense?.fromAccount as string },
    { skip: !expense?.fromAccount }
  );
  const account = accountData.data;

  const { data: transactionCategories } =
    useAllTransactionCategoriesWithCategoryTree();
  const [deleteExpense, { isLoading: isDeleting }] =
    useExpensesRemoveMutation();

  const getCategoryNameById = useCallback(
    (categoryId: string) =>
      transactionCategories?.find((category) => category._id === categoryId)
        ?.categoryTree || categoryId,
    [transactionCategories]
  );

  const handleDelete = useCallback(async () => {
    if (!id) {
      console.error('Failed to delete expense: no id');
      return;
    }
    await deleteExpense({ id }).unwrap();
    push('/statistics/expenses');
  }, [deleteExpense, id, push]);

  return (
    <>
      <DataHandler {...expenseData} />
      {expense && (
        <Expense
          isLoading={isDeleting}
          expense={expense}
          accountName={account?.name}
          onDelete={handleDelete}
          getCategoryNameById={getCategoryNameById}
        />
      )}
    </>
  );
};
