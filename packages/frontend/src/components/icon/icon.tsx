import { IconArrowLeft } from './icon.arrowLeft';
import { IconArrowRight } from './icon.arrowRight';
import { IconChartBar } from './icon.chartBar';
import { IconChevronDown } from './icon.chevronDown';
import { IconChevronLeft } from './icon.chevronLeft';
import { IconChevronRight } from './icon.chevronRight';
import { IconCloudDownload } from './icon.cloudDownload';
import { IconCog } from './icon.cog';
import { IconCollection } from './icon.collection';
import { IconDownload } from './icon.download';
import { IconExclamation } from './icon.exclamation';
import { IconHome } from './icon.home';
import { IconLogout } from './icon.logout';
import { IconMinusCircle } from './icon.minusCircle';
import { IconPlus } from './icon.plus';
import { IconPlusCircle } from './icon.plusCircle';
import { IconSwitchHorizontal } from './icon.switchHorizontal';
import { IconTag } from './icon.tag';
import { IconTrash } from './icon.trash';
import { IconUpload } from './icon.upload';
import { IconUser } from './icon.user';
import { IconUserCircle } from './icon.userCircle';
import { IconViewGrid } from './icon.viewGrid';
import { IconViewGridAdd } from './icon.viewGridAdd';

export type IconName =
  | 'switch-horizontal'
  | 'plus-circle'
  | 'minus-circle'
  | 'home'
  | 'user'
  | 'chart-bar'
  | 'view-grid'
  | 'user-circle'
  | 'plus'
  | 'download'
  | 'upload'
  | 'logout'
  | 'tag'
  | 'exclamation'
  | 'cloud-download'
  | 'chevron-down'
  | 'arrow-left'
  | 'arrow-right'
  | 'view-grid-add'
  | 'cog'
  | 'chevron-right'
  | 'chevron-left'
  | 'trash'
  | 'collection';
interface IconProps {
  type: IconName;
  className?: string;
}

export const Icon = ({ type, className = '' }: IconProps): JSX.Element => {
  let defaultIconClasses = 'h-6 w-6';

  if (className) {
    defaultIconClasses = `${defaultIconClasses} ${className}`;
  }

  switch (type) {
    case 'switch-horizontal':
      return <IconSwitchHorizontal className={defaultIconClasses} />;

    case 'plus-circle':
      return <IconPlusCircle className={defaultIconClasses} />;

    case 'minus-circle':
      return <IconMinusCircle className={defaultIconClasses} />;

    case 'home':
      return <IconHome className={defaultIconClasses} />;

    case 'user':
      return <IconUser className={defaultIconClasses} />;

    case 'chart-bar':
      return <IconChartBar className={defaultIconClasses} />;

    case 'view-grid':
      return <IconViewGrid className={defaultIconClasses} />;

    case 'user-circle':
      return <IconUserCircle className={defaultIconClasses} />;

    case 'plus':
      return <IconPlus className={defaultIconClasses} />;

    case 'download':
      return <IconDownload className={defaultIconClasses} />;

    case 'upload':
      return <IconUpload className={defaultIconClasses} />;

    case 'logout':
      return <IconLogout className={defaultIconClasses} />;

    case 'tag':
      return <IconTag className={defaultIconClasses} />;

    case 'exclamation':
      return <IconExclamation className={defaultIconClasses} />;

    case 'cloud-download':
      return <IconCloudDownload className={defaultIconClasses} />;

    case 'chevron-down':
      return <IconChevronDown className={defaultIconClasses} />;

    case 'chevron-right':
      return <IconChevronRight className={defaultIconClasses} />;

    case 'chevron-left':
      return <IconChevronLeft className={defaultIconClasses} />;

    case 'collection':
      return <IconCollection className={defaultIconClasses} />;

    case 'view-grid-add':
      return <IconViewGridAdd className={defaultIconClasses} />;

    case 'arrow-left':
      return <IconArrowLeft className={defaultIconClasses} />;

    case 'arrow-right':
      return <IconArrowRight className={defaultIconClasses} />;

    case 'trash':
      return <IconTrash className={defaultIconClasses} />;

    case 'cog':
      return <IconCog className={defaultIconClasses} />;

    default:
      break;
  }

  return <div />;
};
