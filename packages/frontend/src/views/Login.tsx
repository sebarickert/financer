'use client';

import clsx from 'clsx';
import { type JSX, useState } from 'react';

import { Logo } from '@/blocks/Logo';
import { Button } from '@/elements/Button/Button';
import { ButtonGroup } from '@/elements/Button/ButtonGroup';
import { Link } from '@/elements/Link';
import { Loader } from '@/elements/Loader';
import { Paragraph } from '@/elements/Paragraph';

const { NEXT_PUBLIC_IS_GITHUB_OAUTH_ENABLED } = process.env;
const { NEXT_PUBLIC_IS_AUTH0_OAUTH_ENABLED } = process.env;

const checkIsEnabled = (stringBoolean: string | undefined) =>
  stringBoolean && stringBoolean.toLocaleLowerCase() !== 'false';

export const Login = (): JSX.Element => {
  const [isLoadingOAuthPage, setIsLoadingOAuthPage] = useState(false);

  const startAuthLoading = () => setTimeout(setIsLoadingOAuthPage, 500, true);

  return (
    <>
      {isLoadingOAuthPage && <Loader />}
      <section
        className={clsx('flex flex-col justify-center items-center h-dvh px-4')}
      >
        <div className="grid w-full max-w-xl gap-6">
          <Logo />
          <div className="p-6 rounded-md bg-layer">
            <h1 className="mb-4 text-2xl font-medium ">Welcome to Financer!</h1>
            <Paragraph className="max-w-md mb-6">
              Financer is your simple financial tracker for expenses, income,
              savings, and investments.
            </Paragraph>
            <Paragraph className="mb-8">
              Log in to take control of your finances.
            </Paragraph>
            <ButtonGroup>
              {checkIsEnabled(NEXT_PUBLIC_IS_GITHUB_OAUTH_ENABLED) && (
                <Button href="/auth/github" onClick={startAuthLoading}>
                  Log In to Financer
                </Button>
              )}
              {checkIsEnabled(NEXT_PUBLIC_IS_AUTH0_OAUTH_ENABLED) && (
                <Button href="/auth/auth0" onClick={startAuthLoading}>
                  Log In to Financer
                </Button>
              )}
            </ButtonGroup>
          </div>
          <div className="grid gap-1 text-sm [&>*]:[justify-self:baseline]">
            <Link href="/issues-with-login">Troubleshooting Login Issues</Link>
            <Link href="/privacy-policy">Privacy Policy</Link>
          </div>
        </div>
      </section>
    </>
  );
};
