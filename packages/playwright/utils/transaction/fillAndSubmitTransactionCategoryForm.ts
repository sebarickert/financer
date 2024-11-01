import Decimal from 'decimal.js';

import { Page } from '$utils/financer-page';

type TransactionCategoryFormFields = {
  amount?: Decimal;
  description?: string;
  category?: string;
};

export const fillAndSubmitTransactionCategoryForm = async (
  page: Page,
  fields: TransactionCategoryFormFields,
  formLocation: 'page' | 'drawer' = 'drawer',
) => {
  const transactionCategoriesForm =
    formLocation === 'page'
      ? page
          .getByTestId('layout-root')
          .getByTestId('transaction-categories-form')
      : page
          .getByTestId('transaction-drawer')
          .getByTestId('transaction-categories-form');

  const index = await transactionCategoriesForm.getAttribute(
    'data-category-index',
  );

  const fieldIdPrefix = `categories\\.${index}\\`;

  const { amount, description, category } = fields;

  const formFields = {
    [`#${fieldIdPrefix}.description`]: description,
    [`#${fieldIdPrefix}.amount`]: amount?.toNumber(),
    [`#${fieldIdPrefix}.categoryId`]: { label: category },
  };

  for (const [selector, value] of Object.entries(formFields)) {
    if (value) {
      if (selector === `#${fieldIdPrefix}.categoryId`) {
        await transactionCategoriesForm
          .locator(selector)
          .selectOption(value as string);
      } else {
        await transactionCategoriesForm
          .locator(selector)
          .fill(value.toString());
      }
    }
  }

  await transactionCategoriesForm
    .getByRole('button', { name: 'Add', exact: true })
    .click();
};
