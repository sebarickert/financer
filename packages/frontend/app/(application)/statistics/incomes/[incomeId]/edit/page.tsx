import { Metadata } from 'next';
import { FC } from 'react';

import { IncomeEditContainer } from '$container/incomes/IncomeEditContainer';
import { IncomeService } from '$ssr/api/income.service';

type EditIncomePageProps = {
  params: {
    incomeId: string;
  };
};

export const generateMetadata = async ({
  params: { incomeId },
}: EditIncomePageProps): Promise<Metadata> => {
  const income = await IncomeService.getById(incomeId);

  return {
    title: `Edit ${income.description} / Incomes / Statistics`,
  };
};

const EditIncomePage: FC<EditIncomePageProps> = ({ params: { incomeId } }) => {
  return <IncomeEditContainer id={incomeId} />;
};

export default EditIncomePage;
