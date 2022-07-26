import { NavLink } from 'react-router-dom';

import { Heading } from '../heading/heading';
import { Icon, IconName } from '../icon/icon';

interface ShortcutProps {
  link: string;
  children: string;
  className?: string;
}

export const Shortcut = ({
  link,
  children,
  className = '',
}: ShortcutProps): JSX.Element => {
  return (
    <div
      className={`relative p-4 bg-gray-25 border rounded-lg group focus-within:ring-2 focus-within:ring-inset focus-within:ring-blue-500 overflow-hidden ${
        className || ''
      }`}
    >
      <div className="flex items-center gap-2">
        <span className={`text-gray-600`}>
          <Icon type={IconName.lightningBolt} />
        </span>
        <Heading
          headingClassName="truncate flex-grow !leading-snug"
          variant="h3"
          style="h4"
        >
          <NavLink to={link} className="focus:outline-none truncate">
            <span className="absolute inset-0" aria-hidden="true" />
            {children}
          </NavLink>
        </Heading>
        <Icon
          type={IconName.chevronRight}
          className="flex-shrink-0 pointer-events-none stroke-gray-300"
        />
      </div>
    </div>
  );
};
