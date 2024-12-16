'use server';

import { redirect, RedirectType } from 'next/navigation';

import { DefaultFormActionHandler } from '$hooks/useFinancerFormState';
import { CategoryService } from '$ssr/api/CategoryService';

export const handleCategoryDelete: DefaultFormActionHandler<{
  id: string;
}> = async ({ id }) => {
  if (!id) {
    return { status: 'ERROR', errors: ['Failed to delete category: no id'] };
  }

  await CategoryService.delete(id);

  redirect('/categories', RedirectType.push);
};
