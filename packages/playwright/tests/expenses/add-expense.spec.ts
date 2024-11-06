import Decimal from 'decimal.js';

import { getAccountBalanceFromAccountListByName } from '$utils/account/getAccountBalanceFromAccountListByName';
import { applyFixture } from '$utils/applyFixture';
import { getEmptyListErrorMessageByBrowserName } from '$utils/common/getEmptyListErrorMessageByBrowserName';
import { test, expect } from '$utils/financer-page';
import { getTemplateFormValues } from '$utils/template/getTemplateFormValues';
import { fillAndSubmitTransactionCategoryForm } from '$utils/transaction/fillAndSubmitTransactionCategoryForm';
import { fillAndSubmitTransactionTemplateForm } from '$utils/transaction/fillAndSubmitTransactionTemplateForm';
import { fillTransactionForm } from '$utils/transaction/fillTransactionForm';
import { getAllAvailableTransactionTemplates } from '$utils/transaction/getAllAvailableTransactionTemplates';
import { getTransactionDetails } from '$utils/transaction/getTransactionDetails';
import { getTransactionFormValues } from '$utils/transaction/getTransactionFormValues';

test.describe('Expense Transactions', () => {
  test.beforeEach(async () => {
    await applyFixture();
  });

  test.describe('Add Expense', () => {
    test('do nothing', async ({ page }) => {
      expect(true).toBeTruthy();
    });

    test('should add new expense and verify account balance and expense list', async ({
      page,
    }) => {
      const transactionDescription = `dummy expense transaction created by test code ${Math.random()}`;

      await page.goto('/accounts');
      const initialAccountBalance =
        await getAccountBalanceFromAccountListByName(page, 'Credit account');

      await page.getByTestId('add-transaction').click();

      await fillTransactionForm(page, {
        fromAccount: 'Credit account',
        amount: new Decimal(15.5),
        description: transactionDescription,
      });

      await page
        .getByTestId('transaction-form')
        .getByRole('button', { name: 'Submit' })
        .click();

      await expect(page.getByTestId('transaction-details')).toBeVisible();
      await expect(page.getByTestId('transaction-amount')).toContainText(
        '15,50',
      );
      await expect(page.getByTestId('transaction-description')).toContainText(
        transactionDescription,
      );

      await page.goto('/accounts');
      const updatedAccountBalance =
        await getAccountBalanceFromAccountListByName(page, 'Credit account');

      expect(updatedAccountBalance).toEqual(initialAccountBalance.minus(15.5));

      await page.goto('/statistics/expenses');
      await expect(
        page
          .getByTestId('transaction-list-item')
          .getByText(transactionDescription),
      ).toBeVisible();
    });
  });

  test.describe('Categories', () => {
    test('should add new expense with category and verify it appears in transaction details', async ({
      page,
    }) => {
      const transactionDescription = `dummy expense transaction created by test code ${Math.random()}`;

      await page.goto('/accounts');
      await page.getByTestId('add-transaction').click();

      await fillTransactionForm(page, {
        fromAccount: 'Credit account',
        amount: new Decimal(15.5),
        description: transactionDescription,
      });

      await page.getByTestId('add-category').click();

      await fillAndSubmitTransactionCategoryForm(page, {
        category: 'Category for all types',
        amount: new Decimal(15.5),
      });

      await expect(
        page.getByTestId('transaction-categories-item'),
      ).toContainText('Category for all types');
      await expect(
        page.getByTestId('transaction-categories-item'),
      ).toContainText('15.5 €');

      await page
        .getByTestId('transaction-form')
        .getByRole('button', { name: 'Submit' })
        .click();

      await expect(page).toHaveURL(/\/statistics\/expenses\//);

      const { categories } = await getTransactionDetails(page);

      expect(categories.length).toEqual(1);
      expect(categories[0].category).toEqual('Category for all types');
      expect(categories[0].amount).toEqual(new Decimal(15.5));
    });

    test('should only show expense-visible categories in dropdown during transaction creation', async ({
      page,
    }) => {
      await page.goto('/');
      await page.getByTestId('add-transaction').click();

      await fillTransactionForm(page, { amount: new Decimal(100) });
      await page.getByTestId('add-category').click();

      const categoryOptions = page
        .getByLabel('Category')
        .locator('option')
        .filter({ hasNotText: 'Select category' });

      await expect(categoryOptions).toHaveCount(4);
      await expect(categoryOptions.nth(0)).toHaveText('Category for all types');
      await expect(categoryOptions.nth(1)).toHaveText('Expense category');
      await expect(categoryOptions.nth(2)).toHaveText(
        'Invisible category > Expense sub category',
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
      await page.goto('/settings/templates');

      await page
        .getByTestId('template-list-item')
        .getByText('Dummy template for EXPENSE')
        .click();

      const templateDetails = await getTemplateFormValues(page);

      await page.goto('/accounts');
      await page.getByTestId('add-transaction').click();

      const initialFormValues = await getTransactionFormValues(page);

      await page.getByTestId('use-template-button').click();

      await fillAndSubmitTransactionTemplateForm(page, {
        template: 'Dummy template for EXPENSE',
      });

      const updatedFormValues = await getTransactionFormValues(page);

      expect(updatedFormValues).not.toEqual(initialFormValues);
      expect(updatedFormValues).toMatchObject({
        description: templateDetails.description,
        amount: templateDetails.amount,
        toAccount: templateDetails.toAccount,
      });
    });

    test('should only show expense-visible templates during transaction creation', async ({
      page,
    }) => {
      await page.goto('/accounts');
      await page.getByTestId('add-transaction').click();

      await page.getByTestId('use-template-button').click();

      const templates = await getAllAvailableTransactionTemplates(page);

      expect(templates.includes('Dummy template for EXPENSE')).toBeTruthy();
      expect(templates.includes('Dummy template for INCOME')).toBeFalsy();
      expect(templates.includes('Dummy template for TRANSFER')).toBeFalsy();
    });
  });

  test.describe('Form Validation', () => {
    test('should not allow form submission with missing required fields', async ({
      page,
      browserName,
    }) => {
      await page.goto('/');

      await page.getByTestId('add-transaction').click();

      await page
        .getByTestId('transaction-form')
        .getByRole('button', { name: 'Submit' })
        .click();

      const accountSelect = page
        .getByTestId('transaction-form')
        .getByLabel('From Account');

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
