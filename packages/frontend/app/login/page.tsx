import clsx from 'clsx';
import { Metadata } from 'next';
import { redirect } from 'next/navigation';

import { Logo } from '@/blocks/Logo';
import { Button } from '@/elements/Button/Button';
import { ButtonGroup } from '@/elements/Button/ButtonGroup';
import { Link } from '@/elements/Link';
import { verifySession } from '@/utils/dal';

export const metadata: Metadata = {
  title: 'Login',
};

const { LOGIN_IS_GITHUB_ENABLED, LOGIN_IS_AUTH_0_ENABLED } = process.env;

const checkIsEnabled = (stringBoolean: string | undefined) =>
  !!(stringBoolean && stringBoolean?.toLowerCase?.() === 'true');

export default async function Login() {
  const isLoggedIn = await verifySession();

  if (isLoggedIn) {
    redirect('/');
  }

  const github = checkIsEnabled(LOGIN_IS_GITHUB_ENABLED);
  const auth0 = checkIsEnabled(LOGIN_IS_AUTH_0_ENABLED);

  return (
    <section
      className={clsx('flex flex-col justify-center items-center h-dvh px-4')}
    >
      <div className="grid w-full max-w-xl gap-6">
        <Logo className="[&>h2]:text-foreground!" />
        <div className="p-6 rounded-md bg-layer">
          <h1 className="mb-4 text-2xl font-medium ">Welcome to Financer!</h1>
          <p className="max-w-md mb-6">
            Financer is your simple financial tracker for expenses, income,
            savings, and investments.
          </p>
          <p className="mb-8">Log in to take control of your finances.</p>
          <ButtonGroup>
            {github && <Button href="/auth/github">Log In to Financer</Button>}
            {auth0 && <Button href="/auth/auth0">Log In to Financer</Button>}
          </ButtonGroup>
        </div>
        <div className="grid gap-1 text-sm [&>*]:[justify-self:baseline]">
          <Link href="/issues-with-login">Troubleshooting Login Issues</Link>
          <Link href="/privacy-policy">Privacy Policy</Link>
        </div>
      </div>
    </section>
  );
}
