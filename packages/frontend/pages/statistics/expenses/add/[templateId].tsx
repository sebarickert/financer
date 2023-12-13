import { ExpenseAddContainer } from '$container/expenses/expense.add.container';
import { useViewTransitionRouter } from '$hooks/useViewTransitionRouter';

const ExpenseAddWithTemplateIdPage = () => {
  const {
    query: { templateId },
  } = useViewTransitionRouter();

  return <ExpenseAddContainer templateId={templateId as string} />;
};

export default ExpenseAddWithTemplateIdPage;
