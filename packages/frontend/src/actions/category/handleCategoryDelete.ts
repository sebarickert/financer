'use server';

import { RedirectType, redirect } from 'next/navigation';

import { deleteCategory } from '@/api-service';
import { DefaultFormActionHandler } from '@/hooks/useFinancerFormState';

export const handleCategoryDelete: DefaultFormActionHandler<{
  id: string;
}> = async ({ id }) => {
  if (!id) {
    return { status: 'ERROR', errors: ['Failed to delete category: no id'] };
  }

  await deleteCategory(id);

  redirect('/categories', RedirectType.push);
};
