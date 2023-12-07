import { useState } from 'react';

import {
  UpdateTransactionCategoryDto,
  useTransactionCategoriesFindOneQuery,
  useTransactionCategoriesUpdateMutation,
} from '$api/generated/financerApi';
import { DataHandler } from '$blocks/data-handler/data-handler';
import { useViewTransitionRouter } from '$hooks/useViewTransitionRouter';
import { EditCategory } from '$pages/settings/categories/edit-category';
import { parseErrorMessagesToArray } from '$utils/apiHelper';

interface EditCategoryContainerProps {
  id: string;
}

export const EditCategoryContainer = ({ id }: EditCategoryContainerProps) => {
  const { push } = useViewTransitionRouter();
  const [errors, setErrors] = useState<string[]>([]);

  const categoryData = useTransactionCategoriesFindOneQuery({ id });
  const { data: category } = categoryData;
  const [editTransactionCategory, { isLoading: isSaving }] =
    useTransactionCategoriesUpdateMutation();

  const handleSubmit = async (
    newTransactionCategoryData: UpdateTransactionCategoryDto
  ) => {
    if (!category?._id) {
      console.error('transactionCategory is not defined');
      return;
    }
    try {
      await editTransactionCategory({
        id: category._id,
        updateTransactionCategoryDto: {
          ...newTransactionCategoryData,
          visibility: newTransactionCategoryData.visibility || [],
          parent_category_id:
            newTransactionCategoryData.parent_category_id || null,
        },
      }).unwrap();

      push(`/profile/transaction-categories`);

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
    <>
      <DataHandler {...categoryData} />
      {category && (
        <EditCategory
          onSubmit={handleSubmit}
          category={category}
          errors={errors}
          isLoading={isSaving}
        />
      )}
      ;
    </>
  );
};
