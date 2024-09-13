import { redirect, RedirectType } from 'next/navigation';

import { AccountType } from '$api/generated/financerApi';
import { ValidationException } from '$exceptions/validation.exception';
import { DefaultFormActionHandler } from '$hooks/useFinancerFormState';
import { AccountService } from '$ssr/api/account.service';
import { AccountAdd } from '$views/accounts/account.add';

export const AccountAddContainer = () => {
  const handleSubmit: DefaultFormActionHandler = async (
    prevState,
    formData,
  ) => {
    'use server';

    try {
      await AccountService.add({
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

    redirect('/accounts', RedirectType.push);
  };

  return <AccountAdd onAddAccount={handleSubmit} />;
};
