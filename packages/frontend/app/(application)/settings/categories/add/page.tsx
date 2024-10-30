import { Metadata } from 'next';

import { CategoryAddContainer } from '$container/categories/CategoryAddContainer';

export const metadata: Metadata = {
  title: 'Add Category',
};

const CategoryAddPage = () => {
  return <CategoryAddContainer />;
};

export default CategoryAddPage;
