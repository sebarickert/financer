import { useRouter } from 'next/router';

import { EditCategoryContainer } from '$container/categories/edit-category.container';

const EditCategoryPage = () => {
  const {
    query: { categoryId },
  } = useRouter();

  return <EditCategoryContainer id={categoryId as string} />;
};

export default EditCategoryPage;
