/* eslint-disable @typescript-eslint/no-unused-vars */
import { IIncome, ITransactionCategoryMapping } from '@local/types';
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { Container } from '../../components/container/container';
import { Loader } from '../../components/loader/loader';
import { SEO } from '../../components/seo/seo';
import { useEditExpense } from '../../hooks/expense/useEditExpense';
import { useExpenseById } from '../../hooks/expense/useExpenseById';
import { useAddTransactionCategoryMapping } from '../../hooks/transactionCategoryMapping/useAddTransactionCategoryMapping';
import { useTransactionCategoryMappingsByTransactionId } from '../../hooks/transactionCategoryMapping/useTransactionCategoryMappingsByTransactionId';
import { ITransactionCategoryWithCategoryTree } from '../../services/TransactionCategoriesService';
import { parseErrorMessagesToArray } from '../../utils/apiHelper';

import { ExpenseForm } from './ExpenseForm';

export const EditExpense = (): JSX.Element => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [errors, setErrors] = useState<string[]>([]);
  const editExpense = useEditExpense();

  const [expense] = useExpenseById(id);
  const [transactionCategoryMapping] =
    useTransactionCategoryMappingsByTransactionId(id);
  const addTransactionCategoryMapping = useAddTransactionCategoryMapping();

  const handleSubmit = async (
    targetExpenseData: IIncome,
    newTransactionCategoryMappingsData: ITransactionCategoryMapping[]
  ) => {
    if (!id) {
      console.error('Failed to edit expense: no id');
      return;
    }
    try {
      const targetExpenseJson = await editExpense(targetExpenseData, id);

      if ('message' in targetExpenseJson) {
        setErrors(parseErrorMessagesToArray(targetExpenseJson.message));
        return;
      }

      if (newTransactionCategoryMappingsData.length > 0) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const newTransactionCategoryMappingJson =
          await addTransactionCategoryMapping(
            newTransactionCategoryMappingsData.map(
              (newTransactionCategoryMappingData) => ({
                ...newTransactionCategoryMappingData,
                transaction_id: targetExpenseJson.payload._id,
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

  return !expense || !transactionCategoryMapping ? (
    <Loader loaderColor="blue" />
  ) : (
    <>
      <SEO title={`Edit ${expense.description} | Expenses`} />
      <ExpenseForm
        onSubmit={handleSubmit}
        errors={errors}
        formHeading="Edit expense"
        submitLabel="Update"
        amount={expense.amount}
        description={expense.description}
        date={new Date(expense.date)}
        fromAccount={expense.fromAccount}
        transactionCategoryMapping={transactionCategoryMapping}
      />
    </>
  );
};
