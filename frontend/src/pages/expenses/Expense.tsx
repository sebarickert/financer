import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import Button from "../../components/button/button";
import ButtonGroup from "../../components/button/button.group";
import Hero from "../../components/hero/hero";
import Loader from "../../components/loader/loader";
import ModalConfirm from "../../components/modal/confirm/modal.confirm";
import Stats from "../../components/stats/stats";
import StatsItem from "../../components/stats/stats.item";
import formatCurrency from "../../utils/formatCurrency";
import { formatDate } from "../../utils/formatDate";

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
      const rawExpense = await fetch(`/api/expense/${id}`);
      setExpense((await rawExpense.json()).payload);
    };
    fetchExpense();
  }, [id]);

  const handleDelete = async () => {
    await fetch(`/api/expense/${id}`, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });

    history.push("/expenses");
  };

  return typeof expense === "undefined" ? (
    <Loader loaderColor="red" />
  ) : (
    <>
      <Hero accent="Income" accentColor="red" label={expense.description}>
        Below you are able to edit your accounts information and check your
        transaction history as well as balance.
      </Hero>
      <div className="mt-6">
        <ButtonGroup>
          <Button accentColor="blue" link={`/expenses/${id}/edit`}>
            Edit expense
          </Button>
          <ExpenseDeleteModal handleDelete={handleDelete} />
        </ButtonGroup>
      </div>
      <Stats className="mt-12" label="Overview">
        <StatsItem statLabel="Amount">
          {formatCurrency(expense.amount)}
        </StatsItem>
        <StatsItem statLabel="Date">
          {formatDate(new Date(expense.date))}
        </StatsItem>
      </Stats>
    </>
  );
};

export default Expense;
