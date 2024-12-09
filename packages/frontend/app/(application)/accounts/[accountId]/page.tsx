import { Metadata } from 'next';
import { FC } from 'react';

import { AccountContainer } from '$container/accounts/AccountContainer';
import { AccountService } from '$ssr/api/AccountService';

type AccountPageProps = {
  params: {
    accountId: string;
  };
};

export const generateMetadata = async ({
  params: { accountId },
}: AccountPageProps): Promise<Metadata> => {
  const account = await AccountService.getById(accountId);

  return {
    title: `${account?.name} / Accounts`,
  };
};

const AccountPage: FC<AccountPageProps> = ({ params: { accountId } }) => {
  return <AccountContainer id={accountId} />;
};

export default AccountPage;
