import { FC } from 'react';

import { AccountForm } from './account.form';

import { DefaultFormActionHandler } from '$hooks/useFinancerFormState';
import { UpdatePageInfo } from '$renderers/seo/updatePageInfo';

export interface AddAccountProps {
  onAddAccount: DefaultFormActionHandler;
}

export const AccountAdd: FC<AddAccountProps> = ({ onAddAccount }) => {
  return (
    <>
      <UpdatePageInfo backLink="/accounts" />
      <AccountForm onSubmit={onAddAccount} submitLabel="Submit" />
    </>
  );
};
