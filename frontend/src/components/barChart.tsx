import { cn } from '@/lib/utils';
import { useEffect, useRef } from 'react';
import Chart, { ChartDataset } from 'chart.js/auto';

export type BarChartProps = {
  className?: string;
  labels?: string[];
  datasets: ChartDataset<'bar'>[];
};

export default function BarChart(props: BarChartProps) {
  const container = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    let chart: Chart<any>;
    if (container.current) {
      chart = new Chart(container.current, {
        type: 'bar',
        data: {
          labels: props.labels,
          datasets: props.datasets,
        },
        options: {
          plugins: {
            legend: {
              display: false,
            },
          },
        },
      });
    }
    return () => {
      chart.destroy();
    };
  }, [props]);

  return (
    <div className={cn(props.className)}>
      <canvas className="w-full, h-full" ref={container} />
    </div>
  );
}
