/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import Container from "../../components/container/container";
import Loader from "../../components/loader/loader";
import SEO from "../../components/seo/seo";
import IncomeForm from "./IncomeForm";
import { getIncomeById } from "./IncomeService";

const EditIncome = (): JSX.Element => {
  const history = useHistory();
  const [errors, setErrors] = useState<string[]>([]);

  const [income, setIncome] = useState<IIncome | undefined>(undefined);
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    const fetchIncome = async () => {
      setIncome(await getIncomeById(id));
    };
    fetchIncome();
  }, [id]);

  const handleSubmit = async () => {};

  return typeof income === "undefined" ? (
    <Loader loaderColor="green" />
  ) : (
    <Container className="mt-6 sm:mt-12">
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
      />
    </Container>
  );
};

export default EditIncome;
