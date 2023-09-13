import { applyFixture } from '$utils/load-fixtures';
import { test, expect, Page } from '$utils/financer-page';

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

    await page.click(`[data-entity-title="${targetCategoryName}"]`);

    await page.waitForTimeout(500);

    await page.click('[data-testid="edit-transaction-category"]');

    await page.fill('#name', newName);

    let targetVisibility: string[]
    if (newVisibility) {
        targetVisibility = newVisibility;
        const checkedChecboxes = await page.$$eval('[data-testid="visibility-checkboxes"] input:checked', (inputs: HTMLInputElement[]) => inputs.map((input) => input.value));

        for(const visibilityItem of checkedChecboxes) {
            await page.click(`[data-testid="visibility-checkboxes"] label:has-text("${visibilityItem}")`);
        }

        for(const visibilityItem of newVisibility) {
            await page.click(`[data-testid="visibility-checkboxes"] label:has-text("${visibilityItem}")`);
        }
    } else {
        targetVisibility = await page.$$eval('[data-testid="visibility-checkboxes"] input:checked', (inputs: HTMLInputElement[]) => inputs.map((input) => input.id.replace('Visible', '')));
    }

    let targetParent: string
    if (parent) {
        targetParent = parent;
      await page.selectOption('#parent_category_id', parent);
    } else {
        targetParent = (await page.$eval(
        '#parent_category_id option:checked',
        (el) => el.textContent
      ));
    }

    await page.click('[data-testid="submit"]');

    await page.waitForTimeout(500);

    await page.click(`[data-entity-title="${newName}"]`);

    await page.click('[data-testid="edit-transaction-category"]');
    await expect(page.url()).toContain('/edit');

    await expect(page.locator('#name')).toHaveValue(newName);

    const incomeCheckbox = await page.$("#incomeVisible");
    const expenseCheckbox = await page.$("#expenseVisible");
    const transferCheckbox = await page.$("#transferVisible");

    expect(await incomeCheckbox?.isChecked()).toEqual(targetVisibility.includes('income'));
    expect(await expenseCheckbox?.isChecked()).toEqual(targetVisibility.includes('expense'));
    expect(await transferCheckbox?.isChecked()).toEqual(targetVisibility.includes('transfer'));


    const selectedOption = await page.$eval(
    '#parent_category_id option:checked',
    (el) => el.textContent
    );
    expect(selectedOption).toContain(targetParent);
  };

  test.beforeEach(async ({ page }) => {
    await applyFixture('accounts-only')
    await page.goto('/profile/transaction-categories');
    await page.waitForSelector('[data-testid=add-category]');
  });

  test('Change category name', async ({ page }) => {
    await editCategoryAndVerifyDetails(page, 'Income sub category', null, true);
  });

  test('Remove category visibility', async ({ page }) => {
    await editCategoryAndVerifyDetails(page, 'Category for all types', [], false);
  });

  test('Add category all visibility types', async ({ page }) => {
    await editCategoryAndVerifyDetails(page, 'Invisible category', ['income', 'expense', 'transfer'], false);
  });

  test('Unlink from parent category', async ({ page }) => {
    await editCategoryAndVerifyDetails(page, 'Expense sub category', null, false, 'None');
  });

  test('Add parent for category', async ({ page }) => {
    await editCategoryAndVerifyDetails(page, 'Invisible category', null, false, 'Category for all types');
  });

  test('Change category parent', async ({ page }) => {
    await editCategoryAndVerifyDetails(page, 'Income sub category', null, false, 'Income category');
  });

  test('Change all field', async ({ page }) => {
    await editCategoryAndVerifyDetails(page, 'Expense sub category', ['income'], true, 'Transfer category');
  });
});