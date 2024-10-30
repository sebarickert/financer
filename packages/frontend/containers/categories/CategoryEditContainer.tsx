import { notFound } from 'next/navigation';
import { FC } from 'react';

import { handleCategoryEdit } from '$actions/category/handleCategoryEdit';
import { settingsPaths } from '$constants/settings-paths';
import { Layout } from '$layouts/Layout';
import { CategoryForm } from '$modules/category/CategoryForm';
import { CategoryService } from '$ssr/api/category.service';

type CategoryEditContainerProps = {
  id: string;
};

export const CategoryEditContainer: FC<CategoryEditContainerProps> = async ({
  id,
}) => {
  const category = await CategoryService.getById(id);

  if (!category.id) {
    notFound();
  }

  const handleSubmit = handleCategoryEdit.bind(null, category);

  return (
    <Layout
      title="Edit Category"
      backLink={`${settingsPaths.categories}/${category.id}`}
    >
      <CategoryForm
        onSubmit={handleSubmit}
        submitLabel="Update"
        currentCategoryId={category.id}
        initialValues={category}
      />
    </Layout>
  );
};
