import { Metadata } from 'next';

import { getTransactionTemplateById } from '@/api-service';
import { TemplateEditContainer } from '@/container/templates/TemplateEditContainer';
type Params = Promise<{
  templateId: string;
}>;

export const generateMetadata = async ({
  params,
}: {
  params: Params;
}): Promise<Metadata> => {
  const { templateId } = await params;
  const template = await getTransactionTemplateById(templateId);

  return {
    title: `Edit ${template.templateName} / Templates`,
  };
};

const EditTemplatePage = async ({ params }: { params: Params }) => {
  const { templateId } = await params;

  return <TemplateEditContainer id={templateId} />;
};

export default EditTemplatePage;
