import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import DescriptionList from "../../components/description-list/description-list";
import DescriptionListItem from "../../components/description-list/description-list.item";
import Icon from "../../components/icon/icon";
import Loader from "../../components/loader/loader";
import ModalConfirm from "../../components/modal/confirm/modal.confirm";
import SEO from "../../components/seo/seo";
import formatCurrency from "../../utils/formatCurrency";
import { formatDate } from "../../utils/formatDate";
import {
  getAllTransactionCategoriesWithCategoryTree,
  ITransactionCategoryWithCategoryTree,
} from "../profile/TransactionCategories/TransactionCategoriesService";
import { deleteExpense, getExpenseById } from "./ExpenseService";

interface IProps {
  handleDelete(): void;
}

const ExpenseDeleteModal = ({ handleDelete }: IProps) => (
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

export const getTransactionCategoryMappingByTransactionId = async (
  id: string
): Promise<ITransactionCategoryMapping[]> => {
  const transactionCategoryMapping = await fetch(
    `/api/transaction-categories-mapping/by-transaction/${id}`
  );
  return (await transactionCategoryMapping.json()).payload;
};

const Expense = (): JSX.Element => {
  const history = useHistory();
  const [expense, setExpense] = useState<IExpense | undefined>(undefined);
  const [transactionCategoryMapping, setTransactionCategoryMapping] = useState<
    ITransactionCategoryMapping[] | undefined
  >(undefined);
  const [transactionCategories, setTransactionCategories] = useState<
    ITransactionCategoryWithCategoryTree[] | null
  >(null);

  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    const fetchExpense = async () => {
      setExpense(await getExpenseById(id));
    };

    const fetchTransactionCategoryMapping = async () => {
      setTransactionCategoryMapping(
        await getTransactionCategoryMappingByTransactionId(id)
      );
    };

    const fetchTransactionCategories = async () => {
      setTransactionCategories(
        await getAllTransactionCategoriesWithCategoryTree()
      );
    };

    fetchExpense();
    fetchTransactionCategoryMapping();
    fetchTransactionCategories();
  }, [id]);

  const getCategoryNameById = (categoryId: string) =>
    transactionCategories?.find((category) => category._id === categoryId)
      ?.categoryTree || categoryId;

  const handleDelete = async () => {
    await deleteExpense(id);
    history.push("/statistics/expenses");
  };

  return typeof expense === "undefined" ||
    typeof transactionCategoryMapping === "undefined" ||
    transactionCategories === null ? (
    <Loader loaderColor="blue" />
  ) : (
    <>
      <SEO title={`${expense.description} | Expenses`} />
      <section className="rounded-lg border bg-white sm:grid divide-y sm:divide-y-0 sm:divide-x">
        <div className="p-6">
          <header className="flex items-center mb-6">
            <span className="rounded-lg inline-flex p-3 text-white bg-red-600">
              <Icon type="download" />
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tighter ml-4">
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
      <div className="mt-6">
        <ExpenseDeleteModal handleDelete={handleDelete} />
      </div>
    </>
  );
};

export default Expense;
