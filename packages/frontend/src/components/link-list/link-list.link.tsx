import { NavLink } from 'react-router-dom';

import { isExternalLink } from '../button/button';
import { Icon, IconName } from '../icon/icon';

interface LinkListLinkProps {
  icon?: IconName;
  children: string;
  link: string;
  testId?: string;
  className?: string;
}

export const LinkListLink = ({
  icon,
  link,
  children,
  testId,
  className = '',
}: LinkListLinkProps): JSX.Element => {
  return (
    <div
      className={`relative flex gap-4 items-center focus-within:bg-gray-200 hover:bg-gray-200 overflow-hidden pl-4 ${className}`}
      data-testid={testId}
    >
      {icon && <Icon type={icon} className="stroke-black flex-shrink-0" />}
      <span className="text-base flex justify-between font-semibold tracking-tight py-4 pr-4 after:h-[1px] after:w-full after:absolute after:bg-gray-200 after:bottom-0 group-last:after:hidden flex-1 overflow-hidden">
        {isExternalLink(link) ? (
          <a href={link} className="focus:outline-none truncate">
            <span className="absolute inset-0" aria-hidden="true" />
            {children}
          </a>
        ) : (
          <NavLink to={link} className="focus:outline-none truncate">
            <span className="absolute inset-0" aria-hidden="true" />
            {children}
          </NavLink>
        )}
        <Icon
          type={'chevron-right'}
          className=" stroke-gray-300 flex-shrink-0"
        />
      </span>
    </div>
  );
};
