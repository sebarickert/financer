import clsx from 'clsx';
import { NavLink } from 'react-router-dom';

import { isExternalLink } from '../button/button';
import { IconName, Icon } from '../icon/icon';

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
    'relative flex gap-4 items-center focus-within:bg-gray-dark hover:bg-gray-dark overflow-hidden pl-4 lg:rounded-md',
    {
      [className]: true,
    }
  );

  const linkContent = (
    <>
      {icon && (
        <span className="inline-flex items-center justify-center rounded-full bg-gray h-11 w-11">
          <Icon
            type={icon}
            className="flex-shrink-0 pointer-events-none stroke-charcoal"
          />
        </span>
      )}
      <span className="text-base items-center flex justify-between font-medium tracking-tight py-5 pr-4 after:h-[1px] after:w-full after:absolute after:bg-gray-dark after:bottom-0 flex-1 overflow-hidden">
        <span className="truncate">{children}</span>
        <Icon
          type={IconName.chevronRight}
          className="flex-shrink-0 pointer-events-none stroke-gray-darkest"
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
