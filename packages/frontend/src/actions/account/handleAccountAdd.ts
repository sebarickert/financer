'use server';

import { RedirectType, redirect } from 'next/navigation';

import { AccountType } from '$api/generated/financerApi';
import { ValidationException } from '$exceptions/validation.exception';
import { DefaultFormActionHandler } from '$hooks/useFinancerFormState';
import { AccountService } from '$ssr/api/AccountService';

export const handleAccountAdd: DefaultFormActionHandler = async (
  prevState,
  formData,
) => {
  try {
    await AccountService.add({
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

  redirect('/accounts', RedirectType.push);
};
