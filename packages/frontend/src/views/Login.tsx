'use client';

import clsx from 'clsx';
import { useState } from 'react';

import { Logo } from '$blocks/Logo';
import { Button } from '$elements/button/button';
import { ButtonGroup } from '$elements/button/button.group';
import { LoaderFullScreen } from '$elements/loader/loader.fullscreen';
import { Paragraph } from '$elements/paragraph/paragraph';

const NEXT_PUBLIC_IS_GITHUB_OAUTH_ENABLED =
  process.env.NEXT_PUBLIC_IS_GITHUB_OAUTH_ENABLED;
const NEXT_PUBLIC_IS_AUTH0_OAUTH_ENABLED =
  process.env.NEXT_PUBLIC_IS_AUTH0_OAUTH_ENABLED;

const checkIsEnabled = (stringBoolean: string | undefined) =>
  stringBoolean && stringBoolean.toLocaleLowerCase() !== 'false';

export const Login = (): JSX.Element => {
  const [isLoadingOAuthPage, setIsLoadingOAuthPage] = useState(false);

  const startAuthLoading = () => setTimeout(setIsLoadingOAuthPage, 500, true);

  return (
    <>
      {isLoadingOAuthPage && <LoaderFullScreen />}
      <section
        className={clsx('flex flex-col justify-center items-center h-dvh px-4')}
      >
        <div className="grid w-full max-w-xl gap-8">
          <Logo />
          <div className="p-6 theme-layer-color">
            <h1 className="mb-4 text-2xl font-medium theme-text-primary">
              Welcome to Financer!
            </h1>
            <Paragraph className="max-w-md mb-6">
              Financer is your simple financial tracker for expenses, income,
              savings, and investments.
            </Paragraph>
            <Paragraph className="mb-8">
              Log in to take control of your finances.
            </Paragraph>
            <ButtonGroup isReverse>
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
        </div>
      </section>
    </>
  );
};