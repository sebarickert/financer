import clsx from 'clsx';

import { Heading } from '$elements/Heading';
import { Icon } from '$elements/Icon';
import { Paragraph } from '$elements/paragraph/paragraph';

interface DrawerHeaderProps {
  className?: string;
  heading?: string;
  children?: string;
  onClose?: () => void;
  id: string;
}

export const DrawerHeader = ({
  className = '',
  onClose,
  children,
  heading,
  id,
}: DrawerHeaderProps) => {
  return (
    <section
      className={clsx('grid grid-cols-[1fr,44px] gap-y-4', {
        [className]: true,
      })}
    >
      {heading && (
        <>
          <Heading className="col-[1]" noMargin disableResponsiveSizing>
            {heading}
          </Heading>
          {children && (
            <Paragraph className="row-[2] col-span-full">{children}</Paragraph>
          )}
        </>
      )}
      <button
        className={clsx(
          'theme-layer-color-with-hover theme-focus rounded-md',
          'col-[2] overflow-hidden inline-flex items-center justify-center h-11 w-11 -my-2 translate-x-1/3',
        )}
        onClick={onClose}
        // @ts-expect-error popovertarget is not a valid prop
        popovertarget={id}
        popovertargetaction="hide"
      >
        <Icon name="PlusIcon" className="w-6 h-6 rotate-45" />
        <span className="sr-only">Close drawer</span>
      </button>
    </section>
  );
};
