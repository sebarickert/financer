import clsx from 'clsx';
import { FC, useId } from 'react';

import { Button } from './Button1/Button';
import { Heading } from './Heading';
import { Icon, IconName } from './Icon';
import { Link } from './Link';

import { List } from '$blocks/List';

type PopperItem = {
  icon: IconName;
  label: string;
  href: string;
};

type PopperProps = {
  className?: string;
  items: PopperItem[];
  children?: React.ReactNode | React.ReactNode[];
};

export const Popper: FC<PopperProps> = ({ className, items, children }) => {
  const popperId = useId();

  const popperItemClasses = clsx(
    'flex items-center gap-2 [&_svg]:pointer-events-none [&_svg]:shrink-0 theme-bg-color-with-hover',
    'rounded-md text-center whitespace-nowrap',
    'py-2.5 h-11 pl-2 pr-[18px] text-base',
  );

  return (
    <div className="relative inline-block">
      <Button
        popoverTarget={popperId}
        accentColor="secondary"
        size="icon"
        className={clsx('anchor-name-[popover-anchor]')}
        id="popover-anchor"
        testId="popper-button"
      >
        <Icon name="EllipsisVerticalIcon" />
        <span className="sr-only">More options</span>
      </Button>
      <div
        className={clsx(
          'theme-bg-color theme-text-primary',
          'min-w-48 shadow',
          'p-2 rounded-md lg:mt-2',
          'border theme-border-primary',
          'fixed lg:absolute inset-[unset]',
          'supports-[anchor-name]:right-anchor-[popover-anchor] supports-[anchor-name]:top-anchor-[popover-anchor,bottom]',
          'transition-all !transition-allow-discrete duration-100 ease-in open:ease-out',
          'opacity-0 starting:opacity-0 open:opacity-100',
          'starting:translate-x-0 starting:-translate-y-2',
          'translate-x-0 -translate-y-2',
          'supports-[anchor-name]:open:translate-x-0 open:translate-y-0 open:-translate-x-[calc(100%-44px)]',
          className,
        )}
        popover="auto"
        id={popperId}
        data-testid="popper-container"
      >
        <Heading disableResponsiveSizing variant="h2" className="sr-only">
          Options
        </Heading>
        <List hasItemRoundness>
          {items.map(({ icon, label, href }, index) => {
            return (
              <Link key={index} href={href} className={popperItemClasses}>
                <Icon name={icon} />
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
