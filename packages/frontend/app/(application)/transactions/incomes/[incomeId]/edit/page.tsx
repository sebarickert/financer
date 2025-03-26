import { Metadata } from 'next';

import { getIncomeById } from '@/api-service';
import { IncomeEditContainer } from '@/container/incomes/IncomeEditContainer';
type Params = Promise<{
  incomeId: string;
}>;

export const generateMetadata = async ({
  params,
}: {
  params: Params;
}): Promise<Metadata> => {
  const { incomeId } = await params;
  const income = await getIncomeById(incomeId);

  return {
    title: `Edit ${income.description} / Incomes`,
  };
};

const EditIncomePage = async ({ params }: { params: Params }) => {
  const { incomeId } = await params;

  return <IncomeEditContainer id={incomeId} />;
};

export default EditIncomePage;
