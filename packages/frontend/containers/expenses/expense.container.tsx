import { useCallback } from 'react';

import {
  useExpensesFindOneQuery,
  useAccountsFindOneByIdQuery,
} from '$api/generated/financerApi';
import { DataHandler } from '$blocks/data-handler/data-handler';
import { useAllTransactionCategoriesWithCategoryTree } from '$hooks/transactionCategories/useAllTransactionCategories';
import { Expense } from '$pages/expenses/expense';

interface ExpenseContainerProps {
  id: string;
}

export const ExpenseContainer = ({ id }: ExpenseContainerProps) => {
  const expenseData = useExpensesFindOneQuery({ id });
  const { data: expense } = expenseData;

  const accountData = useAccountsFindOneByIdQuery(
    { id: expense?.fromAccount as string },
    { skip: !expense?.fromAccount }
  );
  const account = accountData.data;

  const { data: transactionCategories } =
    useAllTransactionCategoriesWithCategoryTree();

  const getCategoryNameById = useCallback(
    (categoryId: string) =>
      transactionCategories?.find((category) => category._id === categoryId)
        ?.categoryTree || categoryId,
    [transactionCategories]
  );

  return (
    <>
      <DataHandler {...expenseData} />
      {expense && (
        <Expense
          expense={expense}
          accountName={account?.name}
          getCategoryNameById={getCategoryNameById}
        />
      )}
    </>
  );
};
