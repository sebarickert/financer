import { createContext, useContext, useState } from 'react';

interface PageInfoProps {
  children: React.ReactNode;
}

export type PageInfoData = {
  backLink?: string;
  headerAction?: React.ReactNode;
};

type PageInfoContextType = [
  PageInfoData,
  React.Dispatch<React.SetStateAction<PageInfoData>>,
];

export const PageInfoContext = createContext<PageInfoContextType>([
  {},
  () => {},
]);

export const usePageInfoContext = (): PageInfoContextType =>
  useContext(PageInfoContext);

export const PageInfoProvider = ({ children }: PageInfoProps): JSX.Element => {
  const [pageInfo, setPageInfo] = useState<PageInfoData>({});

  return (
    <PageInfoContext.Provider value={[pageInfo, setPageInfo]}>
      {children}
    </PageInfoContext.Provider>
  );
};
