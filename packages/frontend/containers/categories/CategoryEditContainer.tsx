import { notFound } from 'next/navigation';
import { FC } from 'react';

import { handleCategoryEdit } from '$actions/category/handleCategoryEdit';
import { settingsPaths } from '$constants/settings-paths';
import { CategoryForm } from '$features/category/CategoryForm';
import { SettingsLayout } from '$features/settings/SettingsLayout';
import { CategoryService } from '$ssr/api/CategoryService';

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
  const categories = await CategoryService.getAllWithTree();

  return (
    <SettingsLayout
      title="Edit Category"
      backLink={`${settingsPaths.categories}/${category.id}`}
    >
      <CategoryForm
        onSubmit={handleSubmit}
        submitLabel="Update"
        currentCategoryId={category.id}
        initialValues={category}
        transactionCategoriesWithCategoryTree={categories}
      />
    </SettingsLayout>
  );
};
