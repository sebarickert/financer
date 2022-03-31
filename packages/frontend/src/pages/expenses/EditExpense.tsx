import { IIncome, ITransactionCategoryMapping } from '@local/types';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { Loader } from '../../components/loader/loader';
import { UpdatePageInfo } from '../../components/seo/updatePageInfo';
import { useEditExpense } from '../../hooks/expense/useEditExpense';
import { useExpenseById } from '../../hooks/expense/useExpenseById';
import { useTransactionCategoryMappingsByTransactionId } from '../../hooks/transactionCategoryMapping/useTransactionCategoryMappingsByTransactionId';
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

  const handleSubmit = async (
    targetExpenseData: IIncome,
    newTransactionCategoryMappingsData: ITransactionCategoryMapping[]
  ) => {
    if (!id) {
      console.error('Failed to edit expense: no id');
      return;
    }
    try {
      const targetExpenseJson = await editExpense(
        {
          ...targetExpenseData,
          categories: newTransactionCategoryMappingsData,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } as any,
        id
      );

      if ('message' in targetExpenseJson) {
        setErrors(parseErrorMessagesToArray(targetExpenseJson.message));
        return;
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
      <UpdatePageInfo title={`Edit ${expense.description} | Expenses`} />
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
