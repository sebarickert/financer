import { useRouter } from 'next/router';
import { useCallback } from 'react';

import {
  useIncomesFindOneQuery,
  useAccountsFindOneByIdQuery,
  useIncomesRemoveMutation,
} from '$api/generated/financerApi';
import { DataHandler } from '$blocks/data-handler/data-handler';
import { useAllTransactionCategoriesWithCategoryTree } from '$hooks/transactionCategories/useAllTransactionCategories';
import { Income } from '$pages/income/income';

interface IncomeContainerProps {
  id: string;
}

export const IncomeContainer = ({ id }: IncomeContainerProps) => {
  const { push } = useRouter();
  const incomeData = useIncomesFindOneQuery({ id });
  const { data: income } = incomeData;

  const accountData = useAccountsFindOneByIdQuery(
    { id: income?.toAccount as string },
    { skip: !income?.toAccount }
  );
  const account = accountData.data;

  const { data: transactionCategories } =
    useAllTransactionCategoriesWithCategoryTree();
  const [deleteIncome, { isLoading: isDeleting }] = useIncomesRemoveMutation();

  const getCategoryNameById = useCallback(
    (categoryId: string) =>
      transactionCategories?.find((category) => category._id === categoryId)
        ?.categoryTree || categoryId,
    [transactionCategories]
  );

  const handleDelete = useCallback(async () => {
    if (!id) {
      console.error('Failed to delete income: no id');
      return;
    }
    await deleteIncome({ id }).unwrap();
    push('/statistics/incomes');
  }, [deleteIncome, id, push]);

  return (
    <>
      <DataHandler {...incomeData} />
      {income && (
        <Income
          isLoading={isDeleting}
          income={income}
          accountName={account?.name}
          onDelete={handleDelete}
          getCategoryNameById={getCategoryNameById}
        />
      )}
    </>
  );
};
