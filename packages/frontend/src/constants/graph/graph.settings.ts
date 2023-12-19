import { ChartOptions } from 'chart.js';

import { colorPalette } from '$constants/colorPalette';
import {
  formatCurrencyAbbreviation,
  formatCurrency,
} from '$utils/formatCurrency';

const baseChartFontFamily = 'Euclid Circular A';

export const baseChartOptions = {
  animation: false,
  maintainAspectRatio: false,
  interaction: {
    intersect: false,
    mode: 'index',
  },
  layout: {
    autoPadding: false,
    padding: {
      right: -10,
    },
  },
  scales: {
    x: {
      border: {
        display: false,
      },
      grid: {
        display: false,
      },
      ticks: {
        padding: 0,
        maxRotation: 0,
        color: `${colorPalette.charcoal}99`,
        font: {
          size: 12,
          family: baseChartFontFamily,
          weight: 'normal',
        },
      },
    },
    y: {
      position: 'right',
      border: {
        display: false,
      },
      grid: {
        color: `${colorPalette.charcoal}0D`,
      },
      ticks: {
        mirror: true,
        padding: 0,
        callback: function (val, index, ticks) {
          if (index % 2 === 0 || ticks.length - 1 === index) return null;
          return `${formatCurrencyAbbreviation(Number(val))} `;
        },
        color: `${colorPalette.charcoal}66`,
      },
    },
  },
  elements: {
    point: {
      hitRadius: 32,
      radius: 0,
      hoverBorderWidth: 3,
      hoverRadius: 3,
    },
    line: {
      borderWidth: 2,
    },
  },
  plugins: {
    legend: {
      display: false,
    },
    filler: {
      propagate: true,
    },
    tooltip: {
      backgroundColor: colorPalette.charcoal,
      padding: 16,
      bodySpacing: 6,
      displayColors: false,
      titleFont: {
        size: 15,
        family: baseChartFontFamily,
      },
      bodyFont: {
        size: 15,
        family: baseChartFontFamily,
        weight: 'normal',
      },
      footerFont: {
        size: 15,
        family: baseChartFontFamily,
        weight: 'normal',
      },
      callbacks: {
        label: (context) => {
          const label = context.dataset.label || '';
          if (!context.parsed.y) {
            return `${label} ${formatCurrency(0)}`.toUpperCase();
          }
          return `${label} ${formatCurrency(
            context.parsed.y as number
          )}`.toUpperCase();
        },
      },
    },
  },
} as ChartOptions;
