import '@/assets/tailwind.css';

import clsx from 'clsx';
import { Metadata, Viewport } from 'next';
import { ViewTransitions } from 'next-view-transitions';

import { Theme } from '@/api/ssr-financer-api';
import { getOwnUserTheme } from '@/api-service';
import { faviconList } from '@/assets/favicon-list';
import { ScrollToTop } from '@/blocks/ScrollToTop';
import { PolyfillProvider } from '@/container/polyfill.provider';
import { StoreProvider } from '@/container/store.provider';
import { verifySession } from '@/utils/dal';

const appName = 'Financer';

export const metadata: Metadata = {
  title: { template: `%s — ${appName}`, default: appName },
  icons: faviconList,
  appleWebApp: {
    title: appName,
    statusBarStyle: 'default',
    capable: true,
  },
  manifest: '/manifest.json',
};

export const generateViewport = async (): Promise<Viewport> => {
  const isLoggedIn = await verifySession();
  const theme = isLoggedIn ? await getOwnUserTheme() : Theme.AUTO;

  let themeColor: Viewport['themeColor'];

  switch (theme) {
    case Theme.LIGHT:
      themeColor = 'hsl(0 0% 0%)';
      break;
    case Theme.DARK:
      themeColor = 'hsl(0 0% 0%)';
      break;
    default:
      themeColor = [
        { media: '(prefers-color-scheme: light)', color: 'hsl(0 0% 0%)' },
        { media: '(prefers-color-scheme: dark)', color: 'hsl(0 0% 0%)' },
      ];
  }

  return {
    themeColor,
    width: 'device-width',
    viewportFit: 'cover',
    initialScale: 1.0,
    minimumScale: 1.0,
    maximumScale: 1.0,
    userScalable: false,
  };
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isLoggedIn = await verifySession();
  const theme = isLoggedIn ? await getOwnUserTheme() : Theme.AUTO;

  return (
    <html
      lang="en"
      className={clsx({
        dark: theme === Theme.DARK,
        light: theme === Theme.LIGHT,
      })}
    >
      <head>
        <link rel="stylesheet" href="https://rsms.me/inter/inter.css" />
      </head>
      <body className={clsx('max-lg:pb-(--gutter-bottom)')}>
        <PolyfillProvider />
        <StoreProvider>
          <ViewTransitions>
            <ScrollToTop />
            {children}
          </ViewTransitions>
        </StoreProvider>
      </body>
    </html>
  );
}
