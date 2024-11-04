import { expect } from '@playwright/test';

import { Page } from '$utils/financer-page';

export const clickPopperItem = async (page: Page, name: string) => {
  await expect(page.getByTestId('popper-button')).toBeVisible({
    timeout: 5000,
  });

  await page.getByTestId('popper-button').click({ force: true });

  await expect(page.getByTestId('popper-container')).toBeVisible({
    timeout: 5000,
  });

  await page
    .getByTestId('popper-container')
    .locator('li')
    .filter({ hasText: name })
    .click({ force: true });
};
