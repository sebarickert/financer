import { Metadata } from 'next';

import { AccountContainer } from '$container/accounts/AccountContainer';
import { AccountService } from '$ssr/api/AccountService';

type Params = Promise<{
  accountId: string;
}>;

export const generateMetadata = async ({
  params,
}: {
  params: Params;
}): Promise<Metadata> => {
  const { accountId } = await params;
  const account = await AccountService.getById(accountId);

  return {
    title: `${account?.name} / Accounts`,
  };
};

const AccountPage = async ({ params }: { params: Params }) => {
  const { accountId } = await params;

  return <AccountContainer id={accountId} />;
};

export default AccountPage;
