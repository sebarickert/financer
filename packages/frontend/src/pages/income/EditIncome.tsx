/* eslint-disable @typescript-eslint/no-unused-vars */
import { IIncome, ITransactionCategoryMapping } from '@local/types';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { Loader } from '../../components/loader/loader';
import { SEO } from '../../components/seo/seo';
import { useEditIncome } from '../../hooks/income/useEditIncome';
import { useIncomeById } from '../../hooks/income/useIncomeById';
import { useAddTransactionCategoryMapping } from '../../hooks/transactionCategoryMapping/useAddTransactionCategoryMapping';
import { useTransactionCategoryMappingsByTransactionId } from '../../hooks/transactionCategoryMapping/useTransactionCategoryMappingsByTransactionId';
import { parseErrorMessagesToArray } from '../../utils/apiHelper';

import { IncomeForm } from './IncomeForm';

export const EditIncome = (): JSX.Element => {
  const navigate = useNavigate();
  const [errors, setErrors] = useState<string[]>([]);
  const { id } = useParams<{ id: string }>();

  const [income] = useIncomeById(id);
  const [transactionCategoryMapping] =
    useTransactionCategoryMappingsByTransactionId(id);
  const editIncome = useEditIncome();
  const addTransactionCategoryMapping = useAddTransactionCategoryMapping();

  const handleSubmit = async (
    targetIncomeData: IIncome,
    newTransactionCategoryMappingsData: ITransactionCategoryMapping[]
  ) => {
    if (!id) {
      console.error('Failed to edit income: no id');
      return;
    }
    try {
      const targetIncomeJson = await editIncome(
        {
          ...targetIncomeData,
          categories: newTransactionCategoryMappingsData,
        } as any,
        id
      );

      if ('message' in targetIncomeJson) {
        setErrors(parseErrorMessagesToArray(targetIncomeJson.message));
        return;
      }

      navigate('/statistics/incomes');
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error);
    }
  };

  return !income || typeof transactionCategoryMapping === 'undefined' ? (
    <Loader loaderColor="blue" />
  ) : (
    <>
      <SEO title={`Edit ${income.description} | Incomes`} />
      <IncomeForm
        onSubmit={handleSubmit}
        errors={errors}
        formHeading="Edit income"
        submitLabel="Update"
        amount={income.amount}
        description={income.description}
        date={new Date(income.date)}
        toAccount={income.toAccount}
        transactionCategoryMapping={transactionCategoryMapping}
      />
    </>
  );
};
