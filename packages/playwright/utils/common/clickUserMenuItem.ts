import { Page } from '@/utils/financer-page';

export const clickUserMenuItem = async (page: Page, name: string) => {
  await page.getByTestId('user-menu-button').click();
  const userMenuContainer = page.getByTestId('user-menu-container');

  const userMenuItem = userMenuContainer
    .getByTestId('user-menu-item')
    .filter({ hasText: name });

  await userMenuItem.click();
};
