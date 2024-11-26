import { FC, useMemo } from 'react';

import {
  AccountBalanceHistoryDto,
  AccountDto,
} from '$api/generated/financerApi';
import { BalanceDisplay } from '$blocks/BalanceDisplay';
import { DetailsList } from '$blocks/details-list/details-list';
import { DetailsItem } from '$blocks/details-list/details-list.item';
import { EmptyContentBlock } from '$blocks/EmptyContentBlock';
import { IconName } from '$elements/Icon';
import { AccountBalanceHistoryChart } from '$features/account/AccountBalanceHistoryChart';
import { TransactionListWithMonthlyPager } from '$features/transaction/TransactionListWithMonthlyPager/TransactionListWithMonthlyPager';
import { capitalize } from '$utils/capitalize';

type AccountProps = {
  account: AccountDto;
  balanceHistory: AccountBalanceHistoryDto[];
};

export const Account: FC<AccountProps> = ({ account, balanceHistory }) => {
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
      {balanceHistory.length < 3 && (
        <EmptyContentBlock
          title="Not Enough Data Yet"
          icon="RectangleGroupIcon"
        >
          There isn&apos;t enough data to generate a meaningful balance history.
          Add more transactions to track your financial trends over time.
        </EmptyContentBlock>
      )}
      {balanceHistory.length >= 3 && (
        <AccountBalanceHistoryChart
          data={balanceHistory}
          // className='lg:h-[375px] [&_[data-slot="chart"]]:lg:h-[279px] [&_[data-slot="chart"]]:lg:aspect-auto'
        />
      )}
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
