import { clsx } from 'clsx';
import { ReactNode } from 'react';
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
      className={clsx('text-[--color-text-primary]', {
        [className]: true,
      })}
      data-testid={testId}
    >
      {children}
    </p>
  );
};
