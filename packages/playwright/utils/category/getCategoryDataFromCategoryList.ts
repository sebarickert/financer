import { expect } from '@playwright/test';

import { Page } from '$utils/financer-page';

export const getCategoryDataFromCategoryList = async (
  page: Page,
): Promise<string[]> => {
  await expect(page).toHaveURL(/\/settings\/categories/, { timeout: 5000 });
  await expect(page.getByTestId('category-list').first()).toBeVisible({
    timeout: 5000,
  });

  const categoryRows = await page
    .getByTestId('category-list-item')
    .evaluateAll((element) => {
      return Array.from(element).map((child) => {
        return child.textContent ?? '';
      });
    });

  return categoryRows;
};