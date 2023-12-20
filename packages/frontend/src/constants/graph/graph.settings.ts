import { ChartOptions, FontSpec, Tooltip } from 'chart.js';

import { colorPalette } from '$constants/colorPalette';
import {
  formatCurrencyAbbreviation,
  formatCurrency,
} from '$utils/formatCurrency';

const baseChartFontFamily = 'Euclid Circular A';

const baseTextConfiguration = {
  size: 15,
  family: baseChartFontFamily,
  weight: 'normal',
} as Partial<FontSpec>;

Tooltip.positioners.topLeft = function () {
  return {
    x: 16,
    y: 12,
  };
};

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
      position: 'topLeft',
      caretSize: 0,
      backgroundColor: `${colorPalette.gray}`,
      borderColor: colorPalette['gray-dark'],
      borderWidth: 1,
      cornerRadius: 2,
      padding: 16,
      displayColors: false,
      usePointStyle: true,
      boxHeight: 8,
      boxWidth: 8,
      boxPadding: 4,
      bodySpacing: 4,
      titleColor: '#000000',
      bodyColor: '#000000',
      footerColor: colorPalette.charcoal,
      titleMarginBottom: 4,
      titleFont: baseTextConfiguration,
      bodyFont: baseTextConfiguration,
      footerFont: baseTextConfiguration,
      callbacks: {
        // Try to get these circles centered with text...
        // labelColor(tooltipItem) {
        //   return {
        //     backgroundColor: tooltipItem.dataset.borderColor,
        //     borderColor: tooltipItem.dataset.borderColor,
        //   };
        // },
        label: (context) => {
          const label = context.dataset.label || '';
          const value = formatCurrency(context.parsed.y || 0);

          return `${label} ${value}`.toUpperCase();
        },
      },
    },
  },
} as ChartOptions;
