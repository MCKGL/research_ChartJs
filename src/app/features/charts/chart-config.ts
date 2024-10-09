import { Chart, registerables } from 'chart.js';

export function registerChartJs(): void {
  Chart.register(...registerables);
}
