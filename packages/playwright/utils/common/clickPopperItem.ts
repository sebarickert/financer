import { Page, expect } from '@/utils/financer-page';

export const clickPopperItem = async (page: Page, name: string) => {
  const popperButton = page.getByTestId('popper-button');

  await expect(popperButton).toBeVisible({ timeout: 5000 });
  await popperButton.click();

  const popperContainer = page.getByTestId('popper-container');
  await expect(popperContainer).toBeVisible({ timeout: 5000 });

  const popperItem = popperContainer
    .getByTestId('popper-item')
    .filter({ hasText: name });
  await expect(popperItem).toBeVisible({ timeout: 5000 });
  await popperItem.click();
};
