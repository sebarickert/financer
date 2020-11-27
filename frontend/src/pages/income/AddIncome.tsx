import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import SEO from "../../components/seo/seo";
import IncomeForm from "./IncomeForm";
import { addIncome } from "./IncomeService";

const AddIncome = (): JSX.Element => {
  const history = useHistory();
  const [errors, setErrors] = useState<string[]>([]);

  const handleSubmit = async (newIncomeData: IIncome) => {
    try {
      const newIncome = await addIncome(newIncomeData);

      if (newIncome.status === 201) {
        history.push("/incomes");
      } else if (newIncome.status === 400) {
        setErrors(newIncome.errors);
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error);
    }
  };

  return (
    <>
      <SEO title="Add income | Incomes" />
      <IncomeForm
        onSubmit={handleSubmit}
        errors={errors}
        formHeading="Add income"
        submitLabel="Add"
      />
    </>
  );
};

export default AddIncome;
