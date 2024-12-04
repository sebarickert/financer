import { ChartLine, Info } from 'lucide-react';
import { FC, useMemo } from 'react';

import {
  AccountBalanceHistoryDto,
  AccountDto,
} from '$api/generated/financerApi';
import { BalanceDisplay } from '$blocks/BalanceDisplay';
import { DetailsList, DetailsItem } from '$blocks/DetailsList';
import { InfoMessageBlock } from '$blocks/InfoMessageBlock';
import { ACCOUNT_TYPE_MAPPING } from '$constants/account/ACCOUNT_TYPE_MAPPING';
import { AccountBalanceHistoryChart } from '$features/account/AccountBalanceHistoryChart';
import { TransactionListWithMonthlyPager } from '$features/transaction/TransactionListWithMonthlyPager/TransactionListWithMonthlyPager';

type AccountProps = {
  account: AccountDto;
  balanceHistory: AccountBalanceHistoryDto[];
};

export const Account: FC<AccountProps> = ({ account, balanceHistory }) => {
  const accountDetails: DetailsItem[] = useMemo(
    () => [
      {
        Icon: Info,
        label: 'Account Type',
        description: ACCOUNT_TYPE_MAPPING[account.type].label,
      },
    ],
    [account.type],
  );

  return (
    <section className="grid gap-6">
      <div className="grid gap-6 p-6 rounded-md bg-layer">
        <BalanceDisplay label="Balance" amount={account.balance} />
        <DetailsList testId="account-details" items={accountDetails} />
      </div>
      {balanceHistory.length < 3 && (
        <InfoMessageBlock title="Not Enough Data Yet" Icon={ChartLine}>
          There isn&apos;t enough data to generate a meaningful balance history.
          Add more transactions to track your financial trends over time.
        </InfoMessageBlock>
      )}
      {balanceHistory.length >= 3 && (
        <AccountBalanceHistoryChart data={balanceHistory} />
      )}
      <TransactionListWithMonthlyPager
        filterOptions={{ accountId: account.id }}
      />
    </section>
  );
};
