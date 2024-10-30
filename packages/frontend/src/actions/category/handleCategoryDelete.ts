'use server';

import { redirect, RedirectType } from 'next/navigation';

import { settingsPaths } from '$constants/settings-paths';
import { CategoryService } from '$ssr/api/category.service';

export const handleCategoryDelete = async (id: string) => {
  await CategoryService.delete(id);
  redirect(settingsPaths.categories, RedirectType.push);
};
