/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import Container from "../../components/container/container";
import Loader from "../../components/loader/loader";
import SEO from "../../components/seo/seo";
import { getTransactionCategoryMappingByTransactionId } from "../expenses/Expense";
import IncomeForm from "./IncomeForm";
import { getIncomeById } from "./IncomeService";

const EditIncome = (): JSX.Element => {
  const history = useHistory();
  const [errors, setErrors] = useState<string[]>([]);

  const [income, setIncome] = useState<IIncome | undefined>(undefined);
  const [transactionCategoryMapping, setTransactionCategoryMapping] = useState<
    ITransactionCategoryMapping[] | undefined
  >(undefined);
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

    fetchIncome();
    fetchTransactionCategoryMapping();
  }, [id]);

  const handleSubmit = async () => {};

  return typeof income === "undefined" ||
    typeof transactionCategoryMapping === "undefined" ? (
    <Loader loaderColor="blue" />
  ) : (
    <>
      <SEO title={`Edit ${income.description} | Incomes`} />
      <IncomeForm
        onSubmit={handleSubmit}
        errors={errors}
        formHeading="Edit income"
        submitLabel="Update"
        amount={income.amount}
        description={income.description}
        date={new Date(income.date)}
        toAccount={income.toAccount}
        transactionCategoryMapping={transactionCategoryMapping}
      />
    </>
  );
};

export default EditIncome;
