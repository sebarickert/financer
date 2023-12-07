import { TemplateEditContainer } from '$container/templates/template.edit.container';
import { useViewTransitionRouter } from '$hooks/useViewTransitionRouter';

const EditTemplatePage = () => {
  const {
    query: { templateId },
  } = useViewTransitionRouter();

  return <TemplateEditContainer id={templateId as string} />;
};

export default EditTemplatePage;
