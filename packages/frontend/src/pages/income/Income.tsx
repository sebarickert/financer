import { useNavigate, useParams } from 'react-router-dom';

import { Button } from '../../components/button/button';
import { ButtonGroup } from '../../components/button/button.group';
import { DescriptionList } from '../../components/description-list/description-list';
import { DescriptionListItem } from '../../components/description-list/description-list.item';
import { ModalConfirm } from '../../components/modal/confirm/modal.confirm';
import { UpdatePageInfo } from '../../components/seo/updatePageInfo';
import { useAccountById } from '../../hooks/account/useAccountById';
import { useDeleteIncome } from '../../hooks/income/useDeleteIncome';
import { useIncomeById } from '../../hooks/income/useIncomeById';
import { useAllTransactionCategoriesWithCategoryTree } from '../../hooks/transactionCategories/useAllTransactionCategories';
import { useTransactionCategoryMappingsByTransactionId } from '../../hooks/transactionCategoryMapping/useTransactionCategoryMappingsByTransactionId';
import { formatCurrency } from '../../utils/formatCurrency';
import { formatDate } from '../../utils/formatDate';

interface IIncomeDeleteModalProps {
  handleDelete(): void;
}

const IncomeDeleteModal = ({ handleDelete }: IIncomeDeleteModalProps) => (
  <ModalConfirm
    label="Delete income"
    submitButtonLabel="Delete"
    onConfirm={handleDelete}
    modalOpenButtonLabel="Delete income"
    accentColor="red"
    testId="income-delete-modal"
  >
    Are you sure you want to delete your income? All of your data will be
    permanently removed. This action cannot be undone.
  </ModalConfirm>
);

export const Income = (): JSX.Element => {
  const navigate = useNavigate();
  const { id = 'missing-id' } = useParams<{ id: string }>();
  const income = useIncomeById(id);
  const account = useAccountById(income?.toAccount);
  const [transactionCategoryMapping] =
    useTransactionCategoryMappingsByTransactionId(id);
  const transactionCategories = useAllTransactionCategoriesWithCategoryTree();
  const deleteIncome = useDeleteIncome();

  const getCategoryNameById = (categoryId: string) =>
    transactionCategories?.find((category) => category._id === categoryId)
      ?.categoryTree || categoryId;

  const handleDelete = async () => {
    if (!id) {
      console.error('Failed to delete income: no id');
      return;
    }
    deleteIncome(id);
    navigate('/statistics/incomes');
  };

  return (
    <>
      <UpdatePageInfo
        title={`${income.description}`}
        backLink="/statistics/incomes"
      />
      <DescriptionList label="Details" className="mb-6">
        <DescriptionListItem label="Amount">
          {formatCurrency(income.amount)}
        </DescriptionListItem>
        <DescriptionListItem label="Date">
          {formatDate(new Date(income.date))}
        </DescriptionListItem>
        <DescriptionListItem label="To account">
          {account?.name ?? '-'}
        </DescriptionListItem>
        <DescriptionListItem label="Type">Income</DescriptionListItem>
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
          link={`/statistics/incomes/${id}/edit`}
          testId="edit-income-button"
        >
          Edit
        </Button>
        <IncomeDeleteModal handleDelete={handleDelete} />
      </ButtonGroup>
    </>
  );
};
