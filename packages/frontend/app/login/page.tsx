import { Metadata } from 'next';
import { FC } from 'react';

import { LoginContainer } from '$container/LoginContainer';

export const metadata: Metadata = {
  title: 'Login',
};

const LoginPage: FC = () => <LoginContainer />;

export default LoginPage;
