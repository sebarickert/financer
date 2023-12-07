import { CategoryContainer } from '$container/categories/category.container';
import { useViewTransitionRouter } from '$hooks/useViewTransitionRouter';

const CategoryPage = () => {
  const {
    query: { categoryId },
  } = useViewTransitionRouter();

  return <CategoryContainer id={categoryId as string} />;
};

export default CategoryPage;
