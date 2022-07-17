import { Routes, Route } from 'react-router-dom';

import { AddIncome } from './AddIncome';
import { AddShortcutIncome } from './AddShortcutIncome';
import { EditIncome } from './EditIncome';
import { Income } from './Income';
import { Incomes } from './Incomes';

export const IncomesRouter = (): JSX.Element => {
  return (
    <Routes>
      <Route index element={<Incomes />} />
      <Route path="add" element={<AddIncome />} />
      <Route path="add/:id" element={<AddShortcutIncome />} />
      <Route path=":id" element={<Income />} />
      <Route path=":id/edit" element={<EditIncome />} />
    </Routes>
  );
};
