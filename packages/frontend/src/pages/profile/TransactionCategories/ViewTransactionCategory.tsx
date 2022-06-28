import { UpdateTransactionCategoryDto } from '@local/types';
import { Suspense, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { Alert } from '../../../components/alert/alert';
import { Container } from '../../../components/container/container';
import { DescriptionList } from '../../../components/description-list/description-list';
import { DescriptionListItem } from '../../../components/description-list/description-list.item';
import { IconName } from '../../../components/icon/icon';
import { LinkList } from '../../../components/link-list/link-list';
import { LinkListLink } from '../../../components/link-list/link-list.link';
import { ModalConfirm } from '../../../components/modal/confirm/modal.confirm';
import { UpdatePageInfo } from '../../../components/seo/updatePageInfo';
import { useDeleteTransactionCategory } from '../../../hooks/transactionCategories/useDeleteTransactionCategory';
import { useEditTransactionCategory } from '../../../hooks/transactionCategories/useEditTransactionCategory';
import { useTransactionCategoryById } from '../../../hooks/transactionCategories/useTransactionCategoryById';
import { parseErrorMessagesToArray } from '../../../utils/apiHelper';
import { capitalize } from '../../../utils/capitalize';
import { formatCurrency } from '../../../utils/formatCurrency';
import { AccountDeleteModal } from '../../accounts/account-modals/AccountDeleteModal';

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

export const ViewTransactionCategory = (): JSX.Element => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [errors, setErrors] = useState<string[]>([]);

  const transactionCategory = useTransactionCategoryById(id);
  const deleteTransactionCategory = useDeleteTransactionCategory();

  const handleDelete = async () => {
    if (!id) {
      console.error('Failed to delete transaction category: no id');
      return;
    }
    deleteTransactionCategory(id);
    navigate('/profile/transaction-categories');
  };
  console.log(transactionCategory);

  return (
    <Container>
      <UpdatePageInfo
        title={`${transactionCategory.name}`}
        backLink="/profile/transaction-categories"
      />
      {errors.length > 0 && (
        <Alert
          additionalInformation={errors}
          testId="transaction-category-page-errors"
        >
          There were {errors.length} errors with your submission
        </Alert>
      )}
      <section className={'mb-6 grid md:grid-cols-2 gap-6'}>
        <DescriptionList>
          <DescriptionListItem label="Balance" isLarge testId="account-balance">
            {/* {formatCurrency(account.balance)} */}
            plaa
          </DescriptionListItem>
          <DescriptionListItem label="Type" testId="account-type">
            {capitalize(transactionCategory.visibility.join(', '))}
          </DescriptionListItem>
          {/* <DescriptionListItem label="Transactions">
            <Suspense fallback="-">
              <AccountTransactionAmount accountId={id} />
            </Suspense>
          </DescriptionListItem> */}
        </DescriptionList>
        <LinkList isVertical>
          <LinkListLink
            link={`/profile/transaction-categories/${id}/edit`}
            testId="edit-account"
            icon={IconName.cog}
          >
            Edit transaction category
          </LinkListLink>
          <AccountDeleteModal handleDelete={handleDelete} />
        </LinkList>
      </section>
    </Container>
  );
};
