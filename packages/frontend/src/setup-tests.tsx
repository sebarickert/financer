import '@testing-library/jest-dom';
import Link from 'next/link';

jest.mock('next-view-transitions', () => ({
  Link: jest.fn(({ children, ...rest }) => <Link {...rest}>{children}</Link>),
  ViewTransitions: jest.fn(({ children }) => children),
  useTransitionRouter: jest.fn(),
}));
