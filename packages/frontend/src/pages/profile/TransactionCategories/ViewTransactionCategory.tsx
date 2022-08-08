import { useNavigate, useParams } from 'react-router-dom';

import { Container } from '../../../components/container/container';
import { DescriptionList } from '../../../components/description-list/description-list';
import { DescriptionListItem } from '../../../components/description-list/description-list.item';
import { IconName } from '../../../components/icon/icon';
import { LinkList } from '../../../components/link-list/link-list';
import { LinkListLink } from '../../../components/link-list/link-list.link';
import { UpdatePageInfo } from '../../../components/seo/updatePageInfo';
import { useDeleteTransactionCategory } from '../../../hooks/transactionCategories/useDeleteTransactionCategory';
import { useTransactionCategoryById } from '../../../hooks/transactionCategories/useTransactionCategoryById';
import { capitalize } from '../../../utils/capitalize';

import { TransactionCategoryDeleteModal } from './TransactionCategoryDeleteModal';

export const ViewTransactionCategory = (): JSX.Element => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

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

  return (
    <Container>
      <UpdatePageInfo
        title={`${transactionCategory.name}`}
        backLink="/profile/transaction-categories"
      />
      <section className={'mb-6 grid md:grid-cols-2 gap-6'}>
        <DescriptionList>
          <DescriptionListItem label="Type" testId="account-type" isLarge>
            {capitalize(transactionCategory.visibility.join(', '))}
          </DescriptionListItem>
          <DescriptionListItem label="Transactions">10</DescriptionListItem>
        </DescriptionList>
        <LinkList isVertical>
          <LinkListLink
            link={`/profile/transaction-categories/${id}/edit`}
            testId="edit-account"
            icon={IconName.cog}
          >
            Edit transaction category
          </LinkListLink>
          <TransactionCategoryDeleteModal handleDelete={handleDelete} />
        </LinkList>
      </section>
    </Container>
  );
};
