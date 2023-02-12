import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import {
  TransactionCategoryMappingDto,
  useAccountsFindOneByIdQuery,
  useTransfersFindOneQuery,
  useTransfersRemoveMutation,
} from '$api/generated/financerApi';
import { DataHandler } from '$blocks/data-handler/data-handler';
import { Button } from '$elements/button/button';
import { ButtonGroup } from '$elements/button/button.group';
import { DialogConfirm } from '$elements/dialog/confirm/dialog.confirm';
import { Dialog } from '$elements/dialog/dialog';
import { Divider } from '$elements/divider/divider';
import { IconName } from '$elements/icon/icon';
import { InfoCard } from '$elements/info-card/info-card';
import { LoaderFullScreen } from '$elements/loader/loader.fullscreen';
import { useAllTransactionCategoriesWithCategoryTree } from '$hooks/transactionCategories/useAllTransactionCategories';
import { UpdatePageInfo } from '$renderers/seo/updatePageInfo';
import { formatCurrency } from '$utils/formatCurrency';
import { formatDate } from '$utils/formatDate';

interface ITransferDeleteModalProps {
  handleDelete(): void;
}

const TransferDeleteModal = ({ handleDelete }: ITransferDeleteModalProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button
        testId="transfer-delete-modal_open-button"
        onClick={() => setIsOpen(!isOpen)}
      >
        Delete
      </Button>
      <Dialog isDialogOpen={isOpen} setIsDialogOpen={setIsOpen}>
        <DialogConfirm
          label="Delete transfer"
          onConfirm={handleDelete}
          onCancel={() => setIsOpen(!isOpen)}
          submitButtonLabel="Delete"
          iconName={IconName.exclamation}
          testId="transfer-delete-modal"
        >
          Are you sure you want to delete your transfer? All of your data will
          be permanently removed. This action cannot be undone.
        </DialogConfirm>
      </Dialog>
    </>
  );
};

export const Transfer = (): JSX.Element => {
  const navigate = useNavigate();
  const { id = 'id-missing' } = useParams<{ id: string }>();
  const { data: transactionCategories } =
    useAllTransactionCategoriesWithCategoryTree();
  const transferData = useTransfersFindOneQuery({ id });
  const { data: transfer } = transferData;

  const [deleteTransfer, { isLoading: isDeleting }] =
    useTransfersRemoveMutation();

  const fromAccountData = useAccountsFindOneByIdQuery(
    {
      id: transfer?.fromAccount as string,
    },
    { skip: !transfer }
  );

  const fromAccount = fromAccountData.data;
  const toAccountData = useAccountsFindOneByIdQuery(
    { id: transfer?.toAccount as string },
    { skip: !transfer }
  );
  const toAccount = toAccountData.data;

  const getCategoryNameById = (categoryId: string) =>
    transactionCategories?.find((category) => category._id === categoryId)
      ?.categoryTree || categoryId;

  const handleDelete = async () => {
    if (!id) {
      console.error('Failed to delete transfer: no id');
      return;
    }
    await deleteTransfer({ id }).unwrap();
    navigate('/statistics/transfers');
  };

  return (
    <>
      {isDeleting && <LoaderFullScreen />}
      <DataHandler {...transferData} />
      <UpdatePageInfo
        title={`${transfer?.description}`}
        backLink="/statistics/transfers"
      />
      {transfer && (
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
                {(
                  transfer.categories as unknown as TransactionCategoryMappingDto[]
                )?.map(({ amount, category_id }) => (
                  <li className="grid grid-cols-2 gap-2 lg:gap-4">
                    <InfoCard
                      iconName={IconName.tag}
                      label="Category"
                      testId="category_label"
                    >
                      {getCategoryNameById(category_id as unknown as string)}
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
      )}
    </>
  );
};
