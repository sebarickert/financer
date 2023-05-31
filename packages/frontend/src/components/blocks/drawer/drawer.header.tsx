import clsx from 'clsx';

import { Heading } from '$elements/heading/heading';
import { Icon, IconName } from '$elements/icon/icon';
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
      className={clsx('grid grid-cols-[1fr,44px] items-center', {
        [className]: true,
      })}
    >
      {heading && (
        <div>
          <Heading>{heading}</Heading>
          {children && <Paragraph>{children}</Paragraph>}
        </div>
      )}
      <button
        className="col-[2] h-11 w-11 overflow-hidden inline-flex items-center justify-center"
        onClick={onClose}
      >
        <Icon type={IconName.plus} className="w-6 h-6 rotate-45" />
        <span className="sr-only">Close drawer</span>
      </button>
    </section>
  );
};
