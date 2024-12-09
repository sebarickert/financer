'use server';

import { redirect, RedirectType } from 'next/navigation';

import { settingsPaths } from '$constants/settings-paths';
import { DefaultFormActionHandler } from '$hooks/useFinancerFormState';
import { TransactionTemplateService } from '$ssr/api/TransactionTemplateService';

export const handleTemplateDelete: DefaultFormActionHandler<{
  id: string;
}> = async ({ id }) => {
  if (!id) {
    return { status: 'ERROR', errors: ['Failed to delete template: no id'] };
  }

  await TransactionTemplateService.delete(id);
  redirect(settingsPaths.templates, RedirectType.push);
};
