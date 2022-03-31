import React from 'react';
import { Helmet } from 'react-helmet';

import { usePageInfoContext } from '../../context/pageInfoContext';

export const SEO = (): JSX.Element => {
  const [{ title, toolbarColor = 'brand', backLink }] = usePageInfoContext();
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
