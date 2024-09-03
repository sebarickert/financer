import { Metadata } from 'next';
import { FC } from 'react';

import { TemplateEditContainer } from '$container/templates/template.edit.container';
import { Layout } from '$layouts/layout/layout';

// TODO change to dynamic title
export const metadata: Metadata = {
  title: 'Edit Template',
};

type EditTemplatePageProps = {
  params: {
    templateId: string;
  };
};

const EditTemplatePage: FC<EditTemplatePageProps> = ({
  params: { templateId },
}) => {
  return (
    <Layout title="Edit Template">
      <TemplateEditContainer id={templateId} />
    </Layout>
  );
};

export default EditTemplatePage;
