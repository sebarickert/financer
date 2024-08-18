import { FC } from 'react';

import { CategoryEditContainer } from '$container/categories/category.edit.container';

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
