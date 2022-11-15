import { Button } from '../../components/elements/button/button';

interface ILoginActionsProps {
  submitButtonLabel: string;
  loginUrl: string;
  onClick?(): void;
}

export const LoginActions = ({
  submitButtonLabel,
  loginUrl,
  onClick = () => {},
}: ILoginActionsProps): JSX.Element => {
  return (
    <div className="bg-gray-900 py-3 px-6 flex justify-end">
      <Button link={loginUrl} onClick={onClick}>
        {submitButtonLabel}
      </Button>
    </div>
  );
};
