import { useRouter } from 'next/router';

import { CategoryContainer } from '$container/categories/category.container';

const CategoryPage = () => {
  const {
    query: { categoryId },
  } = useRouter();

  return <CategoryContainer id={categoryId as string} />;
};

export default CategoryPage;
