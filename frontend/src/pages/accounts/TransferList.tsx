import React, { useEffect, useState } from "react";
import Table, { ITableHead } from "../../components/table/table";
import { getAllTransferTranscations } from "../../services/TransactionService";
import { formatDate } from "../../utils/formatDate";
import formatCurrency from "../../utils/formatCurrency";
import { getAllAccounts } from "./AccountService";

interface IProps {
  className?: string;
}

interface ITransactionRender extends Omit<ITransaction, "amount"> {
  dateStr: string;
  fromAccountName: string;
  toAccountName: string;
  amount: string;
}

const TransferList = ({ className = "" }: IProps): JSX.Element => {
  const [transfersRaw, setTransfersRaw] = useState<ITransaction[] | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [transfers, setTransfers] = useState<ITransactionRender[]>([]);
  const [accounts, setAccounts] = useState<IAccount[] | null>(null);

  useEffect(() => {
    const fetchTransfers = async () => {
      setTransfersRaw((await getAllTransferTranscations()).payload);
    };

    const fetchAccounts = async () => {
      setAccounts(await getAllAccounts());
    };

    fetchTransfers();
    fetchAccounts();
  }, []);

  useEffect(() => {
    if (transfersRaw === null || accounts === null) return;

    setTransfers(
      transfersRaw
        .map(({ date: dateStr, amount, fromAccount, toAccount, ...rest }) => {
          const date = new Date(dateStr);

          return {
            ...rest,
            amount: formatCurrency(amount),
            date,
            dateStr: formatDate(date),
            fromAccountName:
              accounts.find(({ _id }) => _id === fromAccount)?.name ||
              "unknown",
            toAccountName:
              accounts.find(({ _id }) => _id === toAccount)?.name || "unknown",
          };
        })
        .sort((a, b) => (a.date > b.date ? -1 : 1))
    );
  }, [transfersRaw, accounts]);

  const tableHeads: ITableHead[] = [
    { key: "fromAccountName", label: "From account" },
    { key: "toAccountName", label: "To account" },
    { key: "amount", label: "Amount" },
    { key: "dateStr", label: "Date" },
  ];

  return (
    <div className={className}>
      <Table
        tableHeads={tableHeads}
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        rows={transfers as any}
        dataKeyColumn="_id"
        label="Your transfers"
      />
    </div>
  );
};

export default TransferList;
