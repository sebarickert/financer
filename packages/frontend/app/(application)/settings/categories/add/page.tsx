import { Metadata } from 'next';

import { CategoryAddContainer } from '$container/categories/category.add.container';
import { Layout } from '$layouts/Layout';

export const metadata: Metadata = {
  title: 'Add Category',
};

const CategoryAddPage = () => {
  return (
    <Layout title="Add Category">
      <CategoryAddContainer />
    </Layout>
  );
};

export default CategoryAddPage;
