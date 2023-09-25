import { EditIncomeContainer } from '$container/incomes/edit-income.container';
import { useViewTransitionRouter } from '$hooks/useViewTransitionRouter';

const EditIncomePage = () => {
  const {
    query: { incomeId },
  } = useViewTransitionRouter();

  return <EditIncomeContainer id={incomeId as string} />;
};

export default EditIncomePage;
