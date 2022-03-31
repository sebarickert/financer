import { useState, useEffect } from 'react';
import { NavLink, Outlet } from 'react-router-dom';

import { ReactComponent as Logo } from '../../assets/logo.svg';
import { Container } from '../container/container';
import { DesktopNavigation } from '../desktop-navigation/desktop-navigation';
import { MobileHeader } from '../mobile-header/mobile-header';
import { MobileNavigation } from '../mobile-navigation/mobile-navigation';

export const Layout = (): JSX.Element => {
  const [currentWindowWidth, setCurrentWindowWidth] = useState(
    window.outerWidth
  );

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    const loadInitialWidth = (times = 0) => {
      if (window?.outerWidth) {
        setCurrentWindowWidth(window.outerWidth);
        return;
      } else if (times < 10) {
        timeout = setTimeout(loadInitialWidth, 50, times + 1);
      }
    };

    loadInitialWidth();

    return () => clearTimeout(timeout);
  }, []);

  window.addEventListener('resize', () =>
    setCurrentWindowWidth(window.outerWidth)
  );

  if (currentWindowWidth > 1024) {
    return (
      <div className="bg-white-off">
        <Container className="grid grid-cols-[16rem,1fr] min-h-screen px-0">
          <aside className="after:bg-white after:ml-[-100vw] after:pr-[100vw] after:absolute after:top-0 after:bottom-0 after:right-0 relative border-r">
            <div className="sticky top-0 z-10 min-h-screen px-4 pt-12 pb-12 bottom-12">
              <header>
                <NavLink to="/" className="inline-flex items-center gap-3 mb-8">
                  <Logo className="block w-auto h-10" />
                  <h2 className="text-2xl font-bold tracking-tight text-black">
                    Financer
                  </h2>
                </NavLink>
                <DesktopNavigation />
              </header>
            </div>
          </aside>
          <main>
            <div className="px-8 py-12">
              <Outlet />
            </div>
          </main>
        </Container>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full min-h-screen overflow-y-scroll lg:hidden disable-scrollbars">
      <main className="flex-grow bg-white-off lg:pb-24">
        <div className={`px-6 pt-[78px] pb-24`}>
          <Outlet />
        </div>
      </main>
      <header>
        <MobileHeader />
        <MobileNavigation />
      </header>
    </div>
  );
};
