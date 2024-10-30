import { Metadata } from 'next';
import { FC } from 'react';

import { IncomeContainer } from '$container/incomes/IncomeContainer';

// TODO change to dynamic title
export const metadata: Metadata = {
  title: 'Income Details',
};

type IncomePageProps = {
  params: {
    incomeId: string;
  };
};

const IncomePage: FC<IncomePageProps> = ({ params: { incomeId } }) => {
  return <IncomeContainer id={incomeId} />;
};

export default IncomePage;
