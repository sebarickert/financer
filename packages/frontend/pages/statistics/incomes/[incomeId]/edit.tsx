import { useRouter } from 'next/router';

import { EditIncomeContainer } from '$container/incomes/edit-income.container';

const EditIncomePage = () => {
  const {
    query: { incomeId },
  } = useRouter();

  return <EditIncomeContainer id={incomeId as string} />;
};

export default EditIncomePage;
