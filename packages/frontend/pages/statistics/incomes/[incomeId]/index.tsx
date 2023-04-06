import { useRouter } from 'next/router';

import { IncomeContainer } from '$container/incomes/income.container';

const IncomePage = () => {
  const {
    query: { incomeId },
  } = useRouter();

  return <IncomeContainer id={incomeId as string} />;
};

export default IncomePage;
