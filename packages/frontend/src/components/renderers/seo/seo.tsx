import { Helmet } from 'react-helmet';

import { usePageInfoContext } from '../../../context/pageInfoContext';

export const SEO = (): JSX.Element => {
  const [{ title, toolbarColor = 'white', backLink }] = usePageInfoContext();
  const toolbarColorMapping = {
    white: '#FFFFFF',
    brand: '#0E6AC7',
    black: '#000000',
  };

  return (
    <Helmet>
      <title>{title} | Financer</title>
      <meta name="theme-color" content={toolbarColorMapping[toolbarColor]} />
      {backLink && <meta name="back-link" content={backLink} />}
    </Helmet>
  );
};
