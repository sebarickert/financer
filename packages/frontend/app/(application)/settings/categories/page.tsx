import { Metadata } from 'next';

import { CategoryListingContainer } from '$container/categories/category.listing.container';
import { Layout } from '$layouts/layout/layout';

export const metadata: Metadata = {
  title: 'Categories',
};

const CategoryListingPage = () => {
  return (
    <Layout title="Categories">
      <CategoryListingContainer />
    </Layout>
  );
};

export default CategoryListingPage;
