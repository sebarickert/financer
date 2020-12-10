import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import Button from "../../components/button/button";
import ButtonGroup from "../../components/button/button.group";
import Container from "../../components/container/container";
import DescriptionList from "../../components/description-list/description-list";
import DescriptionListItem from "../../components/description-list/description-list.item";
import Hero from "../../components/hero/hero";
import Loader from "../../components/loader/loader";
import ModalConfirm from "../../components/modal/confirm/modal.confirm";
import SEO from "../../components/seo/seo";
import formatCurrency from "../../utils/formatCurrency";
import { formatDate } from "../../utils/formatDate";
import { deleteIncome, getIncomeById } from "./IncomeService";

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
      setIncome(await getIncomeById(id));
    };
    fetchIncome();
  }, [id]);

  const handleDelete = async () => {
    deleteIncome(id);
    history.push("/incomes");
  };

  return typeof income === "undefined" ? (
    <Loader loaderColor="green" />
  ) : (
    <>
      <SEO title={`${income.description} | Incomes`} />
      <Hero accent="Income" accentColor="green" label={income.description}>
        Below you are able to edit your added income information or delete it
        altogether.
      </Hero>
      <Container className="mt-12">
        <ButtonGroup>
          <Button accentColor="blue" link={`/incomes/${id}/edit`}>
            Edit income
          </Button>
          <IncomeDeleteModal handleDelete={handleDelete} />
        </ButtonGroup>
      </Container>
      <DescriptionList label="Transaction details" className="mt-12">
        <DescriptionListItem label="Amount">
          {formatCurrency(income.amount)}
        </DescriptionListItem>
        <DescriptionListItem label="Date">
          {formatDate(new Date(income.date))}
        </DescriptionListItem>
      </DescriptionList>
    </>
  );
};

export default Income;
