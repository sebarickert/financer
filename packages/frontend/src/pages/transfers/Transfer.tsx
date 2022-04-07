import { useNavigate, useParams } from 'react-router-dom';

import { Button } from '../../components/button/button';
import { ButtonGroup } from '../../components/button/button.group';
import { DescriptionList } from '../../components/description-list/description-list';
import { DescriptionListItem } from '../../components/description-list/description-list.item';
import { Icon } from '../../components/icon/icon';
import { Loader } from '../../components/loader/loader';
import { ModalConfirm } from '../../components/modal/confirm/modal.confirm';
import { UpdatePageInfo } from '../../components/seo/updatePageInfo';
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

  return !transfer || !transactionCategoryMapping || !transactionCategories ? (
    <Loader loaderColor="blue" />
  ) : (
    <>
      <UpdatePageInfo
        title={`${transfer.description}`}
        backLink="/statistics/transfers"
      />
      <section className="bg-gray-25 border divide-y rounded-lg sm:grid sm:divide-y-0 sm:divide-x">
        <div className="p-6">
          <header className="flex items-center mb-6">
            <span className="inline-flex p-3 text-white rounded-lg bg-blue-financer">
              <Icon type="switch-horizontal" />
            </span>
            <h1 className="ml-4 text-2xl font-bold tracking-tighter sm:text-3xl">
              {transfer.description}
            </h1>
          </header>
          <DescriptionList label="Transaction details">
            <DescriptionListItem label="Amount">
              {formatCurrency(transfer.amount)}
            </DescriptionListItem>
            <DescriptionListItem label="Date">
              {formatDate(new Date(transfer.date))}
            </DescriptionListItem>
          </DescriptionList>
          {transactionCategoryMapping.length > 0 && (
            <DescriptionList
              label="Categories"
              className="mt-6"
              visibleLabel
              testId="categories-wrapper"
            >
              {transactionCategoryMapping?.map(({ amount, category_id }) => (
                <DescriptionListItem
                  label={getCategoryNameById(category_id)}
                  testId="category-row"
                >
                  {formatCurrency(amount)}
                </DescriptionListItem>
              ))}
            </DescriptionList>
          )}
        </div>
      </section>
      <ButtonGroup className="mt-6">
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
