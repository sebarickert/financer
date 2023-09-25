import { AddExpenseContainer } from '$container/expenses/add-expense.container';
import { useViewTransitionRouter } from '$hooks/useViewTransitionRouter';

const AddExpenseWithTemplateIdPage = () => {
  const {
    query: { templateId },
  } = useViewTransitionRouter();

  return <AddExpenseContainer templateId={templateId as string} />;
};

export default AddExpenseWithTemplateIdPage;
