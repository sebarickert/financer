import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Button from "../../components/button/button";
import ButtonGroup from "../../components/button/button.group";
import Hero from "../../components/hero/hero";
import Loader from "../../components/loader/loader";
import Table, { ITableHead } from "../../components/table/table";
import { TAddiotinalLabel } from "../../components/table/table.header";
import formatCurrency from "../../utils/formatCurrency";

const Accounts = (): JSX.Element => {
  const [accountsRaw, setAccountsRaw] = useState<IAccount[] | null>(null);
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
    if (accountsRaw === null) return;

    const total = accountsRaw.reduce(
      (currentTotal, { balance, type }) =>
        currentTotal + (type !== "loan" ? balance : 0),
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

  return accountsRaw === null ? (
    <Loader loaderColor="blue" />
  ) : (
    <>
      <Hero accent="Overview" accentColor="blue" label="Accounts">
        Below you are able to add your various accounts where you have your
        savings or investments to calculate total amount.
      </Hero>
      <div className="mt-12">
        <ButtonGroup>
          <Button link="/accounts/add" accentColor="blue">
            Add account
          </Button>
          <Button link="/accounts/transfer" accentColor="blue">
            Transfer
          </Button>
        </ButtonGroup>
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
