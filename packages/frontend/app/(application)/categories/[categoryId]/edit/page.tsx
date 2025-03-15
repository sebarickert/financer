import { Metadata } from 'next';

import { getCategoryById } from '@/api-service';
import { CategoryEditContainer } from '@/container/categories/CategoryEditContainer';
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
    title: `Edit ${category.name} / Categories`,
  };
};

const CategoryEditPage = async ({ params }: { params: Params }) => {
  const { categoryId } = await params;

  return <CategoryEditContainer id={categoryId} />;
};

export default CategoryEditPage;
