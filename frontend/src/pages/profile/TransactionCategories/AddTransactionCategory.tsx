import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

import { Container } from '../../../components/container/container';
import { SEO } from '../../../components/seo/seo';

import { addTransactionCategory } from './TransactionCategoriesService';
import { TransactionCategoryForm } from './TransactionCategoryForm';

export const AddTransactionCategory = (): JSX.Element => {
  const history = useHistory();
  const [errors, setErrors] = useState<string[]>([]);

  const handleSubmit = async (
    newTransactionCategoryData: ITransactionCategory
  ) => {
    try {
      const newExpenseJson = await addTransactionCategory(
        newTransactionCategoryData
      );

      if (newExpenseJson.status === 201) {
        history.push('/profile/transaction-categories');
      } else if (newExpenseJson.status === 400) {
        setErrors(newExpenseJson?.errors || ['Unknown error.']);
      }
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
