import { AddIncomeContainer } from '$container/incomes/add-income.container';
import { useViewTransitionRouter } from '$hooks/useViewTransitionRouter';

const AddIncomeWithTemplateIdPage = () => {
  const {
    query: { templateId },
  } = useViewTransitionRouter();

  return <AddIncomeContainer templateId={templateId as string} />;
};

export default AddIncomeWithTemplateIdPage;
