import { Metadata } from 'next';

import { AccountEditContainer } from '$container/accounts/AccountEditContainer';
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
    title: `Edit ${account?.name} / Accounts`,
  };
};
const AccountEditPage = async ({ params }: { params: Params }) => {
  const { accountId } = await params;

  return <AccountEditContainer id={accountId} />;
};

export default AccountEditPage;
