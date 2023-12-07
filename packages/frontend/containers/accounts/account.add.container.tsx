import { useState, useCallback } from 'react';

import { useAccountsCreateMutation } from '$api/generated/financerApi';
import { useViewTransitionRouter } from '$hooks/useViewTransitionRouter';
import { AccountAdd } from '$pages/accounts/account.add';
import { AccountFormFields } from '$pages/accounts/account.form';
import { parseErrorMessagesToArray } from '$utils/apiHelper';

export const AddAccountContainer = () => {
  const { push } = useViewTransitionRouter();
  const [addAccount, { isLoading }] = useAccountsCreateMutation();
  const [errors, setErrors] = useState<string[]>([]);

  const handleSubmit = useCallback(
    async (newAccountData: AccountFormFields) => {
      try {
        console.log(newAccountData);

        await addAccount({
          createAccountDto: newAccountData,
        }).unwrap();

        push('/accounts');
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        // eslint-disable-next-line no-console
        if (error?.status !== 400) console.error(error);

        if ('message' in error?.data) {
          setErrors(parseErrorMessagesToArray(error.data.message));
          return;
        }
      }
    },
    [addAccount, push]
  );

  return (
    <AccountAdd
      isLoading={isLoading}
      errors={errors}
      onAddAccount={handleSubmit}
    />
  );
};
