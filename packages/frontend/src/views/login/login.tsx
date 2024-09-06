'use client';

import Image from 'next/image';
import { useState } from 'react';

import { LoginActions } from './login.actions';

import { ButtonGroup } from '$elements/button/button.group';
import { DialogText } from '$elements/dialog/dialog.text';
import { LoaderFullScreen } from '$elements/loader/loader.fullscreen';
import { UpdatePageInfo } from '$renderers/seo/updatePageInfo';

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
      <UpdatePageInfo />
      {isLoadingOAuthPage && <LoaderFullScreen />}
      <section className="flex flex-col items-center justify-end h-screen bg-charcoal sm:justify-center max-sm:pb-[calc(78px+env(safe-area-inset-bottom))]">
        <section className="p-6 border rounded-md sm:w-full backdrop:bg-charcoal backdrop:opacity-30 max-sm:mx-6 sm:max-w-screen-sm bg-gray border-gray-dark">
          <span className="inline-flex items-center gap-3 mb-6">
            <Image
              src="/logo.svg"
              alt="Financer logo"
              className="w-12 h-12"
              width={48}
              height={48}
            />
            <h2 className="text-xl font-extrabold tracking-tighter text-black uppercase">
              Financer
            </h2>
          </span>
          <DialogText label="Welcome to Financer!" className="mb-8">
            Please login to manage your accounts, expenses and incomes.
          </DialogText>
          <ButtonGroup isReverse>
            {checkIsEnabled(NEXT_PUBLIC_IS_GITHUB_OAUTH_ENABLED) && (
              <LoginActions
                submitButtonLabel="Login with Github"
                loginUrl="/auth/github"
                onClick={startAuthLoading}
              />
            )}
            {checkIsEnabled(NEXT_PUBLIC_IS_AUTH0_OAUTH_ENABLED) && (
              <LoginActions
                submitButtonLabel="Login with Auth0"
                loginUrl="/auth/auth0"
                onClick={startAuthLoading}
              />
            )}
          </ButtonGroup>
        </section>
      </section>
    </>
  );
};
