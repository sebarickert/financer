import { Metadata } from 'next';

import { CategoryEditContainer } from '@/container/categories/CategoryEditContainer';
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
    title: `Edit ${category.name} / Categories`,
  };
};

const CategoryEditPage = async ({ params }: { params: Params }) => {
  const { categoryId } = await params;

  return <CategoryEditContainer id={categoryId} />;
};

export default CategoryEditPage;
