import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import Container from "../container/container";
import MobileNavigation from "../mobile-navigation/mobile-navigation";
import { ReactComponent as Logo } from "../../assets/logo.svg";
import DesktopNavigation from "../desktop-navigation/desktop-navigation";

interface IProps {
  children: React.ReactNode;
}

const Layout = ({ children }: IProps): JSX.Element => {
  const [currentWindowWidth, setCurrentWindowWidth] = useState(
    window.outerWidth
  );

  window.addEventListener("resize", () =>
    setCurrentWindowWidth(window.outerWidth)
  );

  if (currentWindowWidth > 1024) {
    return (
      <div className="bg-white-off">
        <Container className="grid grid-cols-[16rem,1fr] min-h-screen px-0">
          <aside className="after:bg-white after:ml-[-100vw] after:pr-[100vw] after:absolute after:top-0 after:bottom-0 after:right-0 relative border-r">
            <div className="z-10 sticky top-0 pt-12 pb-12 px-4 bottom-12 min-h-screen">
              <NavLink to="/" className="mb-8 block">
                <Logo className="block h-10 w-auto" />
              </NavLink>
              <DesktopNavigation />
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
    <div className="flex flex-col min-h-screen">
      <main className="bg-gray-100 lg:pb-24 flex-grow">
        <div className="pt-6 pb-24 px-4">{children}</div>
      </main>
      <MobileNavigation />
    </div>
  );
};

export default Layout;
