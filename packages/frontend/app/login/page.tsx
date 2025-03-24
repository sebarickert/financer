import { Metadata } from 'next';

import { Login } from '@/views/Login';

export const metadata: Metadata = {
  title: 'Login',
};

const {
  NEXT_PUBLIC_IS_GITHUB_OAUTH_ENABLED,
  NEXT_PUBLIC_IS_AUTH0_OAUTH_ENABLED,
} = process.env;

const checkIsEnabled = (stringBoolean: string | undefined) =>
  !!(stringBoolean && stringBoolean?.toLowerCase?.() === 'true');

const LoginPage = () => (
  <Login
    github={checkIsEnabled(NEXT_PUBLIC_IS_GITHUB_OAUTH_ENABLED)}
    auth0={checkIsEnabled(NEXT_PUBLIC_IS_AUTH0_OAUTH_ENABLED)}
  />
);

export default LoginPage;
