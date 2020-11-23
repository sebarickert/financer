import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import SEO from "../../components/seo/seo";
import AccountForm from "./AccountForm";

const AddAccount = (): JSX.Element => {
  const history = useHistory();
  const [errors, setErrors] = useState<string[]>([]);

  const handleSubmit = async (newAccountData: IAccount) => {
    try {
      const newAccount = await fetch("/api/account", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newAccountData),
      });

      const newAccountJson = await newAccount.json();

      if (newAccountJson.status === 201) {
        history.push("/accounts");
      } else if (newAccountJson.status === 400) {
        setErrors(newAccountJson.errors);
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error);
    }
  };

  return (
    <>
      <SEO title="Add account" />
      <AccountForm
        onSubmit={handleSubmit}
        errors={errors}
        formHeading="Add account"
        submitLabel="Add"
      />
    </>
  );
};

export default AddAccount;
