import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { TransactionCategoryForm } from './TransactionCategoryForm';

import {
  CreateTransactionCategoryDto,
  useTransactionCategoriesCreateMutation,
} from '$api/generated/financerApi';
import { LoaderFullScreen } from '$elements/loader/loader.fullscreen';
import { Container } from '$layouts/container/container';
import { UpdatePageInfo } from '$renderers/seo/updatePageInfo';
import { parseErrorMessagesToArray } from '$utils/apiHelper';

export const AddTransactionCategory = (): JSX.Element => {
  const navigate = useNavigate();
  const [errors, setErrors] = useState<string[]>([]);
  const [addTransactionCategory, { isLoading: isCreating }] =
    useTransactionCategoriesCreateMutation();

  const handleSubmit = async (
    newTransactionCategoryData: CreateTransactionCategoryDto
  ) => {
    try {
      await addTransactionCategory({
        createTransactionCategoryDto: newTransactionCategoryData,
      });

      navigate('/profile/transaction-categories');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      if (error.status === 400 || error.status === 404) {
        setErrors(parseErrorMessagesToArray(error?.data?.message));
        return;
      }

      // eslint-disable-next-line no-console
      console.error(error);
    }
  };

  return (
    <Container>
      {isCreating && <LoaderFullScreen />}
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
