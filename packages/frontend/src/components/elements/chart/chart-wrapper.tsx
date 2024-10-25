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
import { Chart as ChartComponent, ChartProps } from 'react-chartjs-2';

type ChartWrapperProps = {
  isLoading?: boolean;
} & ChartProps;

const ChartWrapper = ({ isLoading, ...chartProps }: ChartWrapperProps) => {
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
        'min-h-[250px] md:min-h-[500px] md:aspect-auto max-lg:-mx-4',
        { 'animate-pulse': isLoading || !isInitialized },
      )}
    >
      {isInitialized && <ChartComponent {...chartProps} />}
    </section>
  );
};

// eslint-disable-next-line import/no-default-export
export default ChartWrapper;
