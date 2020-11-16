import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Button from "../../components/button/button";
import Hero from "../../components/hero/hero";
import Table, { ITableHead } from "../../components/table/table";
import { TAddiotinalLabel } from "../../components/table/table.header";
import formatCurrency from "../../utils/formatCurrency";

const Accounts = (): JSX.Element => {
  const [accountsRaw, setAccountsRaw] = useState<IAccount[]>([]);
  const [accounts, setAccounts] = useState<any[]>([]);
  const [totalBalance, setTotalBalance] = useState<number>(NaN);

  useEffect(() => {
    const fetchAccounts = async () => {
      const rawAccounts = await fetch("/api/account");
      setAccountsRaw(await rawAccounts.json());
    };
    fetchAccounts();
  }, []);

  useEffect(() => {
    const total = accountsRaw.reduce(
      (currentTotal, { balance }) => currentTotal + balance,
      0
    );
    setTotalBalance(total);
    setAccounts(
      accountsRaw.map(({ _id, balance, ...account }) => ({
        ...account,
        _id,
        balance: formatCurrency(balance),
        actions: <Link to={`/accounts/${_id}`}>View</Link>,
      }))
    );
  }, [accountsRaw]);

  console.log(accountsRaw);

  const tableHeads: ITableHead[] = [
    { key: "name", label: "Account" },
    { key: "type", label: "Type" },
    { key: "balance", label: "Balance" },
    { key: "actions", label: "" },
  ];

  const addiotinalLabel: TAddiotinalLabel = {
    label: `${Number.isNaN(totalBalance) ? "-" : formatCurrency(totalBalance)}`,
    accentLabel: "Total",
  };

  return (
    <>
      <Hero accent="Your" accentColor="blue" label="Accounts">
        Below you are able to add your various accounts where you have your
        savings or investments to calculate total amount.
      </Hero>
      <div className="mt-6">
        <Button link="/accounts/add" accentColor="blue">
          Add account
        </Button>
      </div>
      <div className="mt-12">
        <Table
          addiotinalLabel={addiotinalLabel}
          label="Your accounts"
          rows={accounts}
          tableHeads={tableHeads}
          dataKeyColumn="_id"
        />
      </div>
    </>
  );
};

export default Accounts;
