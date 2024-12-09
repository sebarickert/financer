import { Metadata } from 'next';
import { FC } from 'react';

import { IncomeContainer } from '$container/incomes/IncomeContainer';
import { IncomeService } from '$ssr/api/IncomeService';

type IncomePageProps = {
  params: {
    incomeId: string;
  };
};

export const generateMetadata = async ({
  params: { incomeId },
}: IncomePageProps): Promise<Metadata> => {
  const income = await IncomeService.getById(incomeId);

  return {
    title: `${income.description} / Incomes`,
  };
};

const IncomePage: FC<IncomePageProps> = ({ params: { incomeId } }) => {
  return <IncomeContainer id={incomeId} />;
};

export default IncomePage;
