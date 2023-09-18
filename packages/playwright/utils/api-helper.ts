import { AccountDto, TransactionDto, PaginationDto } from '@local/types';

import { getBaseUrl } from './financer-page';

export interface ITransactionWithDateObject extends TransactionDto {
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

export const getAccount = async (accountId: string): Promise<AccountDto> => {
  const baseUrl = getBaseUrl();
  const rawAccount = await fetch(`${baseUrl}/api/accounts/${accountId}`);
  return rawAccount.json();
};

const parseTransactionDate = (
  transactions: PaginationDto<TransactionDto[]>
): ITransactionWithDateObject[] =>
  transactions.data
    .map(({ date, ...rest }) => ({
      ...rest,
      date,
      dateObj: new Date(date),
    }))
    .sort((a, b) => (a.date < b.date ? -1 : 1));

export const getAllTransaction = async (): Promise<
  ITransactionWithDateObject[]
> => {
  const baseUrl = getBaseUrl();
  const transactions = (await (
    await fetch(`${baseUrl}/api/transactions`)
  ).json()) as PaginationDto<TransactionDto[]>;

  return parseTransactionDate(transactions);
};

export const getAllIncomes = async (): Promise<
  ITransactionWithDateObject[]
> => {
  const baseUrl = getBaseUrl();
  const transactions = (await (
    await fetch(`${baseUrl}/api/incomes`)
  ).json()) as PaginationDto<TransactionDto[]>;

  return parseTransactionDate(transactions);
};

export const getAllExpenses = async (): Promise<
  ITransactionWithDateObject[]
> => {
  const baseUrl = getBaseUrl();
  const transactions = (await (
    await fetch(`${baseUrl}/api/expenses`)
  ).json()) as PaginationDto<TransactionDto[]>;

  return parseTransactionDate(transactions);
};

export const getAllTransfers = async (): Promise<
  ITransactionWithDateObject[]
> => {
  const baseUrl = getBaseUrl();
  const transactions = (await (
    await fetch(`${baseUrl}/api/transfers`)
  ).json()) as PaginationDto<TransactionDto[]>;

  return parseTransactionDate(transactions);
};

export const getTransactionByIdRaw = async (
  transactionId: string
): Promise<TransactionDto> => {
  const baseUrl = getBaseUrl();
  return (await (
    await fetch(`${baseUrl}/api/transactions/${transactionId}`)
  ).json()) as TransactionDto;
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
  const baseUrl = getBaseUrl();
  const transactions = (await (
    await fetch(`${baseUrl}/api/transactions/account/${accountId}`)
  ).json()) as PaginationDto<TransactionDto[]>;

  return transactions.data
    .map(({ date, ...rest }) => ({
      ...rest,
      date,
      dateObj: new Date(date),
    }))
    .sort((a, b) => (a.date < b.date ? -1 : 1));
};

export const getAccountFromTransactions = (transaction: TransactionDto) =>
  transaction.toAccount || transaction.fromAccount;

export const roundToTwoDecimal = (number: number): number =>
  Math.round(number * 100) / 100;
