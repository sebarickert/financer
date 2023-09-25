import { IncomeContainer } from '$container/incomes/income.container';
import { useViewTransitionRouter } from '$hooks/useViewTransitionRouter';

const IncomePage = () => {
  const {
    query: { incomeId },
  } = useViewTransitionRouter();

  return <IncomeContainer id={incomeId as string} />;
};

export default IncomePage;
