import { RedirectType, redirect } from 'next/navigation';

import { TransactionType } from '$api/generated/financerApi';
import { ValidationException } from '$exceptions/validation.exception';
import { DefaultFormActionHandler } from '$hooks/useFinancerFormState';
import { CategoryService } from '$ssr/api/CategoryService';

export const handleCategoryAdd: DefaultFormActionHandler = async (
  prev,
  formData,
) => {
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

  redirect('/categories', RedirectType.push);
};
