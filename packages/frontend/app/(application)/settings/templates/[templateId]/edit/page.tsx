import { Metadata } from 'next';
import { FC } from 'react';

import { TemplateEditContainer } from '$container/templates/TemplateEditContainer';

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
  return <TemplateEditContainer id={templateId} />;
};

export default EditTemplatePage;
