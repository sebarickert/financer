import React, { useState, useEffect } from "react";
import Button from "../../components/button/button";
import ButtonGroup from "../../components/button/button.group";
import Container from "../../components/container/container";
import Hero from "../../components/hero/hero";
import HeroLead from "../../components/hero/hero.lead";
import Loader from "../../components/loader/loader";
import SEO from "../../components/seo/seo";
import StackedList from "../../components/stacked-list/stacked-list";
import { IStackedListRowProps } from "../../components/stacked-list/stacked-list.row";
import { TAddiotinalLabel } from "../../components/table/table.header";
import formatCurrency from "../../utils/formatCurrency";
import { getAllAccounts } from "./AccountService";
import TransferList from "./TransferList";

const Accounts = (): JSX.Element => {
  const [accountsRaw, setAccountsRaw] = useState<IAccount[] | null>(null);
  const [accounts, setAccounts] = useState<IStackedListRowProps[]>([]);
  const [totalBalance, setTotalBalance] = useState<number>(NaN);

  useEffect(() => {
    const fetchAccounts = async () => {
      setAccountsRaw(await getAllAccounts());
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
      accountsRaw.map(({ _id, balance, name, type }) => ({
        label: name,
        link: `/accounts/${_id}`,
        additionalLabel: formatCurrency(balance),
        additionalInformation: [type.charAt(0).toUpperCase() + type.slice(1)],
        id: _id,
      }))
    );
  }, [accountsRaw]);

  const getAddiotinalLabel = (total: number): TAddiotinalLabel => ({
    label: `${Number.isNaN(total) ? "-" : formatCurrency(total)}`,
    accentLabel: "Total",
  });

  return accountsRaw === null ? (
    <Loader loaderColor="blue" />
  ) : (
    <>
      <SEO title="Accounts" />
      <Hero accent="Overview" accentColor="blue" label="Accounts">
        <HeroLead>
          Below you are able to add your various accounts where you have your
          savings or investments to calculate total amount.
        </HeroLead>
        <ButtonGroup className="mt-12">
          <Button link="/accounts/add" accentColor="blue" testId="add-account">
            Add account
          </Button>
          <Button link="/accounts/transfer" accentColor="blue">
            Transfer
          </Button>
        </ButtonGroup>
      </Hero>
      <Container className="lg:mt-12">
        <StackedList
          addiotinalLabel={getAddiotinalLabel(totalBalance)}
          label="Your accounts"
          rows={accounts}
          rowTestId="account-row"
        />
        <TransferList className="lg:mt-6" />
      </Container>
    </>
  );
};

export default Accounts;
