import { ScriptableContext } from 'chart.js';

import { colorPalette } from '$constants/colorPalette';

export const setGradientLineGraphBackground = (
  context: ScriptableContext<'line'>
) => {
  const { ctx, chartArea } = context.chart;

  if (!chartArea) return;

  const { top, bottom } = chartArea;
  const gradient = ctx.createLinearGradient(0, bottom, 0, top);

  gradient.addColorStop(0.5, `${colorPalette.blue}1A`);
  gradient.addColorStop(0, 'transparent');

  return gradient;
};
