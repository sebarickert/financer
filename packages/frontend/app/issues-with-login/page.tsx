import clsx from 'clsx';
import { ArrowLeft, LogOut, MessageSquareText } from 'lucide-react';
import { Metadata } from 'next';

import { InfoMessageBlock } from '$blocks/InfoMessageBlock';
import { Button } from '$elements/Button/Button';
import { Heading } from '$elements/Heading';
import { AuthenticationService } from '$ssr/api/AuthenticationService';

export const metadata: Metadata = {
  title: 'Troubleshooting Login Issues',
};

const NEXT_PUBLIC_IS_GITHUB_OAUTH_ENABLED =
  process.env.NEXT_PUBLIC_IS_GITHUB_OAUTH_ENABLED;
const NEXT_PUBLIC_IS_AUTH0_OAUTH_ENABLED =
  process.env.NEXT_PUBLIC_IS_AUTH0_OAUTH_ENABLED;

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

const IssuesWithLogin = async () => {
  const authenticationStatus = await AuthenticationService.getStatus();
  const isLoggedIn = !!authenticationStatus?.authenticated;

  return (
    <main className="grid max-w-screen-lg gap-6 px-4 pt-6 mx-auto lg:pt-12 pb-safe-offset-12 lg:px-8">
      <div className={clsx('flex gap-4 items-center')}>
        <Button
          href={isLoggedIn ? '/' : '/login'}
          accentColor="secondary"
          size="icon"
          haptic="light"
          testId="header-back-link"
          className="max-lg:button-ghost shrink-0"
        >
          <ArrowLeft />
          <span className="sr-only">Go back</span>
        </Button>
        <Heading variant="h1">Troubleshooting Login Issues</Heading>
      </div>
      {checkIsEnabled(NEXT_PUBLIC_IS_GITHUB_OAUTH_ENABLED) && (
        <ResolveGithubIssues />
      )}
      {checkIsEnabled(NEXT_PUBLIC_IS_AUTH0_OAUTH_ENABLED) && (
        <ResolveAuth0Issues />
      )}
    </main>
  );
};

export default IssuesWithLogin;
