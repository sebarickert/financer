import { useRouter } from 'next/router';
import { useState } from 'react';

import {
  CreateTransactionCategoryDto,
  useTransactionCategoriesCreateMutation,
} from '$api/generated/financerApi';
import { AddCategory } from '$pages/profile/categories/add-category';
import { parseErrorMessagesToArray } from '$utils/apiHelper';

export const AddCategoryContainer = () => {
  const { push } = useRouter();
  const [errors, setErrors] = useState<string[]>([]);
  const [addTransactionCategory, { isLoading: isCreating }] =
    useTransactionCategoriesCreateMutation();

  const handleSubmit = async (
    newTransactionCategoryData: CreateTransactionCategoryDto
  ) => {
    try {
      await addTransactionCategory({
        createTransactionCategoryDto: {
          ...newTransactionCategoryData,
          visibility: newTransactionCategoryData.visibility || [],
          parent_category_id:
            newTransactionCategoryData.parent_category_id || null,
        },
      }).unwrap();

      push('/profile/transaction-categories');
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
    <AddCategory
      onSubmit={handleSubmit}
      errors={errors}
      isLoading={isCreating}
    />
  );
};
