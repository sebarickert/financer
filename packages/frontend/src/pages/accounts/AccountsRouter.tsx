import { Routes, Route } from 'react-router-dom';

import { Account } from './Account';
import { Accounts } from './Accounts';
import { AddAccount } from './AddAccount';
import { EditAccount } from './EditAccount';

export const AccountsRouter = (): JSX.Element => {
  return (
    <Routes>
      <Route index element={<Accounts />} />
      <Route path="add" element={<AddAccount />} />
      <Route path=":id" element={<Account />} />
      <Route path=":id/edit" element={<EditAccount />} />
    </Routes>
  );
};
