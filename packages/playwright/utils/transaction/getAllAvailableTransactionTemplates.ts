import { Page } from '$utils/financer-page';

export const getAllAvailableTransactionTemplates = async (
  page: Page,
  isTransactionEdit?: boolean,
): Promise<string[]> => {
  const transactionTemplatesForm = (
    isTransactionEdit
      ? page.getByTestId('drawer')
      : page.getByTestId('transaction-drawer')
  ).getByTestId('transaction-templates-form');

  return transactionTemplatesForm.locator('label').allTextContents();
};
