import { Routes, Route } from 'react-router-dom';

import { AddShortcut } from './AddShortcut';
import { Shortcuts } from './Shortcuts';

export const ShortcutsRouter = (): JSX.Element => {
  return (
    <Routes>
      <Route index element={<Shortcuts />} />
      <Route path="add" element={<AddShortcut />} />
      {/* <Route path=":id/edit" element={<EditTransactionCategory />} /> */}
    </Routes>
  );
};
