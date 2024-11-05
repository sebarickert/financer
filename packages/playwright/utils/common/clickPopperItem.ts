import { expect } from '@playwright/test';

import { Page } from '$utils/financer-page';

export const clickPopperItem = async (page: Page, name: string) => {
  const popperButton = page.getByTestId('popper-button');

  await expect(popperButton).toBeEnabled({ timeout: 5000 });
  await popperButton.scrollIntoViewIfNeeded();
  await popperButton.click();

  const popperContainer = page.getByTestId('popper-container');
  await expect(popperContainer).toBeVisible({ timeout: 5000 });

  const popperItem = popperContainer.locator('li').filter({ hasText: name });
  await expect(popperItem).toBeVisible({ timeout: 5000 });
  await popperItem.click();
};
