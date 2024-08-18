'use server';

import { Metadata, Viewport } from 'next';
import { FC } from 'react';

import '$assets/tailwind.css';

import { faviconList } from '$assets/favicon-list';
import { RootProviderContainer } from '$container/root.provider';
import { ChildrenProp } from 'src/types/children-prop';

const appName = 'Financer';

export async function metadata(): Promise<Metadata> {
  return {
    title: { template: `%s | ${appName}`, default: appName },
    icons: faviconList,

    appleWebApp: {
      title: appName,
      statusBarStyle: 'default',
      capable: true,
    },
    manifest: '/manifest.json',
  };
}

export async function viewport(): Promise<Viewport> {
  return {
    width: 'device-width',
    initialScale: 1.0,
    viewportFit: 'cover',
  };
}

const RootLayout: FC<ChildrenProp> = ({ children }) => {
  // We don't have to polyfill every feature by our self, since next js already does by default for many features
  // See the full list from here: https://nextjs.org/docs/architecture/supported-browsers
  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="https://rsms.me/inter/inter.css" />
      </head>
      <body className="min-h-screen">
        <RootProviderContainer>{children}</RootProviderContainer>
      </body>
    </html>
  );
};

export default RootLayout;
