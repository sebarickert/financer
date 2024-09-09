import {
  CategoryScale,
  Chart,
  Filler,
  LineController,
  LineElement,
  LinearScale,
  PointElement,
  Tooltip,
} from 'chart.js';
import clsx from 'clsx';
import { useEffect, useState } from 'react';

interface ChartWrapperProps {
  children: React.ReactElement;
  isLoading?: boolean;
}

const ChartWrapper = ({ children, isLoading }: ChartWrapperProps) => {
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const register = async () => {
      if (typeof window !== 'undefined') {
        Chart.register(
          LineController,
          PointElement,
          LineElement,
          Filler,
          Tooltip,
          CategoryScale,
          LinearScale,
        );
        setIsInitialized(true);
      }
    };
    register();
  }, []);

  return (
    <section
      className={clsx(
        'min-h-[200px] md:min-h-[400px] md:aspect-auto max-lg:-mx-4',
        { 'animate-pulse': isLoading || !isInitialized },
      )}
    >
      {isInitialized && children}
    </section>
  );
};

// eslint-disable-next-line import/no-default-export
export default ChartWrapper;
