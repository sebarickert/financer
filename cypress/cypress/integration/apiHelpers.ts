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
    `http://localhost:3000/api/account/${accountId}`
  );
  return (await rawAccount.json()).payload;
};

export const getAllUserTransaction = async (): Promise<
  ITransactionWithDateObject[]
> => {
  const transactions = (
    await (await fetch('http://localhost:3000/api/transaction')).json()
  ).payload as ITransaction[];

  return transactions
    .map(({ date, ...rest }) => ({
      ...rest,
      date,
      dateObj: new Date(date),
    }))
    .sort((a, b) => (a.date < b.date ? -1 : 1));
};

export const getTransactionById = async (
  transactionId: string
): Promise<ITransactionWithDateObject> => {
  const transaction = (
    await (
      await fetch(`http://localhost:3000/api/transaction/${transactionId}`)
    ).json()
  ).payload as ITransaction;

  return { ...transaction, dateObj: new Date(transaction?.date) };
};

export const getAllAccountTransactionsById = async (
  accountId: string
): Promise<ITransactionWithDateObject[]> => {
  const transactions = (
    await (
      await fetch(`http://localhost:3000/api/account/${accountId}/transactions`)
    ).json()
  ).payload as ITransaction[];

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

export const getAccountBalanceFromTransactions = (transaction: ITransaction) =>
  roundToTwoDecimal(
    transaction.toAccount
      ? transaction.toAccountBalance
      : transaction.fromAccountBalance
  );
