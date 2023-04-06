import { useState } from 'react';

import {
  IncomeDto,
  TransactionCategoryMappingDto,
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

interface IncomeDeleteModalProps {
  onDelete: () => void;
}

const IncomeDeleteModal = ({ onDelete }: IncomeDeleteModalProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button
        testId="income-delete-modal_open-button"
        onClick={() => setIsOpen(!isOpen)}
      >
        Delete
      </Button>
      <Dialog isDialogOpen={isOpen} setIsDialogOpen={setIsOpen}>
        <DialogConfirm
          label="Delete income"
          onConfirm={onDelete}
          onCancel={() => setIsOpen(!isOpen)}
          submitButtonLabel="Delete"
          iconName={IconName.exclamation}
          testId="income-delete-modal"
        >
          Are you sure you want to delete your income? All of your data will be
          permanently removed. This action cannot be undone.
        </DialogConfirm>
      </Dialog>
    </>
  );
};

interface IncomeProps {
  isLoading: boolean;
  income: IncomeDto;
  accountName?: string;
  onDelete: () => void;
  getCategoryNameById: (categoryId: string) => string;
}

export const Income = ({
  isLoading,
  income,
  accountName,
  onDelete,
  getCategoryNameById,
}: IncomeProps): JSX.Element => {
  return (
    <>
      {isLoading && <LoaderFullScreen />}
      <UpdatePageInfo
        title={`${income?.description}`}
        backLink="/statistics/incomes"
      />
      {income && (
        <section className="grid gap-2 lg:gap-4">
          <section className="grid grid-cols-2 gap-2 lg:grid-cols-3 md:gap-4">
            <InfoCard iconName={IconName.cash} label="Amount">
              {formatCurrency(income.amount)}
            </InfoCard>
            <InfoCard iconName={IconName.calendar} label="Date">
              {formatDate(new Date(income.date))}
            </InfoCard>
            <InfoCard
              iconName={IconName.informationCircle}
              label="Type"
              className="max-lg:col-span-full"
              isLarge
            >
              Income
            </InfoCard>
            <InfoCard
              iconName={IconName.download}
              label="To account"
              className="col-span-full"
              isLarge
            >
              {accountName ?? '-'}
            </InfoCard>
          </section>
          {income.categories.length > 0 && (
            <>
              <Divider>Categories</Divider>
              <ul>
                {(
                  income.categories as unknown as TransactionCategoryMappingDto[]
                )?.map(({ amount, category_id, _id }) => (
                  <li key={_id} className="grid grid-cols-2 gap-2">
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
              link={`/statistics/incomes/${income._id}/edit`}
              testId="edit-income-button"
            >
              Edit
            </Button>
            <IncomeDeleteModal onDelete={onDelete} />
          </ButtonGroup>
        </section>
      )}
    </>
  );
};
