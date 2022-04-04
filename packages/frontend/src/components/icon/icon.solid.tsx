import { IconName } from './icon';
import { IconChartBarSolid } from './icon.chartBar.solid';
import { IconHomeSolid } from './icon.home.solid';
import { IconUserCircleSolid } from './icon.userCircle.solid';
import { IconViewGridSolid } from './icon.viewGrid.solid';

interface IconSolidProps {
  type: IconName;
  className?: string;
}

export const IconSolid = ({
  type,
  className = '',
}: IconSolidProps): JSX.Element => {
  let defaultIconClasses = 'h-6 w-6';

  if (className) {
    defaultIconClasses = `${defaultIconClasses} ${className}`;
  }

  switch (type) {
    case 'home':
      return <IconHomeSolid className={defaultIconClasses} />;

    case 'user-circle':
      return <IconUserCircleSolid className={defaultIconClasses} />;

    case 'chart-bar':
      return <IconChartBarSolid className={defaultIconClasses} />;

    case 'view-grid':
      return <IconViewGridSolid className={defaultIconClasses} />;

    default:
      break;
  }

  return <div />;
};
