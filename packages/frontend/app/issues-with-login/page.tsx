import { Metadata } from 'next';

import { Heading } from '$elements/Heading';
import { Link } from '$elements/Link';

export const metadata: Metadata = {
  title: 'Issues with login',
  description: 'Issues with logging in to Financer',
};

const NEXT_PUBLIC_IS_GITHUB_OAUTH_ENABLED =
  process.env.NEXT_PUBLIC_IS_GITHUB_OAUTH_ENABLED;
const NEXT_PUBLIC_IS_AUTH0_OAUTH_ENABLED =
  process.env.NEXT_PUBLIC_IS_AUTH0_OAUTH_ENABLED;

const checkIsEnabled = (stringBoolean: string | undefined) =>
  stringBoolean && stringBoolean.toLocaleLowerCase() !== 'false';

const ResolveGithubIssues = (): JSX.Element => {
  return (
    <>
      <h2>Github</h2>
      <p>No known issues with GitHub login.</p>
    </>
  );
};

const ResolveAuth0Issues = (): JSX.Element => {
  return (
    <>
      <h2>Auth0</h2>
      <p>
        There is a known issue that when trying to login with Auth0 services, it
        might not work because there is still an active session running.
      </p>
      <p>
        <a href="/auth/logout/auth0">Click here</a> to reset the session and
        then the login (should in theory) work.
      </p>
    </>
  );
};

const IssuesWithLogin = (): JSX.Element => {
  return (
    <div className="py-16 mx-auto prose max-w-prose">
      <Link href="/">Go back</Link>
      <Heading variant="h1">Login issues to Financer</Heading>
      {checkIsEnabled(NEXT_PUBLIC_IS_GITHUB_OAUTH_ENABLED) && (
        <ResolveGithubIssues />
      )}
      {checkIsEnabled(NEXT_PUBLIC_IS_AUTH0_OAUTH_ENABLED) && (
        <ResolveAuth0Issues />
      )}
    </div>
  );
};

export default IssuesWithLogin;
