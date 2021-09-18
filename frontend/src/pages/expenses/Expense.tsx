import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import Button from "../../components/button/button";
import ButtonGroup from "../../components/button/button.group";
import DescriptionList from "../../components/description-list/description-list";
import DescriptionListItem from "../../components/description-list/description-list.item";
import Hero from "../../components/hero/hero";
import HeroLead from "../../components/hero/hero.lead";
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
    modalOpenButtonLabel="Delete expense"
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
    history.push("/expenses");
  };

  return typeof expense === "undefined" ||
    typeof transactionCategoryMapping === "undefined" ? (
    <Loader loaderColor="red" />
  ) : (
    <>
      <SEO title={`${expense.description} | Expenses`} />
      <Hero accent="Expense" accentColor="red" label={expense.description}>
        <HeroLead>
          Below you are able to edit your added expense information or delete it
          altogether.
        </HeroLead>
        <ButtonGroup className="mt-12">
          <Button accentColor="blue" link={`/expenses/${id}/edit`}>
            Edit expense
          </Button>
          <ExpenseDeleteModal handleDelete={handleDelete} />
        </ButtonGroup>
      </Hero>
      <DescriptionList label="Details" className="mt-12">
        <DescriptionListItem label="Amount">
          {formatCurrency(expense.amount)}
        </DescriptionListItem>
        <DescriptionListItem label="Date">
          {formatDate(new Date(expense.date))}
        </DescriptionListItem>
      </DescriptionList>
      {transactionCategoryMapping?.length && (
        <DescriptionList label="Categories" className="mt-6">
          {transactionCategoryMapping?.map(({ amount, category_id }) => (
            <DescriptionListItem label={getCategoryNameById(category_id)}>
              {formatCurrency(amount)}
            </DescriptionListItem>
          ))}
        </DescriptionList>
      )}
    </>
  );
};

export default Expense;
