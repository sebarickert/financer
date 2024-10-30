import { AccountForm } from '$blocks/AccountForm';
import { Layout } from '$layouts/Layout';
import { handleAccountAdd } from 'src/actions/account/handleAccountAdd';

export const AccountAddContainer = () => {
  return (
    <Layout title="Add Account" backLink="/accounts">
      <AccountForm onSubmit={handleAccountAdd} submitLabel="Submit" />
    </Layout>
  );
};
