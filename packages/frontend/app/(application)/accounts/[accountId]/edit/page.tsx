import { Metadata } from 'next';
import { FC } from 'react';

import { AccountEditContainer } from '$container/accounts/AccountEditContainer';
import { AccountService } from '$ssr/api/account.service';

type AccountEditPageProps = {
  params: {
    accountId: string;
  };
};

export const generateMetadata = async ({
  params: { accountId },
}: AccountEditPageProps): Promise<Metadata> => {
  const account = await AccountService.getById(accountId);

  return {
    title: `Edit ${account?.name} / Accounts`,
  };
};

const AccountEditPage: FC<AccountEditPageProps> = ({
  params: { accountId },
}) => {
  return <AccountEditContainer id={accountId} />;
};

export default AccountEditPage;
