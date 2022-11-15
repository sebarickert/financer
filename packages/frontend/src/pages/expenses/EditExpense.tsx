import { CreateExpenseDto } from '@local/types';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { UpdatePageInfo } from '../../components/renderers/seo/updatePageInfo';
import { useEditExpense } from '../../hooks/expense/useEditExpense';
import { useExpenseById } from '../../hooks/expense/useExpenseById';
import { parseErrorMessagesToArray } from '../../utils/apiHelper';

import { ExpenseForm } from './ExpenseForm';

export const EditExpense = (): JSX.Element => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [errors, setErrors] = useState<string[]>([]);
  const editExpense = useEditExpense();

  const expense = useExpenseById(id);

  const handleSubmit = async (targetExpenseData: CreateExpenseDto) => {
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

      navigate('/statistics/expenses');
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
    }
  };

  return (
    <>
      <UpdatePageInfo title={`Edit ${expense.description}`} />
      <ExpenseForm
        onSubmit={handleSubmit}
        errors={errors}
        submitLabel="Update"
        amount={expense.amount}
        description={expense.description}
        date={new Date(expense.date)}
        fromAccount={expense.fromAccount}
        transactionCategoryMapping={expense.categories}
      />
    </>
  );
};
