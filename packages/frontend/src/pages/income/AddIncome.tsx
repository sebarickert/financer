import { CreateIncomeDto, TransactionType } from '@local/types';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { UpdatePageInfo } from '../../components/seo/updatePageInfo';
import { TransactionTemplatesSwitcher } from '../../components/transaction-template-switcher/transaction-templates-switcher';
import { useAddIncome } from '../../hooks/income/useAddIncome';
import { useUserDefaultIncomeAccount } from '../../hooks/profile/user-preference/useUserDefaultIncomeAccount';
import { parseErrorMessagesToArray } from '../../utils/apiHelper';

import { IncomeForm } from './IncomeForm';

export const AddIncome = (): JSX.Element => {
  const navigate = useNavigate();
  const [errors, setErrors] = useState<string[]>([]);
  const addIncome = useAddIncome();
  const [defaultIncomeAccount] = useUserDefaultIncomeAccount();

  const handleSubmit = async (newIncomeData: CreateIncomeDto) => {
    try {
      const newIncomeJson = await addIncome(newIncomeData);

      if ('message' in newIncomeJson) {
        setErrors(parseErrorMessagesToArray(newIncomeJson.message));
        return;
      }

      navigate('/statistics/incomes');
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
    }
  };

  return (
    <>
      <UpdatePageInfo
        title="Add income"
        headerAction={
          <TransactionTemplatesSwitcher templateType={TransactionType.INCOME} />
        }
      />
      <IncomeForm
        onSubmit={handleSubmit}
        errors={errors}
        submitLabel="Submit"
        toAccount={defaultIncomeAccount}
      />
    </>
  );
};
