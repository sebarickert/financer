import React from "react";
import Button from "../button/button";
import ButtonGroup from "../button/button.group";

interface IProps {
  submitLabel: string;
  accentColor?: "pink" | "red" | "green" | "blue";
  formFooterBackLink?: string;
  optionalComponent?: React.ReactNode;
}

const FormFooter = ({
  submitLabel,
  accentColor = "pink",
  formFooterBackLink = "./",
  optionalComponent,
}: IProps): JSX.Element => {
  return (
    <>
      <div className="mt-8 border-t border-gray-200 pt-5">
        <ButtonGroup isReverse>
          <Button accentColor={accentColor} type="submit" size="small">
            {submitLabel}
          </Button>
          <Button accentColor="plain" link={formFooterBackLink} size="small">
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
