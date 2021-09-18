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
import { getTransactionCategoryMappingByTransactionId } from "../expenses/Expense";
import {
  getAllTransactionCategoriesWithCategoryTree,
  ITransactionCategoryWithCategoryTree,
} from "../profile/TransactionCategories/TransactionCategoriesService";
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
  const [transactionCategoryMapping, setTransactionCategoryMapping] = useState<
    ITransactionCategoryMapping[] | undefined
  >(undefined);
  const [transactionCategories, setTransactionCategories] = useState<
    ITransactionCategoryWithCategoryTree[] | null
  >(null);
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    const fetchIncome = async () => {
      setIncome(await getIncomeById(id));
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

    fetchIncome();
    fetchTransactionCategoryMapping();
    fetchTransactionCategories();
  }, [id]);

  const getCategoryNameById = (categoryId: string) =>
    transactionCategories?.find((category) => category._id === categoryId)
      ?.categoryTree || categoryId;

  const handleDelete = async () => {
    deleteIncome(id);
    history.push("/incomes");
  };

  return typeof income === "undefined" ||
    typeof transactionCategoryMapping === "undefined" ||
    transactionCategories === null ? (
    <Loader loaderColor="green" />
  ) : (
    <>
      <SEO title={`${income.description} | Incomes`} />
      <Hero accent="Income" accentColor="green" label={income.description}>
        <HeroLead>
          Below you are able to edit your added income information or delete it
          altogether.
        </HeroLead>
        <ButtonGroup className="mt-12">
          <Button accentColor="blue" link={`/incomes/${id}/edit`}>
            Edit income
          </Button>
          <IncomeDeleteModal handleDelete={handleDelete} />
        </ButtonGroup>
      </Hero>
      <DescriptionList label="Transaction details" className="mt-12">
        <DescriptionListItem label="Amount">
          {formatCurrency(income.amount)}
        </DescriptionListItem>
        <DescriptionListItem label="Date">
          {formatDate(new Date(income.date))}
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

export default Income;
