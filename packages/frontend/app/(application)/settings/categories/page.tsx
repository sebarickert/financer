import { Metadata } from 'next';
import { FC } from 'react';

import { CategoryListingContainer } from '$container/categories/category.listing.container';
import { Layout } from '$layouts/layout/layout';

export const metadata: Metadata = {
  title: 'Categories',
};

const CategoryListingPage: FC = () => {
  return (
    <Layout title="Categories">
      <CategoryListingContainer />
    </Layout>
  );
};

export default CategoryListingPage;
