import clsx from 'clsx';
import Image from 'next/image';
import { FC } from 'react';

import { Container } from './Container';

import { Navigation } from '$blocks/Navigation/Navigation';
import { Link } from '$elements/Link';

export const Header: FC = () => {
  return (
    <header
      className={clsx(
        'theme-layer-color vt-name-[navigation] z-[100] pb-safe',
        'fixed left-0 right-0 max-lg:bottom-0 lg:top-0',
        'lg:py-4',
      )}
    >
      <Container
        className={clsx('lg:px-8', 'lg:flex lg:gap-8 lg:justify-between')}
      >
        <Link
          href="/"
          className={clsx('inline-flex items-center gap-3', 'max-lg:hidden')}
        >
          <Image
            src="/logo.svg"
            alt="Financer logo"
            className="w-12 h-12"
            width={48}
            height={48}
          />
          <h2 className="text-xl font-semibold tracking-tight uppercase theme-text-primary">
            Financer
          </h2>
        </Link>
        <Navigation />
      </Container>
    </header>
  );
};
