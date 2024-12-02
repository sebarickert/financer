'use server';

import { redirect, RedirectType } from 'next/navigation';

import { settingsPaths } from '$constants/settings-paths';
import { DefaultFormActionHandler } from '$hooks/useFinancerFormState';
import { CategoryService } from '$ssr/api/category.service';

export const handleCategoryDelete: DefaultFormActionHandler<{
  id: string;
}> = async ({ id }) => {
  if (!id) {
    return { status: 'ERROR', errors: ['Failed to delete category: no id'] };
  }

  await CategoryService.delete(id);

  redirect(settingsPaths.categories, RedirectType.push);
};
