import { IncomeEditContainer } from '$container/incomes/income.edit.container';
import { useViewTransitionRouter } from '$hooks/useViewTransitionRouter';

const EditIncomePage = () => {
  const {
    query: { incomeId },
  } = useViewTransitionRouter();

  return <IncomeEditContainer id={incomeId as string} />;
};

export default EditIncomePage;
