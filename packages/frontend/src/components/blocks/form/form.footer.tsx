import { FC } from 'react';
import { useFormStatus } from 'react-dom';

import { ButtonAccentColor, Button } from '../../elements/button/button';
import { ButtonGroup } from '../../elements/button/button.group';

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
  accentColor = 'black',
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
          >
            {submitLabel}
          </Button>
          {hasCancelButton && (
            <Button
              accentColor="plain"
              href={formFooterBackLink}
              testId="cancel"
            >
              Cancel
            </Button>
          )}
        </ButtonGroup>
        {pending && <LoaderFullScreen />}
      </div>
      {optionalComponent && (
        <div className="py-4 mt-8 border-t border-gray-dark lg:mt-0 sm:flex sm:flex-row-reverse">
          {optionalComponent}
        </div>
      )}
    </>
  );
};
