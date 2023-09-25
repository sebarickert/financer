import { useState } from 'react';

import {
  TransactionCategoryMappingDto,
  TransferDto,
} from '$api/generated/financerApi';
import { Button } from '$elements/button/button';
import { ButtonGroup } from '$elements/button/button.group';
import { DialogConfirm } from '$elements/dialog/confirm/dialog.confirm';
import { Dialog } from '$elements/dialog/dialog';
import { Divider } from '$elements/divider/divider';
import { IconName } from '$elements/icon/icon';
import { InfoCard } from '$elements/info-card/info-card';
import { LoaderFullScreen } from '$elements/loader/loader.fullscreen';
import { UpdatePageInfo } from '$renderers/seo/updatePageInfo';
import { formatCurrency } from '$utils/formatCurrency';
import { formatDate } from '$utils/formatDate';

interface TransferDeleteModalProps {
  onDelete: () => void;
}

const TransferDeleteModal = ({ onDelete }: TransferDeleteModalProps) => {
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
          onConfirm={onDelete}
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

interface TransferProps {
  isLoading: boolean;
  transfer: TransferDto;
  fromAccountName?: string;
  toAccountName?: string;
  onDelete: () => void;
  getCategoryNameById: (categoryId: string) => string;
}

export const Transfer = ({
  isLoading,
  transfer,
  fromAccountName,
  toAccountName,
  onDelete,
  getCategoryNameById,
}: TransferProps): JSX.Element => {
  return (
    <>
      {isLoading && <LoaderFullScreen />}
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
              {fromAccountName ?? '-'}
            </InfoCard>
            <InfoCard
              iconName={IconName.download}
              label="To account"
              className="max-lg:col-span-full"
              isLarge
            >
              {toAccountName ?? '-'}
            </InfoCard>
          </section>
          {transfer.categories.length > 0 && (
            <>
              <Divider>Categories</Divider>
              <ul className="grid gap-2 lg:gap-4">
                {(
                  transfer.categories as unknown as TransactionCategoryMappingDto[]
                )?.map(({ amount, category_id, _id }) => (
                  <li key={_id} className="grid grid-cols-2 gap-2 lg:gap-4">
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
              link={`/statistics/transfers/${transfer._id}/edit`}
              testId="edit-transfer-button"
              transition="open-from-right"

            >
              Edit
            </Button>
            <TransferDeleteModal onDelete={onDelete} />
          </ButtonGroup>
        </section>
      )}
    </>
  );
};
