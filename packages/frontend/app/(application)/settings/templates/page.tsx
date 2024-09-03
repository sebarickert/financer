import { Metadata } from 'next';

import { TemplateListingContainer } from '$container/templates/template.listing.container';
import { Layout } from '$layouts/layout/layout';

export const metadata: Metadata = {
  title: 'Templates',
};

const TemplateListingPage = () => {
  return (
    <Layout title="Templates">
      <TemplateListingContainer />
    </Layout>
  );
};

export default TemplateListingPage;
