import clsx from 'clsx';
import { FC } from 'react';

import { Heading } from '@/elements/Heading';

export const Hero: FC<{ title: string }> = ({ title }) => {
  return (
    <header className={clsx('vt-name-[hero]', 'mb-6')}>
      <Heading variant="h1" testId="page-main-heading" className="text-white">
        {title}
      </Heading>
    </header>
  );
};
