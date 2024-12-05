import { handleCategoryAdd } from '$actions/category/handleCategoryAdd';
import { settingsPaths } from '$constants/settings-paths';
import { CategoryForm } from '$features/category/CategoryForm';
import { SettingsLayout } from '$features/settings/SettingsLayout';

export const CategoryAddContainer = () => {
  return (
    <SettingsLayout title="Add Category" backLink={settingsPaths.categories}>
      <CategoryForm onSubmit={handleCategoryAdd} submitLabel="Add" />
    </SettingsLayout>
  );
};
