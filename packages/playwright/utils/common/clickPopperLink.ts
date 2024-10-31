import { Page } from '$utils/financer-page';

export const clickPopperLink = async (page: Page, name: string) => {
  await page.getByTestId('popper-button').click();
  await page
    .getByTestId('popper-container')
    .getByRole('link', { name })
    .click();
};
