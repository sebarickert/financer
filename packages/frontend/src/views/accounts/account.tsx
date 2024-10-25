import clsx from 'clsx';
import { FC, useMemo } from 'react';

import { AccountBalanceHistoryChart } from './account.balance-history-chart';

import { AccountDto, AccountType, Theme } from '$api/generated/financerApi';
import { BalanceDisplay } from '$blocks/BalanceDisplay';
import { DetailsList } from '$blocks/details-list/details-list';
import { DetailsItem } from '$blocks/details-list/details-list.item';
import { TransactionListWithMonthlyPager } from '$blocks/TransactionListWithMonthlyPager/TransactionListWithMonthlyPager';
import { accountTypeIconMapping } from '$constants/account/accountTypeMapping';
import { AccountUpdateMarketValueContainer } from '$container/accounts/account.update-market-value.container';
import { Icon, IconName } from '$elements/Icon';
import { Link } from '$elements/Link';
import { LoaderSuspense } from '$elements/loader/loader-suspense';
import { UpdatePageInfo } from '$renderers/seo/updatePageInfo';
import { capitalize } from '$utils/capitalize';

interface AccountProps {
  account: AccountDto;
  userTheme: Theme;
}

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
    <>
      <UpdatePageInfo
        backLink="/accounts"
        headerAction={
          <Link
            href={`/accounts/${account.id}/edit`}
            className="inline-flex items-center justify-center -mr-3 h-11 w-11"
            testId="edit-account"
          >
            <span className="sr-only">Edit</span>
            <Icon name="PencilIcon" />
          </Link>
        }
      />
      <section className="grid gap-6">
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
        {account.type === AccountType.Investment && (
          <AccountUpdateMarketValueContainer account={account} />
        )}
        <TransactionListWithMonthlyPager
          filterOptions={{ accountId: account.id }}
        />
      </section>
    </>
  );
};
