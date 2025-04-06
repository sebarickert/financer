'use client';

import { useClickAway } from '@uidotdev/usehooks';
import clsx from 'clsx';
import {
  ChartNoAxesCombined,
  Cog,
  Download,
  Layers,
  LogOut,
  LucideIcon,
  Tag,
  TriangleAlert,
  UserRound,
} from 'lucide-react';
import { usePathname } from 'next/navigation';
import { FC, useEffect, useId, useState } from 'react';

import { Role, Theme } from '@/api/ssr-financer-api';
import { ThemeSwitcher } from '@/blocks/ThemeSwitcher/ThemeSwitcher';
import { settingsPaths } from '@/constants/settingsPaths';
import { Link } from '@/elements/Link';

export const UserMenu: FC<{ roles: readonly Role[]; theme: Theme }> = ({
  roles,
  theme,
}) => {
  const userMenuId = useId();
  const buttonId = useId();
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const ref = useClickAway<HTMLDivElement>(({ target }) => {
    if (
      (target as HTMLElement | null)?.getAttribute('id') === buttonId ||
      (target as HTMLElement | null)?.getAttribute('data-id') ===
        `${buttonId}/span`
    )
      return;
    setIsOpen(false);
  });

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    } else {
      document.removeEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  return (
    <div className="relative inline-flex">
      <button
        id={buttonId}
        aria-expanded={isOpen}
        aria-controls={userMenuId}
        aria-haspopup="true"
        onClick={() => {
          setIsOpen(!isOpen);
        }}
        className={clsx(
          'relative rounded-full cursor-pointer',
          'focus-visible:focus-highlight',
        )}
        data-testid="user-menu-button"
      >
        <span
          className="top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 absolute size-12"
          data-id={`${buttonId}/span`}
        />
        <div
          className={clsx(
            'pointer-events-none select-none',
            'inline-flex justify-center items-center',
            'size-8 rounded-full text-center',
            'bg-layer-dark text-white hover:bg-accent-dark',
          )}
        >
          <UserRound className="size-4" />
          <span className="sr-only">Open user navigation menu</span>
        </div>
      </button>
      <div
        aria-hidden={!isOpen}
        id={userMenuId}
        ref={ref}
        onBlur={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget)) {
            setIsOpen(false);
          }
        }}
        className={clsx(
          'transition-discrete transition-all',
          'starting:opacity-0 starting:-translate-y-4',
          'aria-hidden:hidden aria-hidden:opacity-0',
          'min-w-[8rem] overflow-hidden rounded-md p-1 shadow-md w-56',
          'border bg-layer',
          'absolute top-[calc(100%+var(--spacing))] right-0',
        )}
        data-testid="user-menu-container"
      >
        <div role="group">
          <UserMenuItem href={settingsPaths.default} icon={Cog}>
            Settings
          </UserMenuItem>
        </div>
        <div role="separator" className="h-px my-1 -mx-1 bg-accent" />
        <div role="group">
          <UserMenuItem href="/categories/" icon={Tag}>
            Categories
          </UserMenuItem>
          <UserMenuItem href="/templates/" icon={Layers}>
            Templates
          </UserMenuItem>
          <UserMenuItem href="/statistics/" icon={ChartNoAxesCombined}>
            Statistics
          </UserMenuItem>
        </div>
        <div role="separator" className="h-px my-1 -mx-1 bg-accent" />
        <div role="group">
          {roles.includes(Role.TEST_USER) && (
            <UserMenuItem
              href={settingsPaths.dataOverwrite}
              icon={TriangleAlert}
            >
              Overwrite User Data
            </UserMenuItem>
          )}
          <UserMenuItem href={settingsPaths.dataDownload} icon={Download}>
            Download My Data
          </UserMenuItem>
        </div>
        <div role="separator" className="h-px my-1 -mx-1 bg-accent" />
        <div role="group">
          <ThemeSwitcher theme={theme} />
        </div>
        <div role="separator" className="h-px my-1 -mx-1 bg-accent" />
        <UserMenuItem href="/auth/logout" icon={LogOut}>
          Log out
        </UserMenuItem>
      </div>
    </div>
  );
};

const UserMenuItem: FC<
  {
    children: string;
    icon: LucideIcon;
    vtName?: string;
  } & (
    | { href: string; onClick?: never }
    | {
        href?: never;
        onClick: () => void;
      }
  )
> = ({ href, children, icon: Icon, onClick, vtName }) => {
  const classes = clsx(
    'flex w-full items-center gap-2 text-sm cursor-pointer py-1.5 px-2 rounded-sm',
    'focus-visible:focus-highlight hover:bg-accent',
    '[&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
    'text-muted-foreground hover:text-foreground!',
    'aria-[current="page"]:text-foreground!',
  );

  const content = (
    <>
      <Icon />
      <span>{children}</span>
    </>
  );

  if (onClick) {
    return (
      <button
        onClick={onClick}
        type="button"
        className={classes}
        data-testid="user-menu-item"
      >
        {content}
      </button>
    );
  }

  return (
    <Link
      href={href}
      className={classes}
      testId="user-menu-item"
      vtName={vtName}
    >
      {content}
    </Link>
  );
};
