import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { Button } from '../../components/button/button';
import { ButtonGroup } from '../../components/button/button.group';
import { DescriptionList } from '../../components/description-list/description-list';
import { DescriptionListItem } from '../../components/description-list/description-list.item';
import { Loader, LoaderColor } from '../../components/loader/loader';
import { ModalConfirm } from '../../components/modal/confirm/modal.confirm';
import { UpdatePageInfo } from '../../components/seo/updatePageInfo';
import { useAccountById } from '../../hooks/account/useAccountById';
import { useAllTransactionCategoriesWithCategoryTree } from '../../hooks/transactionCategories/useAllTransactionCategories';
import { useTransactionCategoryMappingsByTransactionId } from '../../hooks/transactionCategoryMapping/useTransactionCategoryMappingsByTransactionId';
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
    accentColor="red"
    testId="transfer-delete-modal"
  >
    Are you sure you want to delete your transfer? All of your data will be
    permanently removed. This action cannot be undone.
  </ModalConfirm>
);

export const Transfer = (): JSX.Element => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [transactionCategoryMapping] =
    useTransactionCategoryMappingsByTransactionId(id);
  const transactionCategories = useAllTransactionCategoriesWithCategoryTree();
  const [transfer] = useTransferById(id);
  const deleteTransfer = useDeleteTransfer();

  const [{ data: fromAccount }, setTargetFromAccountId] = useAccountById(
    transfer?.fromAccount
  );
  const [{ data: toAccount }, setTargetToAccountId] = useAccountById(
    transfer?.toAccount
  );

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

  useEffect(() => {
    if (!transfer?.fromAccount || !transfer?.toAccount) return;

    setTargetFromAccountId(transfer.fromAccount);
    setTargetToAccountId(transfer.toAccount);
  }, [transfer, setTargetFromAccountId, setTargetToAccountId]);

  return !transfer || !transactionCategoryMapping || !transactionCategories ? (
    <Loader loaderColor={LoaderColor.blue} />
  ) : (
    <>
      <UpdatePageInfo
        title={`${transfer.description}`}
        backLink="/statistics/transfers"
      />
      <DescriptionList label="Details" className="mb-6">
        <DescriptionListItem label="Amount">
          {formatCurrency(transfer.amount)}
        </DescriptionListItem>
        <DescriptionListItem label="Date">
          {formatDate(new Date(transfer.date))}
        </DescriptionListItem>
        <DescriptionListItem label="From account">
          {fromAccount?.name ?? '-'}
        </DescriptionListItem>
        <DescriptionListItem label="To account">
          {toAccount?.name ?? '-'}
        </DescriptionListItem>
        <DescriptionListItem label="Type">Transfer</DescriptionListItem>
      </DescriptionList>
      {transactionCategoryMapping.length > 0 && (
        <DescriptionList label="Categories" testId="categories-wrapper">
          {transactionCategoryMapping?.map(({ amount, category_id }) => (
            <>
              <DescriptionListItem label="Category" testId="category_label">
                {getCategoryNameById(category_id)}
              </DescriptionListItem>
              <DescriptionListItem label="Amount" testId="category_amount">
                {formatCurrency(amount)}
              </DescriptionListItem>
            </>
          ))}
        </DescriptionList>
      )}
      <ButtonGroup className="mt-8">
        <Button
          link={`/statistics/transfers/${id}/edit`}
          testId="edit-transfer-button"
        >
          Edit
        </Button>
        <TransferDeleteModal handleDelete={handleDelete} />
      </ButtonGroup>
    </>
  );
};
