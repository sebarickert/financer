import { useNavigate, useParams } from 'react-router-dom';

import { Button } from '../../components/button/button';
import { ButtonGroup } from '../../components/button/button.group';
import { Divider } from '../../components/divider/divider';
import { IconName } from '../../components/icon/icon';
import { InfoCard } from '../../components/info-card/info-card';
import { ModalConfirm } from '../../components/modal/confirm/modal.confirm';
import { UpdatePageInfo } from '../../components/seo/updatePageInfo';
import { useAccountById } from '../../hooks/account/useAccountById';
import { useAllTransactionCategoriesWithCategoryTree } from '../../hooks/transactionCategories/useAllTransactionCategories';
import { useDeleteTransfer } from '../../hooks/transfer/useDeleteTransfer';
import { useTransferById } from '../../hooks/transfer/useTransferById';
import { formatCurrency } from '../../utils/formatCurrency';
import { formatDate } from '../../utils/formatDate';

interface ITransferDeleteModalProps {
  handleDelete(): void;
}

const TransferDeleteModal = ({ handleDelete }: ITransferDeleteModalProps) => (
  <ModalConfirm
    label="Delete transfer"
    submitButtonLabel="Delete"
    onConfirm={handleDelete}
    modalOpenButtonLabel="Delete transfer"
    testId="transfer-delete-modal"
  >
    Are you sure you want to delete your transfer? All of your data will be
    permanently removed. This action cannot be undone.
  </ModalConfirm>
);

export const Transfer = (): JSX.Element => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const transactionCategories = useAllTransactionCategoriesWithCategoryTree();
  const transfer = useTransferById(id);
  const deleteTransfer = useDeleteTransfer();

  const fromAccount = useAccountById(transfer?.fromAccount);
  const toAccount = useAccountById(transfer?.toAccount);

  const getCategoryNameById = (categoryId: string) =>
    transactionCategories?.find((category) => category._id === categoryId)
      ?.categoryTree || categoryId;

  const handleDelete = async () => {
    if (!id) {
      console.error('Failed to delete transfer: no id');
      return;
    }
    await deleteTransfer(id);
    navigate('/statistics/transfers');
  };

  return (
    <>
      <UpdatePageInfo
        title={`${transfer.description}`}
        backLink="/statistics/transfers"
      />
      <section className="grid gap-2 lg:gap-4">
        <section className="grid grid-cols-2 gap-2 lg:grid-cols-3 md:gap-4">
          <InfoCard iconName={IconName.cash} label="Amount">
            {formatCurrency(transfer.amount)}
          </InfoCard>
          <InfoCard iconName={IconName.calendar} label="Date">
            {formatDate(new Date(transfer.date))}
          </InfoCard>
          <InfoCard
            iconName={IconName.informationCircle}
            label="Type"
            className="max-lg:col-span-full"
            isLarge
          >
            Transfer
          </InfoCard>
        </section>
        <section className="grid grid-cols-2 gap-2 lg:gap-4">
          <InfoCard
            iconName={IconName.upload}
            label="From account"
            className="max-lg:col-span-full"
            isLarge
          >
            {fromAccount?.name ?? '-'}
          </InfoCard>
          <InfoCard
            iconName={IconName.download}
            label="To account"
            className="max-lg:col-span-full"
            isLarge
          >
            {toAccount?.name ?? '-'}
          </InfoCard>
        </section>
        {transfer.categories.length > 0 && (
          <>
            <Divider>Categories</Divider>
            <ul className="grid gap-2 lg:gap-4">
              {transfer.categories?.map(({ amount, category_id }) => (
                <li className="grid grid-cols-2 gap-2 lg:gap-4">
                  <InfoCard
                    iconName={IconName.tag}
                    label="Category"
                    testId="category_label"
                  >
                    {getCategoryNameById(category_id)}
                  </InfoCard>
                  <InfoCard
                    iconName={IconName.cash}
                    label="Amount"
                    testId="category_amount"
                  >
                    {formatCurrency(amount)}
                  </InfoCard>
                </li>
              ))}
            </ul>
          </>
        )}
        <ButtonGroup className="mt-4">
          <Button
            link={`/statistics/transfers/${id}/edit`}
            testId="edit-transfer-button"
          >
            Edit
          </Button>
          <TransferDeleteModal handleDelete={handleDelete} />
        </ButtonGroup>
      </section>
    </>
  );
};
