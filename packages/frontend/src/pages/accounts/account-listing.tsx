import { AccountsList } from '$blocks/accounts-list/accounts-list';
import { AccountsListRowProps } from '$blocks/accounts-list/accounts-list.row';
import { IconName } from '$elements/icon/icon';
import { LinkList } from '$elements/link-list/link-list';
import { LinkListLink } from '$elements/link-list/link-list.link';
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
      <UpdatePageInfo title="Accounts" />
      <section className="grid gap-8">
        <section>
          <LinkList>
            <LinkListLink
              testId="add-account"
              link="/accounts/add"
              icon={IconName.viewGridAdd}
            >
              Add account
            </LinkListLink>
          </LinkList>
        </section>
        <Loader isLoading={isFetching}>
          <AccountsList label="Savings" rows={accounts.savings} />
          <AccountsList label="Investments" rows={accounts.investments} />
          <AccountsList label="Credits and Loans" rows={accounts.loans} />
        </Loader>
      </section>
    </>
  );
};
