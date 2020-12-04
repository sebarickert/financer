import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import Button from "../../components/button/button";
import ButtonGroup from "../../components/button/button.group";
import Hero from "../../components/hero/hero";
import Loader from "../../components/loader/loader";
import ModalConfirm from "../../components/modal/confirm/modal.confirm";
import SEO from "../../components/seo/seo";
import StackedList from "../../components/stacked-list/stacked-list";
import { ICustomStackedListRowProps } from "../../components/stacked-list/stacked-list.row";
import Stats from "../../components/stats/stats";
import StatsItem from "../../components/stats/stats.item";
import formatCurrency from "../../utils/formatCurrency";
import { formatDate } from "../../utils/formatDate";
import {
  deleteAccount,
  getAccountById,
  getAccountTransactions,
  getAllAccounts,
} from "./AccountService";

interface IProps {
  handleDelete(): void;
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
    ICustomStackedListRowProps[]
  >([]);
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    const fetchAccount = async () => {
      setAccount(await getAccountById(id));
    };

    const fetchTransactions = async () => {
      const rawTransactions = (await getAccountTransactions(id)).payload;
      const accounts = await getAllAccounts();

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
              _id,
            }): ICustomStackedListRowProps => {
              const date = new Date(dateStr);
              const fromAccountName =
                accounts.find(
                  ({ _id: targetAccountId }) => targetAccountId === fromAccount
                )?.name || "unknown";
              const toAccountName =
                accounts.find(
                  ({ _id: targetAccountId }) => targetAccountId === toAccount
                )?.name || "unknown";

              const accountTransactionDetailsLabel = (
                type: "transfer" | "expense" | "income"
              ): string => {
                const fromAccountLabel = `${fromAccountName} (${formatCurrency(
                  fromAccountBalance || 0
                )})`;

                const toAccountLabel = `${toAccountName} (${formatCurrency(
                  toAccountBalance || 0
                )})`;

                switch (type) {
                  case "income":
                    return `${toAccountLabel}`;
                  case "expense":
                    return `${fromAccountLabel}`;
                  default:
                    return `${fromAccountLabel} --> ${toAccountLabel}`;
                }
              };

              if (toAccount === id) {
                return {
                  label: description,
                  additionalLabel: formatCurrency(amount),
                  additionalInformation: [
                    formatDate(date),
                    accountTransactionDetailsLabel(
                      !fromAccount ? "income" : "transfer"
                    ),
                  ],
                  id: _id,
                  date,
                  tags: [
                    {
                      label: !fromAccount ? "Income" : "Transfer",
                      color: !fromAccount ? "green" : "blue",
                    },
                  ],
                };
              }

              return {
                label: description,
                additionalLabel: formatCurrency(amount),
                additionalInformation: [
                  formatDate(date),
                  accountTransactionDetailsLabel(
                    !toAccount ? "expense" : "transfer"
                  ),
                ],
                id: _id,
                date,
                tags: [
                  {
                    label: !toAccount ? "Expense" : "Transfer",
                    color: !toAccount ? "red" : "blue",
                  },
                ],
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
        <StackedList label="Account transactions" rows={transactions} />
      </div>
    </>
  );
};

export default Account;
