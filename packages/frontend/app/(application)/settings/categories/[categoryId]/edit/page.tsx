import { Metadata } from 'next';
import { FC } from 'react';

import { CategoryEditContainer } from '$container/categories/CategoryEditContainer';
import { CategoryService } from '$ssr/api/CategoryService';

type CategoryEditPageProps = {
  params: {
    categoryId: string;
  };
};

export const generateMetadata = async ({
  params: { categoryId },
}: CategoryEditPageProps): Promise<Metadata> => {
  const category = await CategoryService.getById(categoryId);

  return {
    title: `Edit ${category.name} / Categories`,
  };
};

const CategoryEditPage: FC<CategoryEditPageProps> = ({
  params: { categoryId },
}) => {
  return <CategoryEditContainer id={categoryId} />;
};

export default CategoryEditPage;
