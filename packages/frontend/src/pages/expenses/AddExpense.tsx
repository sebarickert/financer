import { IExpense, ITransactionCategoryMapping } from '@local/types';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { SEO } from '../../components/seo/seo';
import { useAddExpense } from '../../hooks/expense/useAddExpense';
import { useUserDefaultExpenseAccount } from '../../hooks/profile/user-preference/useUserDefaultExpenseAccount';
import { useAddTransactionCategoryMapping } from '../../hooks/transactionCategoryMapping/useAddTransactionCategoryMapping';
import { parseErrorMessagesToArray } from '../../utils/apiHelper';

import { ExpenseForm } from './ExpenseForm';

export const AddExpense = (): JSX.Element => {
  const navigate = useNavigate();
  const [errors, setErrors] = useState<string[]>([]);
  const addExpense = useAddExpense();
  const addTransactionCategoryMapping = useAddTransactionCategoryMapping();
  const [defaultExpenseAccount] = useUserDefaultExpenseAccount();

  const handleSubmit = async (
    newExpenseData: IExpense,
    newTransactionCategoryMappingsData: ITransactionCategoryMapping[]
  ) => {
    try {
      const newExpenseJson = await addExpense(newExpenseData);

      if ('message' in newExpenseJson) {
        setErrors(parseErrorMessagesToArray(newExpenseJson.message));
        return;
      }

      if (newTransactionCategoryMappingsData.length > 0) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const newTransactionCategoryMappingJson =
          await addTransactionCategoryMapping(
            newTransactionCategoryMappingsData.map(
              (newTransactionCategoryMappingData) => ({
                ...newTransactionCategoryMappingData,
                transaction_id: newExpenseJson.payload._id,
              })
            )
          );
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
