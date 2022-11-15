import { Link } from 'react-router-dom';

import { UpdatePageInfo } from './components/renderers/seo/updatePageInfo';

const { REACT_APP_IS_GITHUB_OAUTH_ENABLED, REACT_APP_IS_AUTH0_OAUTH_ENABLED } =
  process.env;

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

export const IssuesWithLogin = (): JSX.Element => {
  return (
    <>
      <UpdatePageInfo title="Issues with login" />
      <div className="relative py-16 overflow-hidden bg-white">
        <div className="hidden lg:block lg:absolute lg:inset-y-0 lg:h-full lg:w-full">
          <div
            className="relative h-full mx-auto text-lg max-w-prose"
            aria-hidden="true"
          >
            <svg
              className="absolute transform translate-x-32 top-12 left-full"
              width="404"
              height="384"
              fill="none"
              viewBox="0 0 404 384"
            >
              <defs>
                <pattern
                  id="74b3fd99-0a6f-4271-bef2-e80eeafdf357"
                  x="0"
                  y="0"
                  width="20"
                  height="20"
                  patternUnits="userSpaceOnUse"
                >
                  <rect
                    x="0"
                    y="0"
                    width="4"
                    height="4"
                    className="text-gray-200"
                    fill="currentColor"
                  />
                </pattern>
              </defs>
              <rect
                width="404"
                height="384"
                fill="url(#74b3fd99-0a6f-4271-bef2-e80eeafdf357)"
              />
            </svg>
            <svg
              className="absolute transform -translate-x-32 -translate-y-1/2 top-1/2 right-full"
              width="404"
              height="384"
              fill="none"
              viewBox="0 0 404 384"
            >
              <defs>
                <pattern
                  id="f210dbf6-a58d-4871-961e-36d5016a0f49"
                  x="0"
                  y="0"
                  width="20"
                  height="20"
                  patternUnits="userSpaceOnUse"
                >
                  <rect
                    x="0"
                    y="0"
                    width="4"
                    height="4"
                    className="text-gray-200"
                    fill="currentColor"
                  />
                </pattern>
              </defs>
              <rect
                width="404"
                height="384"
                fill="url(#f210dbf6-a58d-4871-961e-36d5016a0f49)"
              />
            </svg>
            <svg
              className="absolute transform translate-x-32 bottom-12 left-full"
              width="404"
              height="384"
              fill="none"
              viewBox="0 0 404 384"
            >
              <defs>
                <pattern
                  id="d3eb07ae-5182-43e6-857d-35c643af9034"
                  x="0"
                  y="0"
                  width="20"
                  height="20"
                  patternUnits="userSpaceOnUse"
                >
                  <rect
                    x="0"
                    y="0"
                    width="4"
                    height="4"
                    className="text-gray-200"
                    fill="currentColor"
                  />
                </pattern>
              </defs>
              <rect
                width="404"
                height="384"
                fill="url(#d3eb07ae-5182-43e6-857d-35c643af9034)"
              />
            </svg>
          </div>
        </div>
        <div className="relative px-4 sm:px-6 lg:px-8">
          <div className="mx-auto text-lg max-w-prose">
            <Link
              to="/"
              className="inline-block mb-12 text-base font-semibold tracking-wide text-blue-600 uppercase rounded-sm focus:outline-none focus:ring-2 focus:ring-offset-4"
            >
              Go back
            </Link>
            <h1>
              <span className="block mt-2 text-3xl font-extrabold leading-8 tracking-tight text-gray-900 sm:text-4xl">
                Login issues to Financer
              </span>
            </h1>
          </div>
          <div className="mx-auto mt-6 prose prose-lg text-gray-500 prose-blue">
            {checkIsEnabled(REACT_APP_IS_GITHUB_OAUTH_ENABLED) && (
              <ResolveGithubIssues />
            )}
            {checkIsEnabled(REACT_APP_IS_AUTH0_OAUTH_ENABLED) && (
              <ResolveAuth0Issues />
            )}
          </div>
        </div>
      </div>
    </>
  );
};
