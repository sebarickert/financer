import { useRouter } from 'next/router';

import { EditTemplateContainer } from '$container/templates/edit-template.container';

const EditTemplatePage = () => {
  const {
    query: { templateId },
  } = useRouter();

  return <EditTemplateContainer id={templateId as string} />;
};

export default EditTemplatePage;
