'use client';

import { useDispatch } from 'react-redux';

import {
  UpdateTransactionCategoryDto,
  useTransactionCategoriesFindOneQuery,
  useTransactionCategoriesRemoveMutation,
  useTransactionCategoriesUpdateMutation,
} from '$api/generated/financerApi';
import { DataHandler } from '$blocks/data-handler/data-handler';
import { ToastMessageTypes } from '$blocks/toast/toast';
import { settingsPaths } from '$constants/settings-paths';
import { useViewTransitionRouter } from '$hooks/useViewTransitionRouter';
import { addToastMessage } from '$reducer/notifications.reducer';
import { clearCategoryCache } from '$ssr/api/clear-cache';
import { parseErrorMessagesToArray } from '$utils/apiHelper';
import { CategoryEdit } from '$views/settings/categories/category.edit';

interface CategoryEditContainerProps {
  id: string;
}

export const CategoryEditContainer = ({ id }: CategoryEditContainerProps) => {
  const { push } = useViewTransitionRouter();

  const categoryData = useTransactionCategoriesFindOneQuery({ id });
  const { data: category } = categoryData;
  const [deleteTransactionCategory] = useTransactionCategoriesRemoveMutation();
  const [editTransactionCategory] = useTransactionCategoriesUpdateMutation();
  const dispatch = useDispatch();

  const handleSubmit = async (
    newTransactionCategoryData: UpdateTransactionCategoryDto,
  ) => {
    if (!category?.id) {
      console.error('transactionCategory is not defined');
      return;
    }
    try {
      await editTransactionCategory({
        id: category.id,
        updateTransactionCategoryDto: {
          ...newTransactionCategoryData,
          visibility: newTransactionCategoryData.visibility || [],
          parentCategoryId: newTransactionCategoryData.parentCategoryId || null,
        },
      }).unwrap();
      await clearCategoryCache();

      push(settingsPaths.categories);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      if (error.status === 400 || error.status === 404) {
        dispatch(
          addToastMessage({
            type: ToastMessageTypes.ERROR,
            message: 'Submission failed',
            additionalInformation: parseErrorMessagesToArray(
              error?.data?.message,
            ),
          }),
        );
        return;
      }

      // eslint-disable-next-line no-console
      console.error(error);
    }
  };

  const handleDelete = async () => {
    await deleteTransactionCategory({ id });
    await clearCategoryCache();
    push(settingsPaths.categories);
  };

  return (
    <>
      <DataHandler {...categoryData} />
      {category && (
        <CategoryEdit
          onSubmit={handleSubmit}
          onDelete={handleDelete}
          category={category}
        />
      )}
    </>
  );
};
