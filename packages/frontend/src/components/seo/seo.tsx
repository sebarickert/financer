import React from 'react';
import { Helmet } from 'react-helmet';

interface ISEOProps {
  title: string;
  toolbarColor?: 'white' | 'brand';
  backLink?: string;
}

export const SEO = ({
  title,
  toolbarColor = 'brand',
  backLink,
}: ISEOProps): JSX.Element => {
  const toolbarColorMapping = {
    white: '#FAFAFA',
    brand: '#0E6AC7',
  };

  return (
    <Helmet>
      <title>{title} | Financer</title>
      <meta name="theme-color" content={toolbarColorMapping[toolbarColor]} />
      {backLink && <meta name="back-link" content={backLink} />}
    </Helmet>
  );
};
