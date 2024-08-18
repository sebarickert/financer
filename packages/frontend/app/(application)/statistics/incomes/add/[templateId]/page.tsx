import { FC } from 'react';

import { IncomeAddContainer } from '$container/incomes/income.add.container';

type AddIncomeWithTemplateIdPageProps = {
  params: {
    templateId: string;
  };
};

const AddIncomeWithTemplateIdPage: FC<AddIncomeWithTemplateIdPageProps> = ({
  params: { templateId },
}) => {
  return <IncomeAddContainer templateId={templateId} />;
};

export default AddIncomeWithTemplateIdPage;
