import { Routes, Route } from 'react-router-dom';

import { AddTransactionTemplate } from './AddTransactionTemplate';
import { EditTransactionTemplate } from './EditTransactionTemplate';
import { TransactionTemplates } from './TransactionTemplates';

export const TransactionTemplatesRouter = (): JSX.Element => {
  return (
    <Routes>
      <Route index element={<TransactionTemplates />} />
      <Route path="add" element={<AddTransactionTemplate />} />
      <Route path=":id/edit" element={<EditTransactionTemplate />} />
    </Routes>
  );
};
