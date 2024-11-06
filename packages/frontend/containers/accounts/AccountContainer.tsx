import { notFound } from 'next/navigation';
import { FC } from 'react';

import { AccountType } from '$api/generated/financerApi';
import { Popper } from '$elements/Popper';
import { AccountDeletePopperItem } from '$features/account/AccountDeletePopperItem';
import { AccountUpdateMarketValuePopperItem } from '$features/account/AccountUpdateMarketValuePopperItem';
import { Layout } from '$layouts/Layout';
import { AccountService } from '$ssr/api/account.service';
import { UserPreferenceService } from '$ssr/api/user-preference.service';
import { UserService } from '$ssr/api/user.service';
import { Account } from '$views/Account';

type AccountContainerProps = {
  id: string;
};

export const AccountContainer: FC<AccountContainerProps> = async ({ id }) => {
  const account = await AccountService.getById(id);
  const theme = await UserService.getOwnUserTheme();
  const marketSettings =
    await UserPreferenceService.getDefaultMarketUpdateSettings();

  if (!account) {
    notFound();
  }

  return (
    <Layout
      title="Account Details"
      backLink="/accounts"
      headerAction={
        <Popper
          items={[
            {
              href: `/accounts/${account.id}/edit`,
              label: 'Edit',
              icon: 'PencilIcon',
            },
          ]}
        >
          <AccountDeletePopperItem id={account.id} />
          {account.type === AccountType.Investment && (
            <AccountUpdateMarketValuePopperItem
              account={account}
              marketSettings={marketSettings}
            />
          )}
        </Popper>
      }
    >
      <Account account={account} userTheme={theme} />
    </Layout>
  );
};