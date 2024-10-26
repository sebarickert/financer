import clsx from 'clsx';
import { FC } from 'react';

import { Container } from './Container';

import { Logo } from '$blocks/Logo';
import { Navigation } from '$blocks/Navigation/Navigation';
import { Link } from '$elements/Link';

export const Header: FC = () => {
  return (
    <header
      className={clsx(
        'theme-layer-color vt-name-[navigation] z-[100] pb-safe',
        'theme-border-primary max-lg:border-t lg:border-b',
        'fixed left-0 right-0 max-lg:bottom-0 lg:top-0',
        'lg:py-4',
      )}
    >
      <Container
        className={clsx('lg:px-8', 'lg:flex lg:items-center lg:gap-20')}
      >
        <Link
          haptic="heavy"
          href="/"
          className={clsx('max-lg:hidden lg:inline-flex')}
        >
          <Logo />
        </Link>
        <Navigation />
      </Container>
    </header>
  );
};
