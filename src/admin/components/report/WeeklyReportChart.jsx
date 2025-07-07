import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import './WeeklyReportChart.css';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const WeeklyReportChart = () => {

  const data = {
    labels: ['The 1st Week', 'The 2nd Week', 'The 3rd Week', 'The 4th Week'],
    datasets: [
      {
        data: [30, 50, 20, 15], // 실제 데이터 비율
        backgroundColor: ['#4f52f4', '#8294f1', '#acb9f8', '#e0e7ff'],
        borderWidth: 0,
      },
    ],
  };

  const options = {
    cutout: '70%',
    plugins: {
      legend: {
        position: 'right',
        labels: {
          usePointStyle: true,
          pointStyle: 'rectRounded',
          color: '#1e1b4b',
        },
      },
    },
  };

  return (
    <div className="weekly-chart-container">
      <div className="chart-header">
        <h2 className="chart-title">Weekly Error Report Count</h2>
      </div>

      {/* 차트 시각화 */}
      <div className="doughnut-wrapper">
        <Doughnut data={data} options={options} />
      </div>

      {/* 주간 에러 리포트 합계 */}
      <div className="chart-legend-custom">
        <div className="legend-item">
          <span className="legend-color color-1" /><b>30개</b>
        </div>
        <div className="legend-item">
          <span className="legend-color color-2" /><b>50개</b>
        </div>
        <div className="legend-item">
          <span className="legend-color color-3" /><b>20개</b>
        </div>
        <div className="legend-item">
          <span className="legend-color color-3" /><b>15개</b>
        </div>
      </div>
    </div>
  );
};

export default WeeklyReportChart;