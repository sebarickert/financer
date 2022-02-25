/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';

import { Container } from '../../components/container/container';
import { Loader } from '../../components/loader/loader';
import { SEO } from '../../components/seo/seo';
import { useEditExpense } from '../../hooks/expense/useEditExpense';
import { useExpenseById } from '../../hooks/expense/useExpenseById';
import { ITransactionCategoryWithCategoryTree } from '../../services/TransactionCategoriesService';
import {
  addTransactionCategoryMapping,
  getTransactionCategoryMappingByTransactionId,
} from '../../services/TransactionCategoryMappingService';

import { ExpenseForm } from './ExpenseForm';

export const EditExpense = (): JSX.Element => {
  const history = useHistory();
  const { id } = useParams<{ id: string }>();
  const [errors, setErrors] = useState<string[]>([]);
  const editExpense = useEditExpense();

  const [expense] = useExpenseById(id);
  const [transactionCategoryMapping, setTransactionCategoryMapping] = useState<
    ITransactionCategoryMapping[] | undefined
  >(undefined);

  useEffect(() => {
    const fetchTransactionCategoryMapping = async () => {
      setTransactionCategoryMapping(
        await getTransactionCategoryMappingByTransactionId(id)
      );
    };

    fetchTransactionCategoryMapping();
  }, [id]);

  const handleSubmit = async (
    targetExpenseData: IIncome,
    newTransactionCategoryMappingsData: ITransactionCategoryMapping[]
  ) => {
    try {
      const targetExpenseJson = await editExpense(targetExpenseData, id);
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

      if (targetExpenseJson.status === 201) {
        history.push('/statistics/expenses');
      } else if (targetExpenseJson.status === 400) {
        setErrors(targetExpenseJson?.errors || ['Unknown error.']);
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error);
    }
  };

  return !expense || typeof transactionCategoryMapping === 'undefined' ? (
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
