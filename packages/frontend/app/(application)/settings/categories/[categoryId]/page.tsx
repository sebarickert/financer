import { Metadata } from 'next';
import { FC } from 'react';

import { CategoryContainer } from '$container/categories/CategoryContainer';

// TODO change to dynamic title
export const metadata: Metadata = {
  title: 'Category Details',
};

type CategoryPageProps = {
  params: {
    categoryId: string;
  };
};

const CategoryPage: FC<CategoryPageProps> = ({ params: { categoryId } }) => {
  return <CategoryContainer id={categoryId} />;
};

export default CategoryPage;
