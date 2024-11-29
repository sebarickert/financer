import { handleAccountAdd } from '$actions/account/handleAccountAdd';
import { AccountForm } from '$features/account/AccountForm';
import { Layout } from '$layouts/Layout';

export const AccountAddContainer = () => {
  return (
    <Layout title="Add Account" backLink="/accounts">
      <AccountForm onSubmit={handleAccountAdd} submitLabel="Save Account" />
    </Layout>
  );
};
