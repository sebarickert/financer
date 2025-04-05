'use server';

import { RedirectType, redirect } from 'next/navigation';

import { deleteTransactionTemplate } from '@/api-service';
import { DefaultFormActionHandler } from '@/hooks/useFinancerFormState';

export const handleTemplateDelete: DefaultFormActionHandler<{
  id: string;
}> = async ({ id }) => {
  if (!id) {
    return { status: 'ERROR', errors: ['Failed to delete template: no id'] };
  }

  await deleteTransactionTemplate(id);
  redirect('/templates', RedirectType.push);
};
