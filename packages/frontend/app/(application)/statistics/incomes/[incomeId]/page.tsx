import { Metadata } from 'next';

import { IncomeContainer } from '$container/incomes/IncomeContainer';
import { IncomeService } from '$ssr/api/IncomeService';

type Params = Promise<{
  incomeId: string;
}>;

export const generateMetadata = async ({
  params,
}: {
  params: Params;
}): Promise<Metadata> => {
  const { incomeId } = await params;
  const income = await IncomeService.getById(incomeId);

  return {
    title: `${income.description} / Incomes`,
  };
};

const IncomePage = async ({ params }: { params: Params }) => {
  const { incomeId } = await params;

  return <IncomeContainer id={incomeId} />;
};

export default IncomePage;
