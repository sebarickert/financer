import { handleAccountAdd } from '$actions/account/handleAccountAdd';
import { Layout } from '$layouts/Layout';
import { AccountForm } from '$modules/account/AccountForm';

export const AccountAddContainer = () => {
  return (
    <Layout title="Add Account" backLink="/accounts">
      <AccountForm onSubmit={handleAccountAdd} submitLabel="Submit" />
    </Layout>
  );
};
