import { useState } from 'react';

import { ReactComponent as Logo } from '../../assets/logo.svg';
import { ButtonGroup } from '../../components/elements/button/button.group';
import { DialogText } from '../../components/elements/dialog/dialog.text';
import { LoaderFullScreen } from '../../components/elements/loader/loader.fullscreen';
import { UpdatePageInfo } from '../../components/renderers/seo/updatePageInfo';

import { LoginActions } from './login.actions';
import { LoginFooter } from './login.footer';

const { REACT_APP_IS_GITHUB_OAUTH_ENABLED, REACT_APP_IS_AUTH0_OAUTH_ENABLED } =
  process.env;

const checkIsEnabled = (stringBoolean: string | undefined) =>
  stringBoolean && stringBoolean.toLocaleLowerCase() !== 'false';

export const Login = (): JSX.Element => {
  const [isLoadingOAuthPage, setIsLoadingOAuthPage] = useState(false);

  const startAuthLoading = () => setTimeout(setIsLoadingOAuthPage, 500, true);

  return (
    <>
      <UpdatePageInfo title="Login" />
      {isLoadingOAuthPage && <LoaderFullScreen />}
      <section className="flex flex-col items-center justify-end h-screen bg-charcoal sm:justify-center max-sm:pb-[calc(78px+env(safe-area-inset-bottom))]">
        <section className="p-6 border rounded-md sm:w-full backdrop:bg-charcoal backdrop:opacity-30 max-sm:mx-6 sm:max-w-screen-sm bg-gray border-gray-dark">
          <Logo className="w-10 h-10 mb-6" />
          <DialogText label="Financer" className="mb-8">
            Please login to manage your accounts, expenses and incomes.
          </DialogText>
          <ButtonGroup isReverse>
            {checkIsEnabled(REACT_APP_IS_GITHUB_OAUTH_ENABLED) && (
              <LoginActions
                submitButtonLabel="Login with Github"
                loginUrl="/auth/github"
                onClick={startAuthLoading}
              />
            )}
            {checkIsEnabled(REACT_APP_IS_AUTH0_OAUTH_ENABLED) && (
              <LoginActions
                submitButtonLabel="Login with Auth0"
                loginUrl="/auth/auth0"
                onClick={startAuthLoading}
              />
            )}
          </ButtonGroup>
        </section>
        <LoginFooter className="mt-4 sm:w-full sm:max-w-screen-sm max-sm:mx-6" />
      </section>
    </>
  );
};
