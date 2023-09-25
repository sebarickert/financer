import { useState } from 'react';

import {
  UpdateExpenseDto,
  useExpensesFindOneQuery,
  useExpensesUpdateMutation,
} from '$api/generated/financerApi';
import { DataHandler } from '$blocks/data-handler/data-handler';
import { useViewTransitionRouter } from '$hooks/useViewTransitionRouter';
import { EditExpense } from '$pages/expenses/edit-expense';
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
  return (
    <>
      <DataHandler {...expenseData} />
      {expense && (
        <EditExpense
          isLoading={isSaving}
          expense={expense}
          errors={errors}
          onSave={handleSubmit}
        />
      )}
    </>
  );
};
