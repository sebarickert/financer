import { IconArrowLeft } from './icon.arrowLeft';
import { IconArrowRight } from './icon.arrowRight';
import { IconCash } from './icon.cash';
import { IconChartBar } from './icon.chartBar';
import { IconChevronDown } from './icon.chevronDown';
import { IconChevronLeft } from './icon.chevronLeft';
import { IconChevronRight } from './icon.chevronRight';
import { IconCloudDownload } from './icon.cloudDownload';
import { IconCog } from './icon.cog';
import { IconCollection } from './icon.collection';
import { IconCreditCard } from './icon.creditCard';
import { IconDownload } from './icon.download';
import { IconExclamation } from './icon.exclamation';
import { IconHome } from './icon.home';
import { IconHomeSolid } from './icon.home.solid';
import { IconLibrary } from './icon.library';
import { IconLogout } from './icon.logout';
import { IconMinusCircle } from './icon.minusCircle';
import { IconPaperAirplane } from './icon.paperAirplane';
import { IconPlus } from './icon.plus';
import { IconPlusCircle } from './icon.plusCircle';
import { IconSparkles } from './icon.sparkles';
import { IconStar } from './icon.star';
import { IconSwitchHorizontal } from './icon.switchHorizontal';
import { IconTag } from './icon.tag';
import { IconTrash } from './icon.trash';
import { IconTrendingDown } from './icon.trendingDown';
import { IconTrendingUp } from './icon.trendingUp';
import { IconUpload } from './icon.upload';
import { IconUser } from './icon.user';
import { IconUserCircle } from './icon.userCircle';
import { IconViewGrid } from './icon.viewGrid';
import { IconViewGridAdd } from './icon.viewGridAdd';

export enum IconName {
  switchHorizontal = 'switch-horizontal',
  plusCircle = 'plus-circle',
  minusCircle = 'minus-circle',
  home = 'home',
  homeSolid = 'home-solid',
  user = 'user',
  chartBar = 'chart-bar',
  viewGrid = 'view-grid',
  userCircle = 'user-circle',
  plus = 'plus',
  download = 'download',
  upload = 'upload',
  logout = 'logout',
  tag = 'tag',
  exclamation = 'exclamation',
  cloudDownload = 'cloud-download',
  chevronDown = 'chevron-down',
  arrowLeft = 'arrow-left',
  arrowRight = 'arrow-right',
  viewGridAdd = 'view-grid-add',
  cog = 'cog',
  chevronRight = 'chevron-right',
  chevronLeft = 'chevron-left',
  trash = 'trash',
  cash = 'cash',
  creditCard = 'credit-card',
  trendingUp = 'trending-up',
  trendingDown = 'trending-down',
  library = 'library',
  star = 'star',
  collection = 'collection',
  sparkles = 'sparkles',
  paperAirplane = 'paper-airplane',
}
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

    case 'home-solid':
      return <IconHomeSolid className={defaultIconClasses} />;

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

    case 'cash':
      return <IconCash className={defaultIconClasses} />;

    case 'credit-card':
      return <IconCreditCard className={defaultIconClasses} />;

    case 'cog':
      return <IconCog className={defaultIconClasses} />;

    case 'trending-up':
      return <IconTrendingUp className={defaultIconClasses} />;

    case 'trending-down':
      return <IconTrendingDown className={defaultIconClasses} />;

    case 'library':
      return <IconLibrary className={defaultIconClasses} />;

    case 'star':
      return <IconStar className={defaultIconClasses} />;

    case 'sparkles':
      return <IconSparkles className={defaultIconClasses} />;

    case 'paper-airplane':
      return <IconPaperAirplane className={defaultIconClasses} />;

    default:
      break;
  }

  return <div />;
};
