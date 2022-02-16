/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';

import { Container } from '../../components/container/container';
import { Loader } from '../../components/loader/loader';
import { SEO } from '../../components/seo/seo';
import {
  getAllTransactionCategoriesWithCategoryTree,
  ITransactionCategoryWithCategoryTree,
} from '../profile/TransactionCategories/TransactionCategoriesService';

import { addTransactionCategoryMapping } from './AddExpense';
import { getTransactionCategoryMappingByTransactionId } from './Expense';
import { ExpenseForm } from './ExpenseForm';
import { getExpenseById, updateExpense } from './ExpenseService';

export const EditExpense = (): JSX.Element => {
  const history = useHistory();
  const [errors, setErrors] = useState<string[]>([]);

  const [expense, setExpense] = useState<IExpense | undefined>(undefined);
  const [transactionCategoryMapping, setTransactionCategoryMapping] = useState<
    ITransactionCategoryMapping[] | undefined
  >(undefined);
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    const fetchExpense = async () => {
      setExpense(await getExpenseById(id));
    };

    const fetchTransactionCategoryMapping = async () => {
      setTransactionCategoryMapping(
        await getTransactionCategoryMappingByTransactionId(id)
      );
    };

    fetchExpense();
    fetchTransactionCategoryMapping();
  }, [id]);

  const handleSubmit = async (
    targetExpenseData: IIncome,
    newTransactionCategoryMappingsData: ITransactionCategoryMapping[]
  ) => {
    try {
      const targetExpenseJson = await updateExpense(targetExpenseData, id);
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

  return typeof expense === 'undefined' ||
    typeof transactionCategoryMapping === 'undefined' ? (
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
