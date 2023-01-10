import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import {
  TransactionCategoryMappingDto,
  useAccountsFindOneByIdQuery,
  useExpensesFindOneQuery,
  useExpensesRemoveMutation,
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

interface IExpenseDeleteModalProps {
  handleDelete(): void;
}

const ExpenseDeleteModal = ({ handleDelete }: IExpenseDeleteModalProps) => {
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
          onConfirm={handleDelete}
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

export const Expense = (): JSX.Element => {
  const navigate = useNavigate();
  const { id = 'id not found' } = useParams<{ id: string }>();
  const expenseData = useExpensesFindOneQuery({ id });
  const { data: expense } = expenseData;

  const accountData = useAccountsFindOneByIdQuery(
    { id: expense?.fromAccount as string },
    { skip: !expense?.fromAccount }
  );
  const account = accountData.data;

  const transactionCategories = useAllTransactionCategoriesWithCategoryTree();
  const [deleteExpense, { isLoading: isDeleting }] =
    useExpensesRemoveMutation();

  const getCategoryNameById = (categoryId: string) =>
    transactionCategories?.find((category) => category._id === categoryId)
      ?.categoryTree || categoryId;

  const handleDelete = async () => {
    if (!id) {
      console.error('Failed to delete expense: no id');
      return;
    }
    await deleteExpense({ id }).unwrap();
    navigate('/statistics/expenses');
  };

  return (
    <>
      {isDeleting && <LoaderFullScreen />}
      <DataHandler {...expenseData} />
      <UpdatePageInfo
        title={`${expense?.description}`}
        backLink="/statistics/expenses"
      />
      {expense && (
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
              {account?.name ?? '-'}
            </InfoCard>
          </section>
          {expense.categories.length > 0 && (
            <>
              <Divider>Categories</Divider>
              <ul>
                {(
                  expense.categories as unknown as TransactionCategoryMappingDto[]
                )?.map(({ amount, category_id }) => (
                  <li className="grid grid-cols-2 gap-2">
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
              link={`/statistics/expenses/${id}/edit`}
              testId="edit-expense-button"
            >
              Edit
            </Button>
            <ExpenseDeleteModal handleDelete={handleDelete} />
          </ButtonGroup>
        </section>
      )}
    </>
  );
};
