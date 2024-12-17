import { Metadata } from 'next';

import { AccountContainer } from '$container/accounts/AccountContainer';
import { AccountService } from '$ssr/api/AccountService';

type Params = Promise<{
  accountId: string;
}>;

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

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

export default async function AccountPage({
  params,
  searchParams,
}: {
  params: Params;
  searchParams: SearchParams;
}) {
  const { accountId } = await params;
  const queryDate = (await searchParams).date as string | undefined;

  return <AccountContainer id={accountId} queryDate={queryDate} />;
}
