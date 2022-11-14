import { clsx } from 'clsx';
import { ReactNode } from 'react';
import { NavLink } from 'react-router-dom';

type HeadingVariants = 'h1' | 'h2' | 'h3' | 'h4';

interface ParagraphProps {
  children: string | ReactNode;
  className?: string;
  testId?: string;
}

export const Paragraph = ({
  children,
  className = '',
  testId,
}: ParagraphProps) => {
  return (
    <p
      className={clsx('text-charcoal', {
        [className]: true,
      })}
      data-testid={testId}
    >
      {children}
    </p>
  );
};
