import { Button } from '../../components/elements/button/button';

interface LoginActionsProps {
  submitButtonLabel: string;
  loginUrl: string;
  onClick?(): void;
}

export const LoginActions = ({
  submitButtonLabel,
  loginUrl,
  onClick = () => {},
}: LoginActionsProps): JSX.Element => {
  return (
    <Button link={loginUrl} onClick={onClick}>
      {submitButtonLabel}
    </Button>
  );
};
