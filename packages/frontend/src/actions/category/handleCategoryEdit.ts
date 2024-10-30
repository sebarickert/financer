'use server';

import { redirect, RedirectType } from 'next/navigation';

import {
  TransactionCategoryDto,
  TransactionType,
} from '$api/generated/financerApi';
import { settingsPaths } from '$constants/settings-paths';
import { ValidationException } from '$exceptions/validation.exception';
import { DefaultFormActionHandler } from '$hooks/useFinancerFormState';
import { CategoryService } from '$ssr/api/category.service';

export const handleCategoryEdit: DefaultFormActionHandler<
  TransactionCategoryDto
> = async (category, prev, formData) => {
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
