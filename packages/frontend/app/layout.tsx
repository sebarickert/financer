import clsx from 'clsx';
import { Metadata, Viewport } from 'next';
import { cookies, headers } from 'next/headers';
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
  title: { template: `%s | ${appName}`, default: appName },
  icons: faviconList,

  appleWebApp: {
    title: appName,
    statusBarStyle: 'default',
    capable: true,
  },
  manifest: '/manifest.json',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1.0,
  viewportFit: 'cover',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f4f4f4' },
    { media: '(prefers-color-scheme: dark)', color: '#262626' },
  ],
};

const REDIRECT_COOKIE_NAME = 'onboardingRedirect';

const PUBLIC_ROUTES = ['/privacy-policy/', '/issues-with-login/', '/login/'];

const RootLayout: FC<ChildrenProp> = async ({ children }) => {
  const headersList = headers();
  const cookiesStore = cookies();

  const authenticationStatus = await AuthenticationService.getStatus();
  const pathname = headersList.get(CustomHeader.PATHNAME) ?? '';

  const isLoggedIn = !!authenticationStatus?.authenticated;

  if (!isLoggedIn && !PUBLIC_ROUTES.includes(pathname)) {
    redirect('/login', RedirectType.replace);
  } else if (pathname === '/login/' && isLoggedIn) {
    redirect('/', RedirectType.replace);
  } else if (
    isLoggedIn &&
    !cookiesStore.get(REDIRECT_COOKIE_NAME) &&
    !authenticationStatus.hasAccounts &&
    pathname !== '/accounts/add/'
  ) {
    // TODO This causes error because we can set cookies only from server actions
    // cookiesStore.set(REDIRECT_COOKIE_NAME, 'true', { maxAge: 60 * 10 }); // 10 minutes
    redirect('/accounts/add', RedirectType.replace);
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
      <body className="min-h-screen theme-bg-color ">
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
