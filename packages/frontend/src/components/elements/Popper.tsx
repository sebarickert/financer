import clsx from 'clsx';
import { EllipsisVertical, LucideIcon } from 'lucide-react';
import { FC } from 'react';

import { Button } from './Button/Button';
import { Heading } from './Heading';
import { Link } from './Link';

import { List } from '@/blocks/List';

type PopperItem =
  | {
      Icon: LucideIcon;
      label: string;
      href: string;
      popperId?: never;
    }
  | {
      Icon: LucideIcon;
      label: string;
      popperId: string;
      href?: never;
    };

interface PopperProps {
  className?: string;
  items?: PopperItem[];
}

export const Popper: FC<PopperProps> = ({ className, items }) => {
  const popperId = `popper-${crypto.randomUUID()}`;

  const popperItemClasses = clsx(
    'pr-3 w-full text-left!',
    'grid! grid-cols-[40px_1fr] h-11 items-center text-left gap-0!',
    'hover:bg-accent active:bg-accent transition-colors focus-visible:ring-inset',
  );

  return (
    <div className="relative inline-block">
      <Button
        popoverTarget={popperId}
        accentColor="secondary"
        size="icon"
        className={clsx(
          '[anchor-name:--popover-anchor]',
          'max-lg:button-ghost',
        )}
        id="popover-anchor"
        testId="popper-button"
      >
        <EllipsisVertical />
        <span className="sr-only">More options</span>
      </Button>
      <div
        className={clsx(
          'bg-background',
          'min-w-48',
          'p-0 rounded-md lg:mt-2',
          'border',
          'fixed lg:absolute inset-[unset]',
          'supports-anchor-name:right-[anchor(--popover-anchor_right)] supports-anchor-name:top-[anchor(--popover-anchor_bottom)]',
          'ease-in-out duration-200 transition-discrete',
          'opacity-0 open:starting:opacity-0 open:opacity-100',
          'translate-x-0 -translate-y-2',
          'open:starting:translate-x-0 open:starting:-translate-y-2',
          'open:translate-y-0',
          'supports-anchor-name:open:translate-x-0 not-supports-[anchor-name]:open:-translate-x-[calc(100%-calc(var(--spacing)*12))]',
          className,
        )}
        popover="auto"
        id={popperId}
        data-testid="popper-container"
      >
        <Heading className="sr-only">Options</Heading>
        <List>
          {items?.map(
            ({ Icon, label, href, popperId: itemPopperId }, index) => {
              if (href) {
                return (
                  <Link
                    key={index}
                    href={href}
                    className={popperItemClasses}
                    hasHoverEffect={false}
                  >
                    <Icon className="w-5 h-5 place-self-center" />
                    <span>{label}</span>
                  </Link>
                );
              }

              return (
                <Button
                  key={index}
                  accentColor="unstyled"
                  popoverTarget={itemPopperId}
                  className={popperItemClasses}
                >
                  <Icon className="w-5 h-5 place-self-center" />
                  <span>{label}</span>
                </Button>
              );
            },
          )}
        </List>
      </div>
    </div>
  );
};
