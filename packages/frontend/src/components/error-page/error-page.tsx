import { useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';

import { ReactComponent as Logo } from '../../assets/logo.svg';
import { Button } from '../button/button';
import { Container } from '../container/container';
import { Heading } from '../heading/heading';
import { UpdatePageInfo } from '../seo/updatePageInfo';

interface ErrorPageProps {
  resetErrorBoundary(...args: unknown[]): void;
  errorPageType: 'full-app' | 'in-app';
}

export const ErrorPage = ({
  resetErrorBoundary,
  errorPageType,
}: ErrorPageProps) => {
  const { pathname } = useLocation();
  const [errorPathname] = useState(pathname);

  useEffect(() => {
    if (pathname !== errorPathname) {
      resetErrorBoundary();
    }
  }, [pathname, errorPathname, resetErrorBoundary]);

  if (errorPageType === 'full-app') {
    return (
      <Container>
        <div className="px-8 py-12">
          <span className="inline-flex items-center gap-3 mb-8">
            <Logo className="block w-auto h-10"></Logo>
            <h2 className="text-2xl font-bold tracking-tight text-black">
              Financer
            </h2>
          </span>
          <Heading variant="h1" headingClassName="mb-6">
            Error
          </Heading>
          <p className="max-w-xl mb-4 text-lg">
            Oops... Something went horribly wrong. We are not sure what
            happened, but we are trying to fix the issue as we speak.
            <br />
            <br />
            We are very sorry.
            <br />
            <br />
            Best regards,
            <br />
            The Financer team.
          </p>
          <ul>
            <li>
              <a
                href="https://github.com/shamalainen"
                className="text-blue-financer"
                target={'_blank'}
              >
                @shamalainen
                <span className="sr-only">(Link opens in a new tab)</span>
              </a>
            </li>
            <li>
              <a
                href="https://github.com/silte"
                className="text-blue-financer"
                target={'_blank'}
              >
                @silte
                <span className="sr-only">(Link opens in a new tab)</span>
              </a>
            </li>
          </ul>
        </div>
      </Container>
    );
  }

  return (
    <>
      <UpdatePageInfo title={`Error`} />
      <p className="max-w-xl mb-4 text-lg">
        Oops... Something went wrong. We are not sure what happened. Click the
        button below to try to fix the error.
      </p>
      <div className="flex items-center gap-2">
        <Button onClick={() => resetErrorBoundary()}>Fix error</Button>
        <span> or </span>
        <NavLink to={'/'} className="font-medium underline ">
          return to homepage
        </NavLink>
      </div>
    </>
  );
};
