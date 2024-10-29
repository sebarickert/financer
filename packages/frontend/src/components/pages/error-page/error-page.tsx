'use client';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { Logo } from '$blocks/Logo';
import { Button } from '$elements/button/button';
import { Heading } from '$elements/Heading';
import { Link } from '$elements/Link';
import { Container } from '$layouts/Container';

interface ErrorPageProps {
  errorPageType: 'full-app' | 'in-app';
}

export const ErrorPage = ({ errorPageType }: ErrorPageProps) => {
  if (errorPageType === 'full-app') {
    return (
      <Container>
        <div className="px-8 py-12">
          <Logo className="mb-8" />
          <Heading variant="h1" noMargin className="mb-6">
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
      <p className="max-w-xl mb-4 text-lg theme-text-primary">
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
