import clsx from 'clsx';
import Link from 'next/link';

import { Icon, IconName } from '$elements/icon/icon';

export interface TransactionActionsItemProps {
  label: string;
  icon: IconName;
  url: string;
  ariaLabel: string;
  onClick?(): void;
}

export const TransactionActionsItem = ({
  label,
  icon,
  url,
  ariaLabel,
  onClick = () => {},
}: TransactionActionsItemProps) => {
  return (
    <Link
      href={url}
      className={`flex flex-col items-center justify-center`}
      onClick={onClick}
      aria-label={ariaLabel}
    >
      <span className="inline-flex items-center justify-center rounded-full bg-gray h-11 w-11 text-black/75">
        <Icon type={icon} />
      </span>
      <span className={clsx('text-sm tracking-tight mt-2')}>{label}</span>
    </Link>
  );
};
