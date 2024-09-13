import { AccountForm } from './account.form';

import { AccountDto } from '$api/generated/financerApi';
import { DeleteAccountContainer } from '$container/accounts/account.delete.container';
import { DefaultFormActionHandler } from '$hooks/useFinancerFormState';
import { UpdatePageInfo } from '$renderers/seo/updatePageInfo';

interface EditAccountParams {
  account: AccountDto;
  onSave: DefaultFormActionHandler;
}

export const AccountEdit = ({
  account,
  onSave,
}: EditAccountParams): JSX.Element => {
  return (
    <>
      <UpdatePageInfo
        backLink={`/accounts/${account.id}`}
        headerAction={<DeleteAccountContainer id={account.id} />}
      />
      <AccountForm
        onSubmit={onSave}
        submitLabel="Update"
        initialValues={account}
      />
    </>
  );
};
