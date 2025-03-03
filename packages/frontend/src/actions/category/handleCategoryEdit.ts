'use server';

import { RedirectType, redirect } from 'next/navigation';

import {
  SchemaTransactionCategoryDto,
  TransactionType,
} from '@/api/ssr-financer-api';
import { ValidationException } from '@/exceptions/validation.exception';
import { DefaultFormActionHandler } from '@/hooks/useFinancerFormState';
import { CategoryService } from '@/ssr/api/CategoryService';

export const handleCategoryEdit: DefaultFormActionHandler<
  SchemaTransactionCategoryDto
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

  redirect(`/categories/${category.id}`, RedirectType.push);
};
