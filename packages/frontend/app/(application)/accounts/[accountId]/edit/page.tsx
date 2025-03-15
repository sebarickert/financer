import { Metadata } from 'next';

import { getAccountById } from '@/api-service';
import { AccountEditContainer } from '@/container/accounts/AccountEditContainer';
type Params = Promise<{
  accountId: string;
}>;

export const generateMetadata = async ({
  params,
}: {
  params: Params;
}): Promise<Metadata> => {
  const { accountId } = await params;
  const account = await getAccountById(accountId);

  return {
    title: `Edit ${account?.name} / Accounts`,
  };
};
const AccountEditPage = async ({ params }: { params: Params }) => {
  const { accountId } = await params;

  return <AccountEditContainer id={accountId} />;
};

export default AccountEditPage;
