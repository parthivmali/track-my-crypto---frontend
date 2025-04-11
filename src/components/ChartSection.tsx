import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
} from 'chart.js';
import CrosshairPlugin from 'chartjs-plugin-crosshair';

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
  CrosshairPlugin
);

interface ChartSectionProps {
  name: string;
  historicalPrices: Array<[number, number]>; // [[timestamp, price], ...]
}

const ChartSection: React.FC<ChartSectionProps> = ({ name, historicalPrices }) => {
  const labels = historicalPrices.map(([timestamp]) => {
    const d = new Date(timestamp);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  });

  const prices = historicalPrices.map(([_, price]) => price);

  const chartData = {
    labels,
    datasets: [
      {
        label: `${name} Price (USD)`,
        data: prices,
        borderColor: 'rgba(255, 206, 86, 1)',
        backgroundColor: 'rgba(255, 206, 86, 0.1)',
        tension: 0.3,
        pointRadius: 0,
        pointHoverRadius: 5,
        fill: true,
      },
    ],
  };

  return (
    <div className="bg-gray-900 rounded-lg p-6 shadow-lg">
      <h2 className="text-lg font-semibold text-white mb-4">{name} Price Chart</h2>
      <Line
        data={chartData}
        options={{
          responsive: true,
          interaction: {
            mode: 'index',
            intersect: false,
          },
          plugins: {
            tooltip: {
              mode: 'index',
              intersect: false,
              backgroundColor: '#222',
              titleColor: '#fff',
              bodyColor: '#fff',
              borderColor: '#555',
              borderWidth: 1,
              callbacks: {
                label: function (tooltipItem: any) {
                  return `$${tooltipItem.formattedValue}`;
                },
              },
            },
            legend: {
              labels: {
                color: 'white',
              },
            },
            crosshair: {
              line: {
                color: 'rgba(255,255,255,0.2)',
                width: 1,
              },
              sync: { enabled: false },
              zoom: { enabled: false },
            },
          },
          scales: {
            x: {
              ticks: {
                color: '#aaa',
                maxTicksLimit: 10,
              },
              grid: {
                color: '#333',
              },
            },
            y: {
              ticks: {
                color: '#aaa',
                callback: function (value: any) {
                  return `$${value.toLocaleString()}`;
                },
              },
              grid: {
                color: '#333',
              },
            },
          },
        }}
      />
    </div>
  );
};

export default ChartSection;
