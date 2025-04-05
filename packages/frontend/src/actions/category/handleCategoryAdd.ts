import { RedirectType, redirect } from 'next/navigation';

import { TransactionType } from '@/api/ssr-financer-api';
import { addCategory } from '@/api-service';
import { ValidationException } from '@/exceptions/validation.exception';
import { DefaultFormActionHandler } from '@/hooks/useFinancerFormState';

export const handleCategoryAdd: DefaultFormActionHandler = async (
  prev,
  formData,
) => {
  'use server';

  try {
    await addCategory({
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
