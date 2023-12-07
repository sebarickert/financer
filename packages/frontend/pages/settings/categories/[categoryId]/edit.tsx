import { CategoryEditContainer } from '$container/categories/category.edit.container';
import { useViewTransitionRouter } from '$hooks/useViewTransitionRouter';

const CategoryEditPage = () => {
  const {
    query: { categoryId },
  } = useViewTransitionRouter();

  return <CategoryEditContainer id={categoryId as string} />;
};

export default CategoryEditPage;
