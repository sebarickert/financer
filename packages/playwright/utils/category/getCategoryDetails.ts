import { TransactionType } from '$types/generated/financer';
import { Page } from '$utils/financer-page';

type AccountDetails = {
  id: string;
  name: string;
  parentCategory?: string;
  visibility: TransactionType[];
};

const getTransactionTypeLocator = async (page: Page) => {
  const transactionTypeElement = page
    .getByTestId('details-list-item')
    .getByText(/Transaction Type(s)?/);

  if (await transactionTypeElement.isVisible()) {
    return transactionTypeElement;
  }

  return undefined;
};

export const getCategoryDetails = async (
  page: Page,
): Promise<AccountDetails> => {
  // TODO figure out how to achieve without waiting...
  // eslint-disable-next-line playwright/no-wait-for-timeout
  await page.waitForTimeout(200);

  const name =
    (await page
      .getByTestId('details-list-item')
      .getByText('Name')
      .evaluate((el) => el.parentElement?.nextElementSibling?.textContent)) ??
    '';

  const isParentCategoryVisible = await page
    .getByTestId('details-list-item')
    .getByText('Parent Category')
    .isVisible();

  const parentCategory = isParentCategoryVisible
    ? ((await page
        .getByTestId('details-list-item')
        .getByText('Parent Category')
        .evaluate((el) => el.parentElement?.nextElementSibling?.textContent)) ??
      '')
    : '';

  const transactionTypeLocator = await getTransactionTypeLocator(page);

  const typesString = transactionTypeLocator
    ? ((await transactionTypeLocator.evaluate(
        (el) => el.parentElement?.nextElementSibling?.textContent,
      )) ?? '')
    : '';

  const validTypes: TransactionType[] = [
    TransactionType.Income,
    TransactionType.Expense,
    TransactionType.Transfer,
  ];

  const visibility: TransactionType[] = typesString
    .replace(' and ', ', ')
    .split(',')
    .map((type) => type.trim() as TransactionType)
    .filter((type) => validTypes.includes(type));

  const id =
    new URL(page.url()).pathname.split('/').filter(Boolean).pop() ?? '';

  return {
    id,
    parentCategory,
    name,
    visibility,
  };
};
