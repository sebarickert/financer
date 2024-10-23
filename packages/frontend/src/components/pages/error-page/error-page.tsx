'use client';

import Image from 'next/image';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import logo from '$assets/logo.svg';
import { Button } from '$elements/button/button';
import { Heading } from '$elements/Heading';
import { Link } from '$elements/Link';
import { Container } from '$layouts/container/container';

interface ErrorPageProps {
  errorPageType: 'full-app' | 'in-app';
}

export const ErrorPage = ({ errorPageType }: ErrorPageProps) => {
  if (errorPageType === 'full-app') {
    return (
      <Container>
        <div className="px-8 py-12">
          <span className="inline-flex items-center gap-3 mb-8">
            <Image
              src={logo}
              className="relative block w-auto h-10 rounded"
              alt="logo"
            />
            <h2 className="text-2xl font-bold tracking-tight text-black">
              Financer
            </h2>
          </span>
          <Heading variant="h1" className="!mb-6">
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
                href="https://github.com/sebarickert"
                className="text-blue-financer"
                target={'_blank'}
              >
                @sebarickert
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
      <p className="max-w-xl mb-4 text-lg">
        Oops... Something went wrong. We are not sure what happened. Click the
        button below to try to fix the error.
      </p>
      <div className="flex items-center gap-2">
        <Button onClick={() => window.location.reload()}>Fix error</Button>
        <span> or </span>
        <Link href={'/'} className="font-medium underline ">
          return to homepage
        </Link>
      </div>
    </>
  );
};
