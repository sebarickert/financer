import { redirect, RedirectType } from 'next/navigation';
import { FC } from 'react';

import { AccountType } from '$api/generated/financerApi';
import { ValidationException } from '$exceptions/validation.exception';
import { DefaultFormActionHandler } from '$hooks/useFinancerFormState';
import { AccountService } from '$ssr/api/account.service';
import { AccountEdit } from '$views/accounts/account.edit';

interface AccountEditContainerProps {
  id: string;
}

export const AccountEditContainer: FC<AccountEditContainerProps> = async ({
  id,
}) => {
  const account = await AccountService.getById(id);

  const handleSubmit: DefaultFormActionHandler = async (
    prevState,
    formData,
  ) => {
    'use server';

    if (!account?.id) {
      return { status: 'error', errors: ['Account not found'] };
    }

    try {
      await AccountService.update(account.id, {
        balance: parseInt(formData.get('balance') as string),
        name: formData.get('name') as string,
        type: formData.get('type') as AccountType,
      });
    } catch (error) {
      if (error instanceof ValidationException) {
        return { status: 'error', errors: error.errors };
      }

      console.error(error);
      return { status: 'error', errors: ['Something went wrong'] };
    }

    redirect(`/accounts/${id}`, RedirectType.push);
  };

  if (!account) {
    throw new Error('Account not found');
  }

  return <AccountEdit account={account} onSave={handleSubmit} />;
};
