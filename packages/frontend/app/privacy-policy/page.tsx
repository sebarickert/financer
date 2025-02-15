import clsx from 'clsx';
import { ArrowLeft } from 'lucide-react';
import { Metadata } from 'next';

import { Button } from '$elements/Button/Button';
import { Heading } from '$elements/Heading';
import { AuthenticationService } from '$ssr/api/AuthenticationService';

export const metadata: Metadata = {
  title: 'Privacy Policy',
};

const PrivacyPolicy = async () => {
  const authenticationStatus = await AuthenticationService.getStatus();
  const isLoggedIn = Boolean(authenticationStatus?.authenticated);

  return (
    <main className="grid max-w-screen-lg gap-6 px-4 pt-6 mx-auto lg:pt-12 pb-safe-offset-12 lg:px-8">
      <div className={clsx('flex gap-4 items-center')}>
        <Button
          href={isLoggedIn ? '/' : '/login'}
          accentColor="secondary"
          size="icon"
          haptic="light"
          testId="header-back-link"
          className="max-lg:button-ghost shrink-0"
        >
          <ArrowLeft />
          <span className="sr-only">Go back</span>
        </Button>
        <Heading variant="h1">Privacy Policy for Financer</Heading>
      </div>
      <div
        className={clsx(
          'prose',
          'prose-headings:text-foreground prose-p:text-foreground prose-strong:text-foreground',
          'prose-ol:text-foreground prose-ul:text-foreground marker:text-muted-foreground',
          'prose-a:text-foreground focus-visible:prose-a:focus-highlight hover:prose-a:text-muted-foreground active:prose-a:text-muted-foreground',
        )}
      >
        <p>
          <em>Last updated: 28.11.2024</em>
        </p>
        <p>
          At <strong>Financer</strong>, we are committed to protecting your
          privacy and being transparent about how we handle your data. This
          policy explains the information we collect, how it’s used, and your
          rights.
        </p>
        <h2>Information We Collect</h2>
        <ol>
          <li>
            <strong>Registration Data:</strong>
            <p>
              Your registration data, including your email, is managed securely
              by our authentication provider, <strong>Auth0</strong>. While your
              email address is accessible from our server, we do not actively
              use it within the app unless required for support or compliance
              purposes.
            </p>
          </li>
          <li>
            <strong>App Data:</strong>
            <p>
              The only personal data we collect and process within the app is
              the information you manually input, such as:
            </p>
            <ul>
              <li>Transactions, budgets, and other financial details.</li>
            </ul>
          </li>
        </ol>
        <h2>How We Use Your Data</h2>
        <p>Your data is used solely to:</p>
        <ul>
          <li>Provide and enhance the app’s functionality.</li>
          <li>Enable you to track and manage your finances effectively.</li>
        </ul>
        <p>
          We do not use your email or registration data for any purpose within
          the app unless explicitly authorized.
        </p>
        <h2>Your Rights</h2>
        <ul>
          <li>
            <strong>Download Your Data:</strong>
            <p>You can export your financial data directly from the app.</p>
          </li>
          <li>
            <strong>Data Deletion:</strong>
            <p>
              To delete your account and all associated data, you must contact
              us directly on GitHub:
            </p>
            <ul>
              <li>
                <a href="https://github.com/sebarickert">@sebarickert</a>
              </li>
              <li>
                <a href="https://github.com/silte">@silte</a>
              </li>
            </ul>
          </li>
          <li>
            <strong>Auth0 Account Management:</strong>
            <p>
              For issues related to your registration data (e.g., email
              changes), contact our support team or manage your account through
              Auth0.
            </p>
          </li>
        </ul>
        <h2>Data Sharing and Security</h2>
        <p>
          We never sell your data or share it with third parties beyond what is
          necessary for authentication (via Auth0). All data is protected using
          industry-standard encryption and security measures.
        </p>
        <h2>Contact Us</h2>
        <p>
          For questions, data requests, or account deletion, contact us on
          GitHub:
        </p>
        <ul>
          <li>
            <a href="https://github.com/sebarickert">@sebarickert</a>
          </li>
          <li>
            <a href="https://github.com/silte">@silte</a>
          </li>
        </ul>
        <p>
          This policy is subject to updates. Significant changes will be
          communicated through the app or GitHub.
        </p>
      </div>
    </main>
  );
};

export default PrivacyPolicy;
