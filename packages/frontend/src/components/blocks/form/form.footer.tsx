import { ButtonAccentColor, Button } from '../../elements/button/button';
import { ButtonGroup } from '../../elements/button/button.group';

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
  return (
    <>
      <div className="py-4 bg-white fixed lg:static left-0 right-0 bottom-[calc(56px+env(safe-area-inset-bottom))] px-4 lg:bg-transparent lg:mt-8 lg:px-0 border-t border-gray-dark">
        <ButtonGroup isReverse isHorizontal>
          <Button accentColor={accentColor} type="submit" testId="submit">
            {submitLabel}
          </Button>
          <Button accentColor="plain" link={formFooterBackLink} testId="cancel">
            Cancel
          </Button>
        </ButtonGroup>
      </div>
      {optionalComponent && (
        <div className="py-4 mt-8 border-t border-gray-dark lg:mt-0 sm:flex sm:flex-row-reverse">
          {optionalComponent}
        </div>
      )}
    </>
  );
};
