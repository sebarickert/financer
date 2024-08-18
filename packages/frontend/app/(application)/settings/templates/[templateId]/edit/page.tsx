import { FC } from 'react';

import { TemplateEditContainer } from '$container/templates/template.edit.container';

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
