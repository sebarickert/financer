import { test, expect, Page } from '$utils/financer-page';
import { applyFixture } from '$utils/load-fixtures';

test.describe('Edit transaction category', () => {
  const editCategoryAndVerifyDetails = async (
    page: Page,
    targetCategoryName: string,
    newVisibility: string[] | null = null,
    shouldNameChange = false,
    parent: string | null = null
  ) => {
    const newName = shouldNameChange
      ? `Changed Test ${newVisibility?.join(', ') || 'invisible'} category`
      : targetCategoryName;

    await page.locator(`[data-entity-title="${targetCategoryName}"]`).click();
    await page.getByTestId('edit-transaction-category').click();

    await page.locator('#name').fill(newName);

    let targetVisibility: string[];
    if (newVisibility) {
      targetVisibility = newVisibility;
      const checkedChecboxes = await page
        .getByTestId('visibility-checkboxes')
        .locator('input:checked')
        .evaluateAll((inputs: HTMLInputElement[]) =>
          inputs.map((input) => input.value)
        );

      for (const visibilityItem of checkedChecboxes) {
        await page
          .getByTestId('visibility-checkboxes')
          .getByText(visibilityItem)
          .click();
      }

      for (const visibilityItem of newVisibility) {
        await page
          .getByTestId('visibility-checkboxes')
          .getByText(visibilityItem)
          .click();
      }
    } else {
      targetVisibility = await page
        .getByTestId('visibility-checkboxes')
        .locator('input:checked')
        .evaluateAll((inputs: HTMLInputElement[]) =>
          inputs.map((input) => input.id.replace('Visible', ''))
        );
    }

    let targetParent: string;
    if (parent) {
      targetParent = parent;
      await page.locator('#parent_category_id').selectOption(parent);
    } else {
      targetParent = await page
        .locator('#parent_category_id')
        .locator('option:checked')
        .textContent();
    }

    await page.getByTestId('submit').click();

    await page.locator(`[data-entity-title="${newName}"]`).click();

    await page.getByTestId("edit-transaction-category").click();

    await expect(page.locator('#name')).toHaveValue(newName);

    const incomeCheckbox = page.locator('#incomeVisible');
    const expenseCheckbox = page.locator('#expenseVisible');
    const transferCheckbox = page.locator('#transferVisible');

    expect(await incomeCheckbox?.isChecked()).toEqual(
      targetVisibility.includes('income')
    );
    expect(await expenseCheckbox?.isChecked()).toEqual(
      targetVisibility.includes('expense')
    );
    expect(await transferCheckbox?.isChecked()).toEqual(
      targetVisibility.includes('transfer')
    );

    const selectedOption = await page
      .locator('#parent_category_id')
      .locator('option:checked')
      .textContent();
    expect(selectedOption).toContain(targetParent);
  };

  test.beforeEach(async ({ page }) => {
    await applyFixture('accounts-only');
    await page.goto('/profile/transaction-categories');
  });

  // eslint-disable-next-line playwright/expect-expect
  test('Change category name', async ({ page }) => {
    await editCategoryAndVerifyDetails(page, 'Income sub category', null, true);
  });

  // eslint-disable-next-line playwright/expect-expect
  test('Remove category visibility', async ({ page }) => {
    await editCategoryAndVerifyDetails(
      page,
      'Category for all types',
      [],
      false
    );
  });

  // eslint-disable-next-line playwright/expect-expect
  test('Add category all visibility types', async ({ page }) => {
    await editCategoryAndVerifyDetails(
      page,
      'Invisible category',
      ['income', 'expense', 'transfer'],
      false
    );
  });

  // eslint-disable-next-line playwright/expect-expect
  test('Unlink from parent category', async ({ page }) => {
    await editCategoryAndVerifyDetails(
      page,
      'Expense sub category',
      null,
      false,
      'None'
    );
  });

  // eslint-disable-next-line playwright/expect-expect
  test('Add parent for category', async ({ page }) => {
    await editCategoryAndVerifyDetails(
      page,
      'Invisible category',
      null,
      false,
      'Category for all types'
    );
  });

  // eslint-disable-next-line playwright/expect-expect
  test('Change category parent', async ({ page }) => {
    await editCategoryAndVerifyDetails(
      page,
      'Income sub category',
      null,
      false,
      'Income category'
    );
  });

  // eslint-disable-next-line playwright/expect-expect
  test('Change all field', async ({ page }) => {
    await editCategoryAndVerifyDetails(
      page,
      'Expense sub category',
      ['income'],
      true,
      'Transfer category'
    );
  });
});
