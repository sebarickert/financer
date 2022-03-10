import React from 'react';

interface IconElementProps {
  className?: string;
}

export const IconArrowRight = ({
  className = '',
}: IconElementProps): JSX.Element => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M14 5l7 7m0 0l-7 7m7-7H3"
      />
    </svg>
  );
};
