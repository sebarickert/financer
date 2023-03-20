import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { TransactionCategoryForm } from './TransactionCategoryForm';

import {
  UpdateTransactionCategoryDto,
  useTransactionCategoriesFindOneQuery,
  useTransactionCategoriesUpdateMutation,
} from '$api/generated/financerApi';
import { DataHandler } from '$blocks/data-handler/data-handler';
import { LoaderFullScreen } from '$elements/loader/loader.fullscreen';
import { Container } from '$layouts/container/container';
import { UpdatePageInfo } from '$renderers/seo/updatePageInfo';
import { parseErrorMessagesToArray } from '$utils/apiHelper';

export const EditTransactionCategory = (): JSX.Element => {
  const navigate = useNavigate();
  const { id = 'id not found' } = useParams<{ id: string }>();
  const [errors, setErrors] = useState<string[]>([]);

  const transactionCategoryData = useTransactionCategoriesFindOneQuery({ id });
  const { data: transactionCategory } = transactionCategoryData;
  const [editTransactionCategory, { isLoading: isSaving }] =
    useTransactionCategoriesUpdateMutation();

  const handleSubmit = async (
    newTransactionCategoryData: UpdateTransactionCategoryDto
  ) => {
    if (!transactionCategory?._id) {
      console.error('transactionCategory is not defined');
      return;
    }
    try {
      await editTransactionCategory({
        id: transactionCategory._id,
        updateTransactionCategoryDto: {
          ...newTransactionCategoryData,
          visibility: newTransactionCategoryData.visibility || [],
          parent_category_id:
            newTransactionCategoryData.parent_category_id || null,
        },
      }).unwrap();

      navigate(`/profile/transaction-categories`);

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
      {isSaving && <LoaderFullScreen />}
      <DataHandler {...transactionCategoryData} />
      <UpdatePageInfo
        title="Edit transaction category"
        backLink={`/profile/transaction-categories/${id}`}
      />
      {transactionCategory && (
        <TransactionCategoryForm
          onSubmit={handleSubmit}
          errors={errors}
          submitLabel="Update"
          currentCategoryId={id}
          initialValues={transactionCategory}
        />
      )}
    </Container>
  );
};
