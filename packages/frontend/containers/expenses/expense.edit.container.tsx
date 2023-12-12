import { useCallback, useState } from 'react';

import {
  UpdateExpenseDto,
  useExpensesFindOneQuery,
  useExpensesRemoveMutation,
  useExpensesUpdateMutation,
} from '$api/generated/financerApi';
import { DataHandler } from '$blocks/data-handler/data-handler';
import { useViewTransitionRouter } from '$hooks/useViewTransitionRouter';
import { ExpenseEdit } from '$pages/expenses/expense.edit';
import { parseErrorMessagesToArray } from '$utils/apiHelper';

interface EditExpenseContainerProps {
  id: string;
}

export const EditExpenseContainer = ({ id }: EditExpenseContainerProps) => {
  const { push } = useViewTransitionRouter();
  const [errors, setErrors] = useState<string[]>([]);

  const expenseData = useExpensesFindOneQuery({ id });
  const { data: expense } = expenseData;
  const [editExpense, { isLoading: isSaving }] = useExpensesUpdateMutation();
  const [deleteExpense] = useExpensesRemoveMutation();

  const handleSubmit = async (newExpenseData: UpdateExpenseDto) => {
    if (!id) {
      console.error('Failed to edit expense: no id');
      return;
    }
    try {
      await editExpense({
        updateExpenseDto: newExpenseData,
        id,
      }).unwrap();

      push('/statistics/expenses');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      if (error.status === 400 || error.status === 404) {
        setErrors(parseErrorMessagesToArray(error?.data?.message));
        return;
      }

      // eslint-disable-next-line no-console
      console.error(error);
    }
  };

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
        <ExpenseEdit
          isLoading={isSaving}
          expense={expense}
          errors={errors}
          onSave={handleSubmit}
          onDelete={handleDelete}
        />
      )}
    </>
  );
};
