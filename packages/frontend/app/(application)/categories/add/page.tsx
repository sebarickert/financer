import { Metadata } from 'next';

import { handleCategoryAdd } from '@/actions/category/handleCategoryAdd';
import { getAllCategoriesWithTree } from '@/api-service';
import { CategoryForm } from '@/features/category/CategoryForm';
import { ContentHeader } from '@/layouts/ContentHeader';

export const metadata: Metadata = {
  title: 'Add Category',
};

export default async function CategoryAddPage() {
  const categories = await getAllCategoriesWithTree();

  return (
    <>
      <ContentHeader title="Add Category" />
      <CategoryForm
        onSubmit={handleCategoryAdd}
        submitLabel="Add"
        transactionCategoriesWithCategoryTree={categories}
      />
    </>
  );
}
