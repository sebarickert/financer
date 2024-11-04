import { Page } from '$utils/financer-page';

export const clickPopperItem = async (page: Page, name: string) => {
  const popperButton = page.getByTestId('popper-button');
  const popperContainer = page.getByTestId('popper-container');
  const popperItem = popperContainer.locator('li').filter({ hasText: name });

  await popperButton.click();
  await popperContainer.waitFor({ state: 'visible' }); // Ensures the container is fully visible

  if (await popperItem.isVisible()) {
    await popperItem.click();
  } else {
    throw new Error(`Popper item with name "${name}" not found`);
  }
};
