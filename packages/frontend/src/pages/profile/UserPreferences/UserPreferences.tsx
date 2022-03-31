import { NavLink } from 'react-router-dom';

import { Heading } from '../../../components/heading/heading';
import { Icon } from '../../../components/icon/icon';
import { SEO } from '../../../components/seo/seo';

const MvpLink = ({
  link,
  children,
}: {
  link: string;
  children: string;
}): JSX.Element => {
  return (
    <li className="group">
      <div className="relative text-base flex justify-between font-semibold tracking-tight py-4 px-6 after:h-[1px] after:w-full after:absolute after:bg-gray-200 after:bottom-0 focus-within:bg-gray-200 hover:bg-gray-200 group-last:after:hidden overflow-hidden">
        <NavLink to={link} className="focus:outline-none truncate">
          <span className="absolute inset-0" aria-hidden="true" />
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
      <SEO title="User preferences" />
      <div className="bg-blue-financer -mx-6 -mt-8 text-center py-4 mb-6 px-6 relative">
        <NavLink
          to={'/profile'}
          className="absolute left-6 top-1/2 -translate-y-1/2 -translate-x-1/2"
        >
          <span className="sr-only">Go back</span>
          <Icon type={'chevron-left'} className="stroke-white" />
        </NavLink>
        <Heading
          variant="h1"
          className="!text-base !tracking-tight !text-white !font-semibold"
        >
          User preferences
        </Heading>
      </div>
      <ul className="-mx-6 -mt-3">
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
