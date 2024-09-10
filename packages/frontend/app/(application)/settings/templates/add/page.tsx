import { Metadata } from 'next';
import { FC } from 'react';

import { TemplateAddContainer } from '$container/templates/template.add.container';
import { Layout } from '$layouts/layout/layout';

export const metadata: Metadata = {
  title: 'Add Template',
};

const AddTemplatePage: FC = () => {
  return (
    <Layout title="Add Template">
      <TemplateAddContainer />
    </Layout>
  );
};

export default AddTemplatePage;
