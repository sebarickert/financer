import Decimal from 'decimal.js';

import { TransactionType } from '$types/generated/financer';
import { getAccountBalanceFromAccountListByName } from '$utils/account/getAccountBalanceFromAccountListByName';
import { applyFixture } from '$utils/applyFixture';
import { getEmptyListErrorMessageByBrowserName } from '$utils/common/getEmptyListErrorMessageByBrowserName';
import { test, expect } from '$utils/financer-page';
import { getTemplateFormValues } from '$utils/template/getTemplateFormValues';
import { fillAndSubmitTransactionTemplateForm } from '$utils/transaction/fillAndSubmitTransactionTemplateForm';
import { fillTransactionForm } from '$utils/transaction/fillTransactionForm';
import { getAllAvailableTransactionTemplates } from '$utils/transaction/getAllAvailableTransactionTemplates';
import { getTransactionDetails } from '$utils/transaction/getTransactionDetails';
import { getTransactionFormValues } from '$utils/transaction/getTransactionFormValues';
import { setCategories } from '$utils/transaction/setCategories';
import { switchTransactionType } from '$utils/transaction/switchTransactionType';

test.describe('Income Transactions', () => {
  test.beforeEach(async ({ page }) => {
    await applyFixture();
    await page.goto('/statistics/incomes');
  });

  test.describe('Add Income', () => {
    test('should add new income and verify account balance and income list', async ({
      page,
    }) => {
      const transactionDescription = `dummy income transaction created by test code ${Math.random()}`;

      await page.getByRole('link', { name: 'Accounts' }).click();
      const initialAccountBalance =
        await getAccountBalanceFromAccountListByName(page, 'Credit account');

      await page.getByTestId('add-transaction').click();

      await switchTransactionType(page, TransactionType.Income);

      await fillTransactionForm(page, {
        toAccount: 'Credit account',
        amount: new Decimal(15.5),
        description: transactionDescription,
      });

      await page
        .getByTestId('transaction-form')
        .getByRole('button', { name: 'Submit' })
        .click();

      const { amount, description } = await getTransactionDetails(page);

      expect(amount).toEqual(new Decimal(15.5));
      expect(description).toEqual(transactionDescription);

      await page.getByRole('link', { name: 'Accounts' }).click();
      const updatedAccountBalance =
        await getAccountBalanceFromAccountListByName(page, 'Credit account');

      expect(updatedAccountBalance).toEqual(initialAccountBalance.plus(15.5));

      await page.getByRole('link', { name: 'Statistics' }).click();
      await page.getByRole('link', { name: 'Incomes' }).click();

      await expect(
        page
          .getByTestId('transaction-list-item')
          .getByText(transactionDescription),
      ).toBeVisible();
    });
  });

  test.describe('Categories', () => {
    test('should add new income with category and verify it appears in transaction details', async ({
      page,
    }) => {
      const transactionDescription = `dummy income transaction created by test code ${Math.random()}`;

      await page.getByRole('link', { name: 'Accounts' }).click();
      await page.getByTestId('add-transaction').click();

      await switchTransactionType(page, TransactionType.Income);

      await fillTransactionForm(page, {
        toAccount: 'Credit account',
        amount: new Decimal(15.5),
        description: transactionDescription,
      });

      await setCategories(page, [
        { category: 'Category for all types', amount: new Decimal(15.5) },
      ]);

      await page
        .getByTestId('transaction-form')
        .getByRole('button', { name: 'Submit' })
        .click();

      await expect(page).toHaveURL(/\/statistics\/incomes\//);

      const { categories } = await getTransactionDetails(page);

      expect(categories.length).toEqual(1);
      expect(categories[0].category).toEqual('Category for all types');
      expect(categories[0].amount).toEqual(new Decimal(15.5));
    });

    test('should only show income-visible categories in dropdown during transaction creation', async ({
      page,
    }) => {
      await page.getByTestId('add-transaction').click();

      await switchTransactionType(page, TransactionType.Income);

      await fillTransactionForm(page, { amount: new Decimal(100) });

      const categoryOptions = page
        .getByLabel('Category')
        .locator('option')
        .filter({ hasNotText: 'Select category' });

      await expect(categoryOptions).toHaveCount(4);
      await expect(categoryOptions.nth(0)).toHaveText('Category for all types');
      await expect(categoryOptions.nth(1)).toHaveText('Income category');
      await expect(categoryOptions.nth(2)).toHaveText(
        'Invisible category > Income sub category',
      );
      await expect(categoryOptions.nth(3)).toHaveText(
        'Invisible category > Sub category for all types',
      );
    });
  });

  test.describe('Templates', () => {
    test('should select a template and confirm that fields are prefilled correctly', async ({
      page,
    }) => {
      await page.getByRole('link', { name: 'Settings' }).click();
      await page.getByRole('link', { name: 'Templates' }).first().click();

      await page
        .getByTestId('template-list-item')
        .getByText('Dummy template for INCOME')
        .click();

      const templateDetails = await getTemplateFormValues(page);

      await page.getByRole('link', { name: 'Accounts' }).click();
      await page.getByTestId('add-transaction').click();

      await switchTransactionType(page, TransactionType.Income);

      const initialFormValues = await getTransactionFormValues(page);

      await page.getByTestId('use-template-button').click();

      await fillAndSubmitTransactionTemplateForm(page, {
        template: 'Dummy template for INCOME',
      });

      const updatedFormValues = await getTransactionFormValues(page);

      expect(updatedFormValues).not.toEqual(initialFormValues);
      expect(updatedFormValues).toMatchObject({
        description: templateDetails.description,
        amount: templateDetails.amount,
        toAccount: templateDetails.toAccount,
        categories: expect.arrayContaining(['Income category']),
      });
    });

    test('should only show income-visible templates during transaction creation', async ({
      page,
    }) => {
      await page.getByTestId('add-transaction').click();

      await switchTransactionType(page, TransactionType.Income);

      await page.getByTestId('use-template-button').click();

      const templates = await getAllAvailableTransactionTemplates(page);

      expect(templates.includes('Dummy template for INCOME')).toBeTruthy();
      expect(templates.includes('Dummy template for EXPENSE')).toBeFalsy();
      expect(templates.includes('Dummy template for TRANSFER')).toBeFalsy();
    });
  });

  test.describe('Form Validation', () => {
    test('should not allow form submission with missing required fields', async ({
      page,
      browserName,
    }) => {
      await page.getByTestId('add-transaction').click();

      await switchTransactionType(page, TransactionType.Income);

      await page
        .getByTestId('transaction-form')
        .getByRole('button', { name: 'Submit' })
        .click();

      const accountSelect = page
        .getByTestId('transaction-form')
        .getByLabel('To Account');

      const validationMessage = await accountSelect.evaluate((element) => {
        const select = element as HTMLInputElement;
        return select.validationMessage;
      });

      expect(validationMessage).toEqual(
        getEmptyListErrorMessageByBrowserName(browserName),
      );
      await expect(page.getByTestId('transaction-drawer')).toBeVisible();
    });
  });
});
