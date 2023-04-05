import clsx from 'clsx';

import { AccountBalanceHistoryChart } from './account-balance-history-chart';
import { AccountDeleteModal } from './account-modals/account-delete.modal';
import {
  AccountUpdateMarketValueModal,
  AccountUpdateMarketValueModalFormFields,
} from './account-modals/account-update-market-value.modal';

import { AccountDto } from '$api/generated/financerApi';
import { LatestAccountTransactions } from '$blocks/latest-account-transactions/latest-account-transactions';
import { initialMonthFilterOptions } from '$blocks/monthly-transaction-list/monthly-transaction-list';
import { Pager } from '$blocks/pager/pager';
import { monthNames } from '$constants/months';
import { Alert } from '$elements/alert/alert';
import { Heading } from '$elements/heading/heading';
import { IconName } from '$elements/icon/icon';
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
  ) => (value: AccountUpdateMarketValueModalFormFields) => void;
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
      <UpdatePageInfo title={`${account.name}`} backLink="/accounts" />
      {errors.length > 0 && (
        <Alert additionalInformation={errors} testId="account-page-errors">
          There were {errors.length} errors with your submission
        </Alert>
      )}
      <section className={'mb-6 grid md:grid-cols-2 gap-4 md:gap-6'}>
        <section className={clsx('grid gap-2')}>
          <InfoCard label="Balance" testId="account-balance" isLarge>
            {formatCurrency(account.balance)}
          </InfoCard>
          <InfoCard label="Type" testId="account-type" isSmall>
            {capitalize(account.type)}
          </InfoCard>
        </section>
        <LinkList isVertical>
          {account.type === 'investment' && (
            <AccountUpdateMarketValueModal
              currentValue={account.balance}
              onUpdate={onMarketValueUpdate}
            />
          )}
          <LinkListLink
            link={`/accounts/${account._id}/edit`}
            testId="edit-account"
            icon={IconName.cog}
          >
            Edit account
          </LinkListLink>
          <AccountDeleteModal onDelete={onDelete} />
        </LinkList>
      </section>
      <LoaderSuspense>
        <AccountBalanceHistoryChart accountId={account._id} />
      </LoaderSuspense>
      <section className="flex items-center justify-between mt-8 mb-2">
        <Heading>{`${pageVisibleMonth}, ${pageVisibleYear}`}</Heading>
        <Pager
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
        />
      </section>
      <LoaderSuspense>
        <LatestAccountTransactions
          accountId={account._id}
          filterOptions={filterOptions}
        />
      </LoaderSuspense>
    </>
  );
};
