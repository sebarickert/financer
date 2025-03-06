'use server';

import { RedirectType, redirect } from 'next/navigation';

import { DefaultFormActionHandler } from '@/hooks/useFinancerFormState';
import { TransactionTemplateService } from '@/ssr/api/TransactionTemplateService';

export const handleTemplateDelete: DefaultFormActionHandler<{
  id: string;
}> = async ({ id }) => {
  if (!id) {
    return { status: 'ERROR', errors: ['Failed to delete template: no id'] };
  }

  await TransactionTemplateService.delete(id);
  redirect('/templates', RedirectType.push);
};
