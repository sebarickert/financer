import { AccountForm, AccountFormFields } from './account-form';

import { AccountDto } from '$api/generated/financerApi';
import { LoaderFullScreen } from '$elements/loader/loader.fullscreen';
import { UpdatePageInfo } from '$renderers/seo/updatePageInfo';

interface EditAccountParams {
  account: AccountDto;
  isLoading: boolean;
  errors: string[];
  onSave: (newAccountData: AccountFormFields) => Promise<void>;
}

export const EditAccount = ({
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
