import clsx from 'clsx';
import { NavLink } from 'react-router-dom';

import { isExternalLink } from '../button/button';
import { Icon, IconName } from '../icon/icon';

interface LinkListLinkProps {
  icon?: IconName;
  children: React.ReactNode;
  link: string;
  testId?: string;
  entityTitle?: string;
  className?: string;
}

export const LinkListLink = ({
  icon,
  link,
  children,
  testId,
  className = '',
  entityTitle,
}: LinkListLinkProps): JSX.Element => {
  const linkClasses = clsx(
    'relative flex gap-4 items-center focus-within:bg-gray-50 hover:bg-gray-50 overflow-hidden pl-4 lg:rounded-md',
    {
      [className]: true,
    }
  );

  const linkContent = (
    <>
      {icon && (
        <span className="bg-gray-50 h-11 w-11 rounded-full inline-flex items-center justify-center">
          <Icon
            type={icon}
            className="stroke-black flex-shrink-0 pointer-events-none"
          />
        </span>
      )}
      <span className="text-base items-center flex justify-between font-medium tracking-tight py-4 pr-4 after:h-[1px] after:w-full after:absolute after:bg-gray-100 after:bottom-0 flex-1 overflow-hidden">
        <span className="truncate">{children}</span>
        <Icon
          type={IconName.chevronRight}
          className=" stroke-gray-300 flex-shrink-0 pointer-events-none"
        />
      </span>
    </>
  );

  return (
    <>
      {isExternalLink(link) ? (
        <a
          href={link}
          className={linkClasses}
          data-testid={testId}
          data-entity-title={entityTitle ?? undefined}
        >
          {linkContent}
        </a>
      ) : (
        <NavLink
          to={link}
          className={linkClasses}
          data-testid={testId}
          data-entity-title={entityTitle ?? undefined}
        >
          {linkContent}
        </NavLink>
      )}
    </>
  );
};
