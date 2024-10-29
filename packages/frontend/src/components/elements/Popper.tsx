import clsx from 'clsx';
import { FC, useId } from 'react';

import { Button } from './button/button';
import { Icon, IconName } from './Icon';
import { Link } from './Link';

import { List } from '$blocks/List';

type PopperItem = {
  icon: IconName;
  label: string;
  href: string;
};

type PopperProps = {
  id: string;
  className?: string;
  items: PopperItem[];
  children?: React.ReactNode | React.ReactNode[];
};

export const Popper: FC<PopperProps> = ({ className, items, children }) => {
  const popperId = useId();

  const popperItemClasses = clsx(
    'flex items-center gap-2 px-2 py-1.5 theme-bg-color-with-hover',
  );

  return (
    <div className="relative inline-block">
      <Button
        popoverTarget={popperId}
        accentColor="secondary"
        className={clsx(
          '!h-11 !w-11 !p-0 inline-flex justify-center items-center',
          'anchor-name-[popover-anchor]',
        )}
        id="popover-anchor"
      >
        <Icon name="EllipsisVerticalIcon" />
      </Button>
      <div
        className={clsx(
          'theme-bg-color theme-text-primary',
          'min-w-48 shadow',
          'p-2 rounded-md lg:mt-2',
          'border theme-border-primary',
          'absolute inset-[unset] right-anchor-[popover-anchor] top-anchor-[popover-anchor,bottom]',
          'transition-all !transition-allow-discrete duration-100 ease-in open:ease-out',
          'opacity-0 starting:opacity-0 open:opacity-100',
          'translate-x-0 -translate-y-2 starting:translate-x-0 starting:-translate-y-2 open:translate-x-0 open:translate-y-0',
          className,
        )}
        popover="auto"
        id={popperId}
      >
        <List hasItemRoundness>
          {items.map(({ icon, label, href }, index) => {
            return (
              <Link key={index} href={href} className={popperItemClasses}>
                <Icon name={icon} className="!w-5 !h-5" />
                <span className="inline-block pr-2">{label}</span>
              </Link>
            );
          })}
          {children}
        </List>
      </div>
    </div>
  );
};
