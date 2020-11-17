import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import IncomeForm from "./IncomeForm";

const AddIncome = (): JSX.Element => {
  const history = useHistory();
  const [errors, setErrors] = useState<string[]>([]);

  const handleSubmit = async (newIncomeData: IExpense) => {
    try {
      const newIncome = await fetch("/api/income", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newIncomeData),
      });

      const newIncomeJson = await newIncome.json();

      if (newIncomeJson.status === 201) {
        history.push("/incomes");
      } else if (newIncomeJson.status === 400) {
        setErrors(newIncomeJson.errors);
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error);
    }
  };

  return (
    <IncomeForm
      onSubmit={handleSubmit}
      errors={errors}
      formHeading="Add income"
      submitLabel="Add"
    />
  );
};

export default AddIncome;
