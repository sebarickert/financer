import { FC } from 'react';

import { IncomeEditContainer } from '$container/incomes/income.edit.container';

type EditIncomePageProps = {
  params: {
    incomeId: string;
  };
};

const EditIncomePage: FC<EditIncomePageProps> = ({ params: { incomeId } }) => {
  return <IncomeEditContainer id={incomeId} />;
};

export default EditIncomePage;
