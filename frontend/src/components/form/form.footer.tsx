import React from "react";
import Button from "../button/button";
import ButtonGroup from "../button/button.group";

interface IProps {
  submitLabel: string;
  accentColor?: "red" | "green" | "blue";
  formFooterBackLink?: string;
  optionalComponent?: React.ReactNode;
}

const FormFooter = ({
  submitLabel,
  accentColor = "blue",
  formFooterBackLink = "./",
  optionalComponent,
}: IProps): JSX.Element => {
  return (
    <>
      <div className="mt-8 border-t border-gray-200 pt-5">
        <ButtonGroup isReverse>
          <Button accentColor={accentColor} type="submit" testId="submit">
            {submitLabel}
          </Button>
          <Button accentColor="plain" link={formFooterBackLink} testId="cancel">
            Cancel
          </Button>
        </ButtonGroup>
      </div>
      {optionalComponent && (
        <div className="mt-8 border-t border-gray-200 pt-5 sm:flex sm:flex-row-reverse">
          {optionalComponent}
        </div>
      )}
    </>
  );
};

export default FormFooter;
