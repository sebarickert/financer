import { Metadata } from 'next';
import { FC } from 'react';

import { CategoryEditContainer } from '$container/categories/category.edit.container';
import { Layout } from '$layouts/layout/layout';

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
  return (
    <Layout title="Edit Category">
      <CategoryEditContainer id={categoryId} />
    </Layout>
  );
};

export default CategoryEditPage;
