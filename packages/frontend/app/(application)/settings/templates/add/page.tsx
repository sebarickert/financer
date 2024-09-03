import { Metadata } from 'next';

import { TemplateAddContainer } from '$container/templates/template.add.container';
import { Layout } from '$layouts/layout/layout';

export const metadata: Metadata = {
  title: 'Add Template',
};

const AddTemplatePage = () => {
  return (
    <Layout title="Add Template">
      <TemplateAddContainer />
    </Layout>
  );
};

export default AddTemplatePage;
