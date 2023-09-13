import { applyFixture } from '$utils/load-fixtures';
import { test, expect, Page } from '$utils/financer-page';

test.describe('Transaction category creation', () => {
  const addCategoryAndVerifyDetails = async (
    page: Page,
    visibility: string[] = [],
    parent = 'None'
  ) => {
    const newName = `New Test ${visibility.join(', ') || 'invisible'} category - ${crypto.randomUUID()}`;


    const parentRowBefore = await page.$(`[data-testid="category-parent-row"]:has-text("${newName}")`);
    expect(parentRowBefore).toBeNull();
    const childRowAfter = await page.$(`[data-testid="category-child-row"]:has-text("${newName}")`);
    expect(childRowAfter).toBeNull();

    await page.waitForTimeout(100);

    await page.getByTestId("add-category").click();

    await page.fill('#name', newName);

    for (const visibilityItem of visibility) {
      await page
        .getByTestId("visibility-checkboxes")
        .getByText(visibilityItem, { exact: false })
        .check();
    }

    await page.selectOption('#parent_category_id', parent);

    await page.getByTestId("submit").click();
    await expect(page).not.toHaveURL('/add');

    await page.waitForTimeout(500);

    await page.getByText(newName).first().click();

    await page.getByTestId("edit-transaction-category").click();

    await page.waitForSelector('#name');
    const name = await page.$eval('#name', (el:HTMLInputElement) => el.value);
    expect(name).toEqual(newName);

    const incomeCheckbox = await page.$("#incomeVisible");
    const expenseCheckbox = await page.$("#expenseVisible");
    const transferCheckbox = await page.$("#transferVisible");

    expect(await incomeCheckbox?.isChecked()).toEqual(visibility.includes('income'));
    expect(await expenseCheckbox?.isChecked()).toEqual(visibility.includes('expense'));
    expect(await transferCheckbox?.isChecked()).toEqual(visibility.includes('transfer'));

    expect(page.$("#parent_category_id option")).not.toContain(newName);


    const selectedOptions = await page.$$eval(
        '#parent_category_id option:checked',
        (options) => options.map((option) => option.textContent)
      );
    expect(selectedOptions.at(0)).toEqual(parent);
  };

  test.beforeEach(async ({page}) => {
    applyFixture('accounts-only')
    await page.goto('/profile/transaction-categories');
    await page.waitForSelector('[data-testid=add-category]');
  });

  test('Verify category in fixture', async ({page}) => {
    expect(await page.getByTestId("category-parent-row").all()).toHaveLength(3);
    expect(await page.getByTestId("category-child-row").all()).toHaveLength(8);
  });

  test('Add category without visibility options and without parent', async ({page}) => {
    await addCategoryAndVerifyDetails(page, []);
  });

  test('Add category with expense visibility', async ({page}) => {
    await addCategoryAndVerifyDetails(page, ['expense']);
  });

  test('Add category with income visibility', async ({page}) => {
    await addCategoryAndVerifyDetails(page, ['income']);
  });

  test('Add category with transfer visibility', async ({page}) => {
    await addCategoryAndVerifyDetails(page, ['transfer']);
  });

  test('Add category with two visibilities', async ({page}) => {
    await addCategoryAndVerifyDetails(page, ['income', 'transfer']);
  });

  test('Add category with all visibilities', async ({page}) => {
    await addCategoryAndVerifyDetails(page, ['income', 'expense', 'transfer']);
  });

  test('Add category with all visibilities and parent', async ({page}) => {
    await addCategoryAndVerifyDetails(page, ['income', 'expense', 'transfer'], 'Invisible category');
  });

  test('Add category without visibility options and with parent', async ({page}) => {
    await addCategoryAndVerifyDetails(page, [], 'Category for all types');
  });
});