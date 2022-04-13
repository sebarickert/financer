import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { Button } from '../../components/button/button';
import { ButtonGroup } from '../../components/button/button.group';
import { DescriptionList } from '../../components/description-list/description-list';
import { DescriptionListItem } from '../../components/description-list/description-list.item';
import { Loader } from '../../components/loader/loader';
import { ModalConfirm } from '../../components/modal/confirm/modal.confirm';
import { UpdatePageInfo } from '../../components/seo/updatePageInfo';
import { useAccountById } from '../../hooks/account/useAccountById';
import { useDeleteExpense } from '../../hooks/expense/useDeleteExpense';
import { useExpenseById } from '../../hooks/expense/useExpenseById';
import { useAllTransactionCategoriesWithCategoryTree } from '../../hooks/transactionCategories/useAllTransactionCategories';
import { useTransactionCategoryMappingsByTransactionId } from '../../hooks/transactionCategoryMapping/useTransactionCategoryMappingsByTransactionId';
import { formatCurrency } from '../../utils/formatCurrency';
import { formatDate } from '../../utils/formatDate';

interface IExpenseDeleteModalProps {
  handleDelete(): void;
}

const ExpenseDeleteModal = ({ handleDelete }: IExpenseDeleteModalProps) => (
  <ModalConfirm
    label="Delete expense"
    submitButtonLabel="Delete"
    onConfirm={handleDelete}
    modalOpenButtonLabel="Delete"
    accentColor="red"
    testId="expense-delete-modal"
  >
    Are you sure you want to delete your expense? All of your data will be
    permanently removed. This action cannot be undone.
  </ModalConfirm>
);

export const Expense = (): JSX.Element => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [expense] = useExpenseById(id);
  const [{ data: account }, setTargetAccountId] = useAccountById(
    expense?.fromAccount
  );
  const [transactionCategoryMapping] =
    useTransactionCategoryMappingsByTransactionId(id);
  const transactionCategories = useAllTransactionCategoriesWithCategoryTree();
  const deleteExpense = useDeleteExpense();

  useEffect(() => {
    if (!expense?.fromAccount) return;

    setTargetAccountId(expense.fromAccount);
  }, [expense, setTargetAccountId]);

  const getCategoryNameById = (categoryId: string) =>
    transactionCategories?.find((category) => category._id === categoryId)
      ?.categoryTree || categoryId;

  const handleDelete = async () => {
    if (!id) {
      console.error('Failed to delete expense: no id');
      return;
    }
    await deleteExpense(id);
    navigate('/statistics/expenses');
  };

  return !expense || !transactionCategoryMapping || !transactionCategories ? (
    <Loader loaderColor="blue" />
  ) : (
    <>
      <UpdatePageInfo
        title={`${expense.description}`}
        backLink="/statistics/expenses"
      />
      <DescriptionList label="Details of expense" className="mb-6">
        <DescriptionListItem label="Amount">
          {formatCurrency(expense.amount)}
        </DescriptionListItem>
        <DescriptionListItem label="Date">
          {formatDate(new Date(expense.date))}
        </DescriptionListItem>
        <DescriptionListItem label="From account">
          {account?.name ?? '-'}
        </DescriptionListItem>
      </DescriptionList>
      {transactionCategoryMapping.length > 0 && (
        <DescriptionList label="Categories">
          {transactionCategoryMapping?.map(({ amount, category_id }) => (
            <>
              <DescriptionListItem label="Category">
                {getCategoryNameById(category_id)}
              </DescriptionListItem>
              <DescriptionListItem label="Amount">
                {formatCurrency(amount)}
              </DescriptionListItem>
            </>
          ))}
        </DescriptionList>
      )}
      <ButtonGroup className="mt-8">
        <Button
          link={`/statistics/expenses/${id}/edit`}
          testId="edit-expense-button"
        >
          Edit
        </Button>
        <ExpenseDeleteModal handleDelete={handleDelete} />
      </ButtonGroup>
    </>
  );
};
