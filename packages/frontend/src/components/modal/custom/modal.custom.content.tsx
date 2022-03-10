import React from 'react';

interface IModalCustomContentProps {
  children: React.ReactNode;
}

export const ModalCustomContent = ({
  children,
}: IModalCustomContentProps): JSX.Element => {
  return (
    <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">{children}</div>
  );
};
