import { ScriptableContext } from 'chart.js';

const getGradientColorByLabel = (label: string) => {
  switch (label) {
    case 'expenses':
      return '#da1e28'

    case 'incomes':
      return '#198038';

    default:
      return '#0f62fe';
  }
};

export const setGradientLineGraphBackground = (
  context: ScriptableContext<'line'>,
) => {
  const { ctx, chartArea } = context.chart;

  if (!chartArea) return;

  const label = context.dataset.label;

  const { top, bottom } = chartArea;
  const gradient = ctx.createLinearGradient(0, bottom, 0, top);

  const color = getGradientColorByLabel(label?.toLowerCase() || '');

  gradient.addColorStop(0.5, `${color}1A`);
  gradient.addColorStop(0, 'transparent');

  return gradient;
};
