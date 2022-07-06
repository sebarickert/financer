import { Children } from 'react';

interface ShortcutListProps {
  children: React.ReactNode | React.ReactNode[];
  className?: string;
  isVertical?: boolean;
  testId?: string;
}

export const ShortcutList = ({
  children,
  className = '',
  isVertical,
  testId,
}: ShortcutListProps): JSX.Element => {
  return (
    <section className={`${className}`} data-testid={testId}>
      <ul
        className={`${
          !isVertical ? 'grid sm:grid-cols-2 lg:grid-cols-3 gap-4' : ''
        }`}
      >
        {Children.map(children, (child) => {
          return child && child;
        })}
      </ul>
    </section>
  );
};
