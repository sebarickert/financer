import clsx from 'clsx';

interface ContainerProps {
  className?: string;
  children: React.ReactNode;
}

export const Container = ({
  className = '',
  children,
}: ContainerProps): JSX.Element => {
  return (
    <div className={clsx('mx-auto max-w-screen-xl', { [className]: true })}>
      {children}
    </div>
  );
};
