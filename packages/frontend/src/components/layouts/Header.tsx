import clsx from 'clsx';

import { Logo } from '@/blocks/Logo';
import { Navigation } from '@/blocks/Navigation/Navigation';
import { UserMenu } from '@/components/UserMenu';
import { Link } from '@/elements/Link';
import { UserService } from '@/ssr/api/UserService';

export const Header = async () => {
  const { roles } = await UserService.getOwnUser();
  const theme = await UserService.getOwnUserTheme();

  return (
    <>
      <header
        className={clsx(
          'vt-name-[header] bg-black',
          'fixed left-0 right-0 top-0 z-(--z-header)',
        )}
      >
        <div
          className={clsx(
            'mx-auto max-w-screen-xl',
            'px-4 h-12 lg:px-8',
            'flex items-center justify-between',
          )}
        >
          <Link haptic="heavy" href="/" className={clsx('inline-flex')}>
            <Logo />
          </Link>
          <div className="inline-flex items-center gap-2">
            <UserMenu roles={roles} theme={theme} />
          </div>
        </div>
      </header>
      <nav
        className={clsx(
          'bg-layer/85 backdrop-blur',
          'vt-name-[navigation] pb-safe',
          'max-lg:border-t lg:border-none lg:shadow-[inset_0_-1px] lg:shadow-accent',
          'fixed left-0 right-0 max-lg:bottom-0 lg:top-(--header-height) z-(--z-navigation)',
        )}
      >
        <div
          className={clsx(
            'mx-auto max-w-screen-xl',
            'lg:px-8',
            'lg:flex lg:items-center lg:gap-20',
          )}
        >
          <Navigation />
        </div>
      </nav>
    </>
  );
};
