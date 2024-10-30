'use server';

import { redirect, RedirectType } from 'next/navigation';

import { settingsPaths } from '$constants/settings-paths';
import { TransactionTemplateService } from '$ssr/api/transaction-template.service';

export const handleTemplateDelete = async (id: string) => {
  if (!id) {
    console.error('Failed to delete template: no id');
    return;
  }

  await TransactionTemplateService.delete(id);
  redirect(settingsPaths.templates, RedirectType.push);
};
