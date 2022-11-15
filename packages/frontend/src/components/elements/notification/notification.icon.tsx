import clsx from 'clsx';

import { Icon, IconName } from '../icon/icon';

interface NotificationIconProps {
  type: 'success' | 'error';
}

export const NotificationIcon = ({
  type,
}: NotificationIconProps): JSX.Element => {
  if (type === 'error') {
    return (
      <Icon
        type={IconName.exclamation}
        className={clsx('flex-shrink-0 stroke-white')}
      />
    );
  }

  return (
    <Icon
      type={IconName.informationCircle}
      className={clsx('flex-shrink-0 stroke-white')}
    />
  );
};
