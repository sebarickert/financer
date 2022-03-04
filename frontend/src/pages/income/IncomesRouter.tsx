import React from 'react';
import { Routes, Route } from 'react-router-dom';

import { AddIncome } from './AddIncome';
import { EditIncome } from './EditIncome';
import { Income } from './Income';
import { Incomes } from './Incomes';

export const IncomesRouter = (): JSX.Element => {
  return (
    <Routes>
      <Route index element={<Incomes />} />
      <Route path="add" element={<AddIncome />} />
      <Route path=":id" element={<Income />} />
      <Route path=":id/edit" element={<EditIncome />} />
    </Routes>
  );
};
