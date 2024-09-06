import { Metadata } from 'next';
import { FC } from 'react';

import { Login } from '$views/login/login';

export const metadata: Metadata = {
  title: 'Login',
};

const LoginPage: FC = () => <Login />;

export default LoginPage;
