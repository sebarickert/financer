import { ITransactionCategory } from '@local/types';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Container } from '../../../components/container/container';
import { SEO } from '../../../components/seo/seo';
import { useAddTransactionCategory } from '../../../hooks/transactionCategories/useAddTransactionCategory';
import { parseErrorMessagesToArray } from '../../../utils/apiHelper';

import { TransactionCategoryForm } from './TransactionCategoryForm';

export const AddTransactionCategory = (): JSX.Element => {
  const navigate = useNavigate();
  const [errors, setErrors] = useState<string[]>([]);
  const addTransactionCategory = useAddTransactionCategory();

  const handleSubmit = async (
    newTransactionCategoryData: ITransactionCategory
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
      console.log(error);
    }
  };

  return (
    <Container>
      <SEO title="Add transaction category" />
      <TransactionCategoryForm
        onSubmit={handleSubmit}
        errors={errors}
        formHeading="Add transaction category"
        submitLabel="Add"
      />
    </Container>
  );
};
