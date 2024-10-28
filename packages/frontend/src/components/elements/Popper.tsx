import clsx from 'clsx';
import { FC } from 'react';

import { Icon, IconName } from './Icon';
import { Link } from './Link';

import { List } from '$blocks/List';

type PopperItemBase = {
  icon: IconName;
  label: string;
};

type PopperItemWithHref = PopperItemBase & {
  href: string;
  onClick?: never;
};

type PopperItemWithOnClick = PopperItemBase & {
  onClick: () => void;
  href?: never;
};

type PopperItem = PopperItemWithHref | PopperItemWithOnClick;

type PopperProps = {
  id: string;
  className?: string;
  items: PopperItem[];
};

export const Popper: FC<PopperProps> = ({ id, className, items }) => {
  const popperItemClasses = clsx(
    'flex items-center gap-2 px-2 py-1.5 theme-bg-color-with-hover',
  );

  return (
    <div
      className={clsx(
        'theme-bg-color theme-text-primary',
        'min-w-48 shadow',
        'p-2 rounded-md',
        'border theme-border-primary',
        className,
      )}
      popover="auto"
      id={id}
    >
      <List hasItemRoundness>
        {items.map(({ icon, label, href, onClick }, index) => {
          if (href) {
            return (
              <Link key={index} href={href} className={popperItemClasses}>
                <Icon name={icon} className="w-5 h-5" />
                <span className="inline-block pr-2">{label}</span>
              </Link>
            );
          }

          if (onClick) {
            return (
              <button
                key={index}
                type="button"
                onClick={onClick}
                className={popperItemClasses}
              >
                <Icon name={icon} className="w-5 h-5" />
                <span className="inline-block pr-2">{label}</span>
              </button>
            );
          }

          return null;
        })}
      </List>
    </div>
  );
};
