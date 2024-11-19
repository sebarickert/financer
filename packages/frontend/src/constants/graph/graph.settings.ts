import { ChartOptions, FontSpec, Tooltip } from 'chart.js';

import {
  formatCurrencyAbbreviation,
  formatCurrency,
} from '$utils/formatCurrency';

const baseChartFontFamily = 'InterVariable';

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

const lightModeColors = {
  xTicksColor: `#525252`, // text-text-secondary
  yGridColor: `#f4f4f4`, // theme-layer-color
  yTicksColor: `#525252`, // text-text-secondary
  tooltipBackgroundColor: `#f4f4f4`, // theme-layer-color
  tooltipTitleColor: '#161616', // text-text-primary
  tooltipBodyColor: '#161616', // text-text-primary
  tooltipFooterColor: '#161616', // text-text-primary
};

const darkModeColors = {
  xTicksColor: `#c6c6c6`, // text-text-secondary
  yGridColor: `#1b1b1b`, // theme-layer-color
  yTicksColor: `#c6c6c6`, // text-text-secondary
  tooltipBackgroundColor: `#1b1b1b`, // theme-layer-color
  tooltipTitleColor: '#f4f4f4', // text-text-primary
  tooltipBodyColor: '#f4f4f4', // text-text-primary
  tooltipFooterColor: '#f4f4f4', // text-text-primary
};

export const updateChartColors = (
  options: ChartOptions,
  isDarkMode: boolean,
): ChartOptions => {
  const chartColors = isDarkMode ? darkModeColors : lightModeColors;

  return {
    ...options,
    scales: {
      ...options.scales,
      x: {
        ...options.scales?.x,
        ticks: {
          ...options.scales?.x?.ticks,
          color: chartColors.xTicksColor,
        },
      },
      y: {
        ...options.scales?.y,
        grid: {
          ...options.scales?.y?.grid,
          color: chartColors.yGridColor,
        },
        ticks: {
          ...options.scales?.y?.ticks,
          color: chartColors.yTicksColor,
        },
      },
    },
    plugins: {
      ...options.plugins,
      tooltip: {
        ...options.plugins?.tooltip,
        backgroundColor: chartColors.tooltipBackgroundColor,
        titleColor: chartColors.tooltipTitleColor,
        bodyColor: chartColors.tooltipBodyColor,
        footerColor: chartColors.tooltipFooterColor,
      },
    },
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
      ticks: {
        mirror: true,
        padding: 0,
        callback: function (val, index, ticks) {
          if (index % 2 === 0 || ticks.length - 1 === index) return null;
          return `${formatCurrencyAbbreviation(Number(val))} `;
        },
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
      borderWidth: 1,
      cornerRadius: 2,
      padding: 16,
      displayColors: false,
      usePointStyle: true,
      boxHeight: 8,
      boxWidth: 8,
      boxPadding: 4,
      bodySpacing: 4,
      titleMarginBottom: 4,
      titleFont: baseTextConfiguration,
      bodyFont: baseTextConfiguration,
      footerFont: baseTextConfiguration,
      callbacks: {
        label: (context) => {
          const label = context.dataset.label || '';
          const value = formatCurrency(context.parsed.y || 0);

          return `${label} ${value}`.toUpperCase();
        },
      },
    },
  },
} as ChartOptions;
