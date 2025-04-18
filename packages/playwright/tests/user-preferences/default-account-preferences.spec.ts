import { TransactionType } from '@/types/generated/financer';
import { applyFixture } from '@/utils/applyFixture';
import { clickUserMenuItem } from '@/utils/common/clickUserMenuItem';
import { expect, test } from '@/utils/financer-page';
import { getTransactionFormValues } from '@/utils/transaction/getTransactionFormValues';
import { switchTransactionType } from '@/utils/transaction/switchTransactionType';

test.describe('Default Account Preferences', () => {
  test.beforeEach(async () => {
    await applyFixture();
  });

  test('should be able to configure default account settings', async ({
    page,
  }) => {
    await page.goto('/');

    await page.getByTestId('add-transaction').click();

    const initialExpenseFormValues = await getTransactionFormValues(page);
    await switchTransactionType(page, TransactionType.Income);
    const initialIncomeFormValues = await getTransactionFormValues(page);
    await switchTransactionType(page, TransactionType.Transfer);
    const initialTransferFormValues = await getTransactionFormValues(page);

    expect(initialExpenseFormValues.fromAccount).toEqual('Select Account');
    expect(initialIncomeFormValues.toAccount).toEqual('Select Account');
    expect(initialTransferFormValues.fromAccount).toEqual('Select Account');
    expect(initialTransferFormValues.toAccount).toEqual('Select Account');

    await page.getByRole('button', { name: 'Close drawer' }).click();

    await clickUserMenuItem(page, 'Settings');
    await page.getByRole('link', { name: 'Default Account Settings' }).click();

    await page
      .getByLabel('Default income account')
      .selectOption({ label: 'Big money' });
    await page
      .getByLabel('Default expense account')
      .selectOption({ label: 'Pre-assigned CASH' });
    await page
      .getByLabel('Default transfer source account')
      .selectOption({ label: 'Saving account 2' });
    await page
      .getByLabel('Default transfer target account')
      .selectOption({ label: 'Credit account' });

    await page
      .getByTestId('default-account-settings-form')
      .getByRole('button', { name: 'Save', exact: true })
      .click();

    await expect(page).toHaveURL('/settings/', {
      timeout: 5000,
    });

    await page.getByTestId('add-transaction').click();

    await switchTransactionType(page, TransactionType.Expense);
    const updatedExpenseFormValues = await getTransactionFormValues(page);
    await switchTransactionType(page, TransactionType.Income);
    const updatedIncomeFormValues = await getTransactionFormValues(page);
    await switchTransactionType(page, TransactionType.Transfer);
    const updatedTransferFormValues = await getTransactionFormValues(page);

    expect(updatedIncomeFormValues.toAccount).toEqual('Big money');
    expect(updatedExpenseFormValues.fromAccount).toEqual('Pre-assigned CASH');
    expect(updatedTransferFormValues.fromAccount).toEqual('Saving account 2');
    expect(updatedTransferFormValues.toAccount).toEqual('Credit account');
  });
});
