import { notFound } from 'next/navigation';
import { FC } from 'react';

import { AccountService } from '$ssr/api/account.service';
import { Account } from '$views/accounts/account';

interface AccountContainerProps {
  id: string;
}

export const AccountContainer: FC<AccountContainerProps> = async ({ id }) => {
  const account = await AccountService.getById(id);

  if (!account) {
    notFound();
  }

  return <Account account={account} />;
};
