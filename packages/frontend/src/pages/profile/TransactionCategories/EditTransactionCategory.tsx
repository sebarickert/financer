import { UpdateTransactionCategoryDto } from '@local/types';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { Container } from '../../../components/container/container';
import { UpdatePageInfo } from '../../../components/seo/updatePageInfo';
import { useEditTransactionCategory } from '../../../hooks/transactionCategories/useEditTransactionCategory';
import { useTransactionCategoryById } from '../../../hooks/transactionCategories/useTransactionCategoryById';
import { parseErrorMessagesToArray } from '../../../utils/apiHelper';

import { TransactionCategoryForm } from './TransactionCategoryForm';

export const EditTransactionCategory = (): JSX.Element => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [errors, setErrors] = useState<string[]>([]);

  const transactionCategory = useTransactionCategoryById(id);
  const editTransactionCategory = useEditTransactionCategory();

  const handleSubmit = async (
    newTransactionCategoryData: UpdateTransactionCategoryDto
  ) => {
    if (!transactionCategory?._id) {
      console.error('transactionCategory is not defined');
      return;
    }
    try {
      const newTransactionCategory = await editTransactionCategory(
        transactionCategory._id,
        newTransactionCategoryData
      );

      if ('message' in newTransactionCategory) {
        setErrors(parseErrorMessagesToArray(newTransactionCategory.message));
        return;
      }

      navigate(`/profile/transaction-categories`);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
    }
  };

  return (
    <Container>
      <UpdatePageInfo
        title="Edit transaction category"
        backLink={`/profile/transaction-categories/${id}`}
      />
      <TransactionCategoryForm
        onSubmit={handleSubmit}
        errors={errors}
        submitLabel="Update"
        name={transactionCategory.name}
        visibility={transactionCategory.visibility}
        parentTransactioCategoryId={transactionCategory.parent_category_id}
        currentCategoryId={id}
      />
    </Container>
  );
};
