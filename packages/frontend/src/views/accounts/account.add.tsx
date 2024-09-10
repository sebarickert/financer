import { FC } from 'react';

import { AccountForm, AccountFormFields } from './account.form';

import { UpdatePageInfo } from '$renderers/seo/updatePageInfo';

export interface AddAccountProps {
  onAddAccount: (newAccountData: AccountFormFields) => Promise<void>;
}

export const AccountAdd: FC<AddAccountProps> = ({ onAddAccount }) => {
  return (
    <>
      <UpdatePageInfo backLink="/accounts" />
      <AccountForm onSubmit={onAddAccount} submitLabel="Submit" />
    </>
  );
};
