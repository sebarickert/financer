import { Metadata } from 'next';

import { TemplateEditContainer } from '$container/templates/TemplateEditContainer';
import { TransactionTemplateService } from '$ssr/api/TransactionTemplateService';

type Params = Promise<{
  templateId: string;
}>;

export const generateMetadata = async ({
  params,
}: {
  params: Params;
}): Promise<Metadata> => {
  const { templateId } = await params;
  const template = await TransactionTemplateService.getById(templateId);

  return {
    title: `Edit ${template.templateName} / Templates`,
  };
};

const EditTemplatePage = async ({ params }: { params: Params }) => {
  const { templateId } = await params;

  return <TemplateEditContainer id={templateId} />;
};

export default EditTemplatePage;
