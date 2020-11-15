import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import Loader from "../../components/loader/loader";
import AccountForm from "./AccountForm";

const EditAccount = (): JSX.Element => {
  const history = useHistory();
  const [errors, setErrors] = useState<string[]>([]);

  const [account, setAccount] = useState<IAccount | undefined>(undefined);
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    const fetchAccount = async () => {
      const rawAccount = await fetch(`/api/account/${id}`);
      setAccount((await rawAccount.json()).payload);
    };
    fetchAccount();
  }, [id]);

  const handleSubmit = async (newAccountData: IAccount) => {
    /* eslint-disable no-param-reassign, no-underscore-dangle */
    newAccountData.owner = account?.owner;
    newAccountData._id = account?._id;
    /* eslint-enable no-param-reassign, no-underscore-dangle */
    try {
      const newAccount = await fetch(`/api/account/${id}`, {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newAccountData),
      });

      const newAccountJson = await newAccount.json();

      if (newAccountJson.status === 200) {
        history.push(`/accounts/${id}`);
      } else if (newAccountJson.status === 400) {
        setErrors(newAccountJson.errors);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return typeof account === "undefined" ? (
    <Loader loaderColor="blue" />
  ) : (
    <AccountForm
      onSubmit={handleSubmit}
      errors={errors}
      formHeading="Edit account"
      submitLabel="Update"
      name={account.name}
      balance={account.balance}
      type={account.type}
    />
  );
};

export default EditAccount;
