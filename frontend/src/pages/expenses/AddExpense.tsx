import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import Container from "../../components/container/container";
import SEO from "../../components/seo/seo";
import ExpenseForm from "./ExpenseForm";
import { addExpense } from "./ExpenseService";

const AddExpense = (): JSX.Element => {
  const history = useHistory();
  const [errors, setErrors] = useState<string[]>([]);

  const handleSubmit = async (newExpenseData: IExpense) => {
    try {
      const newExpenseJson = await addExpense(newExpenseData);

      if (newExpenseJson.status === 201) {
        history.push("/expenses");
      } else if (newExpenseJson.status === 400) {
        setErrors(newExpenseJson?.errors || ["Unknown error."]);
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error);
    }
  };

  return (
    <Container className="mt-6 sm:mt-12">
      <SEO title="Add expense | Expenses" />
      <ExpenseForm
        onSubmit={handleSubmit}
        errors={errors}
        formHeading="Add expense"
        submitLabel="Add"
      />
    </Container>
  );
};

export default AddExpense;
