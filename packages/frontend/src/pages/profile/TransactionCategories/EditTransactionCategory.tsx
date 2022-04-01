import { ITransactionCategory } from '@local/types';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { Container } from '../../../components/container/container';
import { Loader } from '../../../components/loader/loader';
import { ModalConfirm } from '../../../components/modal/confirm/modal.confirm';
import { UpdatePageInfo } from '../../../components/seo/updatePageInfo';
import { useDeleteTransactionCategory } from '../../../hooks/transactionCategories/useDeleteTransactionCategory';
import { useEditTransactionCategory } from '../../../hooks/transactionCategories/useEditTransactionCategory';
import { useTransactionCategoryById } from '../../../hooks/transactionCategories/useTransactionCategoryById';
import { parseErrorMessagesToArray } from '../../../utils/apiHelper';

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
    testId="delete-transaction-category-modal"
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

      if ('message' in newTransactionCategory) {
        setErrors(parseErrorMessagesToArray(newTransactionCategory.message));
        return;
      }

      navigate(`/profile/transaction-categories`);
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
      <UpdatePageInfo
        title="Edit transaction category"
        backLink="/profile/transaction-categories"
      />
      <TransactionCategoryForm
        onSubmit={handleSubmit}
        errors={errors}
        formHeading="Edit transaction category"
        submitLabel="Update"
        name={transactionCategory.name}
        visibility={transactionCategory.visibility}
        parentTransactioCategoryId={transactionCategory.parent_category_id}
        currentCategoryId={id}
        optionalFooterComponent={
          <TransactionCategoryDeleteModal handleDelete={handleDelete} />
        }
      />
    </Container>
  );
};
