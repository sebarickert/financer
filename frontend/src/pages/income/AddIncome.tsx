import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import IncomeForm from "./IncomeForm";

const AddIncome = (): JSX.Element => {
  const history = useHistory();
  const [errors, setErrors] = useState<string[]>([]);

  const handleSubmit = async () => {};

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
