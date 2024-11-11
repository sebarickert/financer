import {
  CategoryScale,
  Chart,
  ChartOptions,
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

import { Theme } from '$api/generated/financerApi';
import { updateChartColors } from '$constants/graph/graph.settings';
import { useDefaultColorScheme } from '$hooks/useDefaultColorScheme';

type ChartWrapperProps = {
  isLoading?: boolean;
  userTheme?: Theme;
} & ChartProps;

const ChartWrapper = ({
  isLoading,
  userTheme = Theme.Auto,
  options: optionsOriginal,
  ...chartProps
}: ChartWrapperProps) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const defaultTheme = useDefaultColorScheme();

  const theme = userTheme === Theme.Auto ? defaultTheme : userTheme;

  const options = updateChartColors(
    optionsOriginal as ChartOptions,
    theme === Theme.Dark,
  );

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
        'min-h-[250px] md:min-h-[500px] md:aspect-auto max-lg:-mx-2',
        { 'animate-pulse': isLoading || !isInitialized },
      )}
    >
      {isInitialized && <ChartComponent options={options} {...chartProps} />}
    </section>
  );
};

// eslint-disable-next-line import/no-default-export
export default ChartWrapper;
