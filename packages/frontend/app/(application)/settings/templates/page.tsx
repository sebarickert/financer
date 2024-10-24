import { Metadata } from 'next';
import { FC } from 'react';

import { TemplateListingContainer } from '$container/templates/template.listing.container';
import { Layout } from '$layouts/Layout';

export const metadata: Metadata = {
  title: 'Templates',
};

const TemplateListingPage: FC = () => {
  return (
    <Layout title="Templates">
      <TemplateListingContainer />
    </Layout>
  );
};

export default TemplateListingPage;
