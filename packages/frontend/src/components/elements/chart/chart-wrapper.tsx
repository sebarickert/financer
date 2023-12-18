import ChartJS from 'chart.js/auto';
import { useEffect, useState } from 'react';

import { Loader } from '$elements/loader/loader';

interface ChartWrapperProps {
  children: React.ReactElement;
}

const ChartWrapper = ({ children }: ChartWrapperProps) => {
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const register = async () => {
      if (typeof window !== 'undefined') {
        ChartJS.register();
        setIsInitialized(true);
      }
    };
    register();
  }, []);

  if (!isInitialized) {
    return <Loader />;
  }

  return (
    <section
      className={'min-h-[200px] md:min-h-[400px] md:aspect-auto max-lg:-mx-4'}
    >
      {children}
    </section>
  );
};

// eslint-disable-next-line import/no-default-export
export default ChartWrapper;
