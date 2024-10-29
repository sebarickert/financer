import { FC } from 'react';

import { Transaction } from '$blocks/Transaction';
import { IncomeService } from '$ssr/api/income.service';

interface IncomeContainerProps {
  id: string;
}

export const IncomeContainer: FC<IncomeContainerProps> = async ({ id }) => {
  const income = await IncomeService.getById(id);

  return <Transaction {...income} />;
};
