import { IExpense, ITransactionCategoryMapping } from '@local/types';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { SEO } from '../../components/seo/seo';
import { useAddExpense } from '../../hooks/expense/useAddExpense';
import { useUserDefaultExpenseAccount } from '../../hooks/profile/user-preference/useUserDefaultExpenseAccount';
import { parseErrorMessagesToArray } from '../../utils/apiHelper';

import { ExpenseForm } from './ExpenseForm';

export const AddExpense = (): JSX.Element => {
  const navigate = useNavigate();
  const [errors, setErrors] = useState<string[]>([]);
  const addExpense = useAddExpense();
  const [defaultExpenseAccount] = useUserDefaultExpenseAccount();

  const handleSubmit = async (
    newExpenseData: IExpense,
    newTransactionCategoryMappingsData: ITransactionCategoryMapping[]
  ) => {
    try {
      const newExpenseJson = await addExpense({
        ...newExpenseData,
        categories: newTransactionCategoryMappingsData,
      } as any);

      if ('message' in newExpenseJson) {
        setErrors(parseErrorMessagesToArray(newExpenseJson.message));
        return;
      }

      navigate('/statistics/expenses');
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error);
    }
  };

  return (
    <>
      <SEO title="Add expense" />
      <ExpenseForm
        onSubmit={handleSubmit}
        errors={errors}
        formHeading="Add expense"
        submitLabel="Submit"
        fromAccount={defaultExpenseAccount}
      />
    </>
  );
};
