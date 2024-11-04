import { expect } from '@playwright/test';

import { Page } from '$utils/financer-page';

export const clickPopperItem = async (page: Page, name: string) => {
  const popperButton = page.getByTestId('popper-button');

  await expect(popperButton).toBeEnabled({ timeout: 5000 });
  await popperButton.click({ force: true });

  await expect(page.getByTestId('popper-container')).toBeVisible({
    timeout: 5000,
  });

  await page
    .getByTestId('popper-container')
    .locator('li')
    .filter({ hasText: name })
    .click();
};
