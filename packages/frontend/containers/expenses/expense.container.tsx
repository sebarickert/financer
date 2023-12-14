import {
  useExpensesFindOneQuery,
  useAccountsFindOneByIdQuery,
} from '$api/generated/financerApi';
import { DataHandler } from '$blocks/data-handler/data-handler';
import { Transaction } from '$renderers/transaction/transaction';

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

  return (
    <>
      <DataHandler {...expenseData} />
      {expense && (
        <>
          <Transaction transaction={expense} fromAccount={account?.name} />
        </>
      )}
    </>
  );
};
