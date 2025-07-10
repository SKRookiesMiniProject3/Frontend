import React from 'react';
import './StatCard.css';

const StatCard = ({ title, count, max, color }) => {
  const percent = max ? Math.min((count / max) * 100, 100) : null;

  return (
    <div className="stat-card">
      <div className="stat-title">{title}</div>
      <div className="stat-count">{count}</div>

      {percent !== null && (
        <div className="progress-bar-container">
          <div
            className="progress-bar-fill"
            style={{
              width: `${percent}%`,
              backgroundColor: color || "#3b82f6",
            }}
          />
        </div>
      )}
    </div>
  );
};

export default StatCard;
