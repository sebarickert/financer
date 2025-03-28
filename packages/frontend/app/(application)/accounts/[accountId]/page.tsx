import { ChartNoAxesCombined, Pencil, Trash } from 'lucide-react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { AccountType } from '@/api/ssr-financer-api';
import { Popper } from '@/elements/Popper';
import { AccountDeleteDrawer } from '@/features/account/AccountDeleteDrawer';
import { AccountUpdateMarketValueDrawer } from '@/features/account/AccountUpdateMarketValueDrawer';
import { ContentHeader } from '@/layouts/ContentHeader';
import { AccountService } from '@/ssr/api/AccountService';
import { UserPreferenceService } from '@/ssr/api/UserPreferenceService';
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
  const account = await AccountService.getById(accountId);

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

  const account = await AccountService.getById(accountId);
  const balanceHistory =
    await AccountService.getAccountBalanceHistory(accountId);
  const marketSettings =
    await UserPreferenceService.getDefaultMarketUpdateSettings();
  const accountDrawerPopperId = `account-market-value-drawer-${crypto.randomUUID()}`;

  if (!account) {
    notFound();
  }

  return (
    <>
      <ContentHeader
        title={account.name}
        backLink="/accounts"
        headerAction={
          <Popper
            items={[
              {
                href: `/accounts/${account.id}/edit`,
                label: 'Edit',
                Icon: Pencil,
              },
              {
                popperId: account.id,
                label: 'Delete',
                Icon: Trash,
              },
              ...(account.type === AccountType.INVESTMENT
                ? [
                    {
                      popperId: accountDrawerPopperId,
                      label: 'Update Market Value',
                      Icon: ChartNoAxesCombined,
                    },
                  ]
                : []),
            ]}
          />
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
          popperId={accountDrawerPopperId}
          account={account}
          marketSettings={marketSettings}
        />
      )}
    </>
  );
}
