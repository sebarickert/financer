import clsx from 'clsx';
import { FC } from 'react';

import { Icon, IconName } from './Icon';

type ProminentDetailItemProps = {
  icon: IconName;
  label: string;
  children: React.ReactNode;
  highlightColor?: string;
};

export const ProminentDetailItem: FC<ProminentDetailItemProps> = ({
  icon,
  label,
  children,
  highlightColor,
}) => {
  return (
    <div
      className={clsx(
        'theme-layer-color theme-text-primary',
        'py-5 px-4',
        'flex items-center gap-4',
      )}
    >
      <div
        className={clsx(
          'theme-layer-secondary-color rounded-xl h-11 w-11',
          'inline-flex items-center justify-center shrink-0',
          {
            [String(highlightColor)]: highlightColor,
          },
        )}
      >
        <Icon name={icon} />
      </div>
      <div
        className={clsx('grid grid-cols-[auto,1fr] items-center gap-2 grow')}
      >
        <span className="truncate">{label}</span>
        <span className="text-lg font-medium text-right whitespace-nowrap">
          <span
            className={clsx({
              'py-2 px-3 rounded-md': highlightColor,
              [String(highlightColor)]: highlightColor,
            })}
          >
            {children}
          </span>
        </span>
      </div>
    </div>
  );
};
