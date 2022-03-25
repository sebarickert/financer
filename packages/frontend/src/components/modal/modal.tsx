import React, { useEffect } from 'react';

import { isIOSDevice } from '../../utils/isIOSDevice';
import { isStandaloneMode } from '../../utils/isStandaloneMode';
import { Button } from '../button/button';

interface IModalProps {
  accentColor?: 'red' | 'green' | 'blue';
  children: React.ReactNode;
  isOpen: boolean;
  modalOpenButtonLabel: string;
  toggleOpen(): void;
  buttonStyle?: 'default' | 'quick-link';
  testId?: string;
}

interface QuickLinkStyleButtonProps {
  children: React.ReactNode;
  onClick(): void;
  testId?: string;
}

const QuickLinkStyleButton = ({
  children,
  onClick = () => {},
  testId,
}: QuickLinkStyleButtonProps) => {
  return (
    <button
      className="relative inline-flex items-center w-full gap-4 p-6 pr-20 text-lg font-semibold tracking-tight bg-white border rounded-lg md:w-auto group focus-within:ring-2 focus-within:ring-inset focus-within:ring-blue-500 hover:bg-gray-50 focus:outline-none"
      onClick={onClick}
      data-testid={`${testId}_open-button`}
    >
      {children}
      <span
        className="absolute text-gray-300 -translate-y-1/2 pointer-events-none top-1/2 right-6 group-hover:text-gray-400"
        aria-hidden="true"
      >
        <svg
          className="w-6 h-6"
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M20 4h1a1 1 0 00-1-1v1zm-1 12a1 1 0 102 0h-2zM8 3a1 1 0 000 2V3zM3.293 19.293a1 1 0 101.414 1.414l-1.414-1.414zM19 4v12h2V4h-2zm1-1H8v2h12V3zm-.707.293l-16 16 1.414 1.414 16-16-1.414-1.414z" />
        </svg>
      </span>
    </button>
  );
};

export const Modal = ({
  children,
  isOpen,
  modalOpenButtonLabel,
  toggleOpen,
  accentColor,
  buttonStyle = 'default',
  testId,
}: IModalProps): JSX.Element => {
  useEffect(() => {
    const bodyElement = document.getElementsByTagName('body')[0];

    if (isOpen) {
      bodyElement.style.overflowY = 'hidden';
    }

    return () => {
      bodyElement.style.overflowY = 'visible';
    };
  }, [isOpen]);

  return (
    <>
      {buttonStyle === 'quick-link' ? (
        <QuickLinkStyleButton onClick={toggleOpen} testId={testId}>
          {modalOpenButtonLabel}
        </QuickLinkStyleButton>
      ) : (
        <Button
          accentColor={accentColor}
          onClick={toggleOpen}
          testId={`${testId}_open-button`}
        >
          {modalOpenButtonLabel}
        </Button>
      )}
      {isOpen && (
        <div className="fixed inset-0 z-20">
          <div className="fixed inset-0 transition-opacity">
            <div className="absolute inset-0 bg-gray-500 opacity-75" />
          </div>
          <div
            className={`flex items-end justify-center min-h-screen pt-4 px-4 text-center sm:block sm:p-0 ${
              isIOSDevice() && isStandaloneMode() ? 'pb-28' : 'pb-20'
            }`}
          >
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" />
            &#8203;
            <div
              className="inline-block w-full max-w-lg overflow-hidden text-left align-bottom transition-all transform bg-white rounded-lg shadow-xl sm:my-8 sm:align-middle sm:w-full"
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
