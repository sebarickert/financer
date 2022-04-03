import React from 'react';

import { Sidebar } from '../sidebar/sidebar';

interface IContainerProps {
  className?: string;
  children: React.ReactNode;
  sidebarComponent?: React.ReactNode;
}

export const Container = ({
  className = '',
  children,
  sidebarComponent,
}: IContainerProps): JSX.Element => {
  return (
    <div
      className={`mx-auto max-w-screen-xl ${className} ${
        sidebarComponent ? 'lg:flex' : ''
      }`}
    >
      {sidebarComponent && <Sidebar>{sidebarComponent}</Sidebar>}
      {sidebarComponent ? (
        <div className="lg:flex-1">{children}</div>
      ) : (
        children
      )}
    </div>
  );
};
