import { handleCategoryAdd } from '$actions/category/handleCategoryAdd';
import { CategoryForm } from '$features/category/CategoryForm';
import { Layout } from '$layouts/Layout';
import { CategoryService } from '$ssr/api/CategoryService';

export const CategoryAddContainer = async () => {
  const categories = await CategoryService.getAllWithTree();

  return (
    <Layout title="Add Category" backLink={'/categories'}>
      <CategoryForm
        onSubmit={handleCategoryAdd}
        submitLabel="Add"
        transactionCategoriesWithCategoryTree={categories}
      />
    </Layout>
  );
};
