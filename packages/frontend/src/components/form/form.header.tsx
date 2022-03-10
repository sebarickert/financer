import React from 'react';

import { Heading } from '../heading/heading';

interface IFormHeaderProps {
  children: string;
}

export const FormHeader = ({ children }: IFormHeaderProps): JSX.Element => {
  return (
    <div className="mb-6">
      <Heading variant="h1">{children}</Heading>
    </div>
  );
};
