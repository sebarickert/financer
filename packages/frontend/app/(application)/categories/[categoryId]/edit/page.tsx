import { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { handleCategoryEdit } from '@/actions/category/handleCategoryEdit';
import { CategoryForm } from '@/features/category/CategoryForm';
import { ContentHeader } from '@/layouts/ContentHeader';
import { CategoryService } from '@/ssr/api/CategoryService';

type Params = Promise<{
  categoryId: string;
}>;

export const generateMetadata = async ({
  params,
}: {
  params: Params;
}): Promise<Metadata> => {
  const { categoryId } = await params;
  const category = await CategoryService.getById(categoryId);

  return {
    title: `Edit ${category.name}`,
  };
};

export default async function CategoryEditPage({ params }: { params: Params }) {
  const { categoryId } = await params;

  const category = await CategoryService.getById(categoryId);

  if (!category) {
    notFound();
  }

  const handleSubmit = handleCategoryEdit.bind(null, category);
  const categories = await CategoryService.getAllWithTree();

  return (
    <>
      <ContentHeader
        title="Edit Category"
        backLink={`/categories/${category.id}`}
      />
      <CategoryForm
        onSubmit={handleSubmit}
        submitLabel="Update"
        currentCategoryId={category.id}
        initialValues={category}
        transactionCategoriesWithCategoryTree={categories}
      />
    </>
  );
}
