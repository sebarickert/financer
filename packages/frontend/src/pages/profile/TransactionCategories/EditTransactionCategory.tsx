/* eslint-disable @typescript-eslint/no-unused-vars */
import { ITransactionCategory } from '@local/types';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { Container } from '../../../components/container/container';
import { Loader } from '../../../components/loader/loader';
import { ModalConfirm } from '../../../components/modal/confirm/modal.confirm';
import { SEO } from '../../../components/seo/seo';
import { useDeleteTransactionCategory } from '../../../hooks/transactionCategories/useDeleteTransactionCategory';
import { useEditTransactionCategory } from '../../../hooks/transactionCategories/useEditTransactionCategory';
import { useTransactionCategoryById } from '../../../hooks/transactionCategories/useTransactionCategoryById';

import { TransactionCategoryForm } from './TransactionCategoryForm';

interface ITransactionCategoryDeleteModalProps {
  handleDelete(): void;
}

const TransactionCategoryDeleteModal = ({
  handleDelete,
}: ITransactionCategoryDeleteModalProps) => (
  <ModalConfirm
    label="Delete transaction category"
    submitButtonLabel="Delete"
    onConfirm={handleDelete}
    modalOpenButtonLabel="Delete transaction category"
    accentColor="red"
  >
    Are you sure you want to delete this transaction category? All of your data
    will be permanently removed. This action cannot be undone.
  </ModalConfirm>
);

export const EditTransactionCategory = (): JSX.Element => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [errors, setErrors] = useState<string[]>([]);

  const [transactionCategory] = useTransactionCategoryById(id);
  const deleteTransactionCategory = useDeleteTransactionCategory();
  const editTransactionCategory = useEditTransactionCategory();

  const handleSubmit = async (
    newTransactionCategoryData: ITransactionCategory
  ) => {
    /* eslint-disable no-param-reassign */
    newTransactionCategoryData.owner = transactionCategory?.owner;
    newTransactionCategoryData._id = transactionCategory?._id;
    /* eslint-enable no-param-reassign */
    try {
      const newTransactionCategory = await editTransactionCategory(
        newTransactionCategoryData._id,
        newTransactionCategoryData
      );

      if (newTransactionCategory.status === 200) {
        navigate(`/profile/transaction-categories`);
      } else if (newTransactionCategory.status === 400) {
        setErrors(newTransactionCategory?.errors || ['Unknown error.']);
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error);
    }
  };

  const handleDelete = async () => {
    if (!id) {
      console.error('Failed to delete transaction category: no id');
      return;
    }
    deleteTransactionCategory(id);
    navigate('/profile/transaction-categories');
  };

  return !transactionCategory ? (
    <Loader loaderColor="blue" />
  ) : (
    <Container>
      <SEO title="Add expense" />
      <TransactionCategoryForm
        onSubmit={handleSubmit}
        errors={errors}
        formHeading="Edit transaction category"
        submitLabel="Update"
        name={transactionCategory.name}
        visibility={transactionCategory.visibility}
        parentTransactioCategoryId={transactionCategory.parent_category_id}
        optionalFooterComponent={
          <TransactionCategoryDeleteModal handleDelete={handleDelete} />
        }
      />
    </Container>
  );
};
