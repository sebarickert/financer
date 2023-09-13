import { applyFixture } from '$utils/load-fixtures';
import { test, expect, Page } from '$utils/financer-page';

test.describe('Transaction category form', () => {
    test.beforeEach(async ({ page }) => {
        await applyFixture('accounts-only')
        await page.goto('/profile/transaction-categories/add');
        await page.waitForSelector('#name');
    });
    
    test('Should not allow set child category as parent', async ({page}) => {
        await page.goto(
            '/profile/transaction-categories/623b58ada3deba9879422fbf/edit'
        );

        const categoryName = 'Category for all types';

        // Verify that we have correct category
        // await expect(page).toHaveSelectorValue('#name', categoryName);
        await page.waitForSelector('#name');
        expect(await page.$eval('#name', (el:HTMLInputElement) => el.value)).toEqual(categoryName);

        const parentCategoryOptions = await page.$$('#parent_category_id option');
        const parentCategoryOptionTexts = await Promise.all(
            parentCategoryOptions.map((option) => option.textContent())
        );
        expect(parentCategoryOptionTexts).not.toContain(categoryName);

        await page.evaluate(() => {
            const categoryName = 'Category for all types';
            const childCategoryId = '623b6b84a3deba9879422fdd';
            const targetElement = document.querySelector("#parent_category_id");
            targetElement.innerHTML = targetElement.innerHTML + `<option value="${childCategoryId}">${categoryName}</option>`;
          });
    

        await page.selectOption('#parent_category_id', categoryName);

        await page.getByTestId("submit").click();

        await expect(page.getByTestId("form-errors")).toContainText(
            'There were 1 errors with your submission'
        );
        await expect(page.getByTestId("form-errors")).toContainText(
            'Parent category cannot be child category of current item.'
        );
    });
});