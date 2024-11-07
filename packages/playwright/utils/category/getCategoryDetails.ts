import { TransactionType } from '$types/generated/financer';
import { Page, expect } from '$utils/financer-page';

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

  try {
    await transactionTypeElement.waitFor({ state: 'visible', timeout: 5000 });
    return transactionTypeElement;
  } catch (error) {
    console.error('Transaction Type element not found:', error);
    return undefined;
  }
};

export const getCategoryDetails = async (
  page: Page,
): Promise<AccountDetails> => {
  await expect(page).toHaveURL(/\/settings\/categories\/[\da-fA-F-]{36}/i, {
    timeout: 5000,
  });

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

  const visibility: TransactionType[] =
    typesString
      .replace(' and ', ', ')
      .split(',')
      .map((type) => type.trim() as TransactionType)
      .filter((type) => validTypes.includes(type)) ?? [];

  const id =
    new URL(page.url()).pathname.split('/').filter(Boolean).pop() ?? '';

  return {
    id,
    parentCategory,
    name,
    visibility,
  };
};
