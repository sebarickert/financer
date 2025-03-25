import clsx from 'clsx';
import { Metadata } from 'next';

import { Logo } from '@/blocks/Logo';
import { Button } from '@/elements/Button/Button';
import { ButtonGroup } from '@/elements/Button/ButtonGroup';
import { Link } from '@/elements/Link';
import { Paragraph } from '@/elements/Paragraph';

export const metadata: Metadata = {
  title: 'Login',
};

const { LOGIN_IS_GITHUB_ENABLED, LOGIN_IS_AUTH_0_ENABLED } = process.env;

const checkIsEnabled = (stringBoolean: string | undefined) =>
  !!(stringBoolean && stringBoolean?.toLowerCase?.() === 'true');

export default function Login() {
  const github = checkIsEnabled(LOGIN_IS_GITHUB_ENABLED);
  const auth0 = checkIsEnabled(LOGIN_IS_AUTH_0_ENABLED);

  return (
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
