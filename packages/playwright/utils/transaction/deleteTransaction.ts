import { clickPopperItem } from '@/utils/common/clickPopperItem';
import { Page } from '@/utils/financer-page';

export const deleteTransaction = async (page: Page) => {
  await clickPopperItem(page, 'Delete');

  await page
    .getByTestId('drawer')
    .getByRole('button', { name: 'Delete' })
    .click();
};
