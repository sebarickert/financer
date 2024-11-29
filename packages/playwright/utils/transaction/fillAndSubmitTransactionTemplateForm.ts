import { Page, expect } from '$utils/financer-page';

type TransactionTemplatesFormFields = {
  template: string;
};

export const fillAndSubmitTransactionTemplateForm = async (
  page: Page,
  fields: TransactionTemplatesFormFields,
  isTransactionEdit?: boolean,
) => {
  const transactionTemplatesForm = (
    isTransactionEdit
      ? page.getByTestId('drawer')
      : page.getByTestId('transaction-drawer')
  ).getByTestId('transaction-templates-form');

  await transactionTemplatesForm
    .locator('label')
    .filter({ hasText: fields.template })
    .check();

  await transactionTemplatesForm
    .getByRole('button', { name: 'Switch', exact: true })
    .click();

  await expect(transactionTemplatesForm).toBeHidden({ timeout: 5000 });
};
