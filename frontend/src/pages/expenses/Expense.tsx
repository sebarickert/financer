import React, { useState, useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';

import { Button } from '../../components/button/button';
import { ButtonGroup } from '../../components/button/button.group';
import { DescriptionList } from '../../components/description-list/description-list';
import { DescriptionListItem } from '../../components/description-list/description-list.item';
import { Icon } from '../../components/icon/icon';
import { Loader } from '../../components/loader/loader';
import { ModalConfirm } from '../../components/modal/confirm/modal.confirm';
import { SEO } from '../../components/seo/seo';
import { useAllTransactionCategoriesWithCategoryTree } from '../../hooks/transactionCategories/useAllTransactionCategories';
import { useAllTransactionCategoryMappings } from '../../hooks/transactionCategoryMapping/useAllTransactionCategoryMappings';
import { deleteExpense, getExpenseById } from '../../services/ExpenseService';
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
  >
    Are you sure you want to delete your expense? All of your data will be
    permanently removed. This action cannot be undone.
  </ModalConfirm>
);

export const Expense = (): JSX.Element => {
  const history = useHistory();
  const [expense, setExpense] = useState<IExpense | undefined>(undefined);
  const transactionCategoryMapping = useAllTransactionCategoryMappings();
  const transactionCategories = useAllTransactionCategoriesWithCategoryTree();

  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    const fetchExpense = async () => {
      setExpense(await getExpenseById(id));
    };

    fetchExpense();
  }, [id]);

  const getCategoryNameById = (categoryId: string) =>
    transactionCategories?.find((category) => category._id === categoryId)
      ?.categoryTree || categoryId;

  const handleDelete = async () => {
    await deleteExpense(id);
    history.push('/statistics/expenses');
  };

  return typeof expense === 'undefined' ||
    typeof transactionCategoryMapping === 'undefined' ||
    transactionCategories === null ? (
    <Loader loaderColor="blue" />
  ) : (
    <>
      <SEO title={`${expense.description} | Expenses`} />
      <section className="bg-white border divide-y rounded-lg sm:grid sm:divide-y-0 sm:divide-x">
        <div className="p-6">
          <header className="flex items-center mb-6">
            <span className="inline-flex p-3 text-white bg-red-600 rounded-lg">
              <Icon type="download" />
            </span>
            <h1 className="ml-4 text-2xl font-bold tracking-tighter sm:text-3xl">
              {expense.description}
            </h1>
          </header>
          <DescriptionList label="Transaction details">
            <DescriptionListItem label="Amount">
              {formatCurrency(expense.amount)}
            </DescriptionListItem>
            <DescriptionListItem label="Date">
              {formatDate(new Date(expense.date))}
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
