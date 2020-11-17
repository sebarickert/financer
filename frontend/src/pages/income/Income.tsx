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
import formatDate from "../../utils/formatDate";

interface IProps {
  handleDelete(): void;
}

const IncomeDeleteModal = ({ handleDelete }: IProps) => (
  <ModalConfirm
    label="Delete income"
    submitButtonLabel="Delete"
    onConfirm={handleDelete}
    modalOpenButtonLabel="Delete income"
    accentColor="red"
  >
    Are you sure you want to delete your income? All of your data will be
    permanently removed. This action cannot be undone.
  </ModalConfirm>
);

const Income = (): JSX.Element => {
  const history = useHistory();
  const [income, setIncome] = useState<IIncome | undefined>(undefined);
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    const fetchIncome = async () => {
      const rawIncome = await fetch(`/api/income/${id}`);
      setIncome((await rawIncome.json()).payload);
    };
    fetchIncome();
  }, [id]);

  const handleDelete = async () => {
    await fetch(`/api/income/${id}`, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });

    history.push("/incomes");
  };

  return typeof income === "undefined" ? (
    <Loader loaderColor="red" />
  ) : (
    <>
      <Hero accent="Income" accentColor="green" label={income.description}>
        Below you are able to edit your accounts information and check your
        transaction history as well as balance.
      </Hero>
      <div className="mt-6">
        <ButtonGroup>
          <Button accentColor="blue" link={`/incomes/${id}/edit`}>
            Edit income
          </Button>
          <IncomeDeleteModal handleDelete={handleDelete} />
        </ButtonGroup>
      </div>
      <Stats className="mt-12" label="Overview">
        <StatsItem statLabel="Amount">
          {formatCurrency(income.amount)}
        </StatsItem>
        <StatsItem statLabel="Date">
          {formatDate(new Date(income.date))}
        </StatsItem>
      </Stats>
    </>
  );
};

export default Income;
