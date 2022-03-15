import { NavLink } from 'react-router-dom';

import { useIsActiveLink } from '../../hooks/useIsActiveLink';
import { Icon, IconName } from '../icon/icon';

interface ICtaBlockItemProps {
  link: string;
  iconName: IconName;
  label: string;
  ariaLabel?: string;
  isExact?: boolean;
}

export const CtaBlockItem = ({
  link,
  iconName,
  label,
  ariaLabel,
  isExact,
}: ICtaBlockItemProps): JSX.Element => {
  const isActive = useIsActiveLink({ link, isExact });

  return (
    <li>
      <NavLink
        to={link}
        className={`flex flex-col items-center justify-center text-black focus:text-blue-financer hover:text-blue-financer pb-2 pt-4 ${
          isActive ? 'text-blue-financer' : ''
        }`}
        aria-label={ariaLabel}
      >
        <Icon type={iconName} />
        <span className={`text-xs mt-1 text-gray-600 `}>{label}</span>
      </NavLink>
    </li>
  );
};
