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
        'bg-layer/85 backdrop-blur',
        'vt-name-[navigation] z-[100] focus-within:z-[101] pb-safe',
        'max-lg:border-t lg:border-none lg:shadow-[inset_0_-1px] lg:shadow-border-primary',
        'fixed left-0 right-0 max-lg:bottom-0 lg:top-0',
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
