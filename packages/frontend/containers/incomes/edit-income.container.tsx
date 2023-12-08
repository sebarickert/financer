import { useCallback, useState } from 'react';

import {
  UpdateIncomeDto,
  useIncomesFindOneQuery,
  useIncomesRemoveMutation,
  useIncomesUpdateMutation,
} from '$api/generated/financerApi';
import { DataHandler } from '$blocks/data-handler/data-handler';
import { useViewTransitionRouter } from '$hooks/useViewTransitionRouter';
import { EditIncome } from '$pages/incomes/edit-income';
import { parseErrorMessagesToArray } from '$utils/apiHelper';

interface EditIncomeContainerProps {
  id: string;
}

export const EditIncomeContainer = ({ id }: EditIncomeContainerProps) => {
  const { push } = useViewTransitionRouter();
  const [deleteIncome] = useIncomesRemoveMutation();

  const [errors, setErrors] = useState<string[]>([]);

  const incomeData = useIncomesFindOneQuery({ id });
  const { data: income } = incomeData;
  const [editIncome, { isLoading: isSaving }] = useIncomesUpdateMutation();

  const handleSubmit = async (newIncomeData: UpdateIncomeDto) => {
    if (!id) {
      console.error('Failed to edit income: no id');
      return;
    }
    try {
      await editIncome({
        updateIncomeDto: newIncomeData,
        id,
      }).unwrap();

      push('/statistics/incomes');
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
        <EditIncome
          isLoading={isSaving}
          income={income}
          errors={errors}
          onSave={handleSubmit}
          onDelete={handleDelete}
        />
      )}
    </>
  );
};