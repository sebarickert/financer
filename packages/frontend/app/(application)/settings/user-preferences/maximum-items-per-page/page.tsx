import { Metadata } from 'next';

import { MaximumItemsPerPageContainer } from '$container/user-preferences/maximum-items-per-page.container';
import { Layout } from '$layouts/layout/layout';

export const metadata: Metadata = {
  title: 'Maximum Items Per Page',
};

const MaximumItemsPerPageUserPreferencePage = () => {
  return (
    <Layout title="Maximum Items Per Page">
      <MaximumItemsPerPageContainer />
    </Layout>
  );
};

export default MaximumItemsPerPageUserPreferencePage;
