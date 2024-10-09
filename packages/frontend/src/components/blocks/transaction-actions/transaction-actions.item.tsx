import clsx from 'clsx';

import { Icon, IconName } from '$elements/icon/icon.new';
import { Link } from '$elements/link/link';
import { TransitionType } from '$utils/transitionAnimations';

export interface TransactionActionsItemProps {
  label: string;
  icon: IconName;
  url: string;
  ariaLabel: string;
  onClick?(): void;
  transition?: TransitionType;
}

export const TransactionActionsItem = ({
  label,
  icon,
  url,
  ariaLabel,
  onClick = () => {},
  transition,
}: TransactionActionsItemProps) => {
  return (
    <Link
      href={url}
      className={`flex flex-col items-center justify-center`}
      onClick={onClick}
      aria-label={ariaLabel}
      transition={transition}
    >
      <span className="inline-flex items-center justify-center rounded-full bg-gray h-11 w-11 text-black/75">
        <Icon name={icon} />
      </span>
      <span className={clsx('text-sm tracking-tight mt-2')}>{label}</span>
    </Link>
  );
};
