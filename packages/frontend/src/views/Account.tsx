import { FC, useMemo } from 'react';

import { AccountDto, Theme } from '$api/generated/financerApi';
import { BalanceDisplay } from '$blocks/BalanceDisplay';
import { DetailsList } from '$blocks/details-list/details-list';
import { DetailsItem } from '$blocks/details-list/details-list.item';
import { IconName } from '$elements/Icon';
import { TransactionListWithMonthlyPager } from '$features/transaction/TransactionListWithMonthlyPager/TransactionListWithMonthlyPager';
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
    <section className="grid gap-6">
      {/* <LoaderSuspense>
        <AccountBalanceHistoryChart
          accountId={account.id}
          userTheme={userTheme}
        />
      </LoaderSuspense> */}
      <div className="grid gap-6 p-6 rounded-md bg-layer">
        <BalanceDisplay label="Balance" amount={account.balance} />
        <DetailsList testId="account-details" items={accountDetails} />
      </div>
      <TransactionListWithMonthlyPager
        filterOptions={{ accountId: account.id }}
      />
    </section>
  );
};
