import { NavLink } from 'react-router-dom';

import { Heading } from '../heading/heading';
import { Icon } from '../icon/icon';

interface MobileHeaderProps {
  backLink?: string;
  children: string;
}

export const MobileHeader = ({
  backLink,
  children,
}: MobileHeaderProps): JSX.Element => {
  return (
    <div className="bg-blue-financer text-center py-4 px-6 fixed top-0 left-0 right-0 z-50">
      {backLink && (
        <NavLink
          to={backLink}
          className="absolute left-6 top-1/2 -translate-y-1/2 -translate-x-1/2"
        >
          <span className="sr-only">Go back</span>
          <Icon type={'chevron-left'} className="stroke-white" />
        </NavLink>
      )}
      <Heading
        variant="h1"
        className="!text-lg !tracking-tight !text-white !font-semibold"
      >
        {children}
      </Heading>
    </div>
  );
};
