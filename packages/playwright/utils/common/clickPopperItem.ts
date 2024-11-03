import { Page } from '$utils/financer-page';

export const clickPopperItem = async (page: Page, name: string) => {
  await page.getByTestId('popper-button').click();
  await page
    .getByTestId('popper-container')
    .locator('li')
    .filter({ hasText: name })
    .click();
};
