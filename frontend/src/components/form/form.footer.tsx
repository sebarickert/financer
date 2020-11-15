import React from "react";
import Button from "../button/button";
import ButtonGroup from "../button/button.group";

interface IProps {
  submitLabel: string;
  accentColor?: "pink" | "red" | "green" | "blue";
}

const FormFooter = ({
  submitLabel,
  accentColor = "pink",
}: IProps): JSX.Element => {
  return (
    <div className="mt-8 border-t border-gray-200 pt-5">
      <ButtonGroup isReverse>
        <Button accentColor={accentColor} type="submit" size="small">
          {submitLabel}
        </Button>
        <Button accentColor="plain" link="./" size="small">
          Cancel
        </Button>
      </ButtonGroup>
    </div>
  );
};

export default FormFooter;
