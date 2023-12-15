import { HeaderDesktop } from './header.desktop';
import { HeaderMobile } from './header.mobile';

interface HeaderProps {
  variant: 'desktop' | 'mobile';
}

export const Header = ({ variant = 'desktop' }: HeaderProps) => {
  const HeaderVariant = variant === 'mobile' ? HeaderMobile : HeaderDesktop;

  return <HeaderVariant />;
};
