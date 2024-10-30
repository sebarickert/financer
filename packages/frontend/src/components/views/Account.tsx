import clsx from 'clsx';
import { FC, useMemo } from 'react';

import { AccountBalanceHistoryChart } from '../../views/accounts/account.balance-history-chart';

import { AccountDto, Theme } from '$api/generated/financerApi';
import { BalanceDisplay } from '$blocks/BalanceDisplay';
import { DetailsList } from '$blocks/details-list/details-list';
import { DetailsItem } from '$blocks/details-list/details-list.item';
import { TransactionListWithMonthlyPager } from '$blocks/TransactionListWithMonthlyPager/TransactionListWithMonthlyPager';
import { accountTypeIconMapping } from '$constants/account/accountTypeMapping';
import { IconName } from '$elements/Icon';
import { LoaderSuspense } from '$elements/loader/loader-suspense';
import { capitalize } from '$utils/capitalize';

type AccountProps = {
  account: AccountDto;
  userTheme: Theme;
};

export const Account: FC<AccountProps> = ({ account, userTheme }) => {
  const accountDetails: DetailsItem[] = useMemo(
    () => [
      {
        icon: 'InformationCircleIcon' as IconName,
        label: 'Account Type',
        description: capitalize(
          account.type.replaceAll('_', ' ').toLowerCase(),
        ),
      },
    ],
    [account.type],
  );

  return (
    <section className="grid gap-8">
      <div className={clsx('grid gap-2')}>
        <div className="grid gap-8 p-6 py-8 theme-layer-color">
          <BalanceDisplay
            amount={account.balance}
            iconName={accountTypeIconMapping[account.type]}
            testId={'account-balance'}
            childTestId={'account-name'}
          >
            {account.name}
          </BalanceDisplay>
        </div>
        <div className="p-6 theme-layer-color">
          <DetailsList testId="account-details" items={accountDetails} />
        </div>
      </div>
      <LoaderSuspense>
        <AccountBalanceHistoryChart
          accountId={account.id}
          userTheme={userTheme}
        />
      </LoaderSuspense>
      <TransactionListWithMonthlyPager
        filterOptions={{ accountId: account.id }}
      />
    </section>
  );
};
