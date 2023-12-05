import clsx from 'clsx';

import { AccountBalanceHistoryChart } from './account-balance-history-chart';
import { AccountDelete } from './account-modals/account-delete';
import {
  AccountUpdateMarketValue,
  AccountUpdateMarketValueFormFields,
} from './account-modals/account-update-market-value';

import { AccountDto } from '$api/generated/financerApi';
import { accountTypeIconMapping } from '$blocks/accounts-list/accounts-list';
import { BalanceDisplay } from '$blocks/balance-display/balance-display';
import { LatestAccountTransactions } from '$blocks/latest-account-transactions/latest-account-transactions';
import { initialMonthFilterOptions } from '$blocks/monthly-transaction-list/monthly-transaction-list';
import { Pager } from '$blocks/pager/pager';
import { monthNames } from '$constants/months';
import { Alert } from '$elements/alert/alert';
import { ButtonGroup } from '$elements/button/button.group';
import { ButtonInternal } from '$elements/button/button.internal';
import { Heading } from '$elements/heading/heading';
import { Icon, IconName } from '$elements/icon/icon';
import { InfoCard } from '$elements/info-card/info-card';
import { LinkList } from '$elements/link-list/link-list';
import { LinkListLink } from '$elements/link-list/link-list.link';
import { LoaderSuspense } from '$elements/loader/loader-suspense';
import { LoaderFullScreen } from '$elements/loader/loader.fullscreen';
import { UpdatePageInfo } from '$renderers/seo/updatePageInfo';
import { capitalize } from '$utils/capitalize';
import { formatCurrency } from '$utils/formatCurrency';

interface AccountProps {
  isLoading: boolean;
  account: AccountDto;
  filterOptions: typeof initialMonthFilterOptions;
  firstAvailableTransaction: Date;
  errors: string[];
  onMonthOptionChange: (direction: 'next' | 'previous') => void;
  onMarketValueUpdate: (
    closeDialog: () => void
  ) => (value: AccountUpdateMarketValueFormFields) => void;
  onDelete: () => void;
}

export const Account = ({
  isLoading,
  account,
  filterOptions,
  firstAvailableTransaction,
  errors,
  onMonthOptionChange,
  onMarketValueUpdate,
  onDelete,
}: AccountProps): JSX.Element | null => {
  const pageVisibleYear = filterOptions.year;
  const pageVisibleMonth = monthNames[filterOptions.month - 1];

  return (
    <>
      {isLoading && <LoaderFullScreen />}
      <UpdatePageInfo
        title={`Account Details`}
        backLink="/accounts"
        headerAction={
          <ButtonInternal
            link={`/accounts/${account._id}/edit`}
            className="inline-flex items-center justify-center -mr-3 h-11 w-11"
          >
            <span className="sr-only">Edit</span>
            <Icon type={IconName.pencilSquare} />
          </ButtonInternal>
        }
      />
      {errors.length > 0 && (
        <Alert additionalInformation={errors} testId="account-page-errors">
          There were {errors.length} errors with your submission
        </Alert>
      )}
      <section>
        <BalanceDisplay
          amount={account.balance}
          iconName={accountTypeIconMapping[account.type]}
        >
          {account.name}
        </BalanceDisplay>
        <LoaderSuspense>
          <AccountBalanceHistoryChart accountId={account._id} />
        </LoaderSuspense>
        <div className="grid gap-2 mt-6">
          {account.type === 'investment' && (
            <AccountUpdateMarketValue
              currentValue={account.balance}
              onUpdate={onMarketValueUpdate}
            />
          )}
          <AccountDelete onDelete={onDelete} />
        </div>
        <Pager
          className="mt-8 mb-2"
          pagerOptions={{
            nextPage: {
              isAvailable: !(
                filterOptions.month === initialMonthFilterOptions.month &&
                filterOptions.year === initialMonthFilterOptions.year
              ),
              load: () => onMonthOptionChange('next'),
            },
            previousPage: {
              isAvailable: !(
                filterOptions.month ===
                  firstAvailableTransaction.getMonth() + 1 &&
                filterOptions.year === firstAvailableTransaction.getFullYear()
              ),
              load: () => onMonthOptionChange('previous'),
            },
          }}
        >{`${pageVisibleMonth} ${pageVisibleYear}`}</Pager>
        <LoaderSuspense>
          <LatestAccountTransactions
            accountId={account._id}
            filterOptions={filterOptions}
          />
        </LoaderSuspense>
      </section>
    </>
  );
};
