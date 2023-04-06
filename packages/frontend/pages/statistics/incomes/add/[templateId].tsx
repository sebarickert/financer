import { useRouter } from 'next/router';

import { AddIncomeContainer } from '$container/incomes/add-income.container';

const AddIncomeWithTemplateIdPage = () => {
  const {
    query: { templateId },
  } = useRouter();

  return <AddIncomeContainer templateId={templateId as string} />;
};

export default AddIncomeWithTemplateIdPage;
