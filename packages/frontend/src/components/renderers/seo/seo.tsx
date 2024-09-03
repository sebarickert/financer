import { Helmet } from 'react-helmet';

import { usePageInfoContext } from '../../../context/pageInfoContext';

export const SEO = (): JSX.Element => {
  const [{ backLink }] = usePageInfoContext();

  return (
    <Helmet>{backLink && <meta name="back-link" content={backLink} />}</Helmet>
  );
};
