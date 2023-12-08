import { useState } from 'react';

import {
  CreateExpenseDto,
  useExpensesCreateMutation,
  useTransactionTemplatesFindOneQuery,
} from '$api/generated/financerApi';
import { DataHandler } from '$blocks/data-handler/data-handler';
import { useUserDefaultExpenseAccount } from '$hooks/settings/user-preference/useUserDefaultExpenseAccount';
import { useViewTransitionRouter } from '$hooks/useViewTransitionRouter';
import { AddExpense } from '$pages/expenses/add-expense';
import { parseErrorMessagesToArray } from '$utils/apiHelper';

interface AddExpenseContainerProps {
  templateId?: string;
}

export const AddExpenseContainer = ({
  templateId,
}: AddExpenseContainerProps) => {
  const { push } = useViewTransitionRouter();
  const [errors, setErrors] = useState<string[]>([]);
  const [addExpense, { isLoading: isCreating }] = useExpensesCreateMutation();
  const { data: defaultExpenseAccount, isLoading: isLoadingDefaultAccount } =
    useUserDefaultExpenseAccount({ skip: !!templateId });

  const templateData = useTransactionTemplatesFindOneQuery(
    { id: templateId as string },
    { skip: !templateId }
  );

  const { currentData: transactionTemplate } = templateData;

  const handleSubmit = async (newExpenseData: CreateExpenseDto) => {
    try {
      await addExpense({
        createExpenseDto: newExpenseData,
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

  const isLoading = isLoadingDefaultAccount;

  return (
    <>
      <DataHandler skipNotFound {...templateData} />
      {(!templateId || transactionTemplate) && (
        <AddExpense
          defaultExpenseAccount={defaultExpenseAccount}
          template={transactionTemplate}
          isLoading={isLoading}
          isCreating={isCreating}
          errors={errors}
          onSubmit={handleSubmit}
        />
      )}
    </>
  );
};
