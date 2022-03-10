import { Routes, Route } from 'react-router-dom';

import { AddExpense } from './AddExpense';
import { EditExpense } from './EditExpense';
import { Expense } from './Expense';
import { Expenses } from './Expenses';

export const ExpensesRouter = (): JSX.Element => {
  return (
    <Routes>
      <Route index element={<Expenses />} />
      <Route path="add" element={<AddExpense />} />
      <Route path=":id" element={<Expense />} />
      <Route path=":id/edit" element={<EditExpense />} />
    </Routes>
  );
};
