import { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { handleCategoryEdit } from '@/actions/category/handleCategoryEdit';
import { getAllCategoriesWithTree, getCategoryById } from '@/api-service';
import { CategoryForm } from '@/features/category/CategoryForm';
import { ContentHeader } from '@/layouts/ContentHeader';

type Params = Promise<{
  categoryId: string;
}>;

export const generateMetadata = async ({
  params,
}: {
  params: Params;
}): Promise<Metadata> => {
  const { categoryId } = await params;
  const category = await getCategoryById(categoryId);

  return {
    title: `Edit ${category.name}`,
  };
};

export default async function CategoryEditPage({ params }: { params: Params }) {
  const { categoryId } = await params;

  const category = await getCategoryById(categoryId);

  if (!category) {
    notFound();
  }

  const handleSubmit = handleCategoryEdit.bind(null, category);
  const categories = await getAllCategoriesWithTree();

  return (
    <>
      <ContentHeader
        title={`Edit ${category.name}`}
        breadcrumbOverrides={{
          [`/categories/${categoryId}`]: category.name,
        }}
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
