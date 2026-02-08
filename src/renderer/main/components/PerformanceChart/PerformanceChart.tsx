import React, { useEffect, useRef, useState } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import './PerformanceChart.scss';

interface PerformanceChartProps {
  title: string;
  currentValue: number;
  color: string;
  maxDataPoints?: number;
}

const PerformanceChart: React.FC<PerformanceChartProps> = ({
  title,
  currentValue,
  color,
  maxDataPoints = 60
}) => {
  const chartRef = useRef<HighchartsReact.RefObject>(null);
  // Initialize with fixed-length array of nulls (empty chart)
  const dataRef = useRef<(number | null)[]>(Array(maxDataPoints).fill(null));
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Skip the first render to avoid initial null value issue
    if (!isInitialized) {
      setIsInitialized(true);
      return;
    }

    // Shift left and add new value at the end (Task Manager style)
    dataRef.current.shift();
    dataRef.current.push(currentValue);

    // Update chart
    if (chartRef.current && chartRef.current.chart) {
      const series = chartRef.current.chart.series[0];
      if (series) {
        series.setData([...dataRef.current], true, false);
      }
    }
  }, [currentValue, maxDataPoints, isInitialized]);

  const options: Highcharts.Options = {
    chart: {
      type: 'area',
      backgroundColor: 'transparent',
      height: 150,
      animation: false,
      spacing: [5, 5, 5, 5]
    },
    title: {
      text: '',
      style: {
        display: 'none'
      }
    },
    credits: {
      enabled: false
    },
    legend: {
      enabled: false
    },
    xAxis: {
      visible: false,
      type: 'linear',
      min: 0,
      max: maxDataPoints - 1,  // Fixed X-axis range
      tickInterval: 1
    },
    yAxis: {
      title: {
        text: ''
      },
      min: 0,
      max: 100,
      gridLineColor: 'rgba(255, 255, 255, 0.05)',
      labels: {
        style: {
          color: '#9ca3af',
          fontSize: '10px'
        }
      }
    },
    tooltip: {
      enabled: false
    },
    plotOptions: {
      area: {
        fillColor: {
          linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
          stops: [
            [0, `${color}80`],
            [1, `${color}10`]
          ]
        },
        marker: {
          enabled: false
        },
        lineWidth: 2,
        states: {
          hover: {
            lineWidth: 2
          }
        },
        threshold: null,
        connectNulls: false  // Don't connect across null values
      }
    },
    series: [
      {
        type: 'area',
        name: title,
        data: [...dataRef.current],  // Copy array to trigger update
        color: color
      }
    ]
  };

  return (
    <div className="performance-chart">
      <div className="chart-header">
        <h4>{title}</h4>
        <span className="current-value">{currentValue.toFixed(1)}%</span>
      </div>
      <HighchartsReact
        highcharts={Highcharts}
        options={options}
        ref={chartRef}
      />
    </div>
  );
};

export default PerformanceChart;
