import clsx from 'clsx';
import { Metadata, Viewport } from 'next';
import { headers } from 'next/headers';
import { redirect, RedirectType } from 'next/navigation';
import { FC } from 'react';

import { Theme } from '$api/generated/financerApi';
import { faviconList } from '$assets/favicon-list';
import { RootProviderContainer } from '$container/root.provider';
import { AuthenticationService } from '$ssr/api/authentication.service';
import { UserService } from '$ssr/api/user.service';
import { ChildrenProp } from 'src/types/children-prop';
import { CustomHeader } from 'src/types/custom-headers';

import '$assets/tailwind.css';

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

export async function generateViewport(): Promise<Viewport> {
  const authenticationStatus = await AuthenticationService.getStatus();
  const isLoggedIn = !!authenticationStatus?.authenticated;
  const theme = isLoggedIn ? await UserService.getOwnUserTheme() : Theme.Auto;

  let themeColor: Viewport['themeColor'];

  switch (theme) {
    case Theme.Light:
      themeColor = '#f6f6f6';
      break;
    case Theme.Dark:
      themeColor = 'hsl(0 0% 10%)';
      break;
    default:
      themeColor = [
        { media: '(prefers-color-scheme: light)', color: '#f6f6f6' },
        { media: '(prefers-color-scheme: dark)', color: 'hsl(0 0% 10%)' },
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
}

const PUBLIC_ROUTES = ['/privacy-policy/', '/issues-with-login/', '/login/'];

const RootLayout: FC<ChildrenProp> = async ({ children }) => {
  const headersList = await headers();

  const authenticationStatus = await AuthenticationService.getStatus();
  const pathname = headersList.get(CustomHeader.PATHNAME) ?? '';

  const isLoggedIn = !!authenticationStatus?.authenticated;

  if (!isLoggedIn && !PUBLIC_ROUTES.includes(pathname)) {
    redirect('/login', RedirectType.replace);
  } else if (pathname === '/login/' && isLoggedIn) {
    redirect('/', RedirectType.replace);
  }

  const theme = isLoggedIn ? await UserService.getOwnUserTheme() : Theme.Auto;

  // We don't have to polyfill every feature by our self, since next js already does by default for many features
  // See the full list from here: https://nextjs.org/docs/architecture/supported-browsers
  return (
    <html
      lang="en"
      className={clsx({
        ['dark']: theme === Theme.Dark,
        ['light']: theme === Theme.Light,
      })}
    >
      <head>
        <link rel="stylesheet" href="https://rsms.me/inter/inter.css" />
      </head>
      <body
        className={clsx(
          'max-lg:pb-[--gutter-bottom]',
          '[&:has([data-slot="contextual-navigation"])_[data-slot="transaction-list-summary"]]:lg:top-[calc(var(--gutter-top)+var(--contextual-navigation-height)+theme(spacing.4))]',
        )}
      >
        <RootProviderContainer
          shouldShowOnboarding={!authenticationStatus?.hasAccounts}
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          authenticationErrors={(authenticationStatus as any)?.errors}
        >
          {children}
        </RootProviderContainer>
      </body>
    </html>
  );
};

export default RootLayout;
