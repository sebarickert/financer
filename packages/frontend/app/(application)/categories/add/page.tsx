import { Metadata } from 'next';

import { handleCategoryAdd } from '@/actions/category/handleCategoryAdd';
import { CategoryForm } from '@/features/category/CategoryForm';
import { ContentHeader } from '@/layouts/ContentHeader';
import { CategoryService } from '@/ssr/api/CategoryService';

export const metadata: Metadata = {
  title: 'Add Category',
};

export default async function CategoryAddPage() {
  const categories = await CategoryService.getAllWithTree();

  return (
    <>
      <ContentHeader title="Add Category" backLink={'/categories'} />
      <CategoryForm
        onSubmit={handleCategoryAdd}
        submitLabel="Add"
        transactionCategoriesWithCategoryTree={categories}
      />
    </>
  );
}
