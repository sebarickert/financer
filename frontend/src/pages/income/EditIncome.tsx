import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import Loader from "../../components/loader/loader";
import IncomeForm from "./IncomeForm";

const EditIncome = (): JSX.Element => {
  const history = useHistory();
  const [errors, setErrors] = useState<string[]>([]);

  const [income, setIncome] = useState<IIncome | undefined>(undefined);
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    const fetchIncome = async () => {
      const rawIncome = await fetch(`/api/income/${id}`);
      setIncome((await rawIncome.json()).payload);
    };
    fetchIncome();
  }, [id]);

  const handleSubmit = async () => {};

  return typeof income === "undefined" ? (
    <Loader loaderColor="green" />
  ) : (
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
  );
};

export default EditIncome;
