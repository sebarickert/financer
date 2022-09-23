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
  headerAction,
}: SEOProps): JSX.Element | null => {
  const [, setPageInfo] = usePageInfoContext();

  useEffect(() => {
    setPageInfo({ title, toolbarColor, backLink, headerAction });
  }, [setPageInfo, title, toolbarColor, backLink, headerAction]);

  return null;
};
