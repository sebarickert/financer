import { FC, useMemo } from 'react';

import { AccountBalanceHistoryChart } from './account.balance-history-chart';

import { AccountDto, AccountType } from '$api/generated/financerApi';
import { BalanceDisplay } from '$blocks/balance-display/balance-display';
import { DetailsList } from '$blocks/details-list/details-list';
import { TransactionListingWithMonthlyPager } from '$blocks/transaction-listing-with-monthly-pager/transaction-listing.with.monthly-pager';
import { accountTypeIconMapping } from '$constants/account/accountTypeMapping';
import { AccountUpdateMarketValueContainer } from '$container/accounts/account.update-market-value.container';
import { Icon, IconName } from '$elements/icon/icon';
import { Link } from '$elements/link/link';
import { LoaderSuspense } from '$elements/loader/loader-suspense';
import { UpdatePageInfo } from '$renderers/seo/updatePageInfo';
import { capitalize } from '$utils/capitalize';

interface AccountProps {
  account: AccountDto;
}

export const Account: FC<AccountProps> = ({ account }) => {
  const accountDetails = useMemo(
    () => [
      {
        icon: IconName.informationCircle,
        label: 'Type',
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
            <Icon type={IconName.pencilSquare} />
          </Link>
        }
      />
      <section>
        <section className="mb-8">
          <BalanceDisplay
            amount={account.balance}
            iconName={accountTypeIconMapping[account.type]}
            testId={'account-balance'}
            childTestId={'account-name'}
          >
            {account.name}
          </BalanceDisplay>
          <DetailsList
            testId="account-details"
            items={accountDetails}
            className="py-4 mt-6 border-t border-b border-gray-dark"
          />
        </section>
        <LoaderSuspense>
          <AccountBalanceHistoryChart accountId={account.id} />
        </LoaderSuspense>
        <div className="grid gap-2 my-6">
          {account.type === AccountType.Investment && (
            <AccountUpdateMarketValueContainer account={account} />
          )}
        </div>
        <TransactionListingWithMonthlyPager
          filterOptions={{ accountId: account.id }}
        />
      </section>
    </>
  );
};
