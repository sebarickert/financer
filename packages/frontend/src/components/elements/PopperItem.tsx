import clsx from 'clsx';
import { LucideIcon } from 'lucide-react';
import { FC } from 'react';

import { Button } from '@/elements/Button/Button';
import { Link } from '@/elements/Link';

type PopperItem =
  | {
      icon: LucideIcon;
      label: string;
      href: string;
      drawerId?: never;
    }
  | {
      icon: LucideIcon;
      label: string;
      drawerId: string;
      href?: never;
    };

export const PopperItem: FC<PopperItem> = ({
  icon: Icon,
  label,
  href,
  drawerId,
}) => {
  const popperItemClasses = clsx(
    'flex w-full items-center gap-2 text-sm font-normal cursor-pointer py-1.5 px-2 rounded-sm justify-start',
    'focus-visible:focus-highlight hover:bg-accent',
    '[&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
    'text-muted-foreground hover:text-foreground!',
    'aria-[current="page"]:text-foreground!',
  );

  const content = (
    <>
      <Icon />
      <span>{label}</span>
    </>
  );

  if (href) {
    return (
      <Link
        href={href}
        className={popperItemClasses}
        hasHoverEffect={false}
        testId="popper-item"
      >
        {content}
      </Link>
    );
  }

  return (
    <Button
      accentColor="unstyled"
      className={popperItemClasses}
      commandFor={drawerId}
      command="show-modal"
      testId="popper-item"
    >
      {content}
    </Button>
  );
};
