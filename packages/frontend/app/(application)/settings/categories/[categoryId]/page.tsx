import { Metadata } from 'next';

import { CategoryContainer } from '$container/categories/CategoryContainer';
import { CategoryService } from '$ssr/api/category.service';

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
    title: `${category.name} / Categories`,
  };
};

const CategoryPage = async ({ params }: { params: Params }) => {
  const { categoryId } = await params;

  return <CategoryContainer id={categoryId} />;
};

export default CategoryPage;
