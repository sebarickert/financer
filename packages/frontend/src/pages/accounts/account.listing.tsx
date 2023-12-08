import { AccountsList } from '$blocks/accounts-list/accounts-list';
import { AccountsListRowProps } from '$blocks/accounts-list/accounts-list.row';
import { ButtonInternal } from '$elements/button/button.internal';
import { Icon, IconName } from '$elements/icon/icon';
import { Loader } from '$elements/loader/loader';
import { UpdatePageInfo } from '$renderers/seo/updatePageInfo';

interface Accounts {
  savings: AccountsListRowProps[];
  investments: AccountsListRowProps[];
  loans: AccountsListRowProps[];
}

interface AccountListingProps {
  isFetching: boolean;
  accounts: Accounts;
}

export const AccountListing = ({
  isFetching,
  accounts,
}: AccountListingProps): JSX.Element => {
  return (
    <>
      <UpdatePageInfo
        title="Accounts"
        headerAction={
          <ButtonInternal
            link="/accounts/add"
            className="inline-flex items-center justify-center -mr-3 h-11 w-11"
          >
            <span className="sr-only">Add account</span>
            <Icon type={IconName.viewGridAdd} />
          </ButtonInternal>
        }
      />
      <section className="grid gap-8">
        <Loader isLoading={isFetching}>
          <AccountsList label="Savings" rows={accounts.savings} />
          <AccountsList label="Investments" rows={accounts.investments} />
          <AccountsList label="Credits and Loans" rows={accounts.loans} />
        </Loader>
      </section>
    </>
  );
};
