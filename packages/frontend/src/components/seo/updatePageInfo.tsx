import { useEffect } from 'react';

import {
  usePageInfoContext,
  PageInfoData,
} from '../../context/pageInfoContext';

type SEOProps = PageInfoData;

export const UpdatePageInfo = ({
  title = '',
  toolbarColor,
  backLink,
}: SEOProps): JSX.Element | null => {
  const [, setPageInfo] = usePageInfoContext();

  useEffect(() => {
    setPageInfo({ title, toolbarColor, backLink });
  }, [setPageInfo, title, toolbarColor, backLink]);

  return null;
};
