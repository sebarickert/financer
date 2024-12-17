import clsx from 'clsx';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { FC } from 'react';

import { Button } from '$elements/Button/Button';

type PagerProps = {
  className?: string;
  previousHref?: string;
  nextHref?: string;
};

type PagerButtonProps = {
  children: string;
  isNext?: boolean;
  className?: string;
  href?: string;
};

const PagerButton: FC<PagerButtonProps> = ({
  children,
  isNext,
  className = '',
  href,
}) => {
  return (
    <Button
      size="icon"
      accentColor="secondary"
      isDisabled={!href}
      href={href ?? '#'}
      className={className}
      title={children}
    >
      <span className="sr-only">{children}</span>
      {isNext ? <ChevronRight /> : <ChevronLeft />}
    </Button>
  );
};

export const Pager: FC<PagerProps> = ({
  className = '',
  previousHref,
  nextHref,
}) => {
  return (
    <div className={clsx('inline-flex items-center gap-2', className)}>
      <PagerButton href={previousHref}>Previous page</PagerButton>
      <PagerButton href={nextHref} isNext>
        Next page
      </PagerButton>
    </div>
  );
};
