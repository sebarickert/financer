import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import Button from "../../components/button/button";
import ButtonGroup from "../../components/button/button.group";
import Hero from "../../components/hero/hero";
import Loader from "../../components/loader/loader";
import ModalConfirm from "../../components/modal/confirm/modal.confirm";
import SEO from "../../components/seo/seo";
import Stats from "../../components/stats/stats";
import StatsItem from "../../components/stats/stats.item";
import Table, { ITableHead } from "../../components/table/table";
import formatCurrency from "../../utils/formatCurrency";
import { formatDate } from "../../utils/formatDate";
import {
  deleteAccount,
  getAccountById,
  getAccountTransactions,
} from "./AccountService";

interface IProps {
  handleDelete(): void;
}

interface ITransactionsOutput {
  type: string;
  description: string;
  amount: string;
  balance: string;
  date: Date;
  dateStr: string;
}

const AccountDeleteModal = ({ handleDelete }: IProps) => (
  <ModalConfirm
    label="Delete account"
    submitButtonLabel="Delete"
    onConfirm={handleDelete}
    modalOpenButtonLabel="Delete account"
    accentColor="red"
  >
    Are you sure you want to delete your account? All of your data will be
    permanently removed. This action cannot be undone.
  </ModalConfirm>
);

const Account = (): JSX.Element => {
  const history = useHistory();
  const [account, setAccount] = useState<IAccount | undefined>(undefined);
  const [transactions, setTransactions] = useState<
    ITransactionsOutput[] | null
  >(null);
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    const fetchAccount = async () => {
      setAccount(await getAccountById(id));
    };

    const fetchTransactions = async () => {
      const rawTransactions = (await getAccountTransactions(id)).payload;

      setTransactions(
        rawTransactions
          .map(
            ({
              date: dateStr,
              fromAccount,
              toAccount,
              description = "Unknown",
              amount,
              fromAccountBalance = 0,
              toAccountBalance = 0,
            }) => {
              const date = new Date(dateStr);
              if (toAccount === id) {
                return {
                  description,
                  type: fromAccount === null ? "Income" : "Transfer",
                  amount: formatCurrency(amount),
                  date,
                  dateStr: formatDate(date),
                  balance: formatCurrency(toAccountBalance),
                };
              }

              return {
                description,
                type: toAccount === null ? "Expense" : "Transfer",
                amount: formatCurrency(-amount),
                date,
                dateStr: formatDate(date),
                balance: formatCurrency(fromAccountBalance),
              };
            }
          )
          .sort((a, b) => (a.date > b.date ? -1 : 1))
      );
    };

    fetchAccount();
    fetchTransactions();
  }, [id]);

  const handleDelete = async () => {
    await deleteAccount(id);
    history.push("/accounts");
  };

  const tableHeads: ITableHead[] = [
    { key: "type", label: "Type" },
    { key: "amount", label: "Amount" },
    { key: "description", label: "Description" },
    { key: "balance", label: "Balance" },
    { key: "dateStr", label: "Date" },
  ];

  return typeof account === "undefined" || transactions === null ? (
    <Loader loaderColor="blue" />
  ) : (
    <>
      <SEO title={`${account.name} | Accounts`} />
      <Hero accent="Account" accentColor="blue" label={account.name}>
        Below you are able to edit your accounts information and check your
        transaction history as well as balance.
      </Hero>
      <div className="mt-12">
        <ButtonGroup>
          <Button accentColor="blue" link={`/accounts/${id}/edit`}>
            Edit account
          </Button>
          <AccountDeleteModal handleDelete={handleDelete} />
        </ButtonGroup>
      </div>
      <Stats className="mt-12" label="Overview">
        <StatsItem statLabel="Balance">
          {formatCurrency(account.balance)}
        </StatsItem>
        <StatsItem statLabel="Type">{account.type}</StatsItem>
      </Stats>
      <div className="mt-12">
        <Table
          label="Account transactions"
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          rows={transactions as any}
          dataKeyColumn="_id"
          tableHeads={tableHeads}
        />
      </div>
    </>
  );
};

export default Account;
