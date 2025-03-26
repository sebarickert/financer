import { notFound } from 'next/navigation';
import { FC } from 'react';

import { handleCategoryEdit } from '@/actions/category/handleCategoryEdit';
import { getAllCategoriesWithTree, getCategoryById } from '@/api-service';
import { CategoryForm } from '@/features/category/CategoryForm';
import { Layout } from '@/layouts/Layout';
interface CategoryEditContainerProps {
  id: string;
}

export const CategoryEditContainer: FC<CategoryEditContainerProps> = async ({
  id,
}) => {
  const category = await getCategoryById(id);

  if (!category.id) {
    notFound();
  }

  const handleSubmit = handleCategoryEdit.bind(null, category);
  const categories = await getAllCategoriesWithTree();

  return (
    <Layout title="Edit Category" backLink={`/categories/${category.id}`}>
      <CategoryForm
        onSubmit={handleSubmit}
        submitLabel="Update"
        currentCategoryId={category.id}
        initialValues={category}
        transactionCategoriesWithCategoryTree={categories}
      />
    </Layout>
  );
};
