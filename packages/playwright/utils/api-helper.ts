import { Page, getBaseUrl } from './financer-page';

import {
  AccountDto,
  ExpenseDetailsDto,
  IncomeDetailsDto,
  PaginationDto as PaginationDtoBase,
  TransactionCategoryDto,
  TransactionDetailsDto,
  TransferDetailsDto,
} from '$types/generated/financer';

type PaginationDto<Data extends object> = PaginationDtoBase & {
  data: Data;
};

export type ITransactionWithDateObject<
  Transaction extends
    | TransactionDetailsDto
    | IncomeDetailsDto
    | ExpenseDetailsDto
    | TransferDetailsDto,
> = Transaction & {
  dateObj: Date;
};

export const MINUTE_IN_MS = 60000;

export const formatDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

export const getAccount = async (accountId: string): Promise<AccountDto> => {
  const baseUrl = getBaseUrl();
  const rawAccount = await fetch(`${baseUrl}/api/accounts/${accountId}`);
  return rawAccount.json();
};

const parseTransactionDate = <
  Transaction extends
    | TransactionDetailsDto
    | IncomeDetailsDto
    | ExpenseDetailsDto
    | TransferDetailsDto,
>(
  transactions: PaginationDto<Transaction[]>,
): ITransactionWithDateObject<Transaction>[] =>
  transactions.data
    .map(({ date, ...rest }) => ({
      ...rest,
      date,
      dateObj: new Date(date),
    }))
    .sort((a, b) =>
      a.date < b.date ? -1 : 1,
    ) as unknown as ITransactionWithDateObject<Transaction>[];

export const getAllTransaction = async (): Promise<
  ITransactionWithDateObject<TransactionDetailsDto>[]
> => {
  const baseUrl = getBaseUrl();
  const transactions = (await (
    await fetch(`${baseUrl}/api/transactions`)
  ).json()) as PaginationDto<TransactionDetailsDto[]>;

  return parseTransactionDate(transactions);
};

export const getAllIncomes = async (): Promise<
  ITransactionWithDateObject<IncomeDetailsDto>[]
> => {
  const baseUrl = getBaseUrl();
  const transactions = (await (
    await fetch(`${baseUrl}/api/incomes`)
  ).json()) as PaginationDto<IncomeDetailsDto[]>;

  return parseTransactionDate(transactions);
};

export const getAllExpenses = async (): Promise<
  ITransactionWithDateObject<ExpenseDetailsDto>[]
> => {
  const baseUrl = getBaseUrl();
  const transactions = (await (
    await fetch(`${baseUrl}/api/expenses`)
  ).json()) as PaginationDto<ExpenseDetailsDto[]>;

  return parseTransactionDate(transactions);
};

export const getAllTransfers = async (): Promise<
  ITransactionWithDateObject<TransferDetailsDto>[]
> => {
  const baseUrl = getBaseUrl();
  const transactions = (await (
    await fetch(`${baseUrl}/api/transfers`)
  ).json()) as PaginationDto<TransferDetailsDto[]>;

  return parseTransactionDate(transactions);
};

export const getTransactionByIdRaw = async (
  transactionId: string,
): Promise<TransactionDetailsDto> => {
  const baseUrl = getBaseUrl();
  return (await (
    await fetch(`${baseUrl}/api/transactions/${transactionId}`)
  ).json()) as TransactionDetailsDto;
};

export const getTransactionById = async (
  transactionId: string,
): Promise<ITransactionWithDateObject<TransactionDetailsDto>> => {
  const transaction = await getTransactionByIdRaw(transactionId);

  return { ...transaction, dateObj: new Date(transaction?.date) };
};

export const getAllTransactionsByAccountId = async (
  accountId: string,
): Promise<ITransactionWithDateObject<TransactionDetailsDto>[]> => {
  const baseUrl = getBaseUrl();
  const transactions = (await (
    await fetch(`${baseUrl}/api/transactions/account/${accountId}`)
  ).json()) as PaginationDto<TransactionDetailsDto[]>;

  return transactions.data
    .map(({ date, ...rest }) => ({
      ...rest,
      date,
      dateObj: new Date(date),
    }))
    .sort((a, b) => (a.date < b.date ? -1 : 1));
};

export const getAccountFromTransactions = (
  transaction: TransactionDetailsDto,
) => transaction.toAccount || transaction.fromAccount;

export const roundToTwoDecimal = (number: number): number =>
  Math.round(number * 100) / 100;

export const submitTransactionCategoryForm = async (
  testId: string,
  page: Page,
  {
    select,
    amount,
    description,
  }: { select?: string; amount?: string; description?: string },
) => {
  const categoriesSelectElement = page.getByTestId(`${testId}-select`);
  const amountInput = page.getByTestId(`${testId}-amount`);
  const descriptionInput = page.getByTestId(`${testId}-description`);

  select && (await categoriesSelectElement.selectOption(select));
  amount && (await amountInput.fill(amount));
  await descriptionInput.fill(description ?? '');

  await page.getByTestId(`${testId}-submit`).click();
};

export const getAllCategories = async () => {
  const baseUrl = getBaseUrl();
  return (await (
    await fetch(`${baseUrl}/api/transaction-categories`)
  ).json()) as TransactionCategoryDto[];
};
