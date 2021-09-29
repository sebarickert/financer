import React from "react";
import Button from "../button/button";

interface IProps {
  accentColor?: "red" | "green" | "blue";
  children: React.ReactNode;
  isOpen: boolean;
  modalOpenButtonLabel: string;
  toggleOpen(): void;
}

const Modal = ({
  children,
  isOpen,
  modalOpenButtonLabel,
  toggleOpen,
  accentColor,
}: IProps): JSX.Element => {
  return (
    <>
      <Button accentColor={accentColor} onClick={toggleOpen}>
        {modalOpenButtonLabel}
      </Button>
      {isOpen && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity">
              <div className="absolute inset-0 bg-gray-500 opacity-75" />
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" />
            &#8203;
            <div
              className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
              role="dialog"
              aria-modal="true"
              aria-labelledby="modal-headline"
            >
              {children}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Modal;
