import { FC } from 'react';

import { AccountDto, AccountType } from '$api/generated/financerApi';
import { AccountList } from '$blocks/AccountList';
import { Icon } from '$elements/Icon';
import { Link } from '$elements/Link';
import { UpdatePageInfo } from '$renderers/seo/updatePageInfo';
import { AccountService } from '$ssr/api/account.service';

const accountCategories = {
  savings: 'savings',
  investments: 'investments',
  loans: 'loans',
} as const;

export const AccountListingContainer: FC = async () => {
  const { data: accounts } = await AccountService.getAll();

  // typescript does not support Object.groupBy but browser and nodejs runtime does
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const groupedAccounts = (Object as any).groupBy(
    accounts,
    ({ type }: AccountDto) => {
      if (type === AccountType.Loan || type === AccountType.Credit) {
        return accountCategories.loans;
      }

      if (type === AccountType.Investment) {
        return accountCategories.investments;
      }

      return accountCategories.savings;
    },
  ) as Record<
    (typeof accountCategories)[keyof typeof accountCategories],
    AccountDto[]
  >;

  return (
    <>
      <UpdatePageInfo
        headerAction={
          <Link
            href="/accounts/add"
            className="inline-flex items-center justify-center -mr-3 h-11 w-11"
            testId="add-account"
          >
            <span className="sr-only">Add account</span>
            <Icon name="PlusIcon" />
          </Link>
        }
      />
      <section className="grid gap-8">
        <AccountList label="Savings" accounts={groupedAccounts.savings} />
        <AccountList
          label="Investments"
          accounts={groupedAccounts.investments}
        />
        <AccountList
          label="Credits and Loans"
          accounts={groupedAccounts.loans}
        />
      </section>
    </>
  );
};
