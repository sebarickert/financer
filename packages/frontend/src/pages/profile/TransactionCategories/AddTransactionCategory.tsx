import { CreateTransactionCategoryDto } from '@local/types';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Container } from '../../../components/container/container';
import { UpdatePageInfo } from '../../../components/seo/updatePageInfo';
import { useAddTransactionCategory } from '../../../hooks/transactionCategories/useAddTransactionCategory';
import { parseErrorMessagesToArray } from '../../../utils/apiHelper';

import { TransactionCategoryForm } from './TransactionCategoryForm';

export const AddTransactionCategory = (): JSX.Element => {
  const navigate = useNavigate();
  const [errors, setErrors] = useState<string[]>([]);
  const addTransactionCategory = useAddTransactionCategory();

  const handleSubmit = async (
    newTransactionCategoryData: CreateTransactionCategoryDto
  ) => {
    try {
      const newExpenseJson = await addTransactionCategory(
        newTransactionCategoryData
      );

      if ('message' in newExpenseJson) {
        setErrors(parseErrorMessagesToArray(newExpenseJson.message));
        return;
      }

      navigate('/profile/transaction-categories');
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
    }
  };

  return (
    <Container>
      <UpdatePageInfo
        title="Add transaction category"
        backLink="/profile/transaction-categories"
      />
      <TransactionCategoryForm
        onSubmit={handleSubmit}
        errors={errors}
        submitLabel="Add"
      />
    </Container>
  );
};
