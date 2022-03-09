import { useNavigate, useParams } from 'react-router-dom';

import { Button } from '../../components/button/button';
import { ButtonGroup } from '../../components/button/button.group';
import { DescriptionList } from '../../components/description-list/description-list';
import { DescriptionListItem } from '../../components/description-list/description-list.item';
import { Icon } from '../../components/icon/icon';
import { Loader } from '../../components/loader/loader';
import { ModalConfirm } from '../../components/modal/confirm/modal.confirm';
import { SEO } from '../../components/seo/seo';
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
  const { id } = useParams<{ id: string }>();
  const [income] = useIncomeById(id);
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

  return !income || !transactionCategoryMapping || !transactionCategories ? (
    <Loader loaderColor="blue" />
  ) : (
    <>
      <SEO title={`${income.description} | Incomes`} />
      <section className="bg-white border divide-y rounded-lg sm:grid sm:divide-y-0 sm:divide-x">
        <div className="p-6">
          <header className="flex items-center mb-6">
            <span className="inline-flex p-3 text-white rounded-lg bg-emerald-600">
              <Icon type="upload" />
            </span>
            <h1 className="ml-4 text-2xl font-bold tracking-tighter sm:text-3xl">
              {income.description}
            </h1>
          </header>
          <DescriptionList label="Transaction details">
            <DescriptionListItem label="Amount">
              {formatCurrency(income.amount)}
            </DescriptionListItem>
            <DescriptionListItem label="Date">
              {formatDate(new Date(income.date))}
            </DescriptionListItem>
          </DescriptionList>
          {transactionCategoryMapping.length > 0 && (
            <DescriptionList label="Categories" className="mt-6" visibleLabel>
              {transactionCategoryMapping?.map(({ amount, category_id }) => (
                <DescriptionListItem label={getCategoryNameById(category_id)}>
                  {formatCurrency(amount)}
                </DescriptionListItem>
              ))}
            </DescriptionList>
          )}
        </div>
      </section>
      <ButtonGroup className="mt-6">
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
