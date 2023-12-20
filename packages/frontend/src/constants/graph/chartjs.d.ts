import type { TooltipPositionerFunction } from 'chart.js';

declare module 'chart.js' {
  interface TooltipPositionerMap {
    topLeft: TooltipPositionerFunction<ChartType>;
  }
}
