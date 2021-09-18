import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import Container from "../../components/container/container";
import SEO from "../../components/seo/seo";
import ExpenseForm from "./ExpenseForm";
import { addExpense } from "./ExpenseService";

export const addTransactionCategoryMapping = async (
  newTransactionCategoryMappingData: ITransactionCategoryMapping[]
): Promise<IApiResponse<ITransactionCategoryMapping[]>> => {
  const newTransactionCategoryMapping = await fetch(
    "/api/transaction-categories-mapping",
    {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newTransactionCategoryMappingData),
    }
  );

  return newTransactionCategoryMapping.json();
};

const AddExpense = (): JSX.Element => {
  const history = useHistory();
  const [errors, setErrors] = useState<string[]>([]);

  const handleSubmit = async (
    newExpenseData: IExpense,
    newTransactionCategoryMappingsData: ITransactionCategoryMapping[]
  ) => {
    try {
      const newExpenseJson = await addExpense(newExpenseData);
      const newTransactionCategoryMappingJson =
        await addTransactionCategoryMapping(
          newTransactionCategoryMappingsData.map(
            (newTransactionCategoryMappingData) => ({
              ...newTransactionCategoryMappingData,
              transaction_id: newExpenseJson.payload._id,
            })
          )
        );

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
