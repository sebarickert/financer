import {
  Chart as ChartJS,
  LinearScale,
  CategoryScale,
  BarElement,
  PointElement,
  LineElement,
  Legend,
  Tooltip,
} from 'chart.js';
import { Chart } from 'react-chartjs-2';

ChartJS.register(
  LinearScale,
  CategoryScale,
  BarElement,
  PointElement,
  LineElement,
  Legend,
  Tooltip
);

export const Test = (): JSX.Element => {
  const labels = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
  ];

  const data = {
    labels,
    datasets: [
      {
        type: 'line' as const,
        label: 'Dataset 1',
        borderColor: 'rgb(255, 99, 132)',
        borderWidth: 2,
        fill: false,
        data: [300, 50, 100, 2, 2, 2, 2],
      },
      {
        type: 'bar' as const,
        label: 'Dataset 2',
        backgroundColor: 'rgb(75, 192, 192)',
        data: [300, 50, 100, 2, 2, 2, 2],
        borderColor: 'white',
        borderWidth: 2,
      },
      {
        type: 'bar' as const,
        label: 'Dataset 3',
        backgroundColor: 'rgb(53, 162, 235)',
        data: [300, 50, 100, 2, 2, 2, 2],
      },
    ],
  };

  return (
    <div className="my-12">
      {/* <Bar data={data} options={options} /> */}
      <Chart type="bar" data={data} />
    </div>
  );
};
