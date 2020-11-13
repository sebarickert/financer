import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Hero from "../../components/hero/hero";

const Account = (): JSX.Element => {
  const [account, setAccount] = useState<IAccount | undefined>(undefined);
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    const fetchAccount = async () => {
      const rawAccount = await fetch(`/api/account/${id}`);
      setAccount((await rawAccount.json()).payload);
    };
    fetchAccount();
  }, [id]);

  return typeof account === "undefined" ? (
    <h1>Loading...</h1>
  ) : (
    <Hero accent="Account" accentColor="blue" label={account.name}>
      Below you are able to edit your accounts information and check your
      transaction history as well as balance.
    </Hero>
  );
};

export default Account;
