import { Page } from '$utils/financer-page';

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

  await transactionTemplatesForm.getByLabel(fields.template).check();

  await transactionTemplatesForm
    .getByRole('button', { name: 'Switch', exact: true })
    .click();
};
