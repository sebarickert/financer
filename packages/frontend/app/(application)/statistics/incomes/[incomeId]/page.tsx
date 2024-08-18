import { FC } from 'react';

import { IncomeContainer } from '$container/incomes/income.container';

type IncomePageProps = {
  params: {
    incomeId: string;
  };
};

const IncomePage: FC<IncomePageProps> = ({ params: { incomeId } }) => {
  return <IncomeContainer id={incomeId} />;
};

export default IncomePage;
