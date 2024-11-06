import { expect } from '@playwright/test';

import { Page } from '$utils/financer-page';

export const deleteTemplate = async (page: Page) => {
  await expect(page.getByRole('button', { name: 'Delete' })).toBeEnabled();
  await page.getByRole('button', { name: 'Delete' }).click();

  await page
    .getByTestId('drawer')
    .getByRole('button', { name: 'Delete' })
    .click();
};
