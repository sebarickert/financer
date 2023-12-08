import { test, expect, Page } from '$utils/financer-page';
import { applyFixture } from '$utils/load-fixtures';

test.describe('Transaction category creation', () => {
  const addCategoryAndVerifyDetails = async (
    page: Page,
    visibility: string[] = [],
    parent = 'None'
  ) => {
    const newName = `New Test ${
      visibility.join(', ') || 'invisible'
    } category - ${crypto.randomUUID()}`;

    const parentRowBefore = page
      .getByTestId('category-parent-row')
      .getByText(newName);

    await expect(parentRowBefore).toHaveCount(0);
    const childRowAfter = page
      .getByTestId('category-child-row')
      .getByText(newName);
    await expect(childRowAfter).toHaveCount(0);

    await page.getByTestId('add-category').click();

    await page.locator('#name').fill(newName);

    for (const visibilityItem of visibility) {
      await page
        .getByTestId('visibility-checkboxes')
        .getByText(visibilityItem, { exact: false })
        .check();
    }

    await page.locator('#parent_category_id').selectOption(parent);

    await page.getByTestId('submit').click();
    await expect(page).not.toHaveURL('/add');

    await page.getByText(newName).first().click();

    await page.getByTestId('edit-transaction-category').click();

    await expect(page.locator('#name')).toHaveValue(newName);

    const incomeCheckbox = page.locator('#incomeVisible');
    const expenseCheckbox = page.locator('#expenseVisible');
    const transferCheckbox = page.locator('#transferVisible');

    expect(await incomeCheckbox?.isChecked()).toEqual(
      visibility.includes('income')
    );
    expect(await expenseCheckbox?.isChecked()).toEqual(
      visibility.includes('expense')
    );
    expect(await transferCheckbox?.isChecked()).toEqual(
      visibility.includes('transfer')
    );

    await expect(
      page.locator('#parent_category_id').locator('option').getByText(newName)
    ).toHaveCount(0);

    const selectedOptions = await page
      .locator('#parent_category_id')
      .locator('option:checked')
      .allTextContents();
    expect(selectedOptions.at(0)).toEqual(parent);
  };

  test.beforeEach(async ({ page }) => {
    await applyFixture('accounts-only');
    await page.goto('/settings/transaction-categories');
  });

  test('Verify category in fixture', async ({ page }) => {
    await expect(page.getByTestId('category-parent-row')).toHaveCount(3);
    await expect(page.getByTestId('category-child-row')).toHaveCount(8);
  });

  // eslint-disable-next-line playwright/expect-expect
  test('Add category without visibility options and without parent', async ({
    page,
  }) => {
    await addCategoryAndVerifyDetails(page, []);
  });

  // eslint-disable-next-line playwright/expect-expect
  test('Add category with expense visibility', async ({ page }) => {
    await addCategoryAndVerifyDetails(page, ['expense']);
  });

  // eslint-disable-next-line playwright/expect-expect
  test('Add category with income visibility', async ({ page }) => {
    await addCategoryAndVerifyDetails(page, ['income']);
  });

  // eslint-disable-next-line playwright/expect-expect
  test('Add category with transfer visibility', async ({ page }) => {
    await addCategoryAndVerifyDetails(page, ['transfer']);
  });

  // eslint-disable-next-line playwright/expect-expect
  test('Add category with two visibilities', async ({ page }) => {
    await addCategoryAndVerifyDetails(page, ['income', 'transfer']);
  });

  // eslint-disable-next-line playwright/expect-expect
  test('Add category with all visibilities', async ({ page }) => {
    await addCategoryAndVerifyDetails(page, ['income', 'expense', 'transfer']);
  });

  // eslint-disable-next-line playwright/expect-expect
  test('Add category with all visibilities and parent', async ({ page }) => {
    await addCategoryAndVerifyDetails(
      page,
      ['income', 'expense', 'transfer'],
      'Invisible category'
    );
  });

  // eslint-disable-next-line playwright/expect-expect
  test('Add category without visibility options and with parent', async ({
    page,
  }) => {
    await addCategoryAndVerifyDetails(page, [], 'Category for all types');
  });
});
