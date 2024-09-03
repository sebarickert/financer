'use client';

// TODO get rid of this file

import { useEffect } from 'react';

import {
  PageInfoData,
  usePageInfoContext,
} from '../../../context/pageInfoContext';

type SEOProps = PageInfoData;

export const UpdatePageInfo = ({
  backLink,
  headerAction,
}: SEOProps): JSX.Element | null => {
  const [, setPageInfo] = usePageInfoContext();

  useEffect(() => {
    setPageInfo({ backLink, headerAction });
  }, [setPageInfo, backLink, headerAction]);

  return null;
};
