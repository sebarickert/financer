import { useCallback } from 'react';

import {
  useIncomesFindOneQuery,
  useAccountsFindOneByIdQuery,
  useIncomesRemoveMutation,
} from '$api/generated/financerApi';
import { DataHandler } from '$blocks/data-handler/data-handler';
import { useAllTransactionCategoriesWithCategoryTree } from '$hooks/transactionCategories/useAllTransactionCategories';
import { useViewTransitionRouter } from '$hooks/useViewTransitionRouter';
import { Income } from '$pages/incomes/income';

interface IncomeContainerProps {
  id: string;
}

export const IncomeContainer = ({ id }: IncomeContainerProps) => {
  const { push } = useViewTransitionRouter();
  const incomeData = useIncomesFindOneQuery({ id });
  const { data: income } = incomeData;

  const accountData = useAccountsFindOneByIdQuery(
    { id: income?.toAccount as string },
    { skip: !income?.toAccount }
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
      <DataHandler {...incomeData} />
      {income && (
        <Income
          income={income}
          accountName={account?.name}
          getCategoryNameById={getCategoryNameById}
        />
      )}
    </>
  );
};
