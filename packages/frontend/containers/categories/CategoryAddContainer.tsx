import { handleCategoryAdd } from '$actions/category/handleCategoryAdd';
import { settingsPaths } from '$constants/settings-paths';
import { Layout } from '$layouts/Layout';
import { CategoryForm } from '$modules/category/CategoryForm';

export const CategoryAddContainer = () => {
  return (
    <Layout title="Add Category" backLink={settingsPaths.categories}>
      <CategoryForm onSubmit={handleCategoryAdd} submitLabel="Add" />
    </Layout>
  );
};
