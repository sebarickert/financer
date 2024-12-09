import { handleCategoryAdd } from '$actions/category/handleCategoryAdd';
import { settingsPaths } from '$constants/settings-paths';
import { CategoryForm } from '$features/category/CategoryForm';
import { SettingsLayout } from '$features/settings/SettingsLayout';
import { CategoryService } from '$ssr/api/CategoryService';

export const CategoryAddContainer = async () => {
  const categories = await CategoryService.getAllWithTree();

  return (
    <SettingsLayout title="Add Category" backLink={settingsPaths.categories}>
      <CategoryForm
        onSubmit={handleCategoryAdd}
        submitLabel="Add"
        transactionCategoriesWithCategoryTree={categories}
      />
    </SettingsLayout>
  );
};
