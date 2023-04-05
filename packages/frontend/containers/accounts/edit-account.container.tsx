import { useRouter } from 'next/router';
import { useState, useCallback } from 'react';

import {
  useAccountsUpdateMutation,
  useAccountsFindOneByIdQuery,
} from '$api/generated/financerApi';
import { DataHandler } from '$blocks/data-handler/data-handler';
import { AccountFormFields } from '$pages/accounts/account-form';
import { EditAccount } from '$pages/accounts/edit-account';

interface EditAccountContainerProps {
  id: string;
}

export const EditAccountContainer = ({ id }: EditAccountContainerProps) => {
  const { push } = useRouter();
  const [editAccount, { isLoading }] = useAccountsUpdateMutation();

  const [errors, setErrors] = useState<string[]>([]);

  const data = useAccountsFindOneByIdQuery({ id });
  const account = data.data;

  const handleSubmit = useCallback(
    async (newAccountData: AccountFormFields) => {
      if (!account?._id) {
        setErrors(['Account not found']);
        return;
      }

      try {
        const newAccount = await editAccount({
          id: account._id,
          updateAccountDto: newAccountData,
        });

        if ('message' in newAccount) {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          setErrors(parseErrorMessagesToArray(newAccount.message));
          return;
        }

        push(`/accounts/${id}`);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error);
      }
    },
    [account?._id, editAccount, id, push]
  );

  return (
    <>
      <DataHandler {...data} />
      {account && (
        <EditAccount
          account={account}
          isLoading={isLoading}
          errors={errors}
          onSave={handleSubmit}
        />
      )}
    </>
  );
};
