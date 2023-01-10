import { TransactionType } from '@local/types';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { IncomeForm } from './IncomeForm';

import {
  CreateIncomeDto,
  useIncomesCreateMutation,
} from '$api/generated/financerApi';
import { TransactionTemplateSwitcher } from '$blocks/transaction-template-switcher/transaction-template-switcher';
import { Loader } from '$elements/loader/loader';
import { LoaderFullScreen } from '$elements/loader/loader.fullscreen';
import { useUserDefaultIncomeAccount } from '$hooks/profile/user-preference/useUserDefaultIncomeAccount';
import { UpdatePageInfo } from '$renderers/seo/updatePageInfo';
import { parseErrorMessagesToArray } from '$utils/apiHelper';

export const AddIncome = (): JSX.Element => {
  const navigate = useNavigate();
  const [errors, setErrors] = useState<string[]>([]);
  const [addIncome, { isLoading: isCreating }] = useIncomesCreateMutation();
  const { data: defaultIncomeAccount, isLoading: isLoadingDefaultAccount } =
    useUserDefaultIncomeAccount();

  const handleSubmit = async (newIncomeData: CreateIncomeDto) => {
    try {
      const newIncomeJson = await addIncome({
        createIncomeDto: newIncomeData,
      }).unwrap();

      if ('message' in newIncomeJson) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        setErrors(parseErrorMessagesToArray((newIncomeJson as any).message));
        return;
      }

      navigate('/statistics/incomes');
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
    }
  };

  const isLoading = isLoadingDefaultAccount;
  return (
    <>
      {isCreating && <LoaderFullScreen />}
      <UpdatePageInfo
        title="Add income"
        headerAction={
          <TransactionTemplateSwitcher templateType={TransactionType.INCOME} />
        }
      />
      {isLoading ? (
        <Loader />
      ) : (
        <IncomeForm
          onSubmit={handleSubmit}
          errors={errors}
          submitLabel="Submit"
          toAccount={defaultIncomeAccount}
        />
      )}
    </>
  );
};
