import { clsx } from 'clsx';
import { NavLink } from 'react-router-dom';

import { useIsActiveLink } from '../../hooks/useIsActiveLink';
import { Icon, IconName } from '../icon/icon';

import { CtaBlockProps } from './cta-block';

interface CtaBlockItemProps {
  link: string;
  iconName: IconName;
  label: string;
  ariaLabel?: string;
  isExact?: boolean;
  variant?: CtaBlockProps['variant'];
}

export const CtaBlockItem = ({
  link,
  iconName,
  label,
  ariaLabel,
  isExact,
  variant,
}: CtaBlockItemProps): JSX.Element => {
  const isActive = useIsActiveLink({ link, isExact });

  return (
    <li>
      <NavLink
        to={link}
        className={clsx('flex flex-col items-center justify-center group', {
          'text-blue-financer': isActive,
        })}
        aria-label={ariaLabel}
      >
        <span
          className={clsx(
            'aspect-square w-full flex items-center justify-center rounded-md border',
            {
              'bg-gray-25 group-hover:bg-gray-100 group-focus:bg-gray-100':
                variant === 'gray',
              'bg-gray-900 text-white': variant === 'black',
            }
          )}
        >
          <Icon type={iconName} />
        </span>
        <span className={`text-sm mt-2 text-gray-600`}>{label}</span>
      </NavLink>
    </li>
  );
};
