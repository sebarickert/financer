import { Page, expect } from '$utils/financer-page';

export const getTemplateDataFromTemplateList = async (
  page: Page,
): Promise<string[]> => {
  await expect(page).toHaveURL(/templates/, { timeout: 5000 });
  await expect(page.getByTestId('template-list').first()).toBeVisible({
    timeout: 5000,
  });

  const templateRows = await page
    .getByTestId('template-list-item')
    .evaluateAll((element) => {
      return Array.from(element).map((child) => {
        return child.textContent ?? '';
      });
    });

  return templateRows;
};
