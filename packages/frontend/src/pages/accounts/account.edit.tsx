import { AccountForm, AccountFormFields } from './account.form';

import { AccountDto } from '$api/generated/financerApi';
import { DeleteAccountContainer } from '$container/accounts/account.delete.container';
import { LoaderFullScreen } from '$elements/loader/loader.fullscreen';
import { UpdatePageInfo } from '$renderers/seo/updatePageInfo';

interface EditAccountParams {
  account: AccountDto;
  isLoading: boolean;
  errors: string[];
  onSave: (newAccountData: AccountFormFields) => Promise<void>;
}

export const AccountEdit = ({
  account,
  isLoading,
  errors,
  onSave,
}: EditAccountParams): JSX.Element => {
  return (
    <>
      {isLoading && <LoaderFullScreen />}
      <UpdatePageInfo
        title={`Edit ${account.name}`}
        backLink={`/accounts/${account._id}`}
        headerAction={<DeleteAccountContainer id={account._id} />}
      />
      <AccountForm
        onSubmit={onSave}
        errors={errors}
        submitLabel="Update"
        initialValues={account}
      />
    </>
  );
};
