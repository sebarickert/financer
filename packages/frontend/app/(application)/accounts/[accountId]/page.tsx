import { ChartNoAxesCombined, Menu, Pencil, Trash } from 'lucide-react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { AccountType } from '@/api/ssr-financer-api';
import {
  getAccountBalanceHistory,
  getAccountById,
  getDefaultMarketUpdateSettings,
} from '@/api-service';
import { Popper } from '@/elements/Popper';
import { PopperItem } from '@/elements/PopperItem';
import { AccountDeleteDrawer } from '@/features/account/AccountDeleteDrawer';
import { AccountUpdateMarketValueDrawer } from '@/features/account/AccountUpdateMarketValueDrawer';
import { generateAccountViewTransitionName } from '@/features/account/generateAccountViewTransitionName';
import { ContentHeader } from '@/layouts/ContentHeader';
import { Account } from '@/views/Account';

type Params = Promise<{
  accountId: string;
}>;

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export const generateMetadata = async ({
  params,
}: {
  params: Params;
}): Promise<Metadata> => {
  const { accountId } = await params;
  const account = await getAccountById(accountId);

  return {
    title: account?.name,
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

  const account = await getAccountById(accountId);
  const balanceHistory = await getAccountBalanceHistory(accountId);
  const marketSettings = await getDefaultMarketUpdateSettings();
  const accountDrawerPopperId = `account-market-value-drawer-${crypto.randomUUID()}`;

  if (!account) {
    notFound();
  }

  const vtNames = generateAccountViewTransitionName(accountId);

  return (
    <>
      <ContentHeader
        title={account.name}
        titleVtName={vtNames.name}
        action={
          <Popper
            popperButton={{
              isPill: true,
              size: 'small',
              accentColor: 'secondary',
              content: (
                <>
                  <Menu />
                  Options
                </>
              ),
            }}
          >
            <PopperItem
              label="Edit"
              href={`/accounts/${account.id}/edit`}
              icon={Pencil}
            />
            <PopperItem label="Delete" icon={Trash} drawerId={account.id} />
            {account.type === AccountType.INVESTMENT && (
              <PopperItem
                label="Update Market Value"
                icon={ChartNoAxesCombined}
                drawerId={accountDrawerPopperId}
              />
            )}
          </Popper>
        }
      />
      <Account
        account={account}
        balanceHistory={balanceHistory}
        queryDate={queryDate}
      />
      <AccountDeleteDrawer id={account.id} />
      {account.type === AccountType.INVESTMENT && (
        <AccountUpdateMarketValueDrawer
          drawerId={accountDrawerPopperId}
          account={account}
          marketSettings={marketSettings}
        />
      )}
    </>
  );
}
