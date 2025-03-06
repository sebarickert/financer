import { Metadata } from 'next';
import { FC } from 'react';

import { CategoryListingContainer } from '@/container/categories/CategoryListingContainer';

export const metadata: Metadata = {
  title: 'Categories',
};

const CategoryListingPage: FC = () => {
  return <CategoryListingContainer />;
};

export default CategoryListingPage;
