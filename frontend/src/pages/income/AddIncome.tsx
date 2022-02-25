import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

import { SEO } from '../../components/seo/seo';
import { useAddIncome } from '../../hooks/income/useAddIncome';
import { addTransactionCategoryMapping } from '../../services/TransactionCategoryMappingService';

import { IncomeForm } from './IncomeForm';

export const AddIncome = (): JSX.Element => {
  const history = useHistory();
  const [errors, setErrors] = useState<string[]>([]);
  const addIncome = useAddIncome();

  const handleSubmit = async (
    newIncomeData: IIncome,
    newTransactionCategoryMappingsData: ITransactionCategoryMapping[]
  ) => {
    try {
      const newIncomeJson = await addIncome(newIncomeData);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const newTransactionCategoryMappingJson =
        await addTransactionCategoryMapping(
          newTransactionCategoryMappingsData.map(
            (newTransactionCategoryMappingData) => ({
              ...newTransactionCategoryMappingData,
              transaction_id: newIncomeJson.payload._id,
            })
          )
        );

      if (newIncomeJson.status === 201) {
        history.push('/statistics/incomes');
      } else if (newIncomeJson.status === 400) {
        setErrors(newIncomeJson?.errors || ['Unknown error.']);
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error);
    }
  };

  return (
    <>
      <SEO title="Add income" />
      <IncomeForm
        onSubmit={handleSubmit}
        errors={errors}
        formHeading="Add income"
        submitLabel="Submit"
      />
    </>
  );
};
