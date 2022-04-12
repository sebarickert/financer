import { IIncome, ITransactionCategoryMapping } from '@local/types';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { UpdatePageInfo } from '../../components/seo/updatePageInfo';
import { useAddIncome } from '../../hooks/income/useAddIncome';
import { useUserDefaultIncomeAccount } from '../../hooks/profile/user-preference/useUserDefaultIncomeAccount';
import { parseErrorMessagesToArray } from '../../utils/apiHelper';

import { IncomeForm } from './IncomeForm';

export const AddIncome = (): JSX.Element => {
  const navigate = useNavigate();
  const [errors, setErrors] = useState<string[]>([]);
  const addIncome = useAddIncome();
  const [defaultIncomeAccount] = useUserDefaultIncomeAccount();

  const handleSubmit = async (
    newIncomeData: IIncome,
    newTransactionCategoryMappingsData: ITransactionCategoryMapping[]
  ) => {
    try {
      const newIncomeJson = await addIncome({
        ...newIncomeData,
        categories: newTransactionCategoryMappingsData,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any);

      if ('message' in newIncomeJson) {
        setErrors(parseErrorMessagesToArray(newIncomeJson.message));
        return;
      }

      navigate('/statistics/incomes');
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error);
    }
  };

  return (
    <>
      <UpdatePageInfo title="Add income" />
      <IncomeForm
        onSubmit={handleSubmit}
        errors={errors}
        submitLabel="Submit"
        toAccount={defaultIncomeAccount}
      />
    </>
  );
};
