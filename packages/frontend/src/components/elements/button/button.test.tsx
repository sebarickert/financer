import { render, screen, fireEvent } from '@testing-library/react';

import { Button } from './Button';

describe('Button component', () => {
  it('renders correctly with default props', () => {
    render(<Button>Click me</Button>);
    const button = screen.getByRole('button', { name: /click me/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('theme-button-primary');
  });

  it('renders correctly with a custom accent color', () => {
    render(<Button accentColor="danger">Click me</Button>);
    const button = screen.getByRole('button', { name: /click me/i });
    expect(button).toHaveClass('theme-button-danger');
  });

  it('renders as a link when href is provided', () => {
    render(<Button href="/test">Go to test</Button>);
    const link = screen.getByRole('link', { name: /go to test/i });
    expect(link).toBeInTheDocument();
  });

  it('renders as an external link when href is an external URL', () => {
    render(<Button href="https://example.com">Go to example</Button>);
    const link = screen.getByRole('link', { name: /go to example/i });
    expect(link).toHaveAttribute('href', 'https://example.com');
  });

  it('calls onClick handler when clicked', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    const button = screen.getByRole('button', { name: /click me/i });
    fireEvent.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('is disabled when isDisabled is true', () => {
    render(<Button isDisabled>Click me</Button>);
    const button = screen.getByRole('button', { name: /click me/i });
    expect(button).toBeDisabled();
  });
});
