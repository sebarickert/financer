import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { ExpenseForm } from './ExpenseForm';

import {
  CreateExpenseDto,
  useExpensesFindOneQuery,
} from '$api/generated/financerApi';
import { DataHandler } from '$blocks/data-handler/data-handler';
import { useEditExpense } from '$hooks/expense/useEditExpense';
import { UpdatePageInfo } from '$renderers/seo/updatePageInfo';
import { parseErrorMessagesToArray } from '$utils/apiHelper';

export const EditExpense = (): JSX.Element => {
  const navigate = useNavigate();
  const { id = 'id not found' } = useParams<{ id: string }>();
  const [errors, setErrors] = useState<string[]>([]);
  const editExpense = useEditExpense();

  const expenseData = useExpensesFindOneQuery({ id });
  const { data: expense } = expenseData;

  const handleSubmit = async (targetExpenseData: CreateExpenseDto) => {
    if (!id) {
      console.error('Failed to edit expense: no id');
      return;
    }
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const targetExpenseJson = await editExpense(targetExpenseData as any, id);

      if ('message' in targetExpenseJson) {
        setErrors(parseErrorMessagesToArray(targetExpenseJson.message));
        return;
      }

      navigate('/statistics/expenses');
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
    }
  };

  return (
    <>
      <DataHandler {...expenseData} />
      <UpdatePageInfo title={`Edit ${expense?.description}`} />
      {expense && (
        <ExpenseForm
          onSubmit={handleSubmit}
          errors={errors}
          submitLabel="Update"
          amount={expense.amount}
          description={expense.description}
          date={new Date(expense.date)}
          fromAccount={expense.fromAccount}
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          transactionCategoryMapping={expense.categories as any}
        />
      )}
    </>
  );
};
