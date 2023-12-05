import { useState } from 'react';

import {
  CreateIncomeDto,
  useIncomesCreateMutation,
  useTransactionTemplatesFindOneQuery,
} from '$api/generated/financerApi';
import { DataHandler } from '$blocks/data-handler/data-handler';
import { useUserDefaultIncomeAccount } from '$hooks/profile/user-preference/useUserDefaultIncomeAccount';
import { useViewTransitionRouter } from '$hooks/useViewTransitionRouter';
import { AddIncome } from '$pages/incomes/add-income';
import { parseErrorMessagesToArray } from '$utils/apiHelper';

interface AddIncomeContainerProps {
  templateId?: string;
}

export const AddIncomeContainer = ({ templateId }: AddIncomeContainerProps) => {
  const { push } = useViewTransitionRouter();
  const [errors, setErrors] = useState<string[]>([]);
  const [addIncome, { isLoading: isCreating }] = useIncomesCreateMutation();
  const { data: defaultIncomeAccount, isLoading: isLoadingDefaultAccount } =
    useUserDefaultIncomeAccount({ skip: !!templateId });

  const templateData = useTransactionTemplatesFindOneQuery(
    { id: templateId as string },
    { skip: !templateId }
  );

  const { data: transactionTemplate } = templateData;

  const handleSubmit = async (newIncomeData: CreateIncomeDto) => {
    try {
      await addIncome({
        createIncomeDto: newIncomeData,
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

  const isLoading = isLoadingDefaultAccount;

  return (
    <>
      <DataHandler skipNotFound {...templateData} />
      {(!templateId || transactionTemplate) && (
        <AddIncome
          defaultIncomeAccount={defaultIncomeAccount}
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
