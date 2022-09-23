import { CreateExpenseDto, TransactionType } from '@local/types';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { UpdatePageInfo } from '../../components/seo/updatePageInfo';
import { TransactionTemplatesSwitcher } from '../../components/transaction-template-switcher/transaction-templates-switcher';
import { useAddExpense } from '../../hooks/expense/useAddExpense';
import { useUserDefaultExpenseAccount } from '../../hooks/profile/user-preference/useUserDefaultExpenseAccount';
import { parseErrorMessagesToArray } from '../../utils/apiHelper';

import { ExpenseForm } from './ExpenseForm';

export const AddExpense = (): JSX.Element => {
  const navigate = useNavigate();
  const [errors, setErrors] = useState<string[]>([]);
  const addExpense = useAddExpense();
  const [defaultExpenseAccount] = useUserDefaultExpenseAccount();

  const handleSubmit = async (newExpenseData: CreateExpenseDto) => {
    try {
      const newExpenseJson = await addExpense(newExpenseData);

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

  return (
    <>
      <UpdatePageInfo
        title="Add expense"
        headerAction={
          <TransactionTemplatesSwitcher
            templateType={TransactionType.EXPENSE}
          />
        }
      />
      <ExpenseForm
        onSubmit={handleSubmit}
        errors={errors}
        submitLabel="Submit"
        fromAccount={defaultExpenseAccount}
      />
    </>
  );
};
