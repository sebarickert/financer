import { FC } from 'react';

import { ExpenseAddContainer } from '$container/expenses/expense.add.container';

type ExpenseAddWithTemplateIdPageProps = {
  params: {
    templateId: string;
  };
};

const ExpenseAddWithTemplateIdPage: FC<ExpenseAddWithTemplateIdPageProps> = ({
  params: { templateId },
}) => {
  return <ExpenseAddContainer templateId={templateId} />;
};

export default ExpenseAddWithTemplateIdPage;
