import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import Container from "../../components/container/container";
import SEO from "../../components/seo/seo";
import AccountForm from "./AccountForm";
import { addAccount } from "./AccountService";

const AddAccount = (): JSX.Element => {
  const history = useHistory();
  const [errors, setErrors] = useState<string[]>([]);

  const handleSubmit = async (newAccountData: IAccount) => {
    try {
      const newAccount = await addAccount(newAccountData);

      if (newAccount.status === 201) {
        history.push("/accounts");
      } else if (newAccount.status === 400) {
        setErrors(newAccount?.errors || ["Unknown error."]);
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error);
    }
  };

  return (
    <Container className="mt-6 sm:mt-12">
      <SEO title="Add account | Accounts" />
      <AccountForm
        onSubmit={handleSubmit}
        errors={errors}
        formHeading="Add account"
        submitLabel="Add"
      />
    </Container>
  );
};

export default AddAccount;
