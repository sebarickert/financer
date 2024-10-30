import { Metadata } from 'next';
import { FC } from 'react';

import { CategoryEditContainer } from '$container/categories/CategoryEditContainer';

// TODO change to dynamic title
export const metadata: Metadata = {
  title: 'Edit Category',
};

type CategoryEditPageProps = {
  params: {
    categoryId: string;
  };
};

const CategoryEditPage: FC<CategoryEditPageProps> = ({
  params: { categoryId },
}) => {
  return <CategoryEditContainer id={categoryId} />;
};

export default CategoryEditPage;
