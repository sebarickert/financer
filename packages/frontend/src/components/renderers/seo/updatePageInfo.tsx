'use client';

// TODO get rid of this file

import { FC, useEffect } from 'react';

import { PageInfoData, usePageInfoContext } from '$context/pageInfoContext';

type SEOProps = PageInfoData;

export const UpdatePageInfo: FC<SEOProps> = ({ backLink, headerAction }) => {
  const [, setPageInfo] = usePageInfoContext();

  useEffect(() => {
    setPageInfo({ backLink, headerAction });
  }, [setPageInfo, backLink, headerAction]);

  return null;
};
