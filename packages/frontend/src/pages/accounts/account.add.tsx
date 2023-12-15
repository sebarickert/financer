import { AccountForm, AccountFormFields } from './account.form';

import { UpdatePageInfo } from '$renderers/seo/updatePageInfo';

export interface AddAccountProps {
  onAddAccount: (newAccountData: AccountFormFields) => Promise<void>;
}

export const AccountAdd = ({ onAddAccount }: AddAccountProps): JSX.Element => {
  return (
    <>
      <UpdatePageInfo title="Add account" backLink="/accounts" />
      <AccountForm onSubmit={onAddAccount} submitLabel="Submit" />
    </>
  );
};
