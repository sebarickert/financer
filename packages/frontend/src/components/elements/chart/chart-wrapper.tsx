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
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const zoomPlugin = (await import('chartjs-plugin-zoom')) as any;
        ChartJS.register(zoomPlugin);
        setIsInitialized(true);
      }
    };
    register();
  }, []);

  if (!isInitialized) {
    return <Loader />;
  }

  return children;
};

// eslint-disable-next-line import/no-default-export
export default ChartWrapper;
