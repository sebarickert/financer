import { LinkViewTransition } from '$elements/link/link-view-transition';
import { UpdatePageInfo } from '$renderers/seo/updatePageInfo';

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
        <a
          href="/auth/logout/auth0"
          className="mb-12 text-blue-600 rounded-sm focus:outline-none focus:ring-2 focus:ring-offset-4"
        >
          Click here
        </a>{' '}
        to reset the session and then the login (should in theory) work.
      </p>
    </>
  );
};

const IssuesWithLogin = (): JSX.Element => {
  return (
    <>
      <UpdatePageInfo title="Issues with login" />
      <div className="py-16 mx-auto prose max-w-prose ">
        <LinkViewTransition
          href="/"
          className="inline-block mb-12 text-base font-semibold tracking-wide text-blue-600 uppercase rounded-sm focus:outline-none focus:ring-2 focus:ring-offset-4"
        >
          Go back
        </LinkViewTransition>
        <h1>
          <span className="block mt-2 text-3xl font-extrabold leading-8 tracking-tight text-gray-900 sm:text-4xl">
            Login issues to Financer
          </span>
        </h1>
        {checkIsEnabled(NEXT_PUBLIC_IS_GITHUB_OAUTH_ENABLED) && (
          <ResolveGithubIssues />
        )}
        {checkIsEnabled(NEXT_PUBLIC_IS_AUTH0_OAUTH_ENABLED) && (
          <ResolveAuth0Issues />
        )}
      </div>
    </>
  );
};

export default IssuesWithLogin;
