'use client';

import { Button } from '$elements/Button/Button';
import { Link } from '$elements/Link';

type ErrorProps = {
  errorPageType: 'full-app' | 'in-app';
};

export const Error = ({ errorPageType }: ErrorProps) => {
  if (errorPageType === 'full-app') {
    return (
      <>
        <p className="max-w-xl mb-4 text-lg">
          Oops... Something went horribly wrong. We are not sure what happened,
          but we are trying to fix the issue as we speak.
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
            <Link href="https://github.com/sebarickert" target="_blank">
              @sebarickert
              <span className="sr-only">(Link opens in a new tab)</span>
            </Link>
          </li>
          <li>
            <Link href="https://github.com/silte" target="_blank">
              @silte
              <span className="sr-only">(Link opens in a new tab)</span>
            </Link>
          </li>
        </ul>
      </>
    );
  }

  return (
    <>
      <p className="max-w-xl mb-4 text-lg ">
        Oops... Something went wrong. We are not sure what happened. Click the
        button below to try to fix the error.
      </p>
      <div className="flex items-center gap-2">
        <Button onClick={() => window.location.reload()}>Fix error</Button>
        <span> or </span>
        <Link href={'/'} className="font-medium underline">
          return to homepage
        </Link>
      </div>
    </>
  );
};
