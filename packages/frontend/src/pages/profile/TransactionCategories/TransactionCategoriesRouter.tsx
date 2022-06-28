import { Routes, Route } from 'react-router-dom';

import { AddTransactionCategory } from './AddTransactionCategory';
import { EditTransactionCategory } from './EditTransactionCategory';
import { TransactionCategories } from './TransactionCategories';
import { ViewTransactionCategory } from './ViewTransactionCategory';

export const TransactionCategoriesRouter = (): JSX.Element => {
  return (
    <Routes>
      <Route index element={<TransactionCategories />} />
      <Route path="add" element={<AddTransactionCategory />} />
      <Route path=":id" element={<ViewTransactionCategory />} />
      <Route path=":id/edit" element={<EditTransactionCategory />} />
    </Routes>
  );
};
