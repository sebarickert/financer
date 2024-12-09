import { handleTemplateAdd } from '$actions/template/handleTemplateAdd';
import { settingsPaths } from '$constants/settings-paths';
import { SettingsLayout } from '$features/settings/SettingsLayout';
import { TemplateForm } from '$features/template/TemplateForm';
import { CategoryService } from '$ssr/api/CategoryService';

export const TemplateAddContainer = async () => {
  const categories = await CategoryService.getAllWithTree();

  return (
    <SettingsLayout title="Add Template" backLink={settingsPaths.templates}>
      <TemplateForm
        onSubmit={handleTemplateAdd}
        submitLabel="Add"
        transactionCategoriesWithCategoryTree={categories}
      />
    </SettingsLayout>
  );
};
