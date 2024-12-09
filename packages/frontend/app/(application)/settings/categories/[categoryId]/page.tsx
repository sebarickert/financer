import { Metadata } from 'next';
import { FC } from 'react';

import { CategoryContainer } from '$container/categories/CategoryContainer';
import { CategoryService } from '$ssr/api/CategoryService';

type CategoryPageProps = {
  params: {
    categoryId: string;
  };
};

export const generateMetadata = async ({
  params: { categoryId },
}: CategoryPageProps): Promise<Metadata> => {
  const category = await CategoryService.getById(categoryId);

  return {
    title: `${category.name} / Categories`,
  };
};

const CategoryPage: FC<CategoryPageProps> = ({ params: { categoryId } }) => {
  return <CategoryContainer id={categoryId} />;
};

export default CategoryPage;
