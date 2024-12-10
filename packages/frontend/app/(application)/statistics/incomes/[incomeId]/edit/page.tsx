import { Metadata } from 'next';

import { IncomeEditContainer } from '$container/incomes/IncomeEditContainer';
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
    title: `Edit ${income.description} / Incomes`,
  };
};

const EditIncomePage = async ({ params }: { params: Params }) => {
  const { incomeId } = await params;

  return <IncomeEditContainer id={incomeId} />;
};

export default EditIncomePage;
