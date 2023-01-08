import { TransactionType } from '@local/types';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { TransactionTemplateSwitcher } from '../../components/blocks/transaction-template-switcher/transaction-template-switcher';
import { UpdatePageInfo } from '../../components/renderers/seo/updatePageInfo';
import { useAddExpense } from '../../hooks/expense/useAddExpense';
import { useUserDefaultExpenseAccount } from '../../hooks/profile/user-preference/useUserDefaultExpenseAccount';
import { parseErrorMessagesToArray } from '../../utils/apiHelper';

import { ExpenseForm } from './ExpenseForm';

import { CreateExpenseDto } from '$api/generated/financerApi';
import { Loader } from '$elements/loader/loader';

export const AddExpense = (): JSX.Element => {
  const navigate = useNavigate();
  const [errors, setErrors] = useState<string[]>([]);
  const addExpense = useAddExpense();
  const { data: defaultExpenseAccount, isLoading: isLoadingDefaultAccount } =
    useUserDefaultExpenseAccount();

  const handleSubmit = async (newExpenseData: CreateExpenseDto) => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const newExpenseJson = await addExpense(newExpenseData as any);

      if ('message' in newExpenseJson) {
        setErrors(parseErrorMessagesToArray(newExpenseJson.message));
        return;
      }

      navigate('/statistics/expenses');
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
    }
  };

  const isLoading = isLoadingDefaultAccount;

  return (
    <>
      <UpdatePageInfo
        title="Add expense"
        headerAction={
          <TransactionTemplateSwitcher templateType={TransactionType.EXPENSE} />
        }
      />
      {isLoading ? (
        <Loader />
      ) : (
        <ExpenseForm
          onSubmit={handleSubmit}
          errors={errors}
          submitLabel="Submit"
          fromAccount={defaultExpenseAccount}
        />
      )}
    </>
  );
};
