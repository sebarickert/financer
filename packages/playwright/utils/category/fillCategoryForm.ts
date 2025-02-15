import { TransactionType } from '$types/generated/financer';
import { Page } from '$utils/financer-page';

interface CategoryFormFields {
  parentCategory?: string;
  name?: string;
  visibility?: TransactionType[];
}

export const fillCategoryForm = async (
  page: Page,
  fields: CategoryFormFields,
) => {
  const { name, parentCategory, visibility } = fields;

  const categoryForm = page.getByTestId('category-form');

  const formFields = {
    '#name': name,
    '#parentCategoryId': parentCategory ? { label: parentCategory } : null,
  };

  if (visibility?.length) {
    await categoryForm
      .locator('label')
      .filter({ hasText: 'Income' })
      .setChecked(false);
    await categoryForm
      .locator('label')
      .filter({ hasText: 'Expense' })
      .setChecked(false);
    await categoryForm
      .locator('label')
      .filter({ hasText: 'Transfer' })
      .setChecked(false);

    for (const type of visibility) {
      if (type === TransactionType.Income) {
        await categoryForm
          .locator('label')
          .filter({ hasText: 'Income' })
          .check();
      }

      if (type === TransactionType.Expense) {
        await categoryForm
          .locator('label')
          .filter({ hasText: 'Expense' })
          .check();
      }

      if (type === TransactionType.Transfer) {
        await categoryForm
          .locator('label')
          .filter({ hasText: 'Transfer' })
          .check();
      }
    }
  }

  for (const [selector, value] of Object.entries(formFields)) {
    if (value) {
      if (selector === '#parentCategoryId') {
        await categoryForm.locator(selector).selectOption(value as string);
      } else {
        await categoryForm.locator(selector).fill(value.toString());
      }
    }
  }
};
