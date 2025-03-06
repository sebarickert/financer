import { Locator } from '@playwright/test';
import Decimal from 'decimal.js';

import { parseCurrency } from '@/utils/api-helper';
import { Page, expect } from '@/utils/financer-page';

interface CategoryItem {
  category?: string;
  amount?: Decimal;
  description?: string;
}

const fillCategoryItemForm = async ({
  item,
  fields,
  index,
}: {
  item: Locator;
  fields: CategoryItem;
  index: number;
}) => {
  const fieldIdPrefix = `categories\\.${index}\\`;

  const { amount, description, category } = fields;

  const formFields = {
    [`#${fieldIdPrefix}.description`]: description,
    [`#${fieldIdPrefix}.amount`]: amount?.toNumber().toString(),
    [`#${fieldIdPrefix}.categoryId`]: { label: category },
  };

  await item.locator('summary').click();

  for (const [selector, value] of Object.entries(formFields)) {
    if (value) {
      if (selector === `#${fieldIdPrefix}.categoryId`) {
        await item.locator(selector).selectOption(value as { label: string });
      } else {
        await item.locator(selector).fill(value as string);
      }
    }
  }
};

export const setCategories = async (
  page: Page,
  categories: CategoryItem[],
  formLocation: 'page' | 'drawer' = 'drawer',
) => {
  const prefixLocator =
    formLocation === 'page'
      ? page.getByTestId('layout-root')
      : page.getByTestId('transaction-drawer');

  const firstCategorySelect = prefixLocator.getByTestId(
    'select-first-category',
  );

  const hasCategories = !(await firstCategorySelect.isVisible());

  if (!hasCategories) {
    const category = categories[0]?.category;

    if (!category) {
      throw new Error('Category is required');
    }

    await firstCategorySelect.selectOption(category);
  }

  const transactionCategoriesItem = prefixLocator.getByTestId(
    'transaction-categories-item',
  );

  await expect(transactionCategoriesItem.first()).toBeVisible();

  for (let index = 0; index < categories.length; index++) {
    const category = categories[index];

    await fillCategoryItemForm({
      item: transactionCategoriesItem.nth(index),
      fields: category,
      index,
    });

    if (
      categories.length > 1 &&
      index < categories.length - 1 &&
      !hasCategories
    ) {
      await prefixLocator.getByTestId('add-category').click();
    }
  }

  await expect(transactionCategoriesItem).toHaveCount(categories.length);

  const categorySummaryItem = prefixLocator.getByTestId(
    'transaction-categories-item-summary',
  );

  for (let index = 0; index < categories.length; index++) {
    const targetCategory = categories[index].category;

    if (!targetCategory) {
      throw new Error('Category is required');
    }

    await expect(
      categorySummaryItem.nth(index).getByTestId('category-label'),
    ).toContainText(targetCategory);

    if (categories[index].amount) {
      const parsedAmount = parseCurrency(
        (await categorySummaryItem
          .nth(index)
          .getByTestId('amount')
          .textContent()) ?? '',
      );

      expect(parsedAmount).toEqual(categories[index].amount);
    }
  }
};
