import { Routes, Route } from 'react-router-dom';

import { ExpensesRouter } from '../expenses/ExpensesRouter';
import { IncomesRouter } from '../income/IncomesRouter';
import { TransfersRouter } from '../transfers/TransfersRouter';

import { Statistics } from './Statistics';

export const StatisticsRouter = (): JSX.Element => {
  return (
    <Routes>
      <Route index element={<Statistics />} />
      <Route path="incomes/*" element={<IncomesRouter />} />
      <Route path="expenses/*" element={<ExpensesRouter />} />
      <Route path="transfers/*" element={<TransfersRouter />} />
    </Routes>
  );
};
