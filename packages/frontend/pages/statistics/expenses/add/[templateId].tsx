import { useRouter } from 'next/router';

import { AddExpenseContainer } from '$container/expenses/add-expense.container';

const AddExpenseWithTemplateIdPage = () => {
  const {
    query: { templateId },
  } = useRouter();

  return <AddExpenseContainer templateId={templateId as string} />;
};

export default AddExpenseWithTemplateIdPage;
