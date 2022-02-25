import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

import { SEO } from '../../components/seo/seo';
import { useAddExpense } from '../../hooks/expense/useAddExpense';
import { useAddTransactionCategoryMapping } from '../../hooks/transactionCategoryMapping/useAddTransactionCategoryMapping';

import { ExpenseForm } from './ExpenseForm';

export const AddExpense = (): JSX.Element => {
  const history = useHistory();
  const [errors, setErrors] = useState<string[]>([]);
  const addExpense = useAddExpense();
  const addTransactionCategoryMapping = useAddTransactionCategoryMapping();

  const handleSubmit = async (
    newExpenseData: IExpense,
    newTransactionCategoryMappingsData: ITransactionCategoryMapping[]
  ) => {
    try {
      const newExpenseJson = await addExpense(newExpenseData);
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

      if (newExpenseJson.status === 201) {
        history.push('/statistics/expenses');
      } else if (newExpenseJson.status === 400) {
        setErrors(newExpenseJson?.errors || ['Unknown error.']);
      }
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
      />
    </>
  );
};
