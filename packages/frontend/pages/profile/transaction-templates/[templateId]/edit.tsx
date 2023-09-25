import { EditTemplateContainer } from '$container/templates/edit-template.container';
import { useViewTransitionRouter } from '$hooks/useViewTransitionRouter';

const EditTemplatePage = () => {
  const {
    query: { templateId },
  } = useViewTransitionRouter();

  return <EditTemplateContainer id={templateId as string} />;
};

export default EditTemplatePage;
