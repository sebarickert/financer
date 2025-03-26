import clsx from 'clsx';
import { LogOut, MessageSquareText } from 'lucide-react';
import { Metadata } from 'next';
import type { JSX } from 'react';

import { getAuthenticationStatus } from '@/api-service';
import { InfoMessageBlock } from '@/blocks/InfoMessageBlock';
import { Button } from '@/elements/Button/Button';
import { ContentHeader } from '@/layouts/ContentHeader';

export const metadata: Metadata = {
  title: 'Troubleshooting Login Issues',
};

const { LOGIN_IS_GITHUB_ENABLED, LOGIN_IS_AUTH_0_ENABLED } = process.env;

const checkIsEnabled = (stringBoolean: string | undefined) =>
  stringBoolean && stringBoolean.toLocaleLowerCase() !== 'false';

const ResolveGithubIssues = (): JSX.Element => {
  return (
    <InfoMessageBlock title="Github" Icon={MessageSquareText}>
      GitHub login is working as expected. If you experience any issues, please
      try again or contact support.
    </InfoMessageBlock>
  );
};

const ResolveAuth0Issues = (): JSX.Element => {
  return (
    <InfoMessageBlock
      title="Auth0"
      Icon={LogOut}
      action={
        <Button href="/auth/logout/auth0">Reset Session and Retry Login</Button>
      }
    >
      There is a known issue with logging in via Auth0 services due to an active
      session still running. To resolve this, please reset your session and try
      logging in again.
    </InfoMessageBlock>
  );
};

export default function IssuesWithLogin() {
  return (
    <main
      className={clsx(
        'pt-12 pb-safe-offset-12 px-4 lg:px-8',
        'mx-auto max-w-screen-md lg:max-w-screen-xl',
      )}
      data-testid="layout-root"
    >
      <ContentHeader title="Troubleshooting Login Issues" />
      {checkIsEnabled(LOGIN_IS_GITHUB_ENABLED) && <ResolveGithubIssues />}
      {checkIsEnabled(LOGIN_IS_AUTH_0_ENABLED) && <ResolveAuth0Issues />}
    </main>
  );
}
