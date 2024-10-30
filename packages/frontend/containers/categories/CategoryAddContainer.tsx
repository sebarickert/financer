import { handleCategoryAdd } from '$actions/category/handleCategoryAdd';
import { settingsPaths } from '$constants/settings-paths';
import { CategoryForm } from '$features/category/CategoryForm';
import { Layout } from '$layouts/Layout';

export const CategoryAddContainer = () => {
  return (
    <Layout title="Add Category" backLink={settingsPaths.categories}>
      <CategoryForm onSubmit={handleCategoryAdd} submitLabel="Add" />
    </Layout>
  );
};
