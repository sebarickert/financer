import { notFound, redirect, RedirectType } from 'next/navigation';
import { FC } from 'react';

import { TransactionType } from '$api/generated/financerApi';
import { settingsPaths } from '$constants/settings-paths';
import { ValidationException } from '$exceptions/validation.exception';
import { DefaultFormActionHandler } from '$hooks/useFinancerFormState';
import { CategoryService } from '$ssr/api/category.service';
import { CategoryEdit } from '$views/settings/categories/category.edit';

interface CategoryEditContainerProps {
  id: string;
}

export const CategoryEditContainer: FC<CategoryEditContainerProps> = async ({
  id,
}) => {
  const category = await CategoryService.getById(id);

  if (!category.id) {
    notFound();
  }

  const handleSubmit: DefaultFormActionHandler = async (prev, formData) => {
    'use server';

    try {
      await CategoryService.update(category.id, {
        name: formData.get('name') as string,
        parentCategoryId: formData.get('parentCategoryId') as string,
        visibility: formData.getAll('visibility') as TransactionType[],
      });
    } catch (error) {
      if (error instanceof ValidationException) {
        return { status: 'ERROR', errors: error.errors };
      }

      console.error(error);
      return { status: 'ERROR', errors: ['Something went wrong'] };
    }

    redirect(settingsPaths.categories, RedirectType.push);
  };

  const handleDelete = async () => {
    'use server';

    await CategoryService.delete(category.id);
    redirect(settingsPaths.categories, RedirectType.push);
  };

  return (
    <CategoryEdit
      onSubmit={handleSubmit}
      onDelete={handleDelete}
      category={category}
    />
  );
};
