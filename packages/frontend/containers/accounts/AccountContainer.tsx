import { ChartNoAxesCombined, Pencil, Trash } from 'lucide-react';
import { notFound } from 'next/navigation';
import { FC } from 'react';

import { AccountType } from '@/api/ssr-financer-api';
import { Popper } from '@/elements/Popper';
import { AccountDeleteDrawer } from '@/features/account/AccountDeleteDrawer';
import { AccountUpdateMarketValueDrawer } from '@/features/account/AccountUpdateMarketValueDrawer';
import { Layout } from '@/layouts/Layout';
import { AccountService } from '@/ssr/api/AccountService';
import { UserPreferenceService } from '@/ssr/api/UserPreferenceService';
import { Account } from '@/views/Account';

interface AccountContainerProps {
  id: string;
  queryDate?: string;
}

export const AccountContainer: FC<AccountContainerProps> = async ({
  id,
  queryDate,
}) => {
  const account = await AccountService.getById(id);
  const balanceHistory = await AccountService.getAccountBalanceHistory(id);
  const marketSettings =
    await UserPreferenceService.getDefaultMarketUpdateSettings();
  const accountDrawerPopperId = `account-market-value-drawer-${crypto.randomUUID()}`;

  if (!account) {
    notFound();
  }

  return (
    <Layout
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
    >
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
    </Layout>
  );
};
