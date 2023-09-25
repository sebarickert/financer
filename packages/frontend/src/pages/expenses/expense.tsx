import { useState } from 'react';

import {
  ExpenseDto,
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

interface IExpenseDeleteModalProps {
  onDelete: () => void;
}

const ExpenseDeleteModal = ({ onDelete }: IExpenseDeleteModalProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button
        testId="expense-delete-modal_open-button"
        onClick={() => setIsOpen(!isOpen)}
      >
        Delete
      </Button>
      <Dialog isDialogOpen={isOpen} setIsDialogOpen={setIsOpen}>
        <DialogConfirm
          label="Delete expense"
          onConfirm={onDelete}
          onCancel={() => setIsOpen(!isOpen)}
          submitButtonLabel="Delete"
          iconName={IconName.exclamation}
          testId="expense-delete-modal"
        >
          Are you sure you want to delete your expense? All of your data will be
          permanently removed. This action cannot be undone.
        </DialogConfirm>
      </Dialog>
    </>
  );
};

interface ExpenseProps {
  isLoading: boolean;
  expense: ExpenseDto;
  accountName?: string;
  onDelete: () => void;
  getCategoryNameById: (categoryId: string) => string;
}

export const Expense = ({
  isLoading,
  expense,
  accountName,
  onDelete,
  getCategoryNameById,
}: ExpenseProps): JSX.Element => {
  return (
    <>
      {isLoading && <LoaderFullScreen />}
      <UpdatePageInfo
        title={`${expense?.description}`}
        backLink="/statistics/expenses"
      />
      <section className="grid gap-2 lg:gap-4">
        <section className="grid grid-cols-2 gap-2 lg:grid-cols-3 md:gap-4">
          <InfoCard iconName={IconName.cash} label="Amount">
            {formatCurrency(expense?.amount)}
          </InfoCard>
          <InfoCard iconName={IconName.calendar} label="Date">
            {formatDate(new Date(expense?.date))}
          </InfoCard>
          <InfoCard
            iconName={IconName.informationCircle}
            label="Type"
            className="max-lg:col-span-full"
            isLarge
          >
            Expense
          </InfoCard>
          <InfoCard
            iconName={IconName.upload}
            label="From account"
            className="col-span-full"
            isLarge
          >
            {accountName ?? '-'}
          </InfoCard>
        </section>
        {expense.categories.length > 0 && (
          <>
            <Divider>Categories</Divider>
            <ul>
              {(
                expense.categories as unknown as TransactionCategoryMappingDto[]
              )?.map(({ amount, category_id }) => (
                <li className="grid grid-cols-2 gap-2" key={category_id}>
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
            link={`/statistics/expenses/${expense._id}/edit`}
            testId="edit-expense-button"
            transition="open-from-right"
          >
            Edit
          </Button>
          <ExpenseDeleteModal onDelete={onDelete} />
        </ButtonGroup>
      </section>
    </>
  );
};
