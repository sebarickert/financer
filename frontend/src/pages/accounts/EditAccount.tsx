import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import Loader from "../../components/loader/loader";
import SEO from "../../components/seo/seo";
import AccountForm from "./AccountForm";
import { editAccount } from "./AccountService";

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
    /* eslint-disable no-param-reassign */
    newAccountData.owner = account?.owner;
    newAccountData._id = account?._id;
    /* eslint-enable no-param-reassign */
    try {
      const newAccount = await editAccount(newAccountData._id, newAccountData);

      if (newAccount.status === 200) {
        history.push(`/accounts/${id}`);
      } else if (newAccount.status === 400) {
        setErrors(newAccount.errors);
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error);
    }
  };

  return typeof account === "undefined" ? (
    <Loader loaderColor="blue" />
  ) : (
    <>
      <SEO title={`Edit ${account.name} | Accounts`} />
      <AccountForm
        onSubmit={handleSubmit}
        errors={errors}
        formHeading="Edit account"
        submitLabel="Update"
        name={account.name}
        balance={account.balance}
        type={account.type}
      />
    </>
  );
};

export default EditAccount;
