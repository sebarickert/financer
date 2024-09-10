'use client';

import { FC, useCallback } from 'react';
import { useDispatch } from 'react-redux';

import {
  useAccountsUpdateMutation,
  useAccountsFindOneByIdQuery,
} from '$api/generated/financerApi';
import { DataHandler } from '$blocks/data-handler/data-handler';
import { ToastMessageTypes } from '$blocks/toast/toast';
import { useViewTransitionRouter } from '$hooks/useViewTransitionRouter';
import { addToastMessage } from '$reducer/notifications.reducer';
import { clearAccountCache } from '$ssr/api/clear-cache';
import { AccountEdit } from '$views/accounts/account.edit';
import { AccountFormFields } from '$views/accounts/account.form';

interface AccountEditContainerProps {
  id: string;
}

export const AccountEditContainer: FC<AccountEditContainerProps> = ({ id }) => {
  const { push } = useViewTransitionRouter();
  const [editAccount] = useAccountsUpdateMutation();

  const data = useAccountsFindOneByIdQuery({ id });
  const account = data.data;
  const dispatch = useDispatch();

  const handleSubmit = useCallback(
    async (newAccountData: AccountFormFields) => {
      if (!account?.id) {
        dispatch(
          addToastMessage({
            type: ToastMessageTypes.ERROR,
            message: 'Submission failed',
            additionalInformation: 'Account not found',
          }),
        );
        return;
      }

      try {
        const newAccount = await editAccount({
          id: account.id,
          updateAccountDto: newAccountData,
        });
        await clearAccountCache();

        if ('message' in newAccount) {
          dispatch(
            addToastMessage({
              type: ToastMessageTypes.ERROR,
              message: 'Submission failed',
              additionalInformation: newAccount?.message as string,
            }),
          );
          return;
        }

        push(`/accounts/${id}`);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error);
      }
    },
    [account?.id, dispatch, editAccount, id, push],
  );

  return (
    <>
      <DataHandler {...data} />
      {account && <AccountEdit account={account} onSave={handleSubmit} />}
    </>
  );
};
