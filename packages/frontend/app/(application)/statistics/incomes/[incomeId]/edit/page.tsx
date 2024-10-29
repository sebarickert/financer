import { Metadata } from 'next';
import { FC } from 'react';

import { IncomeEditContainer } from '$container/incomes/IncomeEditContainer';

// TODO change to dynamic title
export const metadata: Metadata = {
  title: 'Edit Income',
};

type EditIncomePageProps = {
  params: {
    incomeId: string;
  };
};

const EditIncomePage: FC<EditIncomePageProps> = ({ params: { incomeId } }) => {
  return <IncomeEditContainer id={incomeId} />;
};

export default EditIncomePage;
