import { IconArrowLeft } from './svgs/icon.arrowLeft';
import { IconArrowRight } from './svgs/icon.arrowRight';
import { IconCalendar } from './svgs/icon.calendar';
import { IconCash } from './svgs/icon.cash';
import { IconChartBar } from './svgs/icon.chartBar';
import { IconChartBarSolid } from './svgs/icon.chartBar.solid';
import { IconChevronDown } from './svgs/icon.chevronDown';
import { IconChevronLeft } from './svgs/icon.chevronLeft';
import { IconChevronRight } from './svgs/icon.chevronRight';
import { IconCloudDownload } from './svgs/icon.cloudDownload';
import { IconCog } from './svgs/icon.cog';
import { IconCollection } from './svgs/icon.collection';
import { IconCreditCard } from './svgs/icon.creditCard';
import { IconDocumentReport } from './svgs/icon.documentReport';
import { IconDotsHorizontal } from './svgs/icon.dotsHorizontal';
import { IconDownload } from './svgs/icon.download';
import { IconExclamation } from './svgs/icon.exclamation';
import { IconHome } from './svgs/icon.home';
import { IconHomeSolid } from './svgs/icon.home.solid';
import { IconInformationCircle } from './svgs/icon.informationCircle';
import { IconLibrary } from './svgs/icon.library';
import { IconLightningBolt } from './svgs/icon.lightningBolt';
import { IconLogout } from './svgs/icon.logout';
import { IconMinusCircle } from './svgs/icon.minusCircle';
import { IconPaperAirplane } from './svgs/icon.paperAirplane';
import { IconPencilSquare } from './svgs/icon.pencilSquare';
import { IconPlus } from './svgs/icon.plus';
import { IconPlusCircle } from './svgs/icon.plusCircle';
import { IconSparkles } from './svgs/icon.sparkles';
import { IconStar } from './svgs/icon.star';
import { IconSwitchHorizontal } from './svgs/icon.switchHorizontal';
import { IconTag } from './svgs/icon.tag';
import { IconTrash } from './svgs/icon.trash';
import { IconTrendingDown } from './svgs/icon.trendingDown';
import { IconTrendingUp } from './svgs/icon.trendingUp';
import { IconUpload } from './svgs/icon.upload';
import { IconUser } from './svgs/icon.user';
import { IconUserCircle } from './svgs/icon.userCircle';
import { IconUserCircleSolid } from './svgs/icon.userCircle.solid';
import { IconViewGrid } from './svgs/icon.viewGrid';
import { IconViewGridSolid } from './svgs/icon.viewGrid.solid';
import { IconViewGridAdd } from './svgs/icon.viewGridAdd';

export enum IconName {
  switchHorizontal = 'switch-horizontal',
  plusCircle = 'plus-circle',
  minusCircle = 'minus-circle',
  home = 'home',
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
  lightningBolt = 'lightning-bolt',
  dotsHorizontal = 'dots-horizontal',
  documentReport = 'document-report',
  calendar = 'calendar',
  informationCircle = 'information-circle',
  pencilSquare = 'pencil-square',
}
interface IconProps {
  type: IconName;
  className?: string;
  isSolid?: boolean;
}

export const Icon = ({
  type,
  className = '',
  isSolid,
}: IconProps): JSX.Element => {
  let defaultIconClasses = 'h-6 w-6';

  if (className) {
    defaultIconClasses = `${defaultIconClasses} ${className}`;
  }

  switch (isSolid ? `${type}-solid` : type) {
    case 'switch-horizontal':
      return <IconSwitchHorizontal className={defaultIconClasses} />;

    case 'switch-horizontal-solid':
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

    case 'chart-bar-solid':
      return <IconChartBarSolid className={defaultIconClasses} />;

    case 'view-grid':
      return <IconViewGrid className={defaultIconClasses} />;

    case 'view-grid-solid':
      return <IconViewGridSolid className={defaultIconClasses} />;

    case 'user-circle':
      return <IconUserCircle className={defaultIconClasses} />;

    case 'user-circle-solid':
      return <IconUserCircleSolid className={defaultIconClasses} />;

    case 'plus':
      return <IconPlus className={defaultIconClasses} />;

    case 'download':
      return <IconDownload className={defaultIconClasses} />;

    case 'download-solid':
      return <IconDownload className={defaultIconClasses} />;

    case 'upload':
      return <IconUpload className={defaultIconClasses} />;

    case 'upload-solid':
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

    case 'lightning-bolt':
      return <IconLightningBolt className={defaultIconClasses} />;

    case 'dots-horizontal':
      return <IconDotsHorizontal className={defaultIconClasses} />;

    case 'document-report':
      return <IconDocumentReport className={defaultIconClasses} />;

    case 'calendar':
      return <IconCalendar className={defaultIconClasses} />;

    case 'information-circle':
      return <IconInformationCircle className={defaultIconClasses} />;

    case 'pencil-square':
      return <IconPencilSquare className={defaultIconClasses} />;

    default:
      break;
  }

  return <div />;
};
