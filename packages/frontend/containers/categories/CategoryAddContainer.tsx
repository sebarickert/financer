import { handleCategoryAdd } from '@/actions/category/handleCategoryAdd';
import { getAllCategoriesWithTree } from '@/api-service';
import { CategoryForm } from '@/features/category/CategoryForm';
import { Layout } from '@/layouts/Layout';

export const CategoryAddContainer = async () => {
  const categories = await getAllCategoriesWithTree();

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
