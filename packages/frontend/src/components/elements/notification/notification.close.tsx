import { Icon, IconName } from '../icon/icon';

interface NotificationCloseProps {
  onClick: () => void;
}

export const NotificationClose = ({
  onClick,
}: NotificationCloseProps): JSX.Element => {
  return (
    <button onClick={onClick}>
      <span className="sr-only">Close notification</span>
      <Icon type={IconName.plus} className="w-6 h-6 rotate-45 stroke-white" />
    </button>
  );
};
