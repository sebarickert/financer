import React from 'react';
import { Helmet } from 'react-helmet';

interface ISEOProps {
  title: string;
}

export const SEO = ({ title }: ISEOProps): JSX.Element => {
  return (
    <Helmet>
      <title>{title} | Financer</title>
    </Helmet>
  );
};
