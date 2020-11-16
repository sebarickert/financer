import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import Loader from "../../components/loader/loader";
import IncomeForm from "./IncomeForm";

const EditIncome = (): JSX.Element => {
  // const history = useHistory();
  // const [errors, setErrors] = useState<string[]>([]);

  // const [account, setAccount] = useState<IAccount | undefined>(undefined);
  // const { id } = useParams<{ id: string }>();

  // useEffect(() => {
  //   const fetchAccount = async () => {
  //     const rawAccount = await fetch(`/api/account/${id}`);
  //     setAccount((await rawAccount.json()).payload);
  //   };
  //   fetchAccount();
  // }, [id]);

  // const handleSubmit = async () => {};

  // return typeof account === "undefined" ? (
  //   <Loader loaderColor="red" />
  // ) : (
  //   <IncomeForm
  //     onSubmit={handleSubmit}
  //     errors={errors}
  //     formHeading="Edit account"
  //     submitLabel="Update"
  //     // purchase={account.name}
  //     // price={account.balance}
  //     // type={account.type}
  //   />
  // );
  return <h1>Edit</h1>;
};

export default EditIncome;
