import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import ExpenseForm from "./ExpenseForm";

const AddExpense = (): JSX.Element => {
  const history = useHistory();
  const [errors, setErrors] = useState<string[]>([]);

  const handleSubmit = async () => {};

  return (
    <ExpenseForm
      onSubmit={handleSubmit}
      errors={errors}
      formHeading="Add expense"
      submitLabel="Add"
    />
  );
};

export default AddExpense;
