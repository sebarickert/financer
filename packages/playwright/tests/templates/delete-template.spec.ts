import { applyFixture } from '@/utils/applyFixture';
import { expect, test } from '@/utils/financer-page';
import { deleteTemplate } from '@/utils/template/deleteTemplate';
import { getTemplateDataFromTemplateList } from '@/utils/template/getTemplateDataFromTemplateList';

test.describe('Delete Template', () => {
  test.beforeEach(async ({ page }) => {
    await applyFixture();
    await page.goto('/templates');
  });

  test('should delete template and verify it is removed from the list', async ({
    page,
  }) => {
    const initialTemplates = await getTemplateDataFromTemplateList(page);

    await page.getByText(initialTemplates[0]).click();

    await deleteTemplate(page);

    const updatedTemplates = await getTemplateDataFromTemplateList(page);

    expect(updatedTemplates.length).toBeLessThan(initialTemplates.length);
    expect(updatedTemplates).not.toContain(initialTemplates[0]);
  });
});
