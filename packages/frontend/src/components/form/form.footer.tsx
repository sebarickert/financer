import React from 'react';

import { Button } from '../button/button';
import { ButtonGroup } from '../button/button.group';

interface IFormFooterProps {
  submitLabel: string;
  accentColor?: 'red' | 'green' | 'blue';
  formFooterBackLink?: string;
  optionalComponent?: React.ReactNode;
}

export const FormFooter = ({
  submitLabel,
  accentColor = 'blue',
  formFooterBackLink = './',
  optionalComponent,
}: IFormFooterProps): JSX.Element => {
  return (
    <>
      <div className="py-4 fixed lg:static left-0 right-0 bottom-[calc(56px+env(safe-area-inset-bottom))] px-4 bg-gray-25 lg:bg-transparent lg:mt-8 border-t lg:px-0">
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
        <div className="mt-8 lg:mt-0 border-t border-gray-200 py-4 sm:flex sm:flex-row-reverse">
          {optionalComponent}
        </div>
      )}
    </>
  );
};
