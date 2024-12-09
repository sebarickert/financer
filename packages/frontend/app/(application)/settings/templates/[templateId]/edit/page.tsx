import { Metadata } from 'next';
import { FC } from 'react';

import { TemplateEditContainer } from '$container/templates/TemplateEditContainer';
import { TransactionTemplateService } from '$ssr/api/TransactionTemplateService';

type EditTemplatePageProps = {
  params: {
    templateId: string;
  };
};

export const generateMetadata = async ({
  params: { templateId },
}: EditTemplatePageProps): Promise<Metadata> => {
  const template = await TransactionTemplateService.getById(templateId);

  return {
    title: `Edit ${template.templateName} / Templates`,
  };
};

const EditTemplatePage: FC<EditTemplatePageProps> = ({
  params: { templateId },
}) => {
  return <TemplateEditContainer id={templateId} />;
};

export default EditTemplatePage;
