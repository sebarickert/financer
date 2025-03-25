import { Metadata } from 'next';

import { Login } from '@/views/Login';

export const metadata: Metadata = {
  title: 'Login',
};

const { LOGIN_IS_GITHUB_ENABLED, LOGIN_IS_AUTH_0_ENABLED } = process.env;

const checkIsEnabled = (stringBoolean: string | undefined) =>
  !!(stringBoolean && stringBoolean?.toLowerCase?.() === 'true');

const LoginPage = () => (
  <Login
    github={checkIsEnabled(LOGIN_IS_GITHUB_ENABLED)}
    auth0={checkIsEnabled(LOGIN_IS_AUTH_0_ENABLED)}
  />
);

export default LoginPage;
