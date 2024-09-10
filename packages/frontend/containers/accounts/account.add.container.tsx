'use client';

import { useCallback } from 'react';
import { useDispatch } from 'react-redux';

import { useAccountsCreateMutation } from '$api/generated/financerApi';
import { ToastMessageTypes } from '$blocks/toast/toast';
import { useViewTransitionRouter } from '$hooks/useViewTransitionRouter';
import { addToastMessage } from '$reducer/notifications.reducer';
import { clearAccountCache } from '$ssr/api/clear-cache';
import { parseErrorMessagesToArray } from '$utils/apiHelper';
import { AccountAdd } from '$views/accounts/account.add';
import { AccountFormFields } from '$views/accounts/account.form';

export const AccountAddContainer = () => {
  const { push } = useViewTransitionRouter();
  const [addAccount] = useAccountsCreateMutation();
  const dispatch = useDispatch();

  const handleSubmit = useCallback(
    async (newAccountData: AccountFormFields) => {
      try {
        await addAccount({
          createAccountDto: newAccountData,
        }).unwrap();
        await clearAccountCache();

        push('/accounts');
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        // eslint-disable-next-line no-console
        if (error?.status !== 400) console.error(error);

        if ('message' in error?.data) {
          dispatch(
            addToastMessage({
              type: ToastMessageTypes.ERROR,
              message: 'Submission failed',
              additionalInformation: parseErrorMessagesToArray(
                error.data.message,
              ),
            }),
          );
          return;
        }
      }
    },
    [addAccount, dispatch, push],
  );

  return <AccountAdd onAddAccount={handleSubmit} />;
};
