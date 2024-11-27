import { FC } from 'react';
import { useFormStatus } from 'react-dom';

import { ButtonAccentColor, Button } from '../../elements/Button/Button';
import { ButtonGroup } from '../../elements/Button/ButtonGroup';

import { Loader } from '$elements/Loader';

type FormFooterProps = {
  submitLabel: string;
  accentColor?: ButtonAccentColor;
  formFooterBackLink?: string;
  optionalComponent?: React.ReactNode;
  hasCancelButton?: boolean;
};

export const FormFooter: FC<FormFooterProps> = ({
  submitLabel,
  accentColor,
  formFooterBackLink = './',
  optionalComponent,
  hasCancelButton,
}) => {
  const { pending } = useFormStatus();

  return (
    <>
      <div className="mt-12">
        <ButtonGroup>
          <Button
            accentColor={accentColor}
            type="submit"
            testId="submit"
            isDisabled={pending}
            haptic="medium"
          >
            {submitLabel}
          </Button>
          {hasCancelButton && (
            <Button
              accentColor="secondary"
              href={formFooterBackLink}
              testId="cancel"
              haptic="light"
            >
              Cancel
            </Button>
          )}
          {pending && (
            <div className="ml-4 max-lg:hidden">
              <Loader.Icon />
            </div>
          )}
        </ButtonGroup>
        {pending && (
          <div className="lg:hidden">
            <Loader />
          </div>
        )}
      </div>
      {optionalComponent && (
        <div className="py-4 mt-8 border-t lg:mt-0 sm:flex sm:flex-row-reverse">
          {optionalComponent}
        </div>
      )}
    </>
  );
};
