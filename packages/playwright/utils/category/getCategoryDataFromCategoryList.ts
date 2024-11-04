import { Page } from '$utils/financer-page';

export const getCategoryDataFromCategoryList = async (
  page: Page,
): Promise<string[]> => {
  // TODO figure out how to achieve without waiting...
  // eslint-disable-next-line playwright/no-wait-for-timeout
  await page.waitForTimeout(200);

  const accountList = await page
    .getByTestId('category-list')
    .first()
    .isVisible();

  if (!accountList) {
    throw new Error('Category list not found');
  }

  const categoryRows = await page
    .getByTestId('category-list-item')
    .evaluateAll((element) => {
      return Array.from(element).map((child) => {
        return child.textContent ?? '';
      });
    });

  return categoryRows;
};
