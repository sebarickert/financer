import { FC } from 'react';

import { CategoryContainer } from '$container/categories/category.container';

type CategoryPageProps = {
  params: {
    categoryId: string;
  };
};

const CategoryPage: FC<CategoryPageProps> = ({ params: { categoryId } }) => {
  return <CategoryContainer id={categoryId} />;
};

export default CategoryPage;
