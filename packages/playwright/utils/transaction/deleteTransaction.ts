import { Page } from '$utils/financer-page';

export const deleteTransaction = async (page: Page) => {
  await page.getByTestId('popper-button').click();
  await page
    .getByTestId('popper-container')
    .getByRole('button', { name: 'Delete' })
    .click();

  await page
    .getByTestId('drawer')
    .getByRole('button', { name: 'Delete' })
    .click();
};
