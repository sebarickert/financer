import { TransactionType } from '$types/generated/financer';
import { Page } from '$utils/financer-page';

type CategoryFormFields = {
  parentCategory?: string;
  name?: string;
  visibility?: TransactionType[];
};

export const fillCategoryForm = async (
  page: Page,
  fields: CategoryFormFields,
) => {
  const { name, parentCategory, visibility } = fields;

  const formFields = {
    '#name': name,
    '#parentCategoryId': parentCategory ? { label: parentCategory } : null,
    '#incomeVisible': visibility?.includes(TransactionType.Income),
    '#expenseVisible': visibility?.includes(TransactionType.Expense),
    '#transferVisible': visibility?.includes(TransactionType.Transfer),
  };

  const categoryForm = page.getByTestId('category-form');

  if (visibility?.length) {
    await categoryForm.locator('#incomeVisible').setChecked(false);
    await categoryForm.locator('#expenseVisible').setChecked(false);
    await categoryForm.locator('#transferVisible').setChecked(false);
  }

  for (const [selector, value] of Object.entries(formFields)) {
    if (value) {
      if (selector === '#parentCategoryId') {
        await categoryForm.locator(selector).selectOption(value as string);
      } else if (
        selector === '#incomeVisible' ||
        selector === '#expenseVisible' ||
        selector === '#transferVisible'
      ) {
        await categoryForm.locator(selector).check();
      } else {
        await categoryForm.locator(selector).fill(value.toString());
      }
    }
  }
};
