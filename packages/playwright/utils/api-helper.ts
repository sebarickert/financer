import { Page, getBaseUrl } from './financer-page';

import {
  AccountDto,
  ExpenseListItemDto,
  IncomeListItemDto,
  PaginationDto as PaginationDtoBase,
  TransactionCategoryDto,
  TransactionDetailsDto,
  TransactionListItemDto,
  TransferListItemDto,
} from '$types/generated/financer';

type PaginationDto<Data extends object> = PaginationDtoBase & {
  data: Data;
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

export const getAllTransactions = async (): Promise<
  TransactionListItemDto[]
> => {
  const baseUrl = getBaseUrl();
  const transactions = (await (
    await fetch(`${baseUrl}/api/transactions`)
  ).json()) as PaginationDto<TransactionListItemDto[]>;

  return transactions.data.sort((a, b) => (a.date < b.date ? -1 : 1));
};

export const getAllIncomes = async (): Promise<IncomeListItemDto[]> => {
  const baseUrl = getBaseUrl();
  const transactions = (await (
    await fetch(`${baseUrl}/api/incomes`)
  ).json()) as PaginationDto<IncomeListItemDto[]>;

  return transactions.data.sort((a, b) => (a.date < b.date ? -1 : 1));
};

export const getAllExpenses = async (): Promise<ExpenseListItemDto[]> => {
  const baseUrl = getBaseUrl();
  const transactions = (await (
    await fetch(`${baseUrl}/api/expenses`)
  ).json()) as PaginationDto<ExpenseListItemDto[]>;

  return transactions.data.sort((a, b) => (a.date < b.date ? -1 : 1));
};

export const getAllTransfers = async (): Promise<TransferListItemDto[]> => {
  const baseUrl = getBaseUrl();
  const transactions = (await (
    await fetch(`${baseUrl}/api/transfers`)
  ).json()) as PaginationDto<TransferListItemDto[]>;

  return transactions.data.sort((a, b) => (a.date < b.date ? -1 : 1));
};

export const getTransactionById = async (
  transactionId: string,
): Promise<TransactionDetailsDto> => {
  const baseUrl = getBaseUrl();
  return (await (
    await fetch(`${baseUrl}/api/transactions/${transactionId}`)
  ).json()) as TransactionDetailsDto;
};

export const getAllTransactionsByAccountId = async (
  accountId: string,
): Promise<TransactionListItemDto[]> => {
  const baseUrl = getBaseUrl();
  const transactions = (await (
    await fetch(`${baseUrl}/api/transactions/account/${accountId}`)
  ).json()) as PaginationDto<TransactionListItemDto[]>;

  return transactions.data.sort((a, b) => (a.date < b.date ? -1 : 1));
};

export const getAccountFromTransactionListItem = async (
  transaction:
    | TransactionListItemDto
    | ExpenseListItemDto
    | TransferListItemDto
    | IncomeListItemDto,
) => {
  const { toAccount, fromAccount } = await getTransactionById(transaction.id);

  return toAccount || fromAccount;
};

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
