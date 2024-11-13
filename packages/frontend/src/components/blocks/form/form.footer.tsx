import { FC } from 'react';
import { useFormStatus } from 'react-dom';

import { ButtonAccentColor, Button } from '../../elements/Button/Button';
import { ButtonGroup } from '../../elements/Button/button.group';

import { Loader } from '$elements/loader/loader';
import { LoaderFullScreen } from '$elements/loader/loader.fullscreen';

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
        <ButtonGroup isReverse isHorizontal>
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
            <LoaderFullScreen />
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
