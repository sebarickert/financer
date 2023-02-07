import { Routes, Route } from 'react-router-dom';

import { AddExpense } from './AddExpense';
import { AddShortcutExpense } from './AddShortcutExpense';
import { EditExpense } from './EditExpense';
import { Expense } from './Expense';
import { Expenses } from './Expenses';

export const ExpensesRouter = (): JSX.Element => {
  return (
    <Routes>
      <Route index element={<Expenses />} />
      {/* <Route path=":year-:month" element={<Expenses />} /> */}
      <Route path=":date/:page" element={<Expenses />} />
      <Route path="add" element={<AddExpense />} />
      <Route path="add/:id" element={<AddShortcutExpense />} />
      <Route path=":id" element={<Expense />} />
      <Route path=":id/edit" element={<EditExpense />} />
    </Routes>
  );
};
