import { AccountForm, AccountFormFields } from './account-form';

import { LoaderFullScreen } from '$elements/loader/loader.fullscreen';
import { UpdatePageInfo } from '$renderers/seo/updatePageInfo';

export interface AddAccountProps {
  isLoading: boolean;
  errors: string[];
  onAddAccount: (newAccountData: AccountFormFields) => Promise<void>;
}

export const AddAccount = ({
  isLoading,
  errors,
  onAddAccount,
}: AddAccountProps): JSX.Element => {
  return (
    <>
      {isLoading && <LoaderFullScreen />}
      <UpdatePageInfo title="Add account" backLink="/accounts" />
      <AccountForm
        onSubmit={onAddAccount}
        errors={errors}
        submitLabel="Submit"
      />
    </>
  );
};
