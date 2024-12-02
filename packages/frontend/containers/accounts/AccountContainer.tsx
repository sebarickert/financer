import { notFound } from 'next/navigation';
import { FC } from 'react';

import { AccountType } from '$api/generated/financerApi';
import { IconName } from '$elements/Icon';
import { Popper } from '$elements/Popper';
import { AccountDeleteDrawer } from '$features/account/AccountDeleteDrawer';
import { AccountUpdateMarketValueDrawer } from '$features/account/AccountUpdateMarketValueDrawer';
import { Layout } from '$layouts/Layout';
import { AccountService } from '$ssr/api/account.service';
import { UserPreferenceService } from '$ssr/api/user-preference.service';
import { Account } from '$views/Account';

type AccountContainerProps = {
  id: string;
};

export const AccountContainer: FC<AccountContainerProps> = async ({ id }) => {
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
              icon: 'PencilIcon',
            },
            {
              popperId: account.id,
              label: 'Delete',
              icon: 'TrashIcon',
            },
            ...(account.type === AccountType.Investment
              ? [
                  {
                    popperId: accountDrawerPopperId,
                    label: 'Update Market Value',
                    icon: 'ArrowTrendingUpIcon' as IconName,
                  },
                ]
              : []),
          ]}
        />
      }
    >
      <Account account={account} balanceHistory={balanceHistory} />
      <AccountDeleteDrawer id={account.id} />
      {account.type === AccountType.Investment && (
        <AccountUpdateMarketValueDrawer
          popperId={accountDrawerPopperId}
          account={account}
          marketSettings={marketSettings}
        />
      )}
    </Layout>
  );
};
