import { Metadata } from 'next';
import { FC } from 'react';

import { CategoryContainer } from '$container/categories/category.container';
import { Layout } from '$layouts/Layout';

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
  return (
    <Layout title="Category Details">
      <CategoryContainer id={categoryId} />
    </Layout>
  );
};

export default CategoryPage;
