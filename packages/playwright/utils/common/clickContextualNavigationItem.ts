import { Page, expect } from '$utils/financer-page';

export const clickContextualNavigationItem = async (
  page: Page,
  name: string,
) => {
  const isMobile = await page.evaluate(() => window.innerWidth < 1024);

  if (isMobile) {
    const drawerButton = page.getByTestId('contextual-navigation-button');

    await expect(drawerButton).toBeVisible();

    drawerButton.click();
  }

  await page.getByRole('link', { name }).click();
};
