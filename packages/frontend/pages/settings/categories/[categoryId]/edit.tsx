import { EditCategoryContainer } from '$container/categories/edit-category.container';
import { useViewTransitionRouter } from '$hooks/useViewTransitionRouter';

const EditCategoryPage = () => {
  const {
    query: { categoryId },
  } = useViewTransitionRouter();

  return <EditCategoryContainer id={categoryId as string} />;
};

export default EditCategoryPage;
