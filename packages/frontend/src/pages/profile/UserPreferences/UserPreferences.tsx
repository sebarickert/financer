import { NavLink } from 'react-router-dom';

import { Heading } from '../../../components/heading/heading';
import { Icon } from '../../../components/icon/icon';
import { UpdatePageInfo } from '../../../components/seo/updatePageInfo';

const MvpLink = ({
  link,
  children,
}: {
  link: string;
  children: string;
}): JSX.Element => {
  return (
    <li className="group">
      <div className="relative text-base flex justify-between font-semibold tracking-tight py-4 px-6 after:h-[1px] after:w-full after:absolute after:bg-gray-200 after:bottom-0 focus-within:bg-gray-200 hover:bg-gray-200 group-last:after:hidden overflow-hidden select-none">
        <NavLink to={link} className="focus:outline-none truncate">
          <span className="absolute inset-0 select-none" aria-hidden="true" />
          <span className="select-none">{children}</span>
        </NavLink>
        <Icon
          type={'chevron-right'}
          className="translate-x-1/2 stroke-gray-300"
        />
      </div>
    </li>
  );
};

export const UserPreferences = (): JSX.Element => {
  return (
    <>
      <UpdatePageInfo title="User preferences" backLink={'/profile'} />
      <Heading variant="h1" className="mb-4 lg:mb-6">
        User preferences
      </Heading>
      <ul className="-mx-6">
        <MvpLink link="default-income-account">Default income account</MvpLink>
        <MvpLink link="default-expense-account">
          Default expense account
        </MvpLink>
        <MvpLink link="default-transfer-source-account">
          Default transfer source account
        </MvpLink>
        <MvpLink link="default-transfer-target-account">
          Default transfer target account
        </MvpLink>
        <MvpLink link="transaction-list-chunk-size">
          Transaction list chunk size
        </MvpLink>
        <MvpLink link="market-update-settings">Market update settings</MvpLink>
      </ul>
    </>
  );
};
