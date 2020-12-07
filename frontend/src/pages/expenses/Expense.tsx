import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import Button from "../../components/button/button";
import ButtonGroup from "../../components/button/button.group";
import DescriptionList from "../../components/description-list/description-list";
import DescriptionListItem from "../../components/description-list/description-list.item";
import Hero from "../../components/hero/hero";
import Loader from "../../components/loader/loader";
import ModalConfirm from "../../components/modal/confirm/modal.confirm";
import SEO from "../../components/seo/seo";
import formatCurrency from "../../utils/formatCurrency";
import { formatDate } from "../../utils/formatDate";
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

const Expense = (): JSX.Element => {
  const history = useHistory();
  const [expense, setExpense] = useState<IExpense | undefined>(undefined);
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    const fetchExpense = async () => {
      setExpense(await getExpenseById(id));
    };
    fetchExpense();
  }, [id]);

  const handleDelete = async () => {
    await deleteExpense(id);
    history.push("/expenses");
  };

  return typeof expense === "undefined" ? (
    <Loader loaderColor="red" />
  ) : (
    <>
      <SEO title={`${expense.description} | Expenses`} />
      <Hero accent="Expense" accentColor="red" label={expense.description}>
        Below you are able to edit your added expense information or delete it
        altogether.
      </Hero>
      <div className="mt-12">
        <ButtonGroup>
          <Button accentColor="blue" link={`/expenses/${id}/edit`}>
            Edit expense
          </Button>
          <ExpenseDeleteModal handleDelete={handleDelete} />
        </ButtonGroup>
      </div>
      <DescriptionList label="Transaction details" className="mt-12">
        <DescriptionListItem label="Amount">
          {formatCurrency(expense.amount)}
        </DescriptionListItem>
        <DescriptionListItem label="Date">
          {formatDate(new Date(expense.date))}
        </DescriptionListItem>
      </DescriptionList>
    </>
  );
};

export default Expense;
