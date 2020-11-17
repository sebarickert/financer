import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import Loader from "../../components/loader/loader";
import ExpenseForm from "./ExpenseForm";

const EditExpense = (): JSX.Element => {
  const history = useHistory();
  const [errors, setErrors] = useState<string[]>([]);

  const [expense, setExpense] = useState<IExpense | undefined>(undefined);
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    const fetchExpense = async () => {
      const rawExpense = await fetch(`/api/expense/${id}`);
      setExpense((await rawExpense.json()).payload);
    };
    fetchExpense();
  }, [id]);

  const handleSubmit = async () => {};

  return typeof expense === "undefined" ? (
    <Loader loaderColor="red" />
  ) : (
    <ExpenseForm
      onSubmit={handleSubmit}
      errors={errors}
      formHeading="Edit expense"
      submitLabel="Update"
      amount={expense.amount}
      description={expense.description}
      date={new Date(expense.date)}
      fromAccount={expense.fromAccount}
    />
  );
};

export default EditExpense;
