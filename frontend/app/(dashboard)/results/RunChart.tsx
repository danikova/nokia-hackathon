'use client'

import Chart from 'chart.js/auto'
import clsx from 'clsx';
import { useEffect, useRef } from 'react';

export default function RunChart({ className }: { className?: string }) {
  const container = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const data = [
      { year: 2010, count: 10 },
      { year: 2011, count: 20 },
      { year: 2012, count: 15 },
      { year: 2013, count: 25 },
      { year: 2014, count: 22 },
      { year: 2015, count: 30 },
      { year: 2016, count: 28 },
    ];

    let chart: Chart<'bar'>;
    if (container.current) {
      chart = new Chart(
        container.current,
        {
          type: 'bar',
          data: {
            labels: data.map(row => row.year),
            datasets: [
              {
                label: 'Acquisitions by year',
                data: data.map(row => row.count)
              }
            ]
          }
        }
      );
    }
    return () => {
      chart.destroy();
    }
  }, []);

  return <div className={clsx(className)}><canvas ref={container}></canvas></div>
}