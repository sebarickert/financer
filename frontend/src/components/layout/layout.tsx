import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';

import { ReactComponent as Logo } from '../../assets/logo.svg';
import { Container } from '../container/container';
import { DesktopNavigation } from '../desktop-navigation/desktop-navigation';
import { MobileNavigation } from '../mobile-navigation/mobile-navigation';

interface ILayoutProps {
  children: React.ReactNode;
}

export const Layout = ({ children }: ILayoutProps): JSX.Element => {
  const [currentWindowWidth, setCurrentWindowWidth] = useState(
    window.outerWidth
  );

  window.addEventListener('resize', () =>
    setCurrentWindowWidth(window.outerWidth)
  );

  if (currentWindowWidth > 1024) {
    return (
      <div className="bg-white-off">
        <Container className="grid grid-cols-[16rem,1fr] min-h-screen px-0">
          <aside className="after:bg-white after:ml-[-100vw] after:pr-[100vw] after:absolute after:top-0 after:bottom-0 after:right-0 relative border-r">
            <div className="z-10 sticky top-0 pt-12 pb-12 px-4 bottom-12 min-h-screen">
              <header>
                <NavLink to="/" className="mb-8 inline-flex items-center gap-3">
                  <Logo className="block h-10 w-auto" />
                  <h2 className="tracking-tight font-bold text-black text-2xl">
                    Financer
                  </h2>
                </NavLink>
                <DesktopNavigation />
              </header>
            </div>
          </aside>
          <main>
            <div className="py-12 px-8">{children}</div>
          </main>
        </Container>
      </div>
    );
  }

  return (
    <div className="safe-top safe-left safe-right safe-bottom">
      <div className="flex flex-col min-h-screen h-full overflow-y-scroll disable-scrollbars">
        <main className="bg-white-off lg:pb-24 flex-grow">
          <div className="pt-6 pb-24 px-4">{children}</div>
        </main>
        <header>
          <MobileNavigation />
        </header>
      </div>
    </div>
  );
};
