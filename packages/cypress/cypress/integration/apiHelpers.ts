import { IAccount, ITransaction } from '@local/types';

export interface ITransactionWithDateObject extends ITransaction {
  dateObj: Date;
}

export const MINUTE_IN_MS = 60000;

export const formatDate = (date: Date): string => {
  const addLeadingZero = (number: number): string => `0${number}`.substr(-2);

  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  const hours = date.getHours();
  const minutes = date.getMinutes();

  return `${year}-${addLeadingZero(month)}-${addLeadingZero(
    day
  )}T${addLeadingZero(hours)}:${addLeadingZero(minutes)}`;
};

export const getAccount = async (accountId: string): Promise<IAccount> => {
  const rawAccount = await fetch(
    `http://localhost:3000/api/accounts/${accountId}`
  );
  return rawAccount.json();
};

const parseTransactionDate = (
  transactions: ITransaction[]
): ITransactionWithDateObject[] =>
  transactions
    .map(({ date, ...rest }) => ({
      ...rest,
      date,
      dateObj: new Date(date),
    }))
    .sort((a, b) => (a.date < b.date ? -1 : 1));

export const getAllTransaction = async (): Promise<
  ITransactionWithDateObject[]
> => {
  const transactions = (await (
    await fetch('http://localhost:3000/api/transactions')
  ).json()) as ITransaction[];

  return parseTransactionDate(transactions);
};

export const getAllIncomes = async (): Promise<
  ITransactionWithDateObject[]
> => {
  const transactions = (await (
    await fetch('http://localhost:3000/api/incomes')
  ).json()) as ITransaction[];

  return parseTransactionDate(transactions);
};

export const getAllExpenses = async (): Promise<
  ITransactionWithDateObject[]
> => {
  const transactions = (await (
    await fetch('http://localhost:3000/api/expenses')
  ).json()) as ITransaction[];

  return parseTransactionDate(transactions);
};

export const getAllTransfers = async (): Promise<
  ITransactionWithDateObject[]
> => {
  const transactions = (await (
    await fetch('http://localhost:3000/api/transfers')
  ).json()) as ITransaction[];

  return parseTransactionDate(transactions);
};

export const getTransactionByIdRaw = async (
  transactionId: string
): Promise<ITransaction> => {
  return (await (
    await fetch(`http://localhost:3000/api/transactions/${transactionId}`)
  ).json()) as ITransaction;
};

export const getTransactionById = async (
  transactionId: string
): Promise<ITransactionWithDateObject> => {
  const transaction = await getTransactionByIdRaw(transactionId);

  return { ...transaction, dateObj: new Date(transaction?.date) };
};

export const getAllTransactionsByAccountId = async (
  accountId: string
): Promise<ITransactionWithDateObject[]> => {
  const transactions = (await (
    await fetch(`http://localhost:3000/api/transactions/account/${accountId}`)
  ).json()) as ITransaction[];

  return transactions
    .map(({ date, ...rest }) => ({
      ...rest,
      date,
      dateObj: new Date(date),
    }))
    .sort((a, b) => (a.date < b.date ? -1 : 1));
};

export const getAccountFromTransactions = (transaction: ITransaction) =>
  transaction.toAccount || transaction.fromAccount;

export const roundToTwoDecimal = (number: number): number =>
  Math.round(number * 100) / 100;
