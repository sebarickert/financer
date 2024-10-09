import clsx from 'clsx';

import { Heading } from '$elements/heading/heading';
import { Icon } from '$elements/icon/icon.new';
import { Paragraph } from '$elements/paragraph/paragraph';

interface DrawerHeaderProps {
  className?: string;
  heading?: string;
  children?: string;
  onClose: () => void;
}

export const DrawerHeader = ({
  className = '',
  onClose,
  children,
  heading,
}: DrawerHeaderProps) => {
  return (
    <section
      className={clsx('grid grid-cols-[1fr,44px] gap-y-4', {
        [className]: true,
      })}
    >
      {heading && (
        <>
          <Heading className="col-[1] ">{heading}</Heading>
          {children && (
            <Paragraph className="row-[2] col-span-full">{children}</Paragraph>
          )}
        </>
      )}
      <button
        className="col-[2] overflow-hidden inline-flex items-center justify-center h-11 w-11 -my-2 translate-x-1/3"
        onClick={onClose}
      >
        <Icon name="PlusIcon" className="w-6 h-6 rotate-45" />
        <span className="sr-only">Close drawer</span>
      </button>
    </section>
  );
};
