'use server';

import { RedirectType, redirect } from 'next/navigation';

import { AccountType, SchemaAccountDto } from '@/api/ssr-financer-api';
import { ValidationException } from '@/exceptions/validation.exception';
import { DefaultFormActionHandler } from '@/hooks/useFinancerFormState';
import { AccountService } from '@/ssr/api/AccountService';

export const handleAccountEdit: DefaultFormActionHandler<
  SchemaAccountDto
> = async (account, prevState, formData) => {
  if (!account.id) {
    return { status: 'ERROR', errors: ['Account not found'] };
  }

  try {
    await AccountService.update(account.id, {
      balance: parseFloat(formData.get('balance') as string),
      name: formData.get('name') as string,
      type: formData.get('type') as AccountType,
    });
  } catch (error) {
    if (error instanceof ValidationException) {
      return { status: 'ERROR', errors: error.errors };
    }

    console.error(error);
    return { status: 'ERROR', errors: ['Something went wrong'] };
  }

  redirect(`/accounts/${account.id}`, RedirectType.push);
};
