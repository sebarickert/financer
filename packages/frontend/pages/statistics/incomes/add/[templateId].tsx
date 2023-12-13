import { IncomeAddContainer } from '$container/incomes/income.add.container';
import { useViewTransitionRouter } from '$hooks/useViewTransitionRouter';

const AddIncomeWithTemplateIdPage = () => {
  const {
    query: { templateId },
  } = useViewTransitionRouter();

  return <IncomeAddContainer templateId={templateId as string} />;
};

export default AddIncomeWithTemplateIdPage;
