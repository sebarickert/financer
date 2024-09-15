import { redirect, RedirectType } from 'next/navigation';

import { TransactionType } from '$api/generated/financerApi';
import { settingsPaths } from '$constants/settings-paths';
import { ValidationException } from '$exceptions/validation.exception';
import { DefaultFormActionHandler } from '$hooks/useFinancerFormState';
import { CategoryService } from '$ssr/api/category.service';
import { CategoryAdd } from '$views/settings/categories/category.add';

export const CategoryAddContainer = () => {
  const handleSubmit: DefaultFormActionHandler = async (prev, formData) => {
    'use server';

    try {
      await CategoryService.add({
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

  return <CategoryAdd onSubmit={handleSubmit} />;
};
