import { useFormStatus } from 'react-dom';

import { ButtonAccentColor, Button } from '../../elements/button/button';
import { ButtonGroup } from '../../elements/button/button.group';

import { Loader } from '$elements/loader/loader';

interface FormFooterProps {
  submitLabel: string;
  accentColor?: ButtonAccentColor;
  formFooterBackLink?: string;
  optionalComponent?: React.ReactNode;
}

export const FormFooter = ({
  submitLabel,
  accentColor = 'black',
  formFooterBackLink = './',
  optionalComponent,
}: FormFooterProps): JSX.Element => {
  const { pending } = useFormStatus();

  return (
    <>
      <div className="mt-12">
        <ButtonGroup isReverse isHorizontal>
          <Button accentColor={accentColor} type="submit" testId="submit">
            {submitLabel}
          </Button>
          <Button accentColor="plain" href={formFooterBackLink} testId="cancel">
            Cancel
          </Button>
        </ButtonGroup>
        {pending && (
          <div className="flex justify-center mt-8">
            <Loader.Icon />
          </div>
        )}
      </div>
      {optionalComponent && (
        <div className="py-4 mt-8 border-t border-gray-dark lg:mt-0 sm:flex sm:flex-row-reverse">
          {optionalComponent}
        </div>
      )}
    </>
  );
};
