import clsx from 'clsx';

import { getOwnUser, getOwnUserTheme } from '@/api-service';
import { Logo } from '@/blocks/Logo';
import { Navigation } from '@/blocks/Navigation/Navigation';
import { UserMenu } from '@/components/UserMenu';
import { Link } from '@/elements/Link';

export const Header = async () => {
  const { roles } = await getOwnUser();
  const theme = await getOwnUserTheme();

  return (
    <>
      <header
        className={clsx(
          'bg-black',
          'fixed left-0 right-0 top-0 z-(--z-header)',
        )}
        data-vt
        style={{
          '--vt-name': 'header',
        }}
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
        data-vt
        style={{
          '--vt-name': 'navigation',
        }}
        className={clsx(
          'bg-layer/85 backdrop-blur',
          'pb-safe',
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
